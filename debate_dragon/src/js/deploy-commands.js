"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnStart = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const { clientID, guildID, token } = require("../../config.json");
const fs = require("fs");
class OnStart {
    /**
     * @returns all commands contained in `/commands`
     */
    readAllCommands() {
        const commands = [];
        const commandFiles = fs
            .readdirSync(__dirname + "/commands")
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${__dirname}/commands/${file}`);
            commands.push(command.data.toJSON());
        }
        return commands;
    }
    commands = this.readAllCommands();
    /**
     * @param clientID - ClientID
     * @param guildID - guildID
     * @param commands - array of commands
     */
    registerCommands(clientID, guildID, commands) {
        const rest = new rest_1.REST({ version: "9" }).setToken(token);
        rest
            .put(v9_1.Routes.applicationGuildCommands(clientID, guildID), {
            body: commands,
        })
            .then(() => console.log("Successfully registered application commands."))
            .catch(console.error);
    }
}
exports.OnStart = OnStart;
