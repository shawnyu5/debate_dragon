"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnStart = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
// @ts-ignore
const config_json_1 = require("../config.json");
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
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
            if (command.default) {
                commands.push(command.default?.data.toJSON());
            }
        }
        // const command = require(`${__dirname}/commands/debate_dragon.js`);
        // commands.push(command.default.data.toJSON());
        // const command2 = require(`${__dirname}/commands/help.js`);
        // commands.push(command2.default.data.toJSON());
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
                logger_1.default.info(`Started refreshing application (/) commands for ${guild.name}`);
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
                logger_1.default.info(`Successfully reloaded application (/) commands for ${guild.name}`);
            }
            catch (error) {
                logger_1.default.error(error);
            }
        })();
    }
    /**
     * delete all registered commands in a guild
     * @param clientID - ClientID
     * @param guild - Guild object
     */
    deleteRegisteredCommands(clientID, guild) {
        logger_1.default.info("Deleting slash commands for " + guild.name);
        const rest = new rest_1.REST({ version: "9" }).setToken(config_json_1.token);
        rest
            .get(v9_1.Routes.applicationGuildCommands(clientID, guild.id))
            .then((data) => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${v9_1.Routes.applicationGuildCommands(clientID, guild.id)}/${command.id}`;
                // @ts-ignore
                promises.push(rest.delete(deleteUrl));
            }
            logger_1.default.info("Finished deleting slash commands for " + guild.name);
            return Promise.all(promises);
        });
    }
}
exports.OnStart = OnStart;
