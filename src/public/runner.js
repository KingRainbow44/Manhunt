function getLocation() {
    const geolocation = navigator.geolocation;
    if(!geolocation) {
        alert('Location not supported.'); return;
    }
    
    geolocation.getCurrentPosition(handlePosition, () => alert('Unable to get location.'));
}

/**
 * @param {GeolocationPosition} position
 */
function handlePosition(position) {
    const coordinates = position.coords;
    const {latitude, longitude} = coordinates;
    
    
    
    // TODO: Send to websocket server.
}