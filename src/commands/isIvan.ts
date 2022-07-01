import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import ICommand from "../types/command";
import axios from "axios";
import logger from "../logger";
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

   execute: async function (interaction: CommandInteraction) {
      await interaction.deferReply();
      let user = interaction.options.get("user")?.value as string;
      let messages = await getUserMessages(
         interaction.guildId as string,
         user,
         interaction.client
      );

      let isIvanArr: Array<boolean> = [];

      for (let message of messages) {
         const isIvan = await isIvanMessage(message);
         isIvanArr.push(isIvan);
         logger.info(`Ivan array: ${isIvanArr}`); // __AUTO_GENERATED_PRINT_VAR__
      }

      let { truePercentage, falsePercentage } = calculateAverage(isIvanArr);
      // let user = interaction.options.get("user")?.value as string;
      let response = new MessageEmbed().setTitle(
         `<@${interaction.options.getUser("user")?.username}>`
      ).setDescription(`
         Is Ivan  percentage: **${truePercentage * 100}%**
         Is Not Ivan percentage: **${falsePercentage * 100}%** `);
      await interaction.editReply({ embeds: [response] });
   },

   help: {
      name: "isivan",
      description: "Checks if a user or a message is Ivan",
      usage: "/isivan user: @user | message: message",
   },
} as ICommand;

/**
 * Gets the messages of a user in a guild
 * @param guildID - The guild ID of the guild the user is in
 * @param userID - The user ID of the user you want to get messages from
 * @param client - The client
 * @returns a promise that resolves to an array of the messages of the user
 */
async function getUserMessages(
   guildID: string,
   userID: string,
   client: Client
): Promise<any> {
   return new Promise((resolve, reject) => {
      let messageArr: Array<string> = [];
      client.guilds.cache.get(guildID)?.channels.cache.forEach((ch) => {
         if (ch.type === "GUILD_TEXT") {
            ch.messages
               .fetch({
                  limit: 100,
               })
               .then((messages) => {
                  const msgs = messages.filter((m) => m.author.id === userID);
                  msgs.forEach((m) => {
                     messageArr.push(m.content);
                  });
                  resolve(messageArr);
               });
         } else {
            return;
         }
      });
   });
}

/**
 * Checks if a message is sent by ivan.
 * @param message - The message to check if it is sent by Ivan
 * @returns Whether or not the message is sent by Ivan or not
 */
async function isIvanMessage(message: string): Promise<boolean> {
   try {
      let res = await axios.post("http://localhost:8080/", {
         message,
      });
      if (res.data.indexOf("True") > -1) {
         return Promise.resolve(true);
      } else {
         return Promise.resolve(false);
      }
   } catch (e) {
      logger.error(e);
      return Promise.resolve(false);
   }
}

/**
 * Calculate the average times true and false are in the array
 * @param arr - An array of booleans
 */
function calculateAverage(arr: Array<boolean>): {
   truePercentage: number;
   falsePercentage: number;
} {
   let falseCount = 0;
   let trueCount = 0;
   arr.forEach((bool: boolean) => {
      if (bool) {
         trueCount++;
      } else if (!bool) {
         falseCount++;
      }
   });

   return {
      truePercentage: trueCount / arr.length,
      falsePercentage: falseCount / arr.length,
   };
}
