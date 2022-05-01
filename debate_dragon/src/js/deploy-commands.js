"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnStart = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_json_1 = require("../../config.json");
const fs_1 = __importDefault(require("fs"));
class OnStart {
    /**
     * registered slash commands in a guild
     */
    guildCommands;
    /**
     * registered global slash commands
     */
    globalCommands;
    /**
     * read all guild commands contained in `/commands` and set `this.guildCommands`
     */
    readAllGuildCommands() {
        const commands = [];
        const commandFiles = fs_1.default
            .readdirSync(__dirname + "/commands")
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${__dirname}/commands/${file}`);
            commands.push(command.toJSON());
        }
        this.guildCommands = commands;
    }
    /**
     * read all commands contained in `/commands/global` and set `this.globalCommands`
     */
    readGlobalCommands() {
        const commands = [];
        const commandFiles = fs_1.default
            .readdirSync(__dirname + "/commands/global")
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${__dirname}/commands/global/${file}`);
            commands.push(command.data.toJSON());
        }
        this.globalCommands = commands;
    }
    /**
     * register slash commands in a guild
     * @param clientID - ClientID
     * @param guild - Guild object
     * @param commands - array of commands
     * @param global - whether to register commands globally or not
     */
    registerCommands(clientID, guild, commands, global) {
        const rest = new rest_1.REST({ version: "9" }).setToken(config_json_1.token);
        (async () => {
            try {
                console.log(`Started refreshing application (/) commands for ${guild.name}`);
                if (!global) {
                    await rest.put(v9_1.Routes.applicationGuildCommands(clientID, guild.id), {
                        body: commands,
                    });
                }
                else {
                    await rest.put(v9_1.Routes.applicationCommands(clientID), {
                        body: commands,
                    });
                }
                console.log(`Successfully reloaded application (/) commands for ${guild.name}`);
            }
            catch (error) {
                console.error(error);
            }
        })();
    }
}
exports.OnStart = OnStart;
