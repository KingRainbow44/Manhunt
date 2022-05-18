$(document).ready(() => {
    // Reveal the admin UI.
    show('admin');
});

/**
 * Called when the user wants to start the game.
 */
function startGame() {
    pushPacket({
        packetId: packetIds.GameEventNotify,
        type: gameEvents.START_GAME
    });
}

/**
 * Called when the user wants to end the game.
 */
function endGame() {
    pushPacket({
        packetId: packetIds.GameEventNotify,
        type: gameEvents.STOP_GAME
    });
}