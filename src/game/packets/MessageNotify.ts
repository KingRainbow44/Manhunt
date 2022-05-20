import Client from "../client";
import {packetIds, MessageNotify} from "../packets";

import {gameServer} from "../../socketServer";

/**
 * @param message The message sent by the player.
 */
export default function (player: Client, packet: MessageNotify) {
    const players: object = gameServer.getPlayers();
    const {message} = packet;
    
    if(message.startsWith("/")) { // Command processing.
        const command = message.split(" ")[0].substring(1);
        const args = message.split(" ").slice(1);
        switch(command) {
            case "players":
                let playerList: string = 'Currently, ';
                for(const key in players) {
                    playerList += players[key].getUsername() + ', ';
                } playerList += 'are online.';
                
                player.sendPacket(<MessageNotify> {
                    packetId: packetIds.MessageNotify,
                    message: playerList,
                    username: 'Server'
                });
                break;
        } return;
    }
    
    for (const identifier in players)
        players[identifier].sendPacket(<MessageNotify> {
            packetId: packetIds.MessageNotify,
            message, username: player.getUsername()
        });
}