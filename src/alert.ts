'use strict';

import { schedule, validate } from "node-cron";

let nextMinute = ((new Date()).getMinutes()+1 % 60);

let expression: string = `*/20 ${nextMinute} * * * *`;

if(!validate(expression)){
    expression = '*/20 * * * * *';
}

let task = schedule(expression, () => {
        console.log('1 second');
    }, {
        scheduled: true,
        timezone: "Europe/Paris"
    }
);
