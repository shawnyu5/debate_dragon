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
      let helpDocs: Array<IHelp> = readAllHelpDocs();

      // go through all help docs and find the one the user is looking for
      for (let i = 0; i < helpDocs.length; i++) {
         let doc = helpDocs[i];
         if (doc && doc.name == userInput) {
            let reply = new MessageEmbed().setColor("RANDOM").setTitle("Help")
               .setDescription(`
   Command name: ${doc.name}
   Description: ${doc.description}
   Usage: \`${doc.usage}\`
   `);
            interaction.reply({ embeds: [reply] });
            logger.info(`${userInput} help requested`);
            return;
         }
      }
      interaction.reply(`Command \`${userInput}\`  not found`);
      logger.info("Help command called with a invalid command");
   },
   help: {
      name: "help",
      description: "help command",
      usage: "/help command: <command>",
   },
} as ICommand;
