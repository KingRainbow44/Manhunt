let role = 0; // FUGITIVE

/**
 * Change the player's role.
 * @param newRole The role ID.
 */
function changeRole(newRole) {
    role = newRole;
    pushPacket({
        packetId: packetIds.GameEventNotify,
        type: 0, // SWITCH_ROLES
        data: {role: newRole}
    });
    
    if(role === 0) {
        stopHunting();
        configureRunner(); 
        startRunning();
    } else {
        stopRunning();
        configureHunter();
        startHunting();
    }

    alert("You are now a " + (role === 0 ? "runner" : "hunter") + "!");
}

/**
 * Set's the player's username and broadcasts it to the server.
 */
function join() {
    const usernameField = document.getElementById("username");
    username = usernameField.value;
    
    pushPacket({
        packetId: packetIds.GameEventNotify,
        type: 3, // JOIN_GAME
        data: {username}
    });
    
    hide('nameInput');
}

/**
 * Sends a message as the player.
 */
function sendMessage() {
    if(!username) return;
    
    const messageField = document.getElementById("chatInput");
    const message = messageField.value.trim();
    
    pushPacket({
        packetId: packetIds.MessageNotify, message
    });
    
    messageField.value = "";
}

/**
 * Pushes a message to the box.
 * @param {string} username The player who sent the message.
 * @param {string} message The message sent by the player.
 */
function handleMessage(username, message) {
    const text = `${username}: ${message}`;
    
    const boxElement = document.getElementById("chatContainer");
    boxElement.innerHTML += (text + "<br>");
}