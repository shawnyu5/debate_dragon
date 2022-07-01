"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../logger"));
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName("insult")
        .setDescription("Ping someone and insult them")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("The person you tag may be butthurt. Use at your own risk")
        .setRequired(true)),
    execute: async function (interaction) {
        await interaction.deferReply();
        let author = interaction.options.getUser("user")?.id;
        // if I am being insulted, don't
        if (author == "652511543845453855") {
            logger_1.default.info("I am being insulted, this will not fly");
            // get the user that ran the command and insult them instead
            author = String(interaction.user.id);
        }
        let insult;
        try {
            insult = await getInsult();
        }
        catch (e) {
            insult = "fuck you";
        }
        await interaction.editReply(`<@${author}> ${insult}`);
    },
    help: {
        name: "insult",
        description: "Ping someone and insult them",
        usage: "/insult user: <user>",
    },
};
/**
 * get a insult from insult.mattbas.org/api/
 * @return {Promise} An insult in plain text
 */
async function getInsult() {
    try {
        // get insult back in plain text
        logger_1.default.debug("getting insult from mattbas");
        // throw new Error();
        let response = await axios_1.default.get("https://insult.mattbas.org/api/insult", {
            timeout: 5000,
        });
        return Promise.resolve(response.data);
    }
    catch (error) {
        return Promise.resolve("fuck you");
    }
}
