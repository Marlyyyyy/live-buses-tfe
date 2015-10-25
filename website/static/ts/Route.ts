/// <reference path="Point.ts" />

class Route{
    private destination: string;
    private points: Array<Point>;
    private stops: Array<number>;
    
    public constructor(jsonObject: any){
        this.destination = jsonObject.destination;
        this.points = new Array<Point>();
        this.stops = new Array<number>();
        var i: number;
        for(i = 0; i < jsonObject.points.length; i++){
            this.points[this.points.length] = new Point(jsonObject.points[i].latitude, jsonObject.points[i].longitude);
        }
        for(i = 0; i < jsonObject.stops.length; i++){
            this.stops[this.stops.length] = jsonObject.stops[i];
        }
    }
    public getDestination(): string{
        return this.destination;
    }
    public getPoints(): Array<Point>{
        return this.points;
    }
    public getStops(): Array<number>{
        return this.stops;
    }
}