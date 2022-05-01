"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const command_1 = require("../../command");
module.exports = class Hello extends command_1.Command {
    constructor(client) {
        super(client, {
            name: "hello",
            description: "Says hello to the user",
            slashCommand: new builders_1.SlashCommandBuilder(),
        });
    }
    async execute(interaction) {
        console.log("response");
        interaction.reply("hi");
    }
};
// module.exports = {
// data: new SlashCommandBuilder()
// .setName("hello")
// .setDescription("says hello"),
// async execute(interaction: CommandInteraction, args: any) {
// interaction.reply("hi");
// },
// };
