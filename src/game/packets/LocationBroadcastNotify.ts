import Client from "../client";
import {packetIds, LocationBroadcastNotify} from "../packets";

import {gameServer} from "../../socketServer";
import {roles} from "../constants";

/**
 * @param longitude The player's longitude.
 * @param latitude The player's latitude.
 */
export default function (player: Client, packet: LocationBroadcastNotify) {
    const {longitude, latitude} = packet;
    const locationPacket: LocationBroadcastNotify = {
        packetId: packetIds.LocationBroadcastNotify,
        username: player.getUsername(),
        longitude, latitude
    };
    
    const players: object = gameServer.getPlayers();
    for (const identifier in players) {
        const client: Client = players[identifier];
        if(client.getRole() != roles.HUNTER) continue;
        
        client.sendPacket(locationPacket);
    }
}