/* Define 'imports'. */
const {LatLng, Map, Marker, MapTypeId, NavigationControlStyle} = google.maps;

/* Define global variables. */
let map = undefined, markers = {};
let geolocation = undefined;
let debug = false;

// Call methods on initialization.
$(document).ready(() => {
    requestLocation(); // Request location privileges.
});

/*
 * Methods.
 */

/**
 * Requests permission to access the user's geolocation.
 */
function requestLocation() {
    geolocation = navigator.geolocation;
    if(!geolocation) {
        alert('Location not supported.'); return;
    }

    geolocation.getCurrentPosition(() => {}, 
        () => alert('Unable to get location.'));
}

/**
 * Hides the specified element.
 * @param id The id of the element.
 */
function hide(id) {
    document.getElementById(id).style.display = 'none';
}

/**
 * Shows the specified element.
 * @param id The id of the element.
 */
function show(id) {
    document.getElementById(id).style.display = 'block';
}

/**
 * Pushes a packet to the server.
 * @param packet The packet & it's data.
 */
function pushPacket(packet) {
    if(websocket === undefined) {
        alert('Unable to push packet.'); return;
    }
    
    websocket.send(JSON.stringify(packet));
}

/*
 * Google Maps API utilities.
 */

/**
 * Creates a Google Maps map in the 'map' element.
 * @param {LatLng} position The position of the center.
 */
function createMap(position) {
    const mapElement = document.getElementById('map');
    map = new Map(mapElement, {
        zoom: 14, center: position,
        mapTypeId: MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControlOptions: {style: NavigationControlStyle.SMALL}
    });
}

/**
 * Create a marker for the map.
 * @param {LatLng} position The LatLng position of the marker.
 * @param {string} label The marker's label.
 */
function createMarker(position, label) {
    if(map === undefined) return;
    
    markers[label] = new Marker({
        position, label, map
    });
}

/**
 * Updates the position of a marker by label.
 * @param position The LatLng position of the marker.
 * @param label The marker's label.
 */
function updateMarker(position, label) {
    if(map === undefined) return;
    if(markers[label] === undefined) {
        createMarker(position, label); return;
    }
    
    markers[label].setPosition(position);
}

/**
 * Clear all markers from the map.
 */
function clearMarkers() {
    for(const marker in markers)
        markers[marker].setMap(null);
    markers = {}; // Clear the collection.
}