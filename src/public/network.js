/** @type {WebSocket} */
let websocket = undefined;

/**
 * Creates a networking interface.
 * @param {string} address The address to connect to.
 */
function createInterface(address) {
    websocket = new WebSocket(address);
    websocket.onopen = () => console.info("Connected to server.");
    websocket.onclose = () => console.info("Disconnected from server.");
    websocket.onerror = (error) => console.error("An error occurred between the server and client.", error);
    websocket.onmessage = parseMessage;
}

/**
 * Called when the server sends a message.
 * @param {MessageEvent} message The message sent.
 */
function parseMessage(message) {
    const data = message.data;
    const packet = JSON.parse(data);
    
    if(debug) // Debug logging.
        console.debug("Packet received.", packet);
    
    switch(packet.packetId) {
        default:
            console.warn("Unknown packet received.", packet);
            return;
        case packetIds.LocationBroadcastNotify:
            if(role !== 1) return; // HUNTER
            
            if(packet.clear)
                clearMarkers();
            
            updateTarget(packet.username, packet);
            break;
        case packetIds.GameEventNotify:
            const {type, data} = packet;
            handleGameEvent(type, data);
            break;
        case packetIds.MessageNotify:
            const {username, message} = packet;
            handleMessage(username, message);
            break;
        case packetIds.LocationRequestNotify:
            if(role !== 0) return; // FUGITIVE
            broadcastLocation(); // Send the location.
            break;
    }
}

/**
 * Event handler for game events emitted by the server.
 * @param {number} type The event type.
 * @param {object} data The event data.
 */
function handleGameEvent(type, data) {
    switch(type) {
        default:
            return;
        case gameEvents.START_GAME:
            if(role === 0) 
                startRunning(); 
            else startHunting();
            
            alert('The game has started!');
            break;
        case gameEvents.STOP_GAME:
            if(role === 0)
                stopRunning();
            else stopHunting()
            
            alert('The game has ended!');
            break;
        case gameEvents.LEAVE_GAME:
            const {username, reason} = data; clearMarker(username.trim());
            alert(`${username} has ${reason === killReasons.LEFT ? 'left the game.' : 'been captured!'}`);
            break;
    }
}

const packetIds = {
    LocationBroadcastNotify: 0,
    GameEventNotify: 1,
    MessageNotify: 2,
    RefreshMapRequest: 3,
    LocationRequestNotify: 5
};

const gameEvents = {
    SWITCH_ROLES: 0,
    START_GAME: 1,
    STOP_GAME: 2,
    JOIN_GAME: 3,
    LEAVE_GAME: 4
};

const killReasons = {
    LEFT: 0,
    CAPTURED: 1
};