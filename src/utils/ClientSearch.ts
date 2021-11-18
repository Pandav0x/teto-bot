import { Guild, GuildMember, User } from "discord.js";
import { client } from "../teto";

export default class ClientSearch {
    getUserById(id: string): User|null {
        let user: User|undefined = client.users.cache.find(user => user.id == id);

        if(typeof user == 'undefined'){
            return null;
        }

        return user;
    }

    getGuildMemberFromUser(guild: Guild|null, user: User): GuildMember|null {
        if(guild == null){
            return null;
        }

        let member: GuildMember|undefined = guild.members.cache.find(m => m.user == user);

        if(typeof member == 'undefined'){
            return null;
        }

        return member;
    }
}