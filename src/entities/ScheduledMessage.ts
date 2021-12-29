import { reduceEachTrailingCommentRange } from "typescript";

export default class ScheduledMessage {

    creationDate: Date;
    scheduledDate: Date;
    message: string;
    serverId: number;
    channelId: number;

    constructor(){
        this.creationDate = new Date();
        this.scheduledDate = new Date();
        this.message = '';
        this.serverId = 0;
        this.channelId = 0;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    getScheduledTime(): Date {
        return this.scheduledDate;
    }

    getMessage(): string {
        return this.message;
    }

    getServerId(): number {
        return this.serverId;
    }

    getChannelId(): number {
        return this.channelId;
    }
}