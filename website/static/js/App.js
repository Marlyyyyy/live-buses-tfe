/// <reference path="jquery.d.ts" />
/// <reference path="Bus.ts" />
/// <reference path="EntityMap.ts" />
/// <reference path="AppResult.ts" />
/// <reference path="Stop.ts" />
/// <reference path="Service.ts" />
/// <reference path="Journey.ts" />
/// <reference path="AppResponse.ts" />
var App = (function () {
    function App() {
        this.token = "";
        this.stopQueue = new Array();
        this.liveBuses = new Array();
    }
    App.prototype.getLiveBuses = function (serviceNumbers, resultFunc) {
        var object = { services: serviceNumbers };
        this.doAjaxPost(App.GET_SERVICES_LOCATION_URL, function (json, wasSuccessful) {
            //build a object array of all the buses returned
            var buses = new Array();
            if (wasSuccessful) {
                for (var i = 0; i < json.length; i++) {
                    buses[buses.length] = new Bus(json[i]);
                }
            }
            this.liveBuses = buses;
            resultFunc(buses, wasSuccessful);
        }, object);
    };
    App.prototype.getStopLocations = function (text, resultFunc) {
        //check if text has a length of at least three characters
        if (text.length < 3) {
            //get all the result that looks like this which we may have cached
            resultFunc(this.loadStopLocationsCache(text), true);
            return;
        }
        var self = this;
        var object = { stop_name: text };
        //query the server for content
        this.doAjaxPost(App.GET_STOPS_URL, function (json, wasSuccessful) {
            //build an object array of all stops returned
            var stops = new Array();
            //check if process was successful
            if (wasSuccessful) {
                for (var i = 0; i < json.length; i++) {
                    stops[stops.length] = new Stop(json[i]);
                }
            }
            else {
                resultFunc(self.loadStopLocationsCache(text), true);
                return;
            }
            resultFunc(stops, true);
            //cache this result
            var map = new EntityMap(text, stops);
            self.stopQueue.unshift(map); //store result at the start of the array for the queue effect
            while (self.stopQueue.length > App.QUEUE_SIZE)
                self.stopQueue.pop();
        }, object);
    };
    App.prototype.findBus = function (busID) {
        for (var i = 0; i < this.liveBuses.length; i++) {
            if (this.liveBuses[i].getBusID() == busID)
                return this.liveBuses[i];
        }
        return null;
    };
    App.prototype.findStop = function (stopID) {
        for (var i = 0; i < this.stopQueue.length; i++) {
            for (var j = 0; j < this.stopQueue[i].getValues().length; j++) {
                if (this.stopQueue[i].getValues()[j].getStopID() == stopID)
                    return this.stopQueue[i].getValues()[j];
            }
        }
        return null;
    };
    App.prototype.getStopServices = function (stopID) {
        var stop = this.findStop(stopID);
        if (stop != null)
            return stop.getStopServices();
        return null;
    };
    //NOT UTILIZED YET
    App.prototype.getStopToStopLiveBuses = function () {
    };
    //NOT UTILIZED YET
    App.prototype.getStopToStopServices = function (fromStop, toStop, resultFunc) {
        //check for null values
        if (fromStop == null || toStop == null)
            throw "Null value supplied";
        var object = { from: fromStop.getLocation().toString(), to: toStop.getLocation().toString() };
        this.doAjaxPost(App.GET_STOP_STOP_SERVICES_URL, function (json, wasSuccessful) {
            var array = new Array();
            //build the string array
            if (wasSuccessful) {
                for (var i = 0; i < json.length; i++) {
                    array[array.length] = new Service(json[i]);
                }
            }
            resultFunc(array, wasSuccessful);
        }, object);
    };
    App.prototype.getJourneysByStops = function (fromStop, toStop, resultFunc) {
        //check for null values
        if (fromStop == null || toStop == null)
            throw "Null value supplied";
        this.getJourneysByLocation(fromStop.getLocation().toString(), toStop.getLocation().toString(), resultFunc);
    };
    App.prototype.getJourneysByLocation = function (startLocation, stopLocation, resultFunc) {
        var object = { from: startLocation, to: stopLocation };
        this.doAjaxPost(App.GET_STOP_STOP_SERVICES_URL, function (json, wasSuccessful) {
            var array = new Array();
            //build the string array
            if (wasSuccessful) {
                for (var i = 0; i < json.journeys.length; i++) {
                    array[array.length] = new Journey(json.journeys[i], i + 1);
                }
            }
            resultFunc(array, wasSuccessful);
        }, object);
    };
    App.prototype.loadStopLocationsCache = function (text) {
        //check if we have cached any text matching this
        var array = new Array();
        var returnArray = new Array();
        for (var i = 0; i < this.stopQueue.length; i++) {
            if (this.stopQueue[i].startsWith(text))
                array[array.length] = this.stopQueue[i].getValues();
        }
        //check if we found any stop from the previous search
        if (array.length == 0) {
            if (this.stopQueue[i].matchesKey(text))
                array[array.length] = this.stopQueue[i].getValues();
        }
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                returnArray[returnArray.length] = array[i][j];
            }
        }
        return returnArray;
    };
    App.prototype.doAjaxPost = function (url, reponseFunc, params, errorFunction) {
        if (params === void 0) { params = {}; }
        jQuery.post(url, params, function (json, status) {
            reponseFunc(json, status.toLowerCase() == "success");
        }, "json");
    };
    App.QUEUE_SIZE = 20; //the size of all stacks/caches
    // TODO: accept these Ajax URL as input parameters
    App.GET_SERVICES_LOCATION_URL = "/get/vehicles";
    App.GET_STOPS_URL = "/get/stop_names";
    App.GET_STOP_STOP_SERVICES_URL = "getStopToStopServices.php";
    return App;
})();
//# sourceMappingURL=App.js.map