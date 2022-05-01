"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebateDragon = void 0;
const builders_1 = require("@discordjs/builders");
const command_1 = require("../command");
const { textOverlay } = require("../utils");
class DebateDragon extends command_1.Command {
    constructor(client) {
        super(client, {
            name: "dd",
            description: "Summons a dragon to burn your debate fows to the ground",
            // @ts-ignore
            slashCommand: new builders_1.SlashCommandBuilder().addStringOption((option) => option
                .setName("message")
                .setDescription("A string")
                .setRequired(true)),
        });
        async function execute(interaction) {
            let userMessage = interaction.options._hoistedOptions[0].value;
            console.log("execute userMessage: %s", userMessage); // __AUTO_GENERATED_PRINT_VAR__
            await textOverlay(userMessage);
            await interaction.reply({
                // embeds: [message],
                files: ["media/img/done.png"],
            });
        }
    }
}
exports.DebateDragon = DebateDragon;
// data: new SlashCommandBuilder()
// .setName("dd")
// .setDescription("Summons a dragon to burn your debate fows to the ground")
// .addStringOption((option: any) =>
// option.setName("message").setDescription("A string").setRequired(true)
// ),
