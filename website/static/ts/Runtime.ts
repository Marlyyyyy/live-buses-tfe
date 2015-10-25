/// <reference path="App.ts" />
/// <reference path="Bus.ts" />
/// <reference path="AppResult.ts" />
/// <reference path="googlemaps.d.ts" />
/// <reference path="jquery.d.ts" />


// Module responsible for actions on the Map page
module MapModule {

    var ajaxVehiclesPath : string;
    var ajaxRouteAndStopsPath : string;
    var ajaxAddFavouritePath : string;
    var ajaxRmvFavouritePath : string;
    var map: any = null;

    // Live vehicles are shown for this service only, every 20 seconds
    var selectedService : string;
    var selectedServiceButton :  JQuery;
    // Timer for displaying live vehicle on the map
    var liveVehicleTimer : number;
    // Increments up to e.g. 20, then triggers the live update function
    var counterForLiveVehicles : number = 0;
    var counterDiv : any;
    // Time it should take to refresh the live vehicles
    var liveRefreshTime : number = 15;

    // Dictionary for the position of the user e.g. {lat: ..., lng: ...}
    var user_position : Object;

    // Initialises the module. It must take the URL of those path we query on.
    export function init(ajaxRouteAndStops, ajaxVehicles, ajaxAddFavourite, ajaxRmvFavourite) {

        // Get the user's location and show it on the map
        showUserLocation();

        ajaxVehiclesPath = ajaxVehicles;
        ajaxRouteAndStopsPath = ajaxRouteAndStops;

        ajaxAddFavouritePath = ajaxAddFavourite;
        ajaxRmvFavouritePath = ajaxRmvFavourite;

        // Create Map instance
        var mapCanvas : HTMLElement = document.getElementById('map-canvas');
        map = new GoogleMapsApiWrapper({lat: 55.9410656, lng: -3.2053836}, 12, mapCanvas);

        // Get timer div DOM element ready
        counterDiv = document.getElementById("countdown");

        registerEventListeners();

        // Initialise module to handle errors
        ErrorModule.registerContainer(document.getElementById('error_div'));
    }

    function registerEventListeners() {

        // Event listeners for when the user clicks on any service button
        var serviceButtons : JQuery = $(".service-box");
        serviceButtons.click(displayLiveVehicles);
        serviceButtons.click(displayRoutes);
        
        var addFavouriteButton = document.getElementById("favAdd-box");
        $(addFavouriteButton).click(addServiceToFavourites);
        
        var removeFavouriteButton = document.getElementById("favRmv-box");
        $(removeFavouriteButton).click(removeServiceToFavourites);
        
        $("#error_div").width( $(document).width() - $("#service-container").outerWidth() );
        $( window ).resize(function() {
            $("#error_div").width( $(document).width() - $("#service-container").outerWidth() );
        });
    }

    // Ajax request add favourite
    function addServiceToFavourites() {

        getToServer(ajaxAddFavouritePath, selectedService, function (data) {
            window.location.reload();
        });
    }
    
    //Ajax remove favorite
    function removeServiceToFavourites() {

        getToServer(ajaxRmvFavouritePath, selectedService, function (data) {
            window.location.reload();
        });
    }

