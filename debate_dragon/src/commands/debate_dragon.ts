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
      let userMessage = interaction.options.get("message");
      console.log("execute userMessage: %s", userMessage?.value); // __AUTO_GENERATED_PRINT_VAR__
      await textOverlay(userMessage.value?.toString() as string);
      await interaction.editReply({
         files: ["media/img/done.png"],
      });
   },
};
