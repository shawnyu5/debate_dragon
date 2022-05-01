"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const axios_1 = __importDefault(require("axios"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("compliment")
        .setDescription("Ping someone and compliment them")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to compliment")
        .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        let author = getTaggedUser(interaction);
        let compliment = await getCompliment();
        await interaction.editReply(`<@${author}> ${compliment}`);
    },
};
/**
 * get the user that is being complimented
 * @param interaction - the interaction object
 * @returns the id of the user tagged in the message
 */
function getTaggedUser(interaction) {
    return String(interaction).split(":")[1];
}
/**
 * @returns a compliment in plain text
 */
async function getCompliment() {
    let compliment = await axios_1.default.get("https://complimentr.com/api");
    return compliment.data.compliment;
}
