import Client from "../client";
import {GameEventNotify} from "../packets";

import {gameEvents, killReasons, roles} from "../constants";
import {gameServer} from "../../socketServer";

/**
 * @param {number} type The game event type.
 * @param {object} data The game event data.
 */
export default function (player: Client, packet: GameEventNotify) {
    let data: object = packet.data;
    switch(packet.type) {
        default:
            const players: object = gameServer.getPlayers();
            for (const identifier in players)
                player.getIdentifier() != identifier && players[identifier].sendPacket(packet);
            break;
        case gameEvents.SWITCH_ROLES:
            const role: number = data["role"];
            if(player.getRole() == roles.FUGITIVE && role == roles.HUNTER)
                gameServer.killPlayer(player, killReasons.CAPTURED);
            player.setRole(role);
            break;
        case gameEvents.JOIN_GAME:
            const username: string = data["username"];
            player.setUsername(username);
            break;
    }
}