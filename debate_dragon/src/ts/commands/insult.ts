import {
   CommandInteraction,
   Interaction,
   MessageEmbed,
   User,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

/**
 * gets an insult from the API
 * @returns {Promise<string>} Returns the insult from the API
 */
async function getInsult(): Promise<string> {
   interface IInsult {
      status: number;
      statusText: string;
      data: string;
   }

   // get insult back in plain text
   let response: IInsult = await axios.get(
      "https://evilinsult.com/generate_insult.php?lang=en"
   );

   let insult: string = response.data;
   // check if response contains invalid words
   if (insult.includes("&quot;")) {
      await getInsult();
   }
   return insult;
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
      // let userMessage = interaction.options._hoistedOptions[0].value;
      let insult: string = await getInsult();
      await interaction.editReply(`<@${author}> ${insult}`);
   },
};
