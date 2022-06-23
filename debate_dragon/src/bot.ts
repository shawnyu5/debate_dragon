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
client.on("ready", () => {
   console.log(`${client.user?.tag} logged in`);
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
   console.log(message.content);
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
