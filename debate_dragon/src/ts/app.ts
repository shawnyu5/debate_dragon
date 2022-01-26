const fs = require("fs");
const { Channel, Message, Client, Intents } = require("discord.js");
const utils = require("./utils");
require("dotenv").config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`${client.user.tag} logged in`);
});

// command: $dd
client.on("messageCreate", async (message: typeof Message) => {
  let command = "$c";
  let content = message.content;
  //
  // make sure the bot didn't send the message. And the message starts with command
  if (message.author.bot || !content.startsWith(command)) return;

  // console.log(content);
  content = utils.removeCommand(command, content);

  await utils.textOverlay(content);

  await message.channel
    .send({
      files: [
        {
          attachment: "media/img/done.png",
          name: "dragon.png",
          description: "Debate dragon",
        },
      ],
    })
    .then(() => {
      console.log("Image sent");
      fs.unlink("media/img/done.png", (error: any) => {
         console.log(error);
      });
    })
    .catch((error: any) => {
      console.log(`Image failed to send: ${error}`);
    });
});

client.login(process.env.token);
