import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import ICommand from "../types/command";

export default {
   data: new SlashCommandBuilder()
      .setName("dicksforjohn")
      .setDescription("Sends a message to the channel about dicks for john"),
   execute: async function (interaction: CommandInteraction) {
      interaction.reply("DICKCHEESE");
   },
   help: {
      name: "dicksforjohn",
      description: "Sends a message to the channel about dicks for john",
      usage: "/dicksforjohn",
   },
} as ICommand;
