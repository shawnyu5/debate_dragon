import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
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
         .filter((file: string) => file.endsWith(".js"));
      for (const file of commandFiles) {
         const command = require(`${__dirname}/commands/${file}`);
         commands.push(command.data.toJSON());
      }
      return commands;
   }
   commands = this.readAllCommands();

   /**
    * register slash commands in a guild
    * @param clientID - ClientID
    * @param guildID - guildID
    * @param commands - array of commands
    */
   registerCommands(clientID: string, guildID: string, commands: any) {
      const rest = new REST({ version: "9" }).setToken(token);
      rest
         .put(Routes.applicationGuildCommands(clientID, guildID), {
            body: commands,
         })
         .then(() =>
            console.log("Successfully registered application commands.")
         )
         .catch(console.error);
   }
}

export { OnStart };
