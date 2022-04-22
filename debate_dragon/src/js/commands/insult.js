"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const axios_1 = __importDefault(require("axios"));
/**
 * gets an insult from the API
 * @returns {Promise<string>} Returns the insult from the API
 */
async function getInsult() {
    // get insult back in plain text
    let response = await axios_1.default.get("https://evilinsult.com/generate_insult.php?lang=en");
    let insult = response.data;
    // check if response contains invalid words
    if (insult.includes("&quot;")) {
        await getInsult();
    }
    return insult;
}
/**
 * get the user that is being insulted
 * @param interaction - the interaction object
 * @returns the id of the user tagged in the message
 */
function getInsultedUser(interaction) {
    return String(interaction).split(":")[1];
}
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("insult")
        .setDescription("Ping someone and insult them")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("The person you tag may be butthurt. Use at your own risk")
        .setRequired(true)),
    async execute(interaction) {
        let author = getInsultedUser(interaction);
        // if I am being insulted, don't
        if (author == "652511543845453855") {
            console.log("I am being insulted, this will not fly");
            // get the user that ran the command and insult them instead
            author = String(interaction.user.id);
        }
        // let userMessage = interaction.options._hoistedOptions[0].value;
        let insult = await getInsult();
        await interaction.reply(`<@${author}> ${insult}`);
    },
};
