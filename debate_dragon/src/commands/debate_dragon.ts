// import { ApplicationCommandType } from "discord-api-types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { textOverlay } from "../utils";

module.exports = {
   data: new SlashCommandBuilder()
      .setName("dd")
      .setDescription("Summons a dragon to burn your debate fows to the ground")
      .addStringOption((option: any) =>
         option.setName("message").setDescription("A string").setRequired(true)
      ),

   async execute(interaction: CommandInteraction) {
      await interaction.deferReply();
      let userMessage = interaction.options.get("message")?.value as string;
      console.log("execute userMessage: %s", userMessage); // __AUTO_GENERATED_PRINT_VAR__
      console.log("execute#if userMessage.length: %s", userMessage.length); // __AUTO_GENERATED_PRINT_VAR__
      if (userMessage.length > 25) {
         userMessage = userMessage.substring(0, 25);
      }
      await textOverlay(userMessage);
      await interaction.editReply({
         files: ["media/img/done.png"],
      });
   },
};
