import { Client } from "discord.js";
import Command from "./Command";

export default class BaseCommand {
    
    client: Client;
    
    constructor(client: Client){
        this.client = client;
    }
}