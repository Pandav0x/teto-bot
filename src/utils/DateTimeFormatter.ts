import { TimeZone } from "./TimeZone";

export default class DateTimeFormatter {
    timeTo24Hours(time: String|undefined): string {
        //TODO - fit to the tests

        if(typeof time == 'undefined'){
            return new Date().toString();
        }

        if(time.match(/(a|p)m/) === null){
            return <string>time;
        }
                
        let abbreviation: string = time.slice(-2).toLowerCase();
        
        let hour: number = 0;
        let minutes: string = '00';

        if(time.match(/:/) !== null){
            let [timeHours, minutes] = time.split(':');
            hour = Number(timeHours.slice(0, -2));
        } else {
            hour = Number(time.slice(0, -2));
        }        

        if(abbreviation === 'pm'){
            hour += 12;
        }

        hour %= 24;

        return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    timeTo12Hours(time: number): String {
        //TODO - handle minutes
        return `${time%12}${(time < 12)? 'am' : 'pm'}`;
    }

    getHoursMinutes(date: Date): string {
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('en-uk', {
            day: '2-digit',
            weekday: 'short',
            month: 'short',
            year: 'numeric'
        })
    }

    parseDate(date: string|undefined, time: string|undefined, timeZone: string|undefined): Date {

        if(typeof date == 'undefined' && typeof time == 'undefined'){
            return new Date();
        }

        if(typeof timeZone == 'undefined' || timeZone.toUpperCase() === 'ST'){
            timeZone = 'GMT';
        }

        timeZone = timeZone.toUpperCase();

        let timeZoneOffset = '+0:00';

        if(TimeZone.hasOwnProperty(timeZone)) {
            timeZoneOffset = TimeZone[timeZone as keyof typeof TimeZone];
        }
        
        let d = new Date(Date.parse(<string>date));

        let e = new Date(`${d.getUTCFullYear()}-${d.getMonth()}-${d.getUTCDate()} ${this.timeTo24Hours(time)}:00:00.000 GMT${timeZoneOffset}`);
        
        return e;
    }

    formatTime(date: Date): string {
        return `${date.getUTCDay()} ${date.getDay()} ${date.getFullYear()}`;
    }
}