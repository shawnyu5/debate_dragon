"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../logger"));
const utils_1 = require("../utils");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("help command")
        .addStringOption((option) => option
        .setName("command")
        .setDescription("name of command to get help page of")
        .setRequired(true)),
    execute: async function (interaction) {
        let userInput = interaction.options.get("command")?.value;
        let helpDocs = (0, utils_1.readAllHelpDocs)();
        // go through all help docs and find the one the user is looking for
        for (let i = 0; i < helpDocs.length; i++) {
            let doc = helpDocs[i];
            if (doc && doc.name == userInput) {
                let reply = new discord_js_1.MessageEmbed().setColor("RANDOM").setTitle("Help")
                    .setDescription(`
   Command name: ${doc.name}
   Description: ${doc.description}
   Usage: \`${doc.usage}\`
   `);
                interaction.reply({ embeds: [reply] });
                logger_1.default.info(`${userInput} help requested`);
                return;
            }
        }
        interaction.reply(`Command \`${userInput}\`  not found`);
        logger_1.default.info("Help command called with a invalid command");
    },
    help: {
        name: "help",
        description: "help command",
        usage: "/help command: <command>",
    },
};
