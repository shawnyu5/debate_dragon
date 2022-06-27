import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import ICommand from "../types/command";

export default {
   data: new SlashCommandBuilder()
      .setName("dicksforjohn")
      .setDescription("Sends a message to the channel about dicks for john"),
   execute: async function (interaction: CommandInteraction) {
      // interaction.reply("DICKCHEESE");

      const roles = await interaction.guild?.roles.fetch("990982920938352681");
      console.log(" roles: %s", roles); // __AUTO_GENERATED_PRINT_VAR__

      // @ts-ignore
      await interaction.member?.roles.add(roles);
      // await interaction.member.roles.add(role); // and you're all set! welcome to stackoverflow 😄
      await interaction.reply(`All roles: ${roles}`);
   },
   help: {
      name: "dicksforjohn",
      description: "Sends a message to the channel about dicks for john",
      usage: "/dicksforjohn",
   },
} as ICommand;
