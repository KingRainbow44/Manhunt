import Client from "../client";
import {packetIds, LocationRequestNotify, RefreshMapRequest} from "../packets";

import {gameServer} from "../../socketServer";

/**
 * (no parameters)
 */
export default function (player: Client, packet: RefreshMapRequest) {
    const players: object = gameServer.getPlayers();
    for (const identifier in players)
        players[identifier].sendPacket(<LocationRequestNotify> {
            packetId: packetIds.LocationRequestNotify
        });
}