import { SlashCommandBuilder } from "@discordjs/builders";

export interface IOptions {
   name: string; // name of command
   description: string; // description of command
   slashCommand: SlashCommandBuilder; // slash command builder
}
