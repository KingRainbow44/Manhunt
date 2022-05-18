import Client from "../client";
import {GameEventNotify} from "../packets";

import {gameEvents} from "../constants";

/**
 * @param {number} type The game event type.
 * @param {object} data The game event data.
 */
export default function (player: Client, packet: GameEventNotify) {
    let data: object = packet.data;
    switch(packet.type) {
        default:
            return;
        case gameEvents.SWITCH_ROLES:
            const role: number = data["role"];
            player.setRole(role);
            break;
        case gameEvents.JOIN_GAME:
            const username: string = data["username"];
            player.setUsername(username);
            break;
    }
}