    // Gets the position of the user
    function showUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(addUserPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    // Helper function to draw the position of the user on the map.
    function addUserPosition(position) {
        user_position = {lat: position.coords.latitude, lng: position.coords.longitude};
        var options : Object = {
            //infoWindowContent: "<div class='map-info-window'>This is you! :)</div>",
            shouldOpenInfoWindowInitially: true
        };
        map.addMarker("user", user_position, options);
        
    }

    // Displays the route of the selected service. Stops are also returned, but we don't use them now.
    function displayRoutes() {

        // Remove any previous routes
        map.clearPolylines();

        // Get the name of the service the user clicked on
        var selectedService = this.dataset.service;

        postToServer(ajaxRouteAndStopsPath, {service: selectedService}, function (data) {

            // Display the route
            var route : string = data.service.route;
            route = JSON.parse(route);
            map.addPolyline(route, {});
        });
    }

    // Displays count-down until live vehicles are displayed
    function countDownLiveVehicles(){

        counterForLiveVehicles++;

        counterDiv.innerHTML = "Refresh in " + (liveRefreshTime - counterForLiveVehicles) + " seconds";
        //show the count down div
        $(counterDiv).show();

        if (counterForLiveVehicles >= liveRefreshTime){
            clearTimeout(liveVehicleTimer);
            displayLiveVehicles();
            return;
        }

        liveVehicleTimer = setTimeout(countDownLiveVehicles, 1000);
    }

    // Displays live vehicles and continuously updates the map
    function displayLiveVehicles() {

        ErrorModule.hideErrors();

        // Activate the service button - after deactivating the previous one
        if (typeof this.dataset !== "undefined") {
            if (typeof selectedServiceButton !== "undefined") {
                $(selectedServiceButton).removeClass("active-service");
            }

            selectedServiceButton = $(this);
        }

        $(selectedServiceButton).addClass("active-service");

        // Only select the service if it hasn't been selected yet
        if ((typeof selectedService === "undefined") || (typeof this.dataset !== "undefined")) {
            selectedService = this.dataset.service;
        }

        // Cancel the previous timer if there was any timer before
        if (typeof liveVehicleTimer !== "undefined") {
            clearTimeout(liveVehicleTimer);
        }

        // Display loading bar
        var loadingTimer = window.setTimeout(LoadingModule.showLoadingBar, 500);


        postToServer(ajaxVehiclesPath, {services: [selectedService]}, function (data) {

            // Remove loading bar if it's displayed, otherwise just cancel its timer
            clearTimeout(loadingTimer);
            LoadingModule.hideLoadingBar();

            // Remove any previously displayed markers
            map.clearMarkers();
            // Add the user marker to the map again
            showUserLocation();

            var vehicles : Array<any> = data.vehicles;

            // Check if the vehicles array is empty. If yes, then show an error message
            if (vehicles.length === 0) {
                var errors = ["This service does not have any running buses at this time of the day!"];
                ErrorModule.displayErrors(errors);
                
                //cancel the previous timer
                if (typeof liveVehicleTimer !== "undefined") {
                    clearTimeout(liveVehicleTimer);
                }
                
                //hide the count down div
                $(counterDiv).hide();
                
                return;
            }
            
            var dest: string = null;
            // Display each live vehicle on the map
            for (var i = 0; i < vehicles.length; i++) {
                if(dest == null){
                    dest = vehicles[i].destination;
                }
                var dIcon: string;
                if( vehicles[i].destination == dest )
                    dIcon = "bus";
                else
                    dIcon = "busReverse";
                var position : Object = {lat: vehicles[i].latitude, lng: vehicles[i].longitude};
                var options :  Object = {
                    icon: dIcon,
                    infoWindowContent: "<div class='map-info-window'>" +
                    "Service: " + vehicles[i].service_name + " | " +
                    "Destination: " + vehicles[i].destination + " | " +
                    "Speed: " + vehicles[i].speed + " mph </div>"
                };
                map.addMarker("vehicles" + vehicles[i].vehicle_id, position, options);
            }
        });
        
        //show the count down div
        $(counterDiv).show();
        
        // Call the loop again for count-down
        counterForLiveVehicles = 0;
        countDownLiveVehicles();
    }
}

// Module responsible for displaying errors
module ErrorModule {

    var container : any;

    // The error messages will be appended to this container. It's an optional argument. "Body" is the default container.
    export function registerContainer(newContainer?: any) {
        container = newContainer || document.body;
        return this;
    }

    // Takes an array of error messages (strings or HTML string) and displays them in the previously specified container.
    export function displayErrors(errors) {

        hideErrors();

        for (var key in errors) {
            if (errors.hasOwnProperty(key)) {

                if (typeof errors[key] === "object") {
                    for (var k in errors[key]) {
                        if (errors[key].hasOwnProperty(k)) {

                            appendError(errors[key][k]);
                        }
                    }
                } else {
                    appendError(errors[key]);
                }
            }
        }
    }

    // Appends a single error paragraph to the container.
    function appendError(errorText) {

        var p : HTMLElement = document.createElement("p");
        p.className = "error";
        p.innerHTML = errorText;
        p.addEventListener("click", hideError);
        container.appendChild(p);
        
        $('#error_div').show();
    }

