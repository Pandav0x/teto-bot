'use strict';

import { schedule, validate } from "node-cron";
import TickHandler from "./alert/TickHandler";

let nextMinute = ((new Date()).getMinutes()+1 % 60);

let expression: string = `*/20 ${nextMinute}/0 * * * *`;

let tickHandler: TickHandler = new TickHandler();

if(!validate(expression)){
    expression = '*/20 */0 * * * *';
}

let task = schedule(expression, () => {
        tickHandler.handle(new Date());
    }, {
        scheduled: true,
        timezone: "Europe/Paris"
    }
);
