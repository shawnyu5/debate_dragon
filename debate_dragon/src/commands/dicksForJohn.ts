import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message, Util } from "discord.js";
import ICommand from "../types/command";
import config from "../../config.json";
import { getChannelById } from "../utils";
import logger from "../logger";

export default {
   data: new SlashCommandBuilder()
      .setName("dicksforjohn")
      .setDescription("Sends a message to the channel about dicks for john")
      .addBooleanOption((option) => {
         return option
            .setName("notification")
            .setDescription("toggle notification")
            .setRequired(true);
      }),
   execute: async function (interaction: CommandInteraction) {
      // interaction.reply("DICKCHEESE");

      const roles = await interaction.guild?.roles.fetch(
         config.subForJohn.subscribersRoleID
      );
      const userInput = interaction.options.get("notification")
         ?.value as boolean;

      // give user subcriber role
      if (userInput) {
         // @ts-ignore
         await interaction.member?.roles.add(roles);
         await interaction.reply(
            "Congrats, you have been subscribed to dicks for john!"
         );
         logger.info(
            `User ${interaction.user.username} subscribed to dicks for john`
         );
      } else {
         // @ts-ignore
         await interaction.member?.roles.remove(roles);
         await interaction.reply(
            "you have been unsubscribed to dicks for john. Sorry to see you go..."
         );
         logger.info(
            `User ${interaction.user.username} unsubscribed to dicks for john`
         );
      }
   },
   help: {
      name: "dicksforjohn",
      description: "Get notified when John talks about dicks",
      usage: "/dicksforjohn ",
   },
} as ICommand;

/**
 * check if the message contains the words in the config that trigger a notification
 * @param message - the message to check
 * @returns true if the message contains the words in the config
 */
export function containsWords(message: Message): boolean {
   let found = false;
   config.subForJohn.words.forEach((word) => {
      if (message.content.includes(word)) {
         found = true;
      }
   });
   return found;
}

/**
 * send a notification to subscribers of john
 * @param client - the discord client
 */
export function sendNotification(client: Client) {
   const channelID = config.subForJohn.notificationChannelId;
   const channelToSend = getChannelById(client, channelID);
   channelToSend.send(constructNotification());
   logger.info(`notification send`);
}

/**
 * Construct a notification pinging all subscribers of john
 * @returns A notification message
 */
function constructNotification(): string {
   return `Ayo <@&${config.subForJohn.subscribersRoleID}>, John's talking about dicks again!!`;
}
