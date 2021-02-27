'use strict';

module.exports = {
    getName: () => {
        return 'partyfinder';
    },
    getAliases: () => {
        return ['pf', 'raid'];
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}partyfinder <xman> [player_comp] [date] [time] [timezone] <description>`;
    },
    execute: (msg, args) => {

        let args_values = [
            {'name': 'xman', 'regex': /\d+man/, 'value': null},
            {'name': 'player_comp', 'regex': /^(\d{1,2},){2}\d{1,2}$/, 'value': null},
            {'name': 'date', 'regex': /^(([0-9]{1,2}(jan|fev|mar|avr|may|jun|jul|aug|sept|oct|dec))|([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}))$/i, 'value': null},
            {'name': 'time', 'regex': /^[0-9]{1,2}(:[0-9]{2}|)(a|p)m$/, 'value': null},
            {'name': 'timezone', 'regex': /(st|gmt)/i, 'value': null}
        ];

        let unprocessed_args = [...args];

        console.log(unprocessed_args, args);

        args.forEach((arg) => {
            for(let i = 0; i < args_values.length; i++){
                if(args_values[i].regex.test(arg.toString())){
                    args_values[i].value = arg;
                    unprocessed_args.splice(unprocessed_args.indexOf(arg), 1);
                }
            }
        });

        //console.log(unprocessed_args);

        args_values.push({'name': 'description', 'value': unprocessed_args.join(' ')});

        console.log(args_values);

        msg.channel.send('pong !');
    }
};