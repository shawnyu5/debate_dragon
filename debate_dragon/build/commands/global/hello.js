"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("hello")
        .setDescription("says hello"),
    async execute(interaction, args) {
        interaction.reply("hi");
    },
};
