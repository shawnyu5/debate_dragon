#!/usr/bin/env python3
#purpose of this file:
#Date: 2021-09-30
#---------------------------------
import discord #type: ignore
import os
from dotenv import load_dotenv
from PIL import Image, ImageFont, ImageDraw
import textwrap

client = discord.Client()

@client.event
async def on_ready():
    print("{0.user} logged in".format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith("$dd"):
        # message without $dd prefix
        message_content = message.content[3:]
        # print(message_content)

        string = textwrap.fill(message_content, width=10)

        # print(string)

        message_content = string
        my_image = Image.open("dragon_drawing.png")
        title_font = ImageFont.truetype("ComicNeue-BoldItalic.ttf", 90)
        image_editable = ImageDraw.Draw(my_image)
        image_editable.text((15, 496), message_content, (0, 0, 0), font=title_font)
        my_image.save("result.png")
        send_file = discord.File("result.png")
        await message.channel.send("change my mind", file=send_file)

load_dotenv()
client.run(os.getenv('token'))

