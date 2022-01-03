export default class TickHandler {
    handle(currentTime: Date): void {

        if(currentTime.getSeconds() == 0){
            this.fireEvents();
        }

        if(currentTime.getSeconds() == 20){
            this.cleanEvents();
        }

        if(currentTime.getSeconds() == 40){
            this.loadEvents();
        }
    }

    fireEvents(): void {
        //read from cache server and talks to discord's API
        console.log("fire events");
    }

    cleanEvents(): void {
        //remove outdated elements from cache
        console.log("clean events");
    }

    loadEvents(): void {
        //reads elements from db and save them in cache
        console.log("load events");

        this.updateEvents();
    }

    updateEvents(): void {
        //update events already cached, if they have been updated (db != cache) inbetween
        console.log("update events");
    }
}