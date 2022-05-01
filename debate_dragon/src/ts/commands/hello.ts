import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { Command } from "../command";

module.exports = class Hello extends Command {
   constructor(client: Client) {
      super(client, {
         name: "hello",
         description: "Says hello to the user",
         slashCommand: new SlashCommandBuilder(),
      });
   }

   async execute(interaction: CommandInteraction) {
      console.log("response");
      interaction.reply("hi");
   }
};
// module.exports = {
// data: new SlashCommandBuilder()
// .setName("hello")
// .setDescription("says hello"),

// async execute(interaction: CommandInteraction, args: any) {
// interaction.reply("hi");
// },
// };
