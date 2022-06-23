import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { writeToConfig } from "../utils";

module.exports = {
   data: new SlashCommandBuilder()
      .setName("subforcarmen")
      .setDescription("Subscribes to Carmen's ramblings for free!")
      .addBooleanOption((option) => {
         return option
            .setName("subscription")
            .setDescription("subscription to CaramelCorn rambles")
            .setRequired(true);
      }),

   async execute(interaction: CommandInteraction) {
      await interaction.deferReply();
      let subscription = interaction.options.get("subscription")
         ?.value as boolean;
      let config = require("../../config.json");
      let user = interaction.user.id;

      if (subscription) {
         if (config["carmenSubscribers"].includes(user)) {
            await interaction.editReply(
               "You are already subscribed to CaramelCorn rambles!"
            );
            return;
         }
         config["carmenSubscribers"].push(user);
         writeToConfig("carmenSubscribers", config["carmenSubscribers"]);
         await interaction.editReply(
            "You are now subscribed to CaramelCorn rambles!"
         );
      } else {
         if (config["carmenSubscribers"].includes(user)) {
            config["carmenSubscribers"] = config["carmenSubscribers"].filter(
               (id: string) => id !== user
            );
            writeToConfig("carmenSubscribers", config["carmenSubscribers"]);
            await interaction.editReply(
               "You are no longer subscribed to CaramelCorn rambles!"
            );
            return;
         }
         await interaction.editReply(
            "You are not subscribed to CaramelCorn rambles!"
         );
      }
   },
};
