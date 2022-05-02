"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ApplicationCommandType } from "discord-api-types";
const builders_1 = require("@discordjs/builders");
const { textOverlay } = require("../utils");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("dd")
        .setDescription("Summons a dragon to burn your debate fows to the ground")
        .addStringOption((option) => option.setName("message").setDescription("A string").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        let userMessage = interaction.options._hoistedOptions[0].value;
        console.log("execute userMessage: %s", userMessage); // __AUTO_GENERATED_PRINT_VAR__
        await textOverlay(userMessage);
        await interaction.editReply({
            files: ["media/img/done.png"],
        });
    },
};
