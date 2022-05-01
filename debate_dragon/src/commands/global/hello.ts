import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
   data: new SlashCommandBuilder()
      .setName("hello")
      .setDescription("says hello"),

   async execute(interaction: CommandInteraction, args: any) {
      interaction.reply("hi");
   },
};
