/// <reference path="jquery.d.ts" />
/// <reference path="Bus.ts" />
/// <reference path="EntityMap.ts" />
/// <reference path="AppResult.ts" />
/// <reference path="Stop.ts" />
/// <reference path="Service.ts" />
/// <reference path="Journey.ts" />
/// <reference path="AppResponse.ts" />

class App{
    private token: string;
    private stopQueue: Array<EntityMap<Stop>>;
    private static QUEUE_SIZE: number = 20;//the size of all stacks/caches
    // TODO: accept these Ajax URL as input parameters
    private static GET_SERVICES_LOCATION_URL = "/get/vehicles";
    private static GET_STOPS_URL = "/get/stop_names";
    private static GET_STOP_STOP_SERVICES_URL = "getStopToStopServices.php";
    private liveBuses: Array<Bus>;
    
    public constructor(){
        this.token = "";
        this.stopQueue = new Array<EntityMap<Stop>>();
        this.liveBuses = new Array<Bus>();
    }
    public getLiveBuses(serviceNumbers: Array<string>, resultFunc: AppResult<Bus>) : void{
        var object: any = {services: serviceNumbers};
        this.doAjaxPost(App.GET_SERVICES_LOCATION_URL, function(json: any, wasSuccessful: boolean){
            //build a object array of all the buses returned
            var buses: Array<Bus> = new Array<Bus>();
            if( wasSuccessful ){//call to server returned success
                for(var i: number = 0; i < json.length; i++){
                    buses[buses.length] = new Bus(json[i]);
                }
            }
            this.liveBuses = buses;

            resultFunc(buses, wasSuccessful);
        }, object);
    }
    public getStopLocations(text: string, resultFunc: AppResult<Stop>): void{
        //check if text has a length of at least three characters
        if( text.length < 3 ){
            //get all the result that looks like this which we may have cached
            resultFunc( this.loadStopLocationsCache(text), true );
            return;
        }
        
        var self: App = this;
        var object: any = {stop_name: text};
        
        //query the server for content
        this.doAjaxPost(App.GET_STOPS_URL, function(json: any, wasSuccessful: boolean){
            //build an object array of all stops returned
            var stops: Array<Stop> = new Array<Stop>();
            //check if process was successful
            if( wasSuccessful ){
                for(var i: number = 0; i < json.length; i++){
                    stops[stops.length] = new Stop(json[i]);
                }
            }
            else{//try our cache
                resultFunc( self.loadStopLocationsCache(text), true );
                return;
            }
            
            resultFunc( stops, true );
            
            //cache this result
            var map: EntityMap<Stop> = new EntityMap<Stop>(text, stops);
            self.stopQueue.unshift(map);//store result at the start of the array for the queue effect
            
            //remove all cache above the max allowed
            while( self.stopQueue.length > App.QUEUE_SIZE )
                self.stopQueue.pop();//remove elements at the end of the queue
        }, object);
    }
    public findBus(busID: string): Bus{//given an ID, find the bus
        for(var i: number = 0; i < this.liveBuses.length; i++){
            if( this.liveBuses[i].getBusID() == busID )
                return this.liveBuses[i];
        }
        
        return null;
    }
    public findStop(stopID: number): Stop{
        for(var i: number = 0; i < this.stopQueue.length; i++){
            for(var j: number = 0; j < this.stopQueue[i].getValues().length; j++){
                if( this.stopQueue[i].getValues()[j].getStopID() == stopID )
                    return this.stopQueue[i].getValues()[j];
            }
        }
        
        return null;
    }
    public getStopServices(stopID: number): Array<string>{//given a stopID, find from the cache, from the last added, the stop object having the id
        var stop: Stop = this.findStop(stopID);
        if( stop != null )
            return stop.getStopServices();
        
        return null;
    }
    //NOT UTILIZED YET
    public getStopToStopLiveBuses(): void{
        
    }
    //NOT UTILIZED YET
    public getStopToStopServices(fromStop: Stop, toStop: Stop, resultFunc: AppResult<Service>): void{
        //check for null values
        if( fromStop == null || toStop == null )
            throw "Null value supplied";
        
        var object: any = {from: fromStop.getLocation().toString(), to: toStop.getLocation().toString()};
        
        this.doAjaxPost(App.GET_STOP_STOP_SERVICES_URL, function(json: any, wasSuccessful: boolean){
            var array: Array<Service> = new Array<Service>();
            //build the string array
            if( wasSuccessful ){//request returned successfully
                for(var i: number = 0; i < json.length; i++){
                    array[array.length] = new Service(json[i]);
                }
            }
            
            resultFunc(array, wasSuccessful);
        }, object );
    }
    public getJourneysByStops(fromStop: Stop, toStop: Stop, resultFunc: AppResult<Journey>): void{
         //check for null values
        if( fromStop == null || toStop == null )
            throw "Null value supplied";
        
        this.getJourneysByLocation(fromStop.getLocation().toString(), toStop.getLocation().toString(), resultFunc);
    }
    public getJourneysByLocation(startLocation: string, stopLocation: string, resultFunc: AppResult<Journey>){
        var object: Object = {from: startLocation, to: stopLocation};
        this.doAjaxPost(App.GET_STOP_STOP_SERVICES_URL, function(json: any, wasSuccessful: boolean){
            var array: Array<Journey> = new Array<Journey>();
            //build the string array
            if( wasSuccessful ){//request returned successfully
                for(var i: number = 0; i < json.journeys.length; i++){
                    array[array.length] = new Journey(json.journeys[i], i + 1);
                }
            }
            
            resultFunc(array, wasSuccessful);
        }, object );
    }
    private loadStopLocationsCache(text): Array<Stop>{
        //check if we have cached any text matching this
        var array: Array<Array<Stop>> = new Array<Array<Stop>>();
        var returnArray = new Array<Stop>();
        
        for( var i: number = 0; i < this.stopQueue.length; i++ ){
            if( this.stopQueue[i].startsWith(text) )
               array[array.length] = this.stopQueue[i].getValues();
        }
        //check if we found any stop from the previous search
        if( array.length == 0 ){///check for partial matching
            if( this.stopQueue[i].matchesKey(text) )
               array[array.length] = this.stopQueue[i].getValues();
        }
        //populate the stops return array
        for( var i: number = 0; i < array.length; i++ ){
            for( var j: number = 0; j < array[i].length; j++ ){
                returnArray[returnArray.length] = array[i][j];
            }
        }
        
        return returnArray;
    }
    private doAjaxPost(url: string, reponseFunc: AppResponse, params: any = {}, errorFunction?: (errorMessage: string) => void): void{
        jQuery.post(url, params, function(json: any, status:string){
            reponseFunc(json, status.toLowerCase() == "success");
        }, "json");
    }
}