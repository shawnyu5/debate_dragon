// import { ApplicationCommandType } from "discord-api-types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import logger from "../logger";
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
      logger.debug("User message length: " + userMessage.length); // __AUTO_GENERATED_PRINT_VAR__
      if (userMessage.length > 30) {
         logger.debug("userMessage too long, cutting short");
         userMessage = userMessage.substring(0, 30);
      }

      logger.info(
         "Replied with dragon picture and user message: " + userMessage
      );
      await textOverlay(userMessage);
      await interaction.editReply({
         files: ["media/img/done.png"],
      });
   },
};
