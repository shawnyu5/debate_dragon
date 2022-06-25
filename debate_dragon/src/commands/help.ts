import {
   SlashCommandBuilder,
   SlashCommandStringOption,
} from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import logger from "../logger";
import ICommand from "../types/command";
import { IHelp } from "../types/help";
import { readAllHelpDocs } from "../utils";

export default {
   data: new SlashCommandBuilder()
      .setName("help")
      .setDescription("help command")
      .addStringOption((option: SlashCommandStringOption) =>
         option
            .setName("command")
            .setDescription("name of command to get help page of")
            .setRequired(true)
      ),

   execute: async function (interaction: CommandInteraction): Promise<void> {
      let userInput = interaction.options.get("command")?.value as string;
      if (userInput) {
         let helpDocs: Array<IHelp> = readAllHelpDocs();
         logger.debug("helpDocs: " + JSON.stringify(helpDocs));

         // go through all help docs and find the one the user is looking for
         helpDocs.forEach((doc) => {
            console.log("if#(anon) doc: %s", doc); // __AUTO_GENERATED_PRINT_VAR__
            if (doc && doc.name == userInput) {
               let reply = new MessageEmbed()
                  .setColor("RANDOM")
                  .setTitle("Help").setDescription(`
   Command name: ${doc.name}
   Description: ${doc.description}
   Usage: \`${doc.usage}\`
   `);
               interaction.reply({ embeds: [reply] });
               logger.info(`${userInput} help requested`);
            }
         });
      } else {
         interaction.reply("Command not found");
         logger.info("Help command called with a invalid command");
      }
   },
   help: {
      name: "help",
      description: "help command",
      usage: "/help command: <command>",
   },
} as ICommand;
