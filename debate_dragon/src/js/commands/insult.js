"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios_1 = __importDefault(require("axios"));
async function getInsult() {
    // get insult back in plain text
    let response = await axios_1.default.get("https://evilinsult.com/generate_insult.php?lang=en");
    let insult = response.data;
    return insult;
}
function getAuthor(interaction) {
    return interaction.split(":")[1];
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("insult")
        .setDescription("Ping someone and insult them")
        .addUserOption((option) => option.setName("user").setDescription("A string").setRequired(true)),
    async execute(interaction) {
        let author = getAuthor(String(interaction));
        // let userMessage = interaction.options._hoistedOptions[0].value;
        let insult = await getInsult();
        await interaction.reply(`<@${author}> ${insult}`);
    },
};
