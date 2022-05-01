"use strict";
const Jimp = require("jimp");
async function textOverlay(text) {
    // Reading image
    const image = await Jimp.read("media/img/dragon_drawing.png");
    // Defining the text font
    let font = "";
    try {
        if (text.length <= 13) {
            // use bigger font
            font = await Jimp.loadFont("media/font/source_sans/75px.ttf.fnt");
        }
        // use a smaller font
        else {
            font = await Jimp.loadFont("media/font/source_sans/60px.ttf.fnt");
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
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, 300, // max width
    200 // max height
    );
    // Writing image after processing
    await image.writeAsync("media/img/done.png");
}
function removeCommand(command, message) {
    return message.replace(command, "");
}
module.exports = {
    removeCommand: removeCommand,
    textOverlay: textOverlay,
};
