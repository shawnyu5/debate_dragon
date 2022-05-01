import { SlashCommandBuilder } from "@discordjs/builders";
import { Client } from "discord.js";
import { IOptions } from "./types/options";

export class Command {
   // discord client instance
   client: Client;
   slashCommand: SlashCommandBuilder;

   constructor(client: Client, options: IOptions) {
      this.client = client;
      this.slashCommand = options.slashCommand;
      this.slashCommand.setName(options.name);
      this.slashCommand.setDescription(options.description);
   }
}
