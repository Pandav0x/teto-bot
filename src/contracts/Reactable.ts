import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";

export default interface Reactable {
    reacted(reactionOrigin: MessageReaction | PartialMessageReaction, user: User | PartialUser): void;
}