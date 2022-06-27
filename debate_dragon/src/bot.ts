import {
   Client,
   Collection,
   CommandInteraction,
   Intents,
   Interaction,
} from "discord.js";
require("dotenv").config();
import fs from "fs";
import { OnStart } from "./deploy-commands";
import config from "../config.json";
import { QuickDB } from "quick.db";
import logger from "./logger";

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
   require("./commands/subToCarmen").resetCounter(message);
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
   const previousMessageTime: Date | null = new Date(
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
   // if counter from db is greater than 10, send notification
   if (
      ((await db.get(dbCounterLabel)) as number) >
      config.carmenRambles.messageLimit
   ) {
      const subToCarmen = require("./commands/subToCarmen").default;
      subToCarmen.sendNotification(client);
      // reset counter
      db.set(dbCounterLabel, 0);
      // set last message creation time to current time
      db.set(dbMessageTimeStamp, messageCreationTime);
   }
});

client.on("messageCreate", async (message) => {
   // if (message.author.id != config.subForJohn.johnID) return;
   const dbCounterLabel = "john message counter";
   const counter = (await db.get(dbCounterLabel)) as number;

   // if the message contains dick, increase counter
   if (message.toString().indexOf("dick")) {
      db.set(dbCounterLabel, counter + 1);
   }

   if (counter > config.subForJohn.messageLimit) {
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
