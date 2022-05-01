import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Guild } from "discord.js";
import { clientID, guildID, token } from "../../config.json";
import fs from "fs";
import { Command } from "./command";

class OnStart {
   /**
    * registered slash commands in a guild
    */
   guildCommands: any;

   /**
    * registered global slash commands
    */
   globalCommands: any;

   /**
    * read all guild commands contained in `/commands` and set `this.guildCommands`
    */
   readAllGuildCommands(): void {
      const commands = [];
      const commandFiles = fs
         .readdirSync(__dirname + "/commands")
         .filter((file: string) => file.endsWith(".js"));

      for (const file of commandFiles) {
         const command = require(`${__dirname}/commands/${file}`);
         const commandobj = new command(this);
         commands.push(commandobj.slashCommmand.toJSON());
      }
      this.guildCommands = commands;
   }

   /**
    * read all commands contained in `/commands/global` and set `this.globalCommands`
    */
   readGlobalCommands(): void {
      const commands = [];
      const commandFiles = fs
         .readdirSync(__dirname + "/commands/global")
         .filter((file: string) => file.endsWith(".js"));

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
   registerCommands(
      clientID: string,
      guild: Guild,
      commands: any,
      global: boolean
   ): void {
      const rest = new REST({ version: "9" }).setToken(token);
      (async () => {
         try {
            console.log(
               `Started refreshing application (/) commands for ${guild.name}`
            );

            if (!global) {
               await rest.put(
                  Routes.applicationGuildCommands(clientID, guild.id),
                  {
                     body: commands,
                  }
               );
            } else {
               await rest.put(Routes.applicationCommands(clientID), {
                  body: commands,
               });
            }

            console.log(
               `Successfully reloaded application (/) commands for ${guild.name}`
            );
         } catch (error) {
            console.error(error);
         }
      })();
   }
}

export { OnStart };
