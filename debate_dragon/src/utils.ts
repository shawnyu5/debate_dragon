import { Interaction } from "discord.js";
import Jimp from "jimp";
import IArgs from "./types/args";

export async function textOverlay(text: string): Promise<any> {
   console.log("textOverlay text: %s", text); // __AUTO_GENERATED_PRINT_VAR__
   // Reading image
   const image = await Jimp.read("media/img/dragon_drawing.png");
   // Defining the text font
   let font: any = "";
   try {
      if (text.length <= 13) {
         // use bigger font
         font = await Jimp.loadFont("media/font/source_sans/75px.ttf.fnt");
      }
      // use a smaller font
      else {
         font = await Jimp.loadFont("media/font/source_sans/60px.ttf.fnt");
      }
   } catch (error) {
      console.log(error);
   }

   image.print(
      font, //font
      70, // x
      483, // y
      {
         text: text,
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
         alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      300, // max width
      200 // max height
   );

   // Writing image after processing
   await image.writeAsync("media/img/done.png");
}

/**
 * removes the prefix from a command
 * @param command - The command prefix
 * @param message - the command string
 * @returns - the command string without the prefix
 */
export function removeCommandPrefix(command: string, message: string): string {
   return message.replace(command, "");
}
