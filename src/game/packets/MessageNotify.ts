import Client from "../client";
import {packetIds, MessageNotify} from "../packets";

import {gameServer} from "../../socketServer";

/**
 * @param message The message sent by the player.
 */
export default function (player: Client, packet: MessageNotify) {
    const players: object = gameServer.getPlayers();
    const {message} = packet;
    
    for (const identifier in players)
        players[identifier].sendPacket(<MessageNotify> {
            packetId: packetIds.MessageNotify,
            message, username: player.getUsername()
        });
}