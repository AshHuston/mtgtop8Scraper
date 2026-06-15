import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
dotenv.config();

const MAX_LENGTH = 1900;

function splitMessage(content, maxLength = MAX_LENGTH) {
    const chunks = [];

    // Split into sections starting with markdown headings
    const sections = content.split(/(?=^#{1,6}\s)/gm);

    let currentChunk = '';

    for (const section of sections) {
        // If this section fits in the current chunk, add it
        if (
            currentChunk.length > 0 &&
            currentChunk.length + section.length <= maxLength
        ) {
            currentChunk += section;
            continue;
        }

        // Flush current chunk
        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = '';
        }

        // Section fits by itself
        if (section.length <= maxLength) {
            currentChunk = section;
            continue;
        }

        // Section is too large, split by paragraphs
        const paragraphs = section.split(/\n\s*\n/);

        let paragraphChunk = '';

        for (const paragraph of paragraphs) {
            const candidate =
                paragraphChunk.length === 0
                    ? paragraph
                    : paragraphChunk + '\n\n' + paragraph;

            if (candidate.length <= maxLength) {
                paragraphChunk = candidate;
                continue;
            }

            if (paragraphChunk.length > 0) {
                chunks.push(paragraphChunk);
                paragraphChunk = '';
            }

            // Paragraph itself is too large
            if (paragraph.length <= maxLength) {
                paragraphChunk = paragraph;
                continue;
            }

            // Hard split giant paragraph
            for (let i = 0; i < paragraph.length; i += maxLength) {
                chunks.push(paragraph.slice(i, i + maxLength));
            }
        }

        if (paragraphChunk.length > 0) {
            currentChunk = paragraphChunk;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

export async function sendMessage(
    content,
    channelId = process.env.CHANNEL_ID
) {
    const rest = new REST({ version: '10' }).setToken(
        process.env.BOT_TOKEN
    );

    const chunks = splitMessage(content);

    try {
        for (const chunk of chunks) {
            await rest.post(
                Routes.channelMessages(channelId),
                {
                    body: {
                        content: chunk,
                    },
                }
            );
        }

        console.log(`Sent ${chunks.length} message(s).`);
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}
