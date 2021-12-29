'use strict';

import { schedule, validate } from "node-cron";
import TickHandler from "./alert/TickHandler";

console.log('Starting cron job');

let nextMinute = ((new Date()).getMinutes()+1 % 60);

let expression: string = `0-59/20 * * * * *`;

let tickHandler: TickHandler = new TickHandler();

let scheduleOptions: Object = {
    scheduled: true,
    timezone: "Europe/Paris"
};

if(!validate(expression)){
    process.exit(1);
}

let task = schedule(expression, () => {
        tickHandler.handle(new Date());
}, scheduleOptions);
