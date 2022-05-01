import { CommandInteraction, Interaction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

/**
 * get a insult from insult.mattbas.org/api/
 * @return {Promise} An insult in plain text
 */
async function getInsult(): Promise<string> {
   try {
      // get insult back in plain text
      let response = await axios.get("https://insult.mattbas.org/api/insult");
      return Promise.resolve(response.data);
   } catch (error) {
      console.log(error);
      return Promise.reject(error);
   }
}

/**
 * get the user that is being insulted
 * @param interaction - the interaction object
 * @returns the id of the user tagged in the message
 */
function getInsultedUser(interaction: Interaction): string {
   return String(interaction).split(":")[1];
}

module.exports = {
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

   async execute(interaction: CommandInteraction) {
      await interaction.deferReply();
      let author = getInsultedUser(interaction);
      // if I am being insulted, don't
      if (author == "652511543845453855") {
         console.log("I am being insulted, this will not fly");
         // get the user that ran the command and insult them instead
         author = String(interaction.user.id);
      }
      let insult: string = await getInsult();
      await interaction.editReply(`<@${author}> ${insult}`);
   },
};
