import { GuildMember } from "discord.js";

export default class MessageHelper {
    getMentionFromMember(member: GuildMember): string{
        return `<@!${member.user.id}>`;
    }

    getMemberIdFromMention(mention: string): string {        
        return mention.slice(3, -1);
    }
}