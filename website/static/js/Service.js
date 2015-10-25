/**
 * This class models a TFE service.
 */
/// <reference path="ServiceType.ts" />
/// <reference path="Route.ts" />
var Service = (function () {
    function Service(jsonObject) {
        this.serviceName = jsonObject.name;
        this.serviceDescription = jsonObject.description;
        switch (jsonObject.service_type.toLowerCase()) {
            case "day":
                this.serviceType = 0 /* DAY */;
                break;
            case "express":
                this.serviceType = 1 /* EXPRESS */;
                break;
            case "night":
                this.serviceType = 2 /* NIGHT */;
                break;
            case "tram":
                this.serviceType = 3 /* TRAM */;
                break;
        }
        this.routes = new Array();
        for (var i = 0; i < jsonObject.routes.length; i++) {
            this.routes[this.routes.length] = new Route(jsonObject.routes[i]);
        }
    }
    Service.prototype.getServiceName = function () {
        return this.serviceName;
    };
    Service.prototype.getServiceDescription = function () {
        return this.serviceDescription;
    };
    Service.prototype.getServiceType = function () {
        return this.serviceType;
    };
    Service.prototype.getRoutes = function () {
        return this.routes;
    };
    Service.prototype.toString = function () {
        return this.serviceName;
    };
    return Service;
})();
//# sourceMappingURL=Service.js.map