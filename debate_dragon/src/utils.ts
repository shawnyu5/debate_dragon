import Jimp from "jimp";
import fs from "fs";
import path from "path";
import { Client, TextChannel } from "discord.js";

export async function textOverlay(text: string): Promise<any> {
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
 * write a key value pair to config.json
 * @param newConfig - the config object to write to file
 */
export function writeToConfig(newConfig: any): void {
   fs.writeFileSync(
      path.resolve(__dirname + "/../config.json"),
      JSON.stringify(newConfig, null, 2)
   );
}

/**
 * Search for a channel by name
 * @param client - discord client
 * @param channelName - name of channel to search for
 * @returns channel object
 */
export function getChannelByName(
   client: Client,
   channelName: string
): TextChannel | undefined {
   const channel = client.channels.cache.find((ch) => {
      // @ts-ignore
      return ch.name == channelName;
   });
   return channel as TextChannel;
}

/**
 * search for a channel by id
 * @param client - discord client
 * @param channelId - id of channel to search for
 * @returns channel object
 */
export function getChannelById(client: Client, channelId: string): TextChannel {
   return client.channels.cache.get(channelId) as TextChannel;
}
