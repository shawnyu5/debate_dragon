"use strict";
const Jimp = require("jimp");
async function textOverlay(text) {
    // Reading image
    const image = await Jimp.read("media/img/dragon_drawing.png");
    // Defining the text font
    let font = "";
    try {
        font = await Jimp.loadFont("media/font/yacimient/converted/ssLtj6g5PblzARBxCQyvwIxs.ttf.fnt");
    }
    catch (error) {
        console.log(error);
    }
    image.print(font, //font
    70, // x
    512, // y
    {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
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
