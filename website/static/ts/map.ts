/// <reference path="Googlemaps.d.ts" />

    function initialize() {
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions:google.maps.MapOptions = {
            center: new google.maps.LatLng(55.9410656, -3.2053836),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
    }

google.maps.event.addDomListener(window, "load", initialize);
