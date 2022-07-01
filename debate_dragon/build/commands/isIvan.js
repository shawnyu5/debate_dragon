"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../logger"));
exports.default = {
    data: new builders_1.SlashCommandBuilder()
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
            .setDescription("A message you would like to check if its sent by Ivan")
            .setRequired(false);
    }),
    execute: async function (interaction) {
        await interaction.deferReply();
        let user = interaction.options.get("user")?.value;
        let messages = await getUserMessages(interaction.guildId, user, interaction.client);
        let isIvanArr = [];
        for (let message of messages) {
            const isIvan = await isIvanMessage(message);
            isIvanArr.push(isIvan);
            logger_1.default.info(`Ivan array: ${isIvanArr}`); // __AUTO_GENERATED_PRINT_VAR__
        }
        let { truePercentage, falsePercentage } = calculateAverage(isIvanArr);
        // let user = interaction.options.get("user")?.value as string;
        let response = new discord_js_1.MessageEmbed().setTitle(`<@${interaction.options.getUser("user")?.username}>`).setDescription(`
         Is Ivan  percentage: **${truePercentage * 100}%**
         Is Not Ivan percentage: **${falsePercentage * 100}%** `);
        await interaction.editReply({ embeds: [response] });
    },
    help: {
        name: "isivan",
        description: "Checks if a user or a message is Ivan",
        usage: "/isivan user: @user | message: message",
    },
};
/**
 * Gets the messages of a user in a guild
 * @param guildID - The guild ID of the guild the user is in
 * @param userID - The user ID of the user you want to get messages from
 * @param client - The client
 * @returns a promise that resolves to an array of the messages of the user
 */
async function getUserMessages(guildID, userID, client) {
    return new Promise((resolve, reject) => {
        let messageArr = [];
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
            }
            else {
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
async function isIvanMessage(message) {
    try {
        let res = await axios_1.default.post("http://localhost:8080/", {
            message,
        });
        if (res.data.indexOf("True") > -1) {
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    }
    catch (e) {
        logger_1.default.error(e);
        return Promise.resolve(false);
    }
}
/**
 * Calculate the average times true and false are in the array
 * @param arr - An array of booleans
 */
function calculateAverage(arr) {
    let falseCount = 0;
    let trueCount = 0;
    arr.forEach((bool) => {
        if (bool) {
            trueCount++;
        }
        else if (!bool) {
            falseCount++;
        }
    });
    return {
        truePercentage: trueCount / arr.length,
        falsePercentage: falseCount / arr.length,
    };
}
