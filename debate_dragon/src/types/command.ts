import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default interface ICommand {
   data: SlashCommandBuilder;
   execute(interaction: CommandInteraction): Promise<void>;
   help: {
      name: string;
      description: string;
      usage: string;
   };
}
