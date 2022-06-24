import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { writeToConfig } from "../utils";
import { QuickDB } from "quick.db";
import { IConfig } from "../types/config";
import { getChannelByName } from "../utils";

const db = new QuickDB();

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
      const config: IConfig = require("../../config.json");
      const dbLabel = "carmenLastNotification";
      const notificationUsers = config.carmenRambles.subscribers;
      const currentTime = new Date();

      const channelToSend = getChannelByName(
         client,
         config.carmenRambles.channelName
      );
      // if not channel found, then its a config error most likely
      if (!channelToSend) {
         console.log(
            "Please spesify the channel to send notifications in config.json"
         );
         return;
      }
      const lastNotificationTime: Date | null = await db.get(dbLabel);
      // if less than 1 hour has passed since the last notification, do nothing
      if (
         lastNotificationTime &&
         lastNotificationTime.getHours() - currentTime.getHours() < 1
      ) {
         // this means carmen is still rambling, so don't keep notifying user of this
         await db.set(dbLabel, currentTime);
         return;
      }
      // set current notification time
      await db.set(dbLabel, currentTime);
      let message = this.constructNotification(notificationUsers);
      channelToSend.send(message);
   },

   /**
    * construct a notification message alerting the users about carmen's ramblings
    * @param users - array of users to send the message too
    * @returns message to send to the users
    */
   constructNotification(users: Array<string>): string {
      let message = "";
      users.forEach((user) => {
         message += `<@${user}> `;
      });
      message += " carmen is Rambling now!!!";
      return message;
   },
};
