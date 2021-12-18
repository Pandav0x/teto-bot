export default class TickHandler {
    handle(currentTime: Date){
        console.log(`${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`);
    }
}