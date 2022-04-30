import { Client, Collection, Intents } from "discord.js";
require("dotenv").config();
import fs from "fs";
// const deploy_commands = require("./deploy-commands");
import { OnStart } from "./deploy-commands";
const config = require("../../config.json");

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
   let allCommands = onStart.readAllCommands();

   console.log(`${client.user?.tag} logged in`);
   client.guilds.cache.forEach((guild) => {
      onStart.registerCommands(config.clientID, guild.id, allCommands);
   });
});

client.on("interactionCreate", async (interaction) => {
   if (!interaction.isCommand()) return;
   const command = client.commands.get(interaction.commandName);

   if (!command) return;

   try {
      await command.execute(interaction);
   } catch (error) {
      console.error(error);
      await interaction.reply({
         content: "There was an error while executing this command!",
         ephemeral: true,
      });
   }
});

client.on("guildCreate", function (guild) {
   let allCommands = onStart.readAllCommands();
   onStart.registerCommands(config.clientID, guild.id, allCommands);
});

client.login(require("../../config.json").token);
