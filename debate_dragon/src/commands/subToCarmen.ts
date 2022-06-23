import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { writeToConfig } from "../utils";
import { QuickDB } from "quick.db";
import { IConfig } from "../types/config";

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
      let config: IConfig = require("../../config.json");
      let user = interaction.user.id;
      let subscribers = config["carmenRambles"]["subscribers"];

      if (subscription) {
         // if user already subscribed, do nothing
         if (subscribers.includes(user)) {
            await interaction.editReply(
               "You are already subscribed to CaramelCorn rambles!"
            );
            return;
         }
         subscribers.push(user);
         config["carmenRambles"]["subscribers"] = subscribers;
         writeToConfig(config);
         await interaction.editReply(
            "You are now subscribed to CaramelCorn rambles!"
         );
      } else {
         // if user is subscribed, remove them from subscription
         if (subscribers.includes(user)) {
            subscribers = subscribers.filter((id: string) => id !== user);
            config["carmenRambles"]["subscribers"] = subscribers;
            writeToConfig(config);
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
   /**
    * Send notifications to the users in config.json about carmen's ramblings
    * @param client - discord client to send the message too
    */
   async sendNotification(client: Client) {
      const db = new QuickDB();
      let cooldown = 3.6e6; // 1 hour in milliseconds
      await db.set("carmenCooldown", cooldown);
   },
};
