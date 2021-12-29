export default class TickHandler {
    handle(currentTime: Date){
        //console.log(`${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`);

        if(currentTime.getSeconds() == 0){
            console.log('Fire event');
        }

        if(currentTime.getSeconds() == 20){
            console.log('clean fired events');
        }

        if(currentTime.getSeconds() == 40){
            console.log('load new events');
        }
    }
}