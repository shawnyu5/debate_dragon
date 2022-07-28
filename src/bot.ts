import { Client, Collection, Guild, Intents, Interaction } from "discord.js";
require("dotenv").config();
import fs from "fs";
import { OnStart } from "./deploy-commands";
import config from "../config.json";
import { QuickDB } from "quick.db";
import logger from "./logger";
import * as carmen from "./commands/subToCarmen";

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

let onStart = new OnStart();
let db = new QuickDB();
client.on("ready", (client: Client) => {
   logger.info(`${client.user?.tag} logged in`);

   // TODO: loop over all the guilds on exit to delete the slash commands from them
   client.guilds.cache.forEach(async (guild) => {
      if (guild.name === "Ogi's server") {
         logger.info("Skipping Ogi's server");
         return;
      }
      // await onStart.deleteRegisteredCommands(config.clientID, guild);
      onStart.readAllGuildCommands();
      onStart.registerCommands(
         config.clientID,
         guild,
         onStart.guildCommands,
         false
      );
   });

   process.on("SIGINT", () => {
      client.guilds.cache.forEach(async (guild) => {
         try {
            await onStart.deleteRegisteredCommands(config.clientID, guild);
         } catch (e) {
            logger.error(`No slash command for guild ${guild.name}`);
            // exit process
            process.exit(1);
         }
      });
   });
   process.on("exit", () => {
      client.guilds.cache.forEach(async (guild) => {
         try {
            await onStart.deleteRegisteredCommands(config.clientID, guild);
         } catch (e) {
            logger.error(`No slash command for guild ${guild.name}`);
            // exit process
            process.exit(1);
         }
      });
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
      carmen.sendNotification(client, message);
      // reset counter
      db.set(dbCounterLabel, 0);
      // set last message creation time to current time
      db.set(dbMessageTimeStamp, messageCreationTime);
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

client.on("destroy", function (guild: Guild) {
   // onStart.deleteRegisteredCommands(config.clientID, guild);
});

// process.on("exit", () => {
// onStart.deleteRegisteredCommands(config.clientID);
// });
client.login(config.token);
