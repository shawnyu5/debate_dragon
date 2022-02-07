"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const deploy_commands = require("./deploy-commands");
const config = require("../../config.json");
const client = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new discord_js_1.Collection();
const commandFiles = fs
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
client.on("ready", () => {
    let allCommands = deploy_commands.getAllCommands();
    console.log(`${client.user.tag} logged in`);
    client.guilds.cache.forEach((guild) => {
        deploy_commands.registerCommands(config.clientID, guild.id, allCommands);
    });
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});
client.on("guildCreate", function (guild) {
    let allCommands = deploy_commands.getAllCommands();
    deploy_commands.registerCommands(config.clientID, guild.id, allCommands);
});
// console.log(require("../../config.json").token);
client.login(require("../../config.json").token);
