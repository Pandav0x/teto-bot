export default class Reflection {
    constructor() {}

    async createInstanceFromClassPath(commandFile: string) {

        console.log(`${__dirname}/../commands/${commandFile}`);
        

        let command = await import(`${__dirname}/../commands/${commandFile}`);
            if(typeof command.default == 'undefined'){
                return null;
            }
    
        let constructorName = Object.keys(command)[0];
    
        let commandInstance: any = new command[constructorName]();
    
        console.log(commandInstance);

        return commandInstance;
    }

}