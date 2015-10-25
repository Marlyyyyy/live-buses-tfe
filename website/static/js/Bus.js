/**
 * This class models a bus and the current position it may be. Effectively used for the determining the live Bus location
 */
/// <reference path="Point.ts" />
var Bus = (function () {
    function Bus(jsonObject) {
        this.busID = jsonObject.vehicle_id;
        this.lastGPSFix = jsonObject.last_gps_fix;
        this.location = new Point(jsonObject.latitude, jsonObject.longitude);
        this.speed = jsonObject.speed;
        this.heading = jsonObject.heading;
        this.service = jsonObject.service_name;
        this.destination = jsonObject.destination;
    }
    Bus.prototype.getBusID = function () {
        return this.busID;
    };
    Bus.prototype.getLastGPsFix = function () {
        return this.lastGPSFix;
    };
    Bus.prototype.getLocation = function () {
        return this.location;
    };
    Bus.prototype.getLatitude = function () {
        return this.location.getLatitude();
    };
    Bus.prototype.getLongitude = function () {
        return this.location.getLongitude();
    };
    Bus.prototype.getSpeed = function () {
        return this.speed;
    };
    Bus.prototype.getHeading = function () {
        return this.heading;
    };
    Bus.prototype.getService = function () {
        return this.service;
    };
    Bus.prototype.getDestination = function () {
        return this.destination;
    };
    return Bus;
})();
//# sourceMappingURL=Bus.js.map