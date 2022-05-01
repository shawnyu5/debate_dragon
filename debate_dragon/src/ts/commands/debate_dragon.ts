// import { ApplicationCommandType } from "discord-api-types";
import { Client } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../command";
const { textOverlay } = require("../utils");

module.exports = class DebateDragon extends Command {
   constructor(client: Client) {
      super(client, {
         name: "dd",
         description: "Summons a dragon to burn your debate fows to the ground",
         // @ts-ignore
         slashCommand: new SlashCommandBuilder().addStringOption(
            (option: any) =>
               option
                  .setName("message")
                  .setDescription("A string")
                  .setRequired(true)
         ),
      });

      async function execute(interaction: any) {
         let userMessage = interaction.options._hoistedOptions[0].value;
         console.log("execute userMessage: %s", userMessage); // __AUTO_GENERATED_PRINT_VAR__
         await textOverlay(userMessage);
         await interaction.reply({
            // embeds: [message],
            files: ["media/img/done.png"],
         });
      }
   }
};
// data: new SlashCommandBuilder()
// .setName("dd")
// .setDescription("Summons a dragon to burn your debate fows to the ground")
// .addStringOption((option: any) =>
// option.setName("message").setDescription("A string").setRequired(true)
// ),
