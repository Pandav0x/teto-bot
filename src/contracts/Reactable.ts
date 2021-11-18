import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";

export default interface Reactable {
    reactionAdd(reactionOrigin: MessageReaction | PartialMessageReaction, user: User | PartialUser): void;
    reactionRemove(reactionOrigin: MessageReaction | PartialMessageReaction, user: User | PartialUser): void;
}