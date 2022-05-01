"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv").config();
const fs_1 = __importDefault(require("fs"));
// const deploy_commands = require("./deploy-commands");
const deploy_commands_1 = require("./deploy-commands");
const config = require("../../config.json");
const client = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new discord_js_1.Collection();
const commandFiles = fs_1.default
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
let onStart = new deploy_commands_1.OnStart();
client.on("ready", () => {
    console.log(`${client.user?.tag} logged in`);
    client.guilds.cache.forEach((guild) => {
        onStart.readAllGuildCommands();
        onStart.registerCommands(config.clientID, guild, onStart.guildCommands, false);
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
            content: error.toString(),
            ephemeral: true,
        });
    }
});
client.on("guildCreate", function (guild) {
    onStart.readAllGuildCommands();
    onStart.readGlobalCommands();
    onStart.registerCommands(config.clientID, guild, onStart.guildCommands, false);
    onStart.registerCommands(config.clientID, guild, onStart.guildCommands, true);
});
client.login(require("../config.json").token);
