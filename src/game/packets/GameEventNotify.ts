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
            break;
        case gameEvents.SWITCH_ROLES:
            const role: number = data["role"];
            if(gameServer.inGame() && player.getRole() == roles.FUGITIVE && role == roles.HUNTER)
                gameServer.killPlayer(player, killReasons.CAPTURED);
            player.setRole(role);
            break;
        case gameEvents.JOIN_GAME:
            const username: string = data["username"];
            player.setUsername(username);
            break;
        case gameEvents.START_GAME:
        case gameEvents.STOP_GAME:
            gameServer.broadcastPacket(packet);
            gameServer.setGameStatus(!gameServer.inGame());
            break;
    }
}