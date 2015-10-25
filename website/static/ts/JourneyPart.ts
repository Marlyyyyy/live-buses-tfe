/**
 * This class models a section of a Journey. A Journey could have 1 to many JourneyPart(s)
 */

/// <reference path="JourneyPoint.ts" />

class JourneyPart{
    private mode: string;
    private duration: number;
    private serviceName: string;
    private serviceDestination: string;
    private startPoint: JourneyPoint;
    private endPoint: JourneyPoint;
    
    public constructor(json: any){
        this.mode = json.mode.toLowerCase();
        this.duration = json.duration;
        this.startPoint = new JourneyPoint(json.start);
        this.endPoint = new JourneyPoint(json.finish);
        this.serviceName = "";
        this.serviceDestination = "";
        
        if( json.hasOwnProperty("service") ){
            this.serviceName = json.service.name;
            this.serviceDestination = json.service.destination;
        }
    }
    public isByBus(): boolean{
        return this.mode == "bus";
    }
    public getDuration(): number{
        return this.duration;
    }
    public getServiceName(): string{
        return this.serviceName;
    }
    public getServiceDestination(): string{
        return this.serviceDestination;
    }
    public getStartPoint(): JourneyPoint{
        return this.startPoint;
    }
    public getEndPoint(): JourneyPoint{
        return this.endPoint;
    }
}