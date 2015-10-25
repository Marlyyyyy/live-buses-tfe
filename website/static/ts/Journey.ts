/**
 * This class models a journey between two places. A Journey could be composed of multiple parts. 
 * e.g one may have to walk up to bus stops (a part) and then take a bus to another stop (another part)
 * and maybe walk to the final destination (yet another part). These parts are modeled in a JourneyPart class
 */

/// <reference path="JourneyPart.ts" />

class Journey{
    private duration: number;
    private journeyParts: Array<JourneyPart>;
    
    public constructor(json: any, private tag: number){
        this.duration = json.duration;
        this.journeyParts = new Array<JourneyPart>();
        
        for(var i: number = 0; i < json.legs.length; i++){
            this.journeyParts[this.journeyParts.length] = new JourneyPart(json.legs[i]);
        }
    }
    
    public getDuration(): number{
        return this.duration;
    }
    
    public getJourneyParts(): Array<JourneyPart>{
        return this.journeyParts;
    }
    
    public getJourneyBusServices(): Array<string>{
        var array: Array<string> = new Array<string>();
        
        //search through all the journey parts and get the bus service names that might exist
        for( var i: number = 0; i < this.journeyParts.length; i++ ){
            if( this.journeyParts[i].isByBus() )
               array[array.length] = this.journeyParts[i].getServiceName();
        }
        
        return array;
    }
    
    public getTag(): number{
        return this.tag;
    }
    
    public toString(): string{
        return "Journey " + this.tag;
    }
}