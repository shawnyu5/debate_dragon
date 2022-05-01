"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    // discord client instance
    client;
    slashCommand;
    constructor(client, options) {
        this.client = client;
        this.slashCommand = options.slashCommand;
        this.slashCommand.setName(options.name);
        this.slashCommand.setDescription(options.description);
    }
}
exports.Command = Command;
