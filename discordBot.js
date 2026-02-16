import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
dotenv.config();

async function sendMessage(channelId, content) {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.post(
      Routes.channelMessages(channelId),
      { body: { content } }
    );

    console.log("Message sent.");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

module.exports = sendMessage;