    // Hides and removes the clicked error message.
    function hideError() {

        $(this).fadeOut(150, function () {

            container.removeChild(this);
            $('#error_div').hide();
        });
    }

    // Hides and removes all error messages.
    export function hideErrors() {

        var children = container.childNodes;

        for (var i = 0; i < children.length; i++) {

            if (children[i].className === "error") {
                container.removeChild(children[i]);
            }
        }
        $('#error_div').hide();
    }
}

// Module responsible for displaying a simple loading circle (without any numbers)
module LoadingModule {

    var loadingContainer;

    export function showLoadingBar(){

        loadingContainer = document.getElementById("loading-container");

        $(loadingContainer).fadeIn(150);
    }

    export function hideLoadingBar(){

        $(loadingContainer).fadeOut(150);
    }
}


// The following object was created by Manas Bajaj on 23-03-2015, and it is used with his permission.
function GoogleMapsApiWrapper(centerLocation, zoomLevel, mapContainer) {
    var config = {
        map: null,
        directionsRenderer: null,
        directionsService: null,
        markers: [],
        polylines: [],
        markerIcons: {
            purple: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/purple-dot.png",
            yellow: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png",
            blue: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
            green: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
            red: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
            orange: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/orange-dot.png",
            bus: "/static/images/smallbuses/green2.png",
            busReverse: "/static/images/smallbuses/cobalt2.png"
        },
        travelModes: {
            walking: google.maps.TravelMode.WALKING,
            driving: google.maps.TravelMode.DRIVING,
            bicycling: google.maps.TravelMode.BICYCLING
        }
    };
    
    //a reference to the current active InfoWindow
    var activeInfoWindow: any = null;
    //a reference to the ID of the last shown marker InfoWindow
    var lastMarkerID: string = null;

    // self invoking initialization method
    (function init() {
        // setup map
        var options = {
            zoom: zoomLevel,
            center: new google.maps.LatLng(centerLocation["lat"], centerLocation["lng"]),
            mapTypeControl: false
        };
        config.map = new google.maps.Map(mapContainer, options);

        // setup directions renderer which will draw routes on map
        config.directionsRenderer = new google.maps.DirectionsRenderer();
        config.directionsRenderer.setOptions({suppressMarkers: true, preserveViewport: true});
        config.directionsRenderer.setMap(config.map);

        // setup directions service which will retrieve the required route
        config.directionsService = new google.maps.DirectionsService();
    })();

    this.addMarker = function (id, position, options) {

        var markerOptions = {
            icon: options.icon || "red",
            singleClickCallback: options.singleClickCallback,
            doubleClickCallback: options.doubleClickCallback,
            infoWindowContent: options.infoWindowContent,
            shouldOpenInfoWindowInitially: options.shouldOpenInfoWindowInitially || false
        };

        var marker : any = new google.maps.Marker({
            position: new google.maps.LatLng(position["lat"], position["lng"]),
            map: config.map,
            icon: new google.maps.MarkerImage(config.markerIcons[markerOptions.icon])
        });

        var infoWindow;
        if (markerOptions.infoWindowContent) {
            infoWindow = new google.maps.InfoWindow({
                content: markerOptions.infoWindowContent
            });
        }

        marker.setMap(config.map);

        // add id property to each marker so that it can easily be recognized later
        marker.id = id;

        // add method to open info window
        marker.infoWindow = function (state) {
            if (infoWindow) {
                if (state == "show") {
                    infoWindow.open(config.map, marker);
                } else if (state == "hide") {
                } else if (state == "hide") {
                    infoWindow.close(config.map, marker);
                }
            } else {
                throw new Error("Info window content was not provided when marker was created");
            }
        };
        

        if (markerOptions.shouldOpenInfoWindowInitially || lastMarkerID == id) {
            if (infoWindow) {
                if( activeInfoWindow != null )
                    activeInfoWindow.close();
                
                infoWindow.open(config.map, marker);
                activeInfoWindow = infoWindow;
            }
        }

        // handle single click using the callback provided
        google.maps.event.addListener(marker, 'click', function () {
            if( activeInfoWindow != null )
                activeInfoWindow.close();
            activeInfoWindow = infoWindow;
            marker.infoWindow("show");
            
            lastMarkerID = id;//store a reference to the clicked marker ID
            
            if (markerOptions.singleClickCallback) {
                markerOptions.singleClickCallback();
            }
        });

        // handle double click using the callback provided
        if (markerOptions.doubleClickCallback) {
            google.maps.event.addListener(marker, 'dblclick', markerOptions.doubleClickCallback);
        }

        // keep marker reference for later use
        config.markers.push(marker);
    };

    this.addRoute = function (origin, destination, travelMode) {
        var request = {
            origin: new google.maps.LatLng(origin["lat"], origin["lng"]),
            destination: new google.maps.LatLng(destination["lat"], destination["lng"]),
            travelMode: config.travelModes[travelMode] || config.travelModes.walking
        };

        config.directionsService.route(request, function (res, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                config.directionsRenderer.setDirections(res);
            } else {
                console.log("Error occurred while adding route: " + status);
            }
        });
    };

