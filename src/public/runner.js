let taskId = undefined;

/**
 * Configures properties of the runner.
 */
function configureRunner() {
    
}

/**
 * Starts the events that allow the runner to run.
 */
function startRunning() {
    // Configure the position watcher.
    taskId = geolocation.watchPosition(handlePosition, () => console.warn('Failed to get position.'));
}

/**
 * Stops the events that allow the runner to run.
 */
function stopRunning() {
    geolocation.clearWatch(taskId);
}

/**
 * Broadcasts the current player's location to hunters.
 */
function broadcastLocation() {
    if(!geolocation) return;
    
    geolocation.getCurrentPosition(handlePosition,
        () => alert("Unable to get the current position."));
}

/**
 * The event handler for geolocation events.
 * @param {GeolocationPosition} position The position object.
 */
function handlePosition(position) {
    const coordinates = position.coords;
    const {latitude, longitude} = coordinates;

    // Send to server for processing.
    pushPacket({
        packetId: packetIds.LocationBroadcastNotify,
        longitude, latitude
    });
}