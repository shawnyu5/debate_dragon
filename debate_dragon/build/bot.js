"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv").config();
const fs_1 = __importDefault(require("fs"));
const deploy_commands_1 = require("./deploy-commands");
const config_json_1 = __importDefault(require("../config.json"));
const quick_db_1 = require("quick.db");
const logger_1 = __importDefault(require("./logger"));
const carmen = __importStar(require("./commands/subToCarmen"));
const client = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new discord_js_1.Collection();
const commandFiles = fs_1.default
    .readdirSync(__dirname + "/commands")
    .filter((file) => file.endsWith(".js"));
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
let onStart = new deploy_commands_1.OnStart();
let db = new quick_db_1.QuickDB();
client.on("ready", () => {
    logger_1.default.info(`${client.user?.tag} logged in`);
    client.guilds.cache.forEach((guild) => {
        onStart.readAllGuildCommands();
        // onStart.deleteRegisteredCommands(config.clientID, guild);
        onStart.registerCommands(config_json_1.default.clientID, guild, onStart.guildCommands, false);
    });
});
client.on("messageCreate", async (message) => {
    await carmen.resetCounter(message);
    // the guild id of the server to keep track of carmen messages
    const carmenGuild = config_json_1.default.carmenRambles.guildID;
    // if message is not sent by carmen, or not in the right guild, ignore it
    if (message.author.id != config_json_1.default.carmenRambles.carmenId ||
        message.guildId != carmenGuild) {
        return;
    }
    logger_1.default.info("carmen message: " + message.content);
    // 10 messages within 5 minutes will trigger a notification
    const dbMessageTimeStamp = "carmen message time stamp";
    const dbCounterLabel = "carmen message counter";
    const messageCreationTime = message.createdAt;
    const previousMessageTime = new Date((await db.get(dbMessageTimeStamp)));
    // if no previous message, set counter to 0
    if (!previousMessageTime) {
        await db.set(dbCounterLabel, 0);
        await db.set(dbMessageTimeStamp, messageCreationTime);
        return;
    }
    // calculate the time difference between current message and previous message
    let timeDifference = messageCreationTime.getMinutes() - previousMessageTime.getMinutes();
    // if time difference is within 5 minutes, increment counter
    if (timeDifference < 5) {
        let counter = (await db.get(dbCounterLabel));
        await db.set(dbCounterLabel, counter + 1);
        logger_1.default.info(`Counter updated: ${counter + 1}`);
    }
    else {
        // if time difference is greater than 5 mins, reset counter and last message creation time
        logger_1.default.info(`Counter reset. Time difference: ${timeDifference}`);
        db.set(dbCounterLabel, 0);
        db.set(dbMessageTimeStamp, messageCreationTime);
        return;
    }
    // update the last message creation time in db
    db.set(dbMessageTimeStamp, messageCreationTime);
    logger_1.default.debug("Counter from db: " + (await db.get(dbCounterLabel)));
    // if counter from db is greater than message limit, send notification
    if ((await db.get(dbCounterLabel)) >
        config_json_1.default.carmenRambles.messageLimit) {
        carmen.sendNotification(client);
        // reset counter
        db.set(dbCounterLabel, 0);
        // set last message creation time to current time
        db.set(dbMessageTimeStamp, messageCreationTime);
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.default.execute(interaction);
    }
    catch (error) {
        logger_1.default.error(error);
        await interaction.reply({
            content: error.toString(),
            ephemeral: true,
        });
    }
});
client.on("guildCreate", function (guild) {
    onStart.readAllGuildCommands();
    // onStart.readGlobalCommands();
    onStart.registerCommands(config_json_1.default.clientID, guild, onStart.guildCommands, false);
});
client.login(config_json_1.default.token);
