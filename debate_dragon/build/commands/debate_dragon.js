"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { ApplicationCommandType } from "discord-api-types";
const builders_1 = require("@discordjs/builders");
const logger_1 = __importDefault(require("../logger"));
const utils_1 = require("../utils");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("dd")
        .setDescription("Summons a dragon to burn your debate fows to the ground")
        .addStringOption((option) => option.setName("message").setDescription("A string").setRequired(true)),
    execute: async function (interaction) {
        await interaction.deferReply();
        let userMessage = interaction.options.get("message")?.value;
        logger_1.default.debug("User message length: " + userMessage.length); // __AUTO_GENERATED_PRINT_VAR__
        if (userMessage.length > 30) {
            logger_1.default.debug("userMessage too long, cutting short");
            userMessage = userMessage.substring(0, 30);
        }
        logger_1.default.info("Replied with dragon picture and user message: " + userMessage);
        await (0, utils_1.textOverlay)(userMessage);
        await interaction.editReply({
            files: ["media/img/done.png"],
        });
        logger_1.default.info("Replied with dragon picture and user message: " + userMessage);
    },
    help: {
        name: "dd",
        description: "Summons a dragon to burn your debate fows to the ground",
        usage: "/dd message: <message>",
    },
};
