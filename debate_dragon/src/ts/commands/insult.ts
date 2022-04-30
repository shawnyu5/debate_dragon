import {
   CommandInteraction,
   Interaction,
   MessageEmbed,
   User,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";

/**
 * gets an insult from the evil insults API
 * @returns {Promise<string>} Returns the insult from the API
 */
async function evilInsult(): Promise<string> {
   interface IEvilInsult {
      status: number;
      statusText: string;
      data: string;
   }

   try {
      // get insult back in plain text
      console.log("getting insult from evilinsult");
      let response: IEvilInsult = await axios.get(
         "https://evilinsult.com/generate_insult.php?lang=en"
      );

      let insult: string = response.data;
      // check if response contains invalid words
      if (insult.includes("&quot;")) {
         await getInsult();
      }
      return Promise.resolve(insult);
   } catch (error) {
      console.log(error);
      return Promise.reject(error);
   }
}

/**
 * get a insult from insult.mattbas.org/api/
 * @return {Promise} An insult in plain text
 */
async function mattbasInsult(): Promise<string> {
   try {
      // get insult back in plain text
      console.log("getting insult from mattbas");
      let response = await axios.get("https://insult.mattbas.org/api/insult");
      return Promise.resolve(response.data);
   } catch (error) {
      console.log(error);
      return Promise.reject(error);
   }
}

/**
 * gets an insult from either the evilinsult API or the insult.mattbas.org API
 * @returns {Promise<string>} Returns the insult from the API
 */
async function getInsult(): Promise<string> {
   // generate random number between 1 and 10
   let randomNumber: number = Math.floor(Math.random() * 10) + 1;

   if (randomNumber <= 5) {
      return await evilInsult();
   } else {
      return await mattbasInsult();
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
