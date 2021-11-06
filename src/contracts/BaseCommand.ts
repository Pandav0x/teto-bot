import TetoBot from "../TetoBot";

export default class BaseCommand {
    
    client: TetoBot;
    
    isRecordable: boolean = false;

    constructor(client: TetoBot){
        this.client = client;
    }
}