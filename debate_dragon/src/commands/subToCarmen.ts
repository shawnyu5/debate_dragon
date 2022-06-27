import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message } from "discord.js";
import { msToMins, getChannelById } from "../utils";
import { QuickDB } from "quick.db";
import { IConfig } from "../types/config";
import logger from "../logger";
import ICommand from "../types/command";

const db = new QuickDB();

export default {
   data: new SlashCommandBuilder()
      .setName("subforcarmen")
      .setDescription("Subscribes to Carmen's ramblings for free!")
      .addBooleanOption((option) => {
         return option
            .setName("subscription")
            .setDescription("subscription to CaramelCorn rambles")
            .setRequired(true);
      }),

   execute: async function (interaction: CommandInteraction) {
      await interaction.deferReply();

      const config: IConfig = require("../../config.json");
      const carmenRole = config.carmenRambles.subscribersRoleID;

      let subscriptionToggle = interaction.options.get("subscription")
         ?.value as boolean;

      if (subscriptionToggle) {
         // give carmen subscriber role to user that executed the command
         // @ts-ignore
         await interaction.member?.roles.add(carmenRole);
         await interaction.editReply(
            "Congrats, you have been subscribed to CarmenRambles!"
         );
      } else {
         // remove carmen subscriber role from user that executed the command
         // @ts-ignore
         await interaction.member?.roles.remove(carmenRole);
         await interaction.editReply(
            "Congrats, you have been unsubscribed to CarmenRambles. Sorry to see you go..."
         );
      }
   },

   help: {
      name: "subforcarmen",
      description: "subscribes to carmen's ramblings for free!",
      usage: "/subforcarmen subscription: True | False",
   },
} as ICommand;

/**
 * if 30 mins has passed since the last carmen message, reset the last notification time to now
 * @param message - message object
 */
export async function resetCounter(message: Message) {
   const dbMessageCreationTime = "carmenMessageTimeStamp";
   const dbCounterLabel = "carmenCounter";
   const lastMessageTime: Date | null = new Date(
      (await db.get(dbMessageCreationTime)) as string
   );
   const currentMessageTime = message.createdAt;

   let timeDifference =
      currentMessageTime.getTime() - lastMessageTime.getTime();
   timeDifference = msToMins(timeDifference);
   if (timeDifference > 30) {
      await db.set(dbMessageCreationTime, currentMessageTime);
      await db.set(dbCounterLabel, 0);
      logger.info(
         `Reset carmen counter. More than 30 mins has passed since last message`
      );
   }
}
/**
 * Send notifications to the users in config.json about carmen's ramblings
 * @param client - discord client to send the message too
 */
export async function sendNotification(client: Client) {
   const config: IConfig = require("../../config.json");
   const dbLastNotificationLabel = "carmen last notification time";
   // const notificationUsers = config.carmenRambles.subscribers;
   const currentTime = new Date();

   const channelToSend = getChannelById(client, config.carmenRambles.channelId);
   logger.debug(`channel to send name: ${channelToSend?.name}`);

   // if not channel found, then its a config error most likely
   if (!channelToSend) {
      logger.error(
         "Please specify the channel to send notifications in config.json"
      );
      return;
   }
   // get the last notification time from db
   const lastNotificationTime: Date | null = new Date(
      (await db.get(dbLastNotificationLabel)) as string
   );
   logger.debug(`last notification time: ${lastNotificationTime}`);

   let timeDifference = currentTime.getTime() - lastNotificationTime.getTime();

   timeDifference = msToMins(timeDifference);
   logger.debug(`time difference in mins: ${timeDifference}`);

   // if less than 1 hour has passed since the last notification, do nothing
   // only check this in production
   if (
      timeDifference < config.carmenRambles.coolDown &&
      config.development == false
   ) {
      // this means carmen is still rambling, so don't keep notifying user of this
      await db.set(dbLastNotificationLabel, currentTime);
      logger.info(
         `Less than 60 mins has passed since last notification, doing nothing. Time passed: ${timeDifference} minutes`
      );
      logger.info(
         `Updated last notification time with current time: ${currentTime}`
      );
      return;
   }
   // set current notification time
   await db.set(dbLastNotificationLabel, currentTime);
   let message = constructNotification(config.carmenRambles.subscribersRoleID);
   channelToSend.send(message);
   logger.info(
      `Sent notification to ${config.carmenRambles.subscribersRoleID}`
   );
}
/**
 * construct a notification message alerting the users about carmen's ramblings
 * @param roleID - role id of the role to notify
 * @returns message to send to the users
 */
function constructNotification(roleID: string): string {
   let message = `<@&${roleID}> carmen is Rambling now!!!`;
   return message;
}
