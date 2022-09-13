import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import { msToMins } from "../utils";
import logger from "../logger";
import ICommand from "../types/command";
import config from "../../config.json";
import Realm from "realm";

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
         logger.info(`User ${interaction.user.username} subscribed to carmen`);
      } else {
         // remove carmen subscriber role from user that executed the command
         // @ts-ignore
         await interaction.member?.roles.remove(carmenRole);
         await interaction.editReply(
            "You have been unsubscribed to CarmenRambles. Sorry to see you go..."
         );
         logger.info(
            `User ${interaction.user.username} unsubscribed to carmen`
         );
      }
   },

   help: {
      name: "subforcarmen",
      description: "subscribes to carmen's ramblings for free!",
      usage: "/subforcarmen subscription: True | False",
   },
} as ICommand;

// time stamp the previous notification was sent
// previousNotificationTimeStamp: "string",
// // time stamp the previous carmen message was sent
// previousMessageTimeStamp: "string",
// // message counter
// counter: "int",
export enum dbLabel {
   // name of the database
   dbName = "Carmen subs",
   previousMessageCreationTime = "previousNotificationTimeStamp",
   previousNotificationTimeStamp = "previousNotificationTimeStamp",
   counter = "counter",
}

/**
 * Interface for the data in realm db
 */
export interface IRealm {
   // time stamp the previous notification was sent
   previousNotificationTimeStamp: string;
   // time stamp the previous carmen message was sent
   previousMessageTimeStamp: string;
   // message counter
   counter: number;
}

/**
 * if 30 mins has passed since the last carmen message, reset the last notification time to now
 * @param message - message object
 */
export async function resetCounter(message: Message) {
   const realm = await getRealm();

   const db: Realm.Results<IRealm> = realm.objects(dbLabel.dbName);

   // if there are currently nothing in db, create with default values
   if (db.length === 0) {
      realm.write(() => {
         realm.create(dbLabel.dbName, {
            previousNotificationTimeStamp: new Date().toString(),
            previousMessageTimeStamp: new Date().toString(),
            counter: 0,
         });
      });
   }
   const lastMessageTime: Date | null = new Date(
      db[0].previousMessageTimeStamp
   );
   const currentMessageTime = message.createdAt;

   // time difference between current message and the last message sent
   let timeDifference =
      currentMessageTime.getTime() - lastMessageTime.getTime();

   timeDifference = msToMins(timeDifference);
   // if more than 30 mins has passed from the last message, reset message time stamp and counter
   if (timeDifference > 30) {
      resetDBFields();
      logger.info(
         `Reset caramel counter. More than 30 mins has passed since last message`
      );
   }
}
/**
 * Send notifications to the users in config.json about carmen's ramblings
 * @param messageObj - message object
 */
export async function sendNotification(messageObj: Message) {
   const realm = await getRealm();

   const db: Realm.Results<IRealm> = realm.objects(dbLabel.dbName);

   const currentTime = new Date();

   // get the last notification time from db
   const lastNotificationTime: Date | null = new Date(
      db[0].previousNotificationTimeStamp as string
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
      realm.write(() => {
         db[0].previousNotificationTimeStamp = currentTime.toString();
      });
      logger.info(
         `Less than 60 mins has passed since last notification, doing nothing. Time passed: ${timeDifference} minutes`
      );
      logger.info(
         `Updated last notification time with current time: ${currentTime}`
      );
      return;
   }
   // set current notification time
   realm.write(() => {
      db[0].previousNotificationTimeStamp = currentTime.toString();
   });
   let message = constructNotification();
   messageObj.channel.send(message);
   logger.info(
      `Sent notification to ${config.carmenRambles.subscribersRoleID}`
   );
}
/**
 * construct a notification message telling Caramel to stfu
 * @returns message to send to the users
 */
function constructNotification(): string {
   let message = `<@${config.carmenRambles.carmenId}> stfu, #CancelCaramel. <@&${config.carmenRambles.subscribersRoleID}>`;
   return message;
}

/**
 * Get the realm instance containing caramel ramble information
 * @returns A realm instance containing Caramel rambles information
 */
export async function getRealm(): Promise<Realm> {
   const schema = {
      name: "Carmen subs",
      properties: {
         // time stamp the previous notification was sent
         previousNotificationTimeStamp: "string",
         // time stamp the previous carmen message was sent
         previousMessageTimeStamp: "string",
         // message counter
         counter: "int",
      },
   };

   const realm = await Realm.open({
      schema: [schema],
   });

   return realm;
}

/**
 * Reset fields in data base. `counter` to 0, `notificationTimeStamp` to current time
 */
export async function resetDBFields() {
   const realm = await getRealm();
   const db: Realm.Results<IRealm> = realm.objects(dbLabel.dbName);
   realm.write(() => {
      db[0].counter = 0;
      db[0].previousNotificationTimeStamp = new Date().toString();
      db[0].previousMessageTimeStamp = new Date().toString();
   });
}
