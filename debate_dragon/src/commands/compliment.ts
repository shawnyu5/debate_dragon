import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, Interaction } from "discord.js";

module.exports = {
   data: new SlashCommandBuilder()
      .setName("compliment")
      .setDescription("Ping someone and compliment them")
      .addUserOption((option: any) =>
         option
            .setName("user")
            .setDescription("The user you want to compliment")
            .setRequired(true)
      ),

   async execute(interaction: CommandInteraction) {
      await interaction.deferReply();
      let author = getTaggedUser(interaction);
      let compliment: string = await getCompliment();
      await interaction.editReply(`<@${author}> ${compliment}`);
   },
};

/**
 * get the user that is being complimented
 * @param interaction - the interaction object
 * @returns the id of the user tagged in the message
 */
function getTaggedUser(interaction: Interaction): string {
   return String(interaction).split(":")[1];
}

/**
 * @returns a compliment in plain text
 */
async function getCompliment() {
   let compliment = await axios.get("https://complimentr.com/api");
   return compliment.data.compliment;
}
