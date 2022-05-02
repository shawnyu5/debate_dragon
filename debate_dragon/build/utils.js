"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommandPrefix = exports.textOverlay = void 0;
const jimp_1 = __importDefault(require("jimp"));
async function textOverlay(text) {
    console.log("textOverlay text: %s", text); // __AUTO_GENERATED_PRINT_VAR__
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
 * removes the prefix from a command
 * @param command - The command prefix
 * @param message - the command string
 * @returns - the command string without the prefix
 */
function removeCommandPrefix(command, message) {
    return message.replace(command, "");
}
exports.removeCommandPrefix = removeCommandPrefix;
