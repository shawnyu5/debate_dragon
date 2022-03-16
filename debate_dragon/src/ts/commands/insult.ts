import { MessageEmbed } from "discord.js";
const { SlashCommandBuilder } = require("@discordjs/builders");
import axios from "axios";

async function getInsult() {
   /*
    * Return an insult from an api
    * @return {json} an insult
    */
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
   return insult;
}

function getAuthor(interaction: string) {
   return interaction.split(":")[1];
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("insult")
      .setDescription("Ping someone and insult them")
      .addUserOption((option: any) =>
         option.setName("user").setDescription("A string").setRequired(true)
      ),

   async execute(interaction: any) {
      let author = getAuthor(String(interaction));
      console.log("execute author: %s", author); // __AUTO_GENERATED_PRINT_VAR__
      // let userMessage = interaction.options._hoistedOptions[0].value;
      let insult: string = await getInsult();
      await interaction.reply(`<@${author}> ${insult}`);
   },
};
