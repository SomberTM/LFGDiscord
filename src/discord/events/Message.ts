import Discord from "discord.js";

export function onMessage(message: Discord.Message) {
    if (message.author.bot) return;
}