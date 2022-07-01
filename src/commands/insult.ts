import { CommandInteraction, Interaction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import logger from "../logger";
import ICommand from "../types/command";

export default {
   data: new SlashCommandBuilder()
      .setName("insult")
      .setDescription("Ping someone and insult them")
      .addUserOption((option: any) =>
         option
            .setName("user")
            .setDescription(
               "The person you tag may be butthurt. Use at your own risk"
            )
            .setRequired(true)
      ),

   execute: async function (interaction: CommandInteraction) {
      await interaction.deferReply();
      let author = interaction.options.getUser("user")?.id;
      // if I am being insulted, don't
      if (author == "652511543845453855") {
         logger.info("I am being insulted, this will not fly");
         // get the user that ran the command and insult them instead
         author = String(interaction.user.id);
      }
      let insult: string;
      try {
         insult = await getInsult();
      } catch (e) {
         insult = "fuck you";
      }
      await interaction.editReply(`<@${author}> ${insult}`);
   },
   help: {
      name: "insult",
      description: "Ping someone and insult them",
      usage: "/insult user: <user>",
   },
} as ICommand;

/**
 * get a insult from insult.mattbas.org/api/
 * @return {Promise} An insult in plain text
 */
async function getInsult(): Promise<string> {
   try {
      // get insult back in plain text
      logger.debug("getting insult from mattbas");
      // throw new Error();
      let response = await axios.get("https://insult.mattbas.org/api/insult", {
         timeout: 5000,
      });
      return Promise.resolve(response.data);
   } catch (error) {
      return Promise.resolve("fuck you");
   }
}
