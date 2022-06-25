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

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   // Set a new item in the Collection
   // With the key as the command name and the value as the exported module
   client.commands.set(command.data.name, command);
}

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
   // if message is not sent by carmen, ignore it
   if (message.author.id != config.carmenRambles.carmenId) {
      return;
   }
   // 10 messages within 5 minutes will trigger a notification
   const dbMessageCreationTime = "carmenMessageTimeStamp";
   const dbCounterLabel = "carmenCounter";
   const messageCreationTime = message.createdAt;
   const previousMessageTime: Date | null = new Date(
      (await db.get(dbMessageCreationTime)) as string
   );

   // if no previous message, set counter to 0
   if (!previousMessageTime) {
      await db.set(dbCounterLabel, 0);
      await db.set(dbMessageCreationTime, messageCreationTime);
      return;
   }

   // calculate the time difference between current message and previous message
   let timeDifference =
      messageCreationTime.getMinutes() - previousMessageTime.getMinutes();

   // if time difference is within 5 minutes, increment counter
   if (timeDifference < 5) {
      let counter: number = (await db.get(dbCounterLabel)) as number;
      await db.set(dbCounterLabel, counter + 1);
      logger.debug(`Counter updated: ${counter + 1}`);
   } else {
      // if time difference is greater than 5 mins, reset counter and last message creation time
      db.set(dbCounterLabel, 0);
      db.set(dbMessageCreationTime, messageCreationTime);
      return;
   }

   // update the last message creation time in db
   db.set(dbMessageCreationTime, messageCreationTime);

   logger.debug("Counter label from db: " + (await db.get(dbCounterLabel)));
   // if counter from db is greater than 10, send notification
   if (((await db.get(dbCounterLabel)) as number) >= 10) {
      const subToCarmen = require("./commands/subToCarmen");
      subToCarmen.sendNotification(client);
      db.set(dbCounterLabel, 0);
      db.set(dbMessageCreationTime, messageCreationTime);
   }
});

client.on("interactionCreate", async (interaction: Interaction) => {
   if (!interaction.isCommand()) return;
   const command = client.commands.get(interaction.commandName);

   if (!command) return;

   try {
      await command.execute(interaction);
   } catch (error: any) {
      console.error(error);
      await interaction.reply({
         content: error.toString(),
         ephemeral: true,
      });
   }
});

client.on("guildCreate", function (guild) {
   onStart.readAllGuildCommands();
   onStart.readGlobalCommands();
   onStart.registerCommands(
      config.clientID,
      guild,
      onStart.guildCommands,
      false
   );
   // onStart.registerCommands(
   // config.clientID,
   // guild,
   // onStart.guildCommands,
   // true
   // );
});

client.login(require("../config.json").token);
