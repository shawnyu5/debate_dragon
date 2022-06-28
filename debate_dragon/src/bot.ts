import { Client, Collection, Intents, Interaction } from "discord.js";
require("dotenv").config();
import fs from "fs";
import { OnStart } from "./deploy-commands";
import config from "../config.json";
import { QuickDB } from "quick.db";
import logger from "./logger";
import * as carmen from "./commands/subToCarmen";
import * as john from "./commands/dicksForJohn";
import { msToMins } from "./utils";

declare module "discord.js" {
   export interface Client {
      commands: Collection<unknown, any>;
   }
}

const client = new Client({
   intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();

const commandFiles = fs
   .readdirSync(__dirname + "/commands")
   .filter((file: string) => file.endsWith(".js"));

// for (const file of commandFiles) {
// const command = require(`${__dirname}/commands/global/${file}`);
// commands.push(command.data.toJSON());
// }

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   // Set a new item in the Collection
   // With the key as the command name and the value as the exported module
   client.commands.set(command.default?.data.name, command);
}
// const command = require(`${__dirname}/commands/debate_dragon.js`);
// client.commands.set(command.default.data.name, command);

// const command2 = require(`${__dirname}/commands/help.js`);
// client.commands.set(command2.default.data.name, command2);

let onStart = new OnStart();
let db = new QuickDB();
client.on("ready", () => {
   logger.info(`${client.user?.tag} logged in`);
   client.guilds.cache.forEach((guild) => {
      onStart.readAllGuildCommands();
      // onStart.deleteRegisteredCommands(config.clientID, guild);
      onStart.registerCommands(
         config.clientID,
         guild,
         onStart.guildCommands,
         false
      );
   });
});

client.on("messageCreate", async (message) => {
   await carmen.resetCounter(message);
   // the guild id of the server to keep track of carmen messages
   const carmenGuild = config.carmenRambles.guildID;
   // if message is not sent by carmen, or not in the right guild, ignore it
   if (
      message.author.id != config.carmenRambles.carmenId ||
      message.guildId != carmenGuild
   ) {
      return;
   }

   logger.info("carmen message: " + message.content);
   // 10 messages within 5 minutes will trigger a notification
   const dbMessageTimeStamp = "carmen message time stamp";
   const dbCounterLabel = "carmen message counter";
   const messageCreationTime = message.createdAt;
   const previousMessageTime: Date = new Date(
      (await db.get(dbMessageTimeStamp)) as string
   );

   // if no previous message, set counter to 0
   if (!previousMessageTime) {
      await db.set(dbCounterLabel, 0);
      await db.set(dbMessageTimeStamp, messageCreationTime);
      return;
   }

   // calculate the time difference between current message and previous message
   let timeDifference =
      messageCreationTime.getMinutes() - previousMessageTime.getMinutes();

   // if time difference is within 5 minutes, increment counter
   if (timeDifference < 5) {
      let counter: number = (await db.get(dbCounterLabel)) as number;
      await db.set(dbCounterLabel, counter + 1);
      logger.info(`Counter updated: ${counter + 1}`);
   } else {
      // if time difference is greater than 5 mins, reset counter and last message creation time
      logger.info(`Counter reset. Time difference: ${timeDifference}`);
      db.set(dbCounterLabel, 0);
      db.set(dbMessageTimeStamp, messageCreationTime);
      return;
   }

   // update the last message creation time in db
   db.set(dbMessageTimeStamp, messageCreationTime);

   logger.debug("Counter from db: " + (await db.get(dbCounterLabel)));
   // if counter from db is greater than message limit, send notification
   if (
      ((await db.get(dbCounterLabel)) as number) >
      config.carmenRambles.messageLimit
   ) {
      carmen.sendNotification(client);
      // reset counter
      db.set(dbCounterLabel, 0);
      // set last message creation time to current time
      db.set(dbMessageTimeStamp, messageCreationTime);
   }
});

// For john
client.on("messageCreate", async (message) => {
   if (message.author.bot) {
      logger.info(`Bot message: ${message.content}. Ignoring`);
      return;
   }
   logger.info(`John message: ${message.content}`);
   // if (message.author.id != config.subForJohn.johnID) return;
   // const dbCounterLabel = "john message counter";
   const dbMessageTimeStamp = "john notification time stamp";
   const lastNotificationTime: Date = new Date(
      (await db.get(dbMessageTimeStamp)) as string
   );
   // const counter = (await db.get(dbCounterLabel)) as number;

   let timeDifference = Date.now() - lastNotificationTime.getTime();
   timeDifference = msToMins(timeDifference);
   logger.info(`Time difference: ${timeDifference} mins`);

   // if the message contains notification words,
   if (john.containsWords(message)) {
      // if the time difference is less than cool down cycle. Reset
      // lastNotificationTime to avoid keeping sending notifications, and do
      // nothing
      // only check this is production
      if (
         timeDifference < config.subForJohn.cooldown &&
         config.development === false
      ) {
         await db.set(dbMessageTimeStamp, new Date());
         logger.info(
            `lastNotificationTime rest. Time difference: ${timeDifference} mins`
         );
         return;
      }
      // else if john keeps saying those words, reset lastNotificationTime to now to avoid keeping sending notifications
      // reset lastNotificationTime to now
      await db.set(dbMessageTimeStamp, new Date());
      john.sendNotification(client);
      logger.info(`Notification sent. Time difference: ${timeDifference} mins`);
   }
   // if john keeps saying those words, reset lastNotificationTime to now, so we dont keep sending notifications
   else if (john.containsWords(message)) {
      await db.set(dbMessageTimeStamp, new Date());
      logger.info(
         `Notification reset. Time difference: ${timeDifference} mins`
      );
   }
});

client.on("interactionCreate", async (interaction: Interaction) => {
   if (!interaction.isCommand()) return;
   const command = client.commands.get(interaction.commandName);

   if (!command) return;

   try {
      await command.default.execute(interaction);
   } catch (error: any) {
      logger.error(error);
      await interaction.reply({
         content: error.toString(),
         ephemeral: true,
      });
   }
});

client.on("guildCreate", function (guild) {
   onStart.readAllGuildCommands();
   // onStart.readGlobalCommands();
   onStart.registerCommands(
      config.clientID,
      guild,
      onStart.guildCommands,
      false
   );
});

client.login(require("../config.json").token);
