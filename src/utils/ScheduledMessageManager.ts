import ScheduledMessage from "../entities/ScheduledMessage";

export default class ScheduledMessageManager {
    constructor(){

    }

    save(): void {

    }

    load(until: Date | null = null): ScheduledMessage[] {

        if(until == null){
            until = new Date();   
            until.setMinutes(until.getMinutes() + 5);
        }

        return [new ScheduledMessage()];
    }

}