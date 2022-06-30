import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import ICommand from "../types/command";

export default {
   data: new SlashCommandBuilder()
      .setName("isivan")
      .setDescription("Checks if a user or a message is Ivan")
      .addUserOption((option) => {
         return option
            .setName("user")
            .setDescription("A user you would like to check if is ivan")
            .setRequired(false);
      })
      .addStringOption((option) => {
         return option
            .setName("message")
            .setDescription(
               "A message you would like to check if its sent by Ivan"
            )
            .setRequired(false);
      }),

   execute: async function (interaction: CommandInteraction) {},
   help: {
      name: "isivan",
      description: "Checks if a user or a message is Ivan",
      usage: "/isivan user: @user | message: message",
   },
} as ICommand;
