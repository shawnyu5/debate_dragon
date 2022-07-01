"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msToMins = exports.readAllHelpDocs = exports.getChannelById = exports.getChannelByName = exports.writeToConfig = exports.textOverlay = void 0;
const jimp_1 = __importDefault(require("jimp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function textOverlay(text) {
    // Reading image
    const image = await jimp_1.default.read("media/img/dragon_drawing.png");
    // Defining the text font
    let font = "";
    try {
        if (text.length <= 13) {
            // use bigger font
            font = await jimp_1.default.loadFont("media/font/source_sans/75px.ttf.fnt");
        }
        // use a smaller font
        else {
            font = await jimp_1.default.loadFont("media/font/source_sans/60px.ttf.fnt");
        }
    }
    catch (error) {
        console.log(error);
    }
    image.print(font, //font
    70, // x
    483, // y
    {
        text: text,
        alignmentX: jimp_1.default.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp_1.default.VERTICAL_ALIGN_MIDDLE,
    }, 300, // max width
    200 // max height
    );
    // Writing image after processing
    await image.writeAsync("media/img/done.png");
}
exports.textOverlay = textOverlay;
/**
 * write a key value pair to config.json
 * @param newConfig - the config object to write to file
 */
function writeToConfig(newConfig) {
    fs_1.default.writeFileSync(path_1.default.resolve(__dirname + "/../config.json"), JSON.stringify(newConfig, null, 2));
}
exports.writeToConfig = writeToConfig;
/**
 * Search for a channel by name
 * @param client - discord client
 * @param channelName - name of channel to search for
 * @returns channel object
 */
function getChannelByName(client, channelName) {
    const channel = client.channels.cache.find((ch) => {
        // @ts-ignore
        return ch.name == channelName;
    });
    return channel;
}
exports.getChannelByName = getChannelByName;
/**
 * search for a channel by id
 * @param client - discord client
 * @param channelId - id of channel to search for
 * @returns channel object
 */
function getChannelById(client, channelId) {
    return client.channels.cache.get(channelId);
}
exports.getChannelById = getChannelById;
/**
 * read all help docs from command modules and store in array
 * @returns json array of help docs
 */
function readAllHelpDocs() {
    const helpDocs = [];
    const commandFiles = fs_1.default
        .readdirSync(__dirname + "/commands")
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`${__dirname}/commands/${file}`);
        helpDocs.push(command.default?.help);
    }
    return helpDocs;
}
exports.readAllHelpDocs = readAllHelpDocs;
/**
 * convert ms to mins
 * @param ms - number of milliseconds to convert
 * @returns minutes represenation of the ms
 */
function msToMins(ms) {
    return Math.floor(ms / 60000);
}
exports.msToMins = msToMins;
