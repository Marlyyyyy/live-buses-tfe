/**
 * This Generic class is built to store results received from the server 
 * for a faster access for the client
 */
class EntityMap<T>{
    private key: string;
    private values: Array<T>;
    
    constructor(key: string, values: T[]){
        this.key = key.toLowerCase();
        this.values = values;
    }
    hasKey(key: string): boolean{
        return this.key == key.toLowerCase();
    }
    matchesKey(key: string): boolean{
        return this.key.indexOf(key.toLowerCase()) != -1;
    }
    startsWith(key: string): boolean{
        return this.key.substring(0, key.length) == key.toLowerCase();
    }
    getValues(): T[]{
        return this.values;
    }
}