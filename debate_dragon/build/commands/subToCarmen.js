"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.resetCounter = void 0;
const builders_1 = require("@discordjs/builders");
const utils_1 = require("../utils");
const quick_db_1 = require("quick.db");
const logger_1 = __importDefault(require("../logger"));
const db = new quick_db_1.QuickDB();
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("subforcarmen")
        .setDescription("Subscribes to Carmen's ramblings for free!")
        .addBooleanOption((option) => {
        return option
            .setName("subscription")
            .setDescription("subscription to CaramelCorn rambles")
            .setRequired(true);
    }),
    execute: async function (interaction) {
        await interaction.deferReply();
        const config = require("../../config.json");
        const carmenRole = config.carmenRambles.subscribersRoleID;
        let subscriptionToggle = interaction.options.get("subscription")
            ?.value;
        if (subscriptionToggle) {
            // give carmen subscriber role to user that executed the command
            // @ts-ignore
            await interaction.member?.roles.add(carmenRole);
            await interaction.editReply("Congrats, you have been subscribed to CarmenRambles!");
            logger_1.default.info(`User ${interaction.user.username} subscribed to carmen`);
        }
        else {
            // remove carmen subscriber role from user that executed the command
            // @ts-ignore
            await interaction.member?.roles.remove(carmenRole);
            await interaction.editReply("You have been unsubscribed to CarmenRambles. Sorry to see you go...");
            logger_1.default.info(`User ${interaction.user.username} unsubscribed to carmen`);
        }
    },
    help: {
        name: "subforcarmen",
        description: "subscribes to carmen's ramblings for free!",
        usage: "/subforcarmen subscription: True | False",
    },
};
/**
 * if 30 mins has passed since the last carmen message, reset the last notification time to now
 * @param message - message object
 */
async function resetCounter(message) {
    const dbMessageCreationTime = "carmenMessageTimeStamp";
    const dbCounterLabel = "carmenCounter";
    const lastMessageTime = new Date((await db.get(dbMessageCreationTime)));
    const currentMessageTime = message.createdAt;
    let timeDifference = currentMessageTime.getTime() - lastMessageTime.getTime();
    timeDifference = (0, utils_1.msToMins)(timeDifference);
    if (timeDifference > 30) {
        await db.set(dbMessageCreationTime, currentMessageTime);
        await db.set(dbCounterLabel, 0);
        logger_1.default.info(`Reset carmen counter. More than 30 mins has passed since last message`);
    }
}
exports.resetCounter = resetCounter;
/**
 * Send notifications to the users in config.json about carmen's ramblings
 * @param client - discord client to send the message too
 */
async function sendNotification(client) {
    const config = require("../../config.json");
    const dbLastNotificationLabel = "carmen last notification time";
    // const notificationUsers = config.carmenRambles.subscribers;
    const currentTime = new Date();
    const channelToSend = (0, utils_1.getChannelById)(client, config.carmenRambles.channelId);
    logger_1.default.debug(`channel to send name: ${channelToSend?.name}`);
    // if not channel found, then its a config error most likely
    if (!channelToSend) {
        logger_1.default.error("Please specify the channel to send notifications in config.json");
        return;
    }
    // get the last notification time from db
    const lastNotificationTime = new Date((await db.get(dbLastNotificationLabel)));
    logger_1.default.debug(`last notification time: ${lastNotificationTime}`);
    let timeDifference = currentTime.getTime() - lastNotificationTime.getTime();
    timeDifference = (0, utils_1.msToMins)(timeDifference);
    logger_1.default.debug(`time difference in mins: ${timeDifference}`);
    // if less than 1 hour has passed since the last notification, do nothing
    // only check this in production
    if (timeDifference < config.carmenRambles.coolDown &&
        config.development == false) {
        // this means carmen is still rambling, so don't keep notifying user of this
        await db.set(dbLastNotificationLabel, currentTime);
        logger_1.default.info(`Less than 60 mins has passed since last notification, doing nothing. Time passed: ${timeDifference} minutes`);
        logger_1.default.info(`Updated last notification time with current time: ${currentTime}`);
        return;
    }
    // set current notification time
    await db.set(dbLastNotificationLabel, currentTime);
    let message = constructNotification(config.carmenRambles.subscribersRoleID);
    channelToSend.send(message);
    logger_1.default.info(`Sent notification to ${config.carmenRambles.subscribersRoleID}`);
}
exports.sendNotification = sendNotification;
/**
 * construct a notification message alerting the users about carmen's ramblings
 * @param roleID - role id of the role to notify
 * @returns message to send to the users
 */
function constructNotification(roleID) {
    let message = `<@&${roleID}> carmen is Rambling now!!!`;
    return message;
}
