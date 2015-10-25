var Point = (function () {
    function Point(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    Point.prototype.getLatitude = function () {
        return this.latitude;
    };
    Point.prototype.getLongitude = function () {
        return this.longitude;
    };
    Point.prototype.toString = function () {
        return this.latitude + "," + this.longitude;
    };
    return Point;
})();
//# sourceMappingURL=Point.js.map