    this.addPolyline = function (pathCoordinates, options) {
        for (var i=0; i<pathCoordinates.length; i++) {
            pathCoordinates[i] = new google.maps.LatLng(pathCoordinates[i]["latitude"], pathCoordinates[i]["longitude"]);
        }
        var path = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: options.geodesic || true,
            strokeColor: options.strokeColor || '#FF0000',
            strokeOpacity: options.strokeOpacity || 1.0,
            strokeWeight: options.strokeWeight || 2
        });
        path.setMap(config.map);

        // keep polyline reference for later use
        config.polylines.push(path);
    };

    this.clearRoutes = function () {
        config.directionsRenderer.setDirections({routes: []});
    };

    this.clearMarkers = function () {
        for (var i=0; i<config.markers.length; i++) {
            config.markers[i].setMap(null);
        }
        config.markers = [];
    };
    
    this.hideInfoWindows = function(){
        for (var i=0; i<config.markers.length; i++) {
            config.markers[i].infoWindow.close(config.map, config.markers[i]);
        }
    }

    this.clearPolylines = function () {
        for (var i=0; i<config.polylines.length; i++) {
            config.polylines[i].setMap(null);
        }
        config.polylines = [];
    };

    this.getMarkers = function (markerId) {
        if (markerId) {
            var filteredMarkers = [];
            for (var i=0; i<config.markers.length; i++) {
                if (config.markers[i].id == markerId) {
                    filteredMarkers.push(config.markers[i]);
                }
            }
            return filteredMarkers;
        } else {
            return config.markers;
        }
    };

    this.triggerResize = function () {
        google.maps.event.trigger(config.map, 'resize');
    };

    this.setZoom = function (zoomLevel) {
        config.map.setZoom(zoomLevel);
    };

    this.setCenter = function (centerLocation) {
        config.map.setCenter(new google.maps.LatLng(centerLocation["lat"], centerLocation["lng"]));
    }
}



// Regular Ajax call
function postToServer(url, data, success){

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,

        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
            console.log('Error : ' + errorThrown);
        }
    });
}

// Regular Ajax call (GET)
function getToServer(url, data, success){

    $.ajax({
        type: "GET",
        url: url + data,
        success: success,

        error: function(XMLHttpRequest, textStatus, errorThrown)
        {
            console.log('Error : ' + errorThrown);
        }
    });
}

// Animates height:auto without having to worry about the height of the object
$.fn.animateAutoHeight = function(speed, callback){

    var elem, height;

    // Iterate through each element returned by the selector
    return this.each(function(i, el){
        el = $(el);
        elem = el.clone().css({"height":"auto"}).appendTo("body");
        height = elem.css("height");
        elem.remove();

        el.animate({"height":height}, speed, callback);
    });
};

// Makes placeholder of an input field disappear on focus
$(document).ready(function(){

    var defaultInputPlaceholder;

    $(":input").focus(function(){
        // Remove placeholder-text from the input field when selected
        defaultInputPlaceholder = this.placeholder;
        this.placeholder = "";
        $(this).addClass("input-active");

    }).blur(function(){
        // Reset the placeholder-text
        this.placeholder = defaultInputPlaceholder;
        $(this).removeClass("input-active");
    });
});