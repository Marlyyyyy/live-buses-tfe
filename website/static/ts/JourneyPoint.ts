/**
 * This class models either the Start Point of a Journey part or the End Point
 * The point could either be a Bus Stop or Some other place (Initial Position/Final Destination)
 */

/// <reference path="Point.ts" />

class JourneyPoint extends Point{
    private name: string;
    private time: number;
    private _isBusStop: boolean;
    private stopID: number;
    private stopName: string;
    
    public constructor(json: any){
        super(json.latitude, json.longitude);//initialize parent constructor
        this.name = json.name;
        this.stopID = 0;
        this.stopName = "";
        this._isBusStop = false;
        
        if( json.hasOwnProperty("stop_id") ){
            this._isBusStop = true;
            this.stopID = json.stop_id;
            this.stopName = json.stop_name;
        }
    }
    
    public getName(): string{
        return this.name;
    }
    
    public getTime(): number{
        return this.time;
    }
    
    public getStopID(): number{
        return this.stopID;
    }
    
    public getStopName(): string{
        return this.stopName;
    }
    
    public isBusStop(): boolean{
        return this._isBusStop;
    }
}