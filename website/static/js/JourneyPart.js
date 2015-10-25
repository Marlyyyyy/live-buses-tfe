/**
 * This class models a section of a Journey. A Journey could have 1 to many JourneyPart(s)
 */
/// <reference path="JourneyPoint.ts" />
var JourneyPart = (function () {
    function JourneyPart(json) {
        this.mode = json.mode.toLowerCase();
        this.duration = json.duration;
        this.startPoint = new JourneyPoint(json.start);
        this.endPoint = new JourneyPoint(json.finish);
        this.serviceName = "";
        this.serviceDestination = "";
        if (json.hasOwnProperty("service")) {
            this.serviceName = json.service.name;
            this.serviceDestination = json.service.destination;
        }
    }
    JourneyPart.prototype.isByBus = function () {
        return this.mode == "bus";
    };
    JourneyPart.prototype.getDuration = function () {
        return this.duration;
    };
    JourneyPart.prototype.getServiceName = function () {
        return this.serviceName;
    };
    JourneyPart.prototype.getServiceDestination = function () {
        return this.serviceDestination;
    };
    JourneyPart.prototype.getStartPoint = function () {
        return this.startPoint;
    };
    JourneyPart.prototype.getEndPoint = function () {
        return this.endPoint;
    };
    return JourneyPart;
})();
//# sourceMappingURL=JourneyPart.js.map