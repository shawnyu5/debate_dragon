// import { ApplicationCommandType } from "discord-api-types";
import { SlashCommandBuilder } from "@discordjs/builders";
const { textOverlay } = require("../utils");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("dd")
      .setDescription("Summons a dragon to burn your debate fows to the ground")
      .addStringOption((option: any) =>
         option.setName("message").setDescription("A string").setRequired(true)
      ),

   async execute(interaction: any) {
      let userMessage = interaction.options._hoistedOptions[0].value;
      console.log("execute userMessage: %s", userMessage); // __AUTO_GENERATED_PRINT_VAR__
      await textOverlay(userMessage);
      await interaction.reply({
         // embeds: [message],
         files: ["media/img/done.png"],
      });
   },
};
