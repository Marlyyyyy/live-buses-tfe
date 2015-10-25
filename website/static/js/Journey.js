/**
 * This class models a journey between two places. A Journey could be composed of multiple parts.
 * e.g one may have to walk up to bus stops (a part) and then take a bus to another stop (another part)
 * and maybe walk to the final destination (yet another part). These parts are modeled in a JourneyPart class
 */
/// <reference path="JourneyPart.ts" />
var Journey = (function () {
    function Journey(json, tag) {
        this.tag = tag;
        this.duration = json.duration;
        this.journeyParts = new Array();
        for (var i = 0; i < json.legs.length; i++) {
            this.journeyParts[this.journeyParts.length] = new JourneyPart(json.legs[i]);
        }
    }
    Journey.prototype.getDuration = function () {
        return this.duration;
    };
    Journey.prototype.getJourneyParts = function () {
        return this.journeyParts;
    };
    Journey.prototype.getJourneyBusServices = function () {
        var array = new Array();
        for (var i = 0; i < this.journeyParts.length; i++) {
            if (this.journeyParts[i].isByBus())
                array[array.length] = this.journeyParts[i].getServiceName();
        }
        return array;
    };
    Journey.prototype.getTag = function () {
        return this.tag;
    };
    Journey.prototype.toString = function () {
        return "Journey " + this.tag;
    };
    return Journey;
})();
//# sourceMappingURL=Journey.js.map