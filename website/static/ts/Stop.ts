/**
 * Stop Typescript class modeling TFE Stop API
 */
class Stop{
    private stopID: number;
    private stopName: string;
    private direction: string;
    private locality: string;
    private services: Array<string>;
    private destinations: Array<string>;
    private location: Point;
    
    public constructor(jsonObject: any){
        this.stopID = jsonObject.stop_id;
        this.stopName = jsonObject.name;
        this.direction = jsonObject.direction;
        this.location = new Point(jsonObject.latitude, jsonObject.longitude);
        this.locality = jsonObject.locality;
        var i: number;
        
        this.services = new Array<string>();
        this.destinations = new Array<string>();
        for(i = 0; i < jsonObject.services.length; i++){
            this.services[this.services.length] = jsonObject.services[i];
        }
        for(i = 0; i < jsonObject.destinations.length; i++){
            this.destinations[this.destinations.length] = jsonObject.destinations[i];
        }
    }
    public getStopID(): number{
        return this.stopID;
    }
    public getStopName(): string{
        return this.stopName;
    }
    public getStopDirection(): string{
        return this.direction;
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
    public getLocality(): string{
        return this.locality;
    }
    public getStopServices(): string[]{
        return this.services;
    }
    public getStopDestinations(): string[]{
        return this.destinations;
    }
}