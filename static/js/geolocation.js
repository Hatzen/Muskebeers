/**
 * Development values.
 */

const DUMMY_GEO = [
    [-124.99404, 39.75621],
    [-124.99404, 39.75621],
    [-114.99404, 39.75621],
    [-104.99404, 39.75621],
]


/**
 * Contract with backend is format:
 * Longitude first then latitude
 */
var currentGeoWatcher = null
const MUENSTER_RELEVANT_RADIUS_IN_KM = 2.5

/**
 * Request of Geolocation for current position in
 * @returns [longitude, latitude]
 */
function getCurrentPosition (callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        callback(null)
    }
}

/**
 * Calls the callback everytime there is an location update.
 * @prama function({latitude: double, longitude: double}) 
 */
 function watchPosition (callback) {
     if (currentGeoWatcher != null) {
        clear()
     }
    currentGeoWatcher = navigator.geolocation.watchPosition(function (position) {
        let location = {
            latitude: null,
            longitude: null,
        };
        location.longitude = position.coords.longitude;
        location.latitude = position.coords.latitude;
        callback(location)
    })
}

function clear() {
    navigator.geolocation.clearWatch(currentGeoWatcher);
    currentGeoWatcher = null
}
  
function isGeoLocationSupported () {
    return navigator.geolocation != null
}

/**
 * https://stackoverflow.com/q/18883601/8524651
 * 
 * @param {*} lon1 
 * @param {*} lat1 
 * @param {*} lon2 
 * @param {*} lat2 
 * @returns the distance in kilometeres
 */
function getDistanceFromLatLonInKm(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}