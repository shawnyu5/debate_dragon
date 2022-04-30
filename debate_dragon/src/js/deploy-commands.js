"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnStart = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const { clientID, guildID, token } = require("../../config.json");
const fs_1 = __importDefault(require("fs"));
class OnStart {
    commands;
    /**
     * read all commands contained in `/commands` and set `this.commands`
     */
    readAllCommands() {
        const commands = [];
        const commandFiles = fs_1.default
            .readdirSync(__dirname + "/commands")
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${__dirname}/commands/${file}`);
            commands.push(command.data.toJSON());
        }
        this.commands = commands;
    }
    /**
     * register slash commands in a guild
     * @param clientID - ClientID
     * @param guild - Guild object
     * @param commands - array of commands
     * @param global - whether to register commands globally or not
     */
    registerCommands(clientID, guild, commands, global) {
        const rest = new rest_1.REST({ version: "9" }).setToken(token);
        (async () => {
            try {
                console.log("Started refreshing application (/) commands");
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
                console.log("Successfully reloaded application (/) commands.");
            }
            catch (error) {
                console.error(error);
            }
        })();
        // rest
        // .put(Routes.applicationGuildCommands(clientID, guildID), {
        // body: commands,
        // })
        // .then(() =>
        // console.log("Successfully registered application commands.")
        // )
        // .catch(console.error);
    }
}
exports.OnStart = OnStart;
