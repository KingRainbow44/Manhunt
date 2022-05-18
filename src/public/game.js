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