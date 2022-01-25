#!/usr/bin/env python3
#purpose of this file:
#Date: 2021-09-30
#---------------------------------
import discord #type: ignore
import os
from dotenv import load_dotenv

client = discord.Client()

@client.event
async def on_ready():
    print("{0.user} logged in".format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith("$hateBaffle") or "sam" in message.content.lower():
        await message.channel.send("ugh baffle\nboooo\nBut you should by it anyways\nhttps://www.penguinmagic.com/p/16196")

load_dotenv()
client.run(os.getenv('token'))

