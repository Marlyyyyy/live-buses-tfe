/**
 * This class models a TFE service.
 */

/// <reference path="ServiceType.ts" />
/// <reference path="Route.ts" />

class Service{
    private serviceName: string;
    private serviceDescription: string;
    private serviceType: ServiceType;
    private routes: Array<Route>;
    
    public constructor(jsonObject: any){
        this.serviceName = jsonObject.name;
        this.serviceDescription = jsonObject.description;
        
        switch( jsonObject.service_type.toLowerCase() ){
            case "day": this.serviceType = ServiceType.DAY; break;
            case "express": this.serviceType = ServiceType.EXPRESS; break;
            case "night": this.serviceType = ServiceType.NIGHT; break;
            case "tram": this.serviceType = ServiceType.TRAM; break;
        }
        
        this.routes = new Array<Route>();
        for(var i: number = 0; i < jsonObject.routes.length; i++){
            this.routes[this.routes.length] = new Route(jsonObject.routes[i]);
        }
    }
    
    public getServiceName(): string{
        return this.serviceName;
    }
    
    public getServiceDescription(): string{
        return this.serviceDescription;
    }
    
    public getServiceType(): ServiceType{
        return this.serviceType;
    }
    
    public getRoutes(): Array<Route>{
        return this.routes;
    }
    
    public toString(): string{
        return this.serviceName;
    }
}