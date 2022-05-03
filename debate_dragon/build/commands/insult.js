"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const axios_1 = __importDefault(require("axios"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("insult")
        .setDescription("Ping someone and insult them")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("The person you tag may be butthurt. Use at your own risk")
        .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        let author = interaction.options.getUser("user")?.id;
        // if I am being insulted, don't
        if (author == "652511543845453855") {
            console.log("I am being insulted, this will not fly");
            // get the user that ran the command and insult them instead
            author = String(interaction.user.id);
        }
        let insult = await getInsult();
        await interaction.editReply(`<@${author}> ${insult}`);
    },
};
/**
 * get a insult from insult.mattbas.org/api/
 * @return {Promise} An insult in plain text
 */
async function getInsult() {
    try {
        // get insult back in plain text
        console.log("getting api");
        try {
            let response = await axios_1.default.get("https://insult.mattbas.org/api/insult", { timeout: 5000 });
            console.log("done getting api");
            return Promise.resolve(response.data);
        }
        catch (e) {
            let response = await axios_1.default.get("https://evilinsult.com/generate_insult.php?lang=en&type=json", { timeout: 5000 });
            console.log("done getting api 2");
            console.log(JSON.stringify(response.data, null, 3));
            return Promise.resolve(response.data.insult);
        }
    }
    catch (error) {
        console.log("Promise rejected");
        console.log(error);
        return Promise.reject(error);
    }
}
