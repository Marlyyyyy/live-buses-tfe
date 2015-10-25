/**
 * This Generic class is built to store results received from the server
 * for a faster access for the client
 */
var EntityMap = (function () {
    function EntityMap(key, values) {
        this.key = key.toLowerCase();
        this.values = values;
    }
    EntityMap.prototype.hasKey = function (key) {
        return this.key == key.toLowerCase();
    };
    EntityMap.prototype.matchesKey = function (key) {
        return this.key.indexOf(key.toLowerCase()) != -1;
    };
    EntityMap.prototype.startsWith = function (key) {
        return this.key.substring(0, key.length) == key.toLowerCase();
    };
    EntityMap.prototype.getValues = function () {
        return this.values;
    };
    return EntityMap;
})();
//# sourceMappingURL=EntityMap.js.map