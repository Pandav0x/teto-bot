import TetoBot from "../TetoBot";

export default class BaseCommand {
    
    client: TetoBot;
    
    constructor(client: TetoBot){
        this.client = client;
    }
}