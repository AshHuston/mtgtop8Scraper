import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
dotenv.config();

export async function sendMessage(content, channelId = process.env.CHANNEL_ID) {
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

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
