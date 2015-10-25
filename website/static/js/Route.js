/// <reference path="Point.ts" />
var Route = (function () {
    function Route(jsonObject) {
        this.destination = jsonObject.destination;
        this.points = new Array();
        this.stops = new Array();
        var i;
        for (i = 0; i < jsonObject.points.length; i++) {
            this.points[this.points.length] = new Point(jsonObject.points[i].latitude, jsonObject.points[i].longitude);
        }
        for (i = 0; i < jsonObject.stops.length; i++) {
            this.stops[this.stops.length] = jsonObject.stops[i];
        }
    }
    Route.prototype.getDestination = function () {
        return this.destination;
    };
    Route.prototype.getPoints = function () {
        return this.points;
    };
    Route.prototype.getStops = function () {
        return this.stops;
    };
    return Route;
})();
//# sourceMappingURL=Route.js.map