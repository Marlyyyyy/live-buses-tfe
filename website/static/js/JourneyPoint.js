/**
 * This class models either the Start Point of a Journey part or the End Point
 * The point could either be a Bus Stop or Some other place (Initial Position/Final Destination)
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="Point.ts" />
var JourneyPoint = (function (_super) {
    __extends(JourneyPoint, _super);
    function JourneyPoint(json) {
        _super.call(this, json.latitude, json.longitude); //initialize parent constructor
        this.name = json.name;
        this.stopID = 0;
        this.stopName = "";
        this._isBusStop = false;
        if (json.hasOwnProperty("stop_id")) {
            this._isBusStop = true;
            this.stopID = json.stop_id;
            this.stopName = json.stop_name;
        }
    }
    JourneyPoint.prototype.getName = function () {
        return this.name;
    };
    JourneyPoint.prototype.getTime = function () {
        return this.time;
    };
    JourneyPoint.prototype.getStopID = function () {
        return this.stopID;
    };
    JourneyPoint.prototype.getStopName = function () {
        return this.stopName;
    };
    JourneyPoint.prototype.isBusStop = function () {
        return this._isBusStop;
    };
    return JourneyPoint;
})(Point);
//# sourceMappingURL=JourneyPoint.js.map