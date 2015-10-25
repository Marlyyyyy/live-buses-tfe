/**
 * This class models a bus and the current position it may be. Effectively used for the determining the live Bus location
 */

/// <reference path="Point.ts" />

class Bus{
    private busID: string;
    private lastGPSFix: number;
    private location: Point;
    private speed: number;
    private heading: number;
    private service: string;
    private destination: string;
    
    public constructor(jsonObject: any){
        this.busID = jsonObject.vehicle_id;
        this.lastGPSFix = jsonObject.last_gps_fix;
        this.location = new Point(jsonObject.latitude, jsonObject.longitude);
        this.speed = jsonObject.speed;
        this.heading = jsonObject.heading;
        this.service = jsonObject.service_name;
        this.destination = jsonObject.destination;
    }
    public getBusID(): string{
        return this.busID;
    }
    public getLastGPsFix(): number{
       return this.lastGPSFix; 
    }
    public getLocation(): Point{
        return this.location;
    }
    public getLatitude(): number{
       return this.location.getLatitude();
    }
    public getLongitude(): number{
       return this.location.getLongitude();
    }
    public getSpeed(): number{
        return this.speed;
    }
    public getHeading(): number{
        return this.heading;
    }
    public getService(): string{
        return this.service;
    }
    public getDestination(): string{
        return this.destination;
    }
}