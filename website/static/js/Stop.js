/**
 * Stop Typescript class modeling TFE Stop API
 */
var Stop = (function () {
    function Stop(jsonObject) {
        this.stopID = jsonObject.stop_id;
        this.stopName = jsonObject.name;
        this.direction = jsonObject.direction;
        this.location = new Point(jsonObject.latitude, jsonObject.longitude);
        this.locality = jsonObject.locality;
        var i;
        this.services = new Array();
        this.destinations = new Array();
        for (i = 0; i < jsonObject.services.length; i++) {
            this.services[this.services.length] = jsonObject.services[i];
        }
        for (i = 0; i < jsonObject.destinations.length; i++) {
            this.destinations[this.destinations.length] = jsonObject.destinations[i];
        }
    }
    Stop.prototype.getStopID = function () {
        return this.stopID;
    };
    Stop.prototype.getStopName = function () {
        return this.stopName;
    };
    Stop.prototype.getStopDirection = function () {
        return this.direction;
    };
    Stop.prototype.getLocation = function () {
        return this.location;
    };
    Stop.prototype.getLatitude = function () {
        return this.location.getLatitude();
    };
    Stop.prototype.getLongitude = function () {
        return this.location.getLongitude();
    };
    Stop.prototype.getLocality = function () {
        return this.locality;
    };
    Stop.prototype.getStopServices = function () {
        return this.services;
    };
    Stop.prototype.getStopDestinations = function () {
        return this.destinations;
    };
    return Stop;
})();
//# sourceMappingURL=Stop.js.map