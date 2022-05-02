"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ApplicationCommandType } from "discord-api-types";
const builders_1 = require("@discordjs/builders");
const utils_1 = require("../utils");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("dd")
        .setDescription("Summons a dragon to burn your debate fows to the ground")
        .addStringOption((option) => option.setName("message").setDescription("A string").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        let userMessage = interaction.options.get("message");
        console.log("execute userMessage: %s", userMessage?.value); // __AUTO_GENERATED_PRINT_VAR__
        await (0, utils_1.textOverlay)(userMessage.value?.toString());
        await interaction.editReply({
            files: ["media/img/done.png"],
        });
    },
};
