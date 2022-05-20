import Client from "./client";
import Packet, {GameEventNotify, packetIds, reversedIds} from "./packets";

import {gameEvents, killReasons, roles} from "./constants";

export default class GameServer {
    readonly players: object = {};
    
    remainingRunners: number = 0;

    /**
     * Called when the player opens the game window.
     * @param player The player who joined.
     */
    addPlayer(player: Client) {
        this.players[player.getIdentifier()] = player;
    }

    /**
     * Called when a player disconnects from the socket.
     * @param player The player to remove.
     */
    removePlayer(player: Client) {
        delete this.players[player.getIdentifier()];
        this.killPlayer(player, killReasons.LEFT);
    }

    /**
     * Returns all players in the game.
     */
    getPlayers(): object {
        return this.players;
    }

    /**
     * Returns all of a certain type of player in the game.
     * @param type The type of player to look for.
     */
    getAllOf(type: number): object {
        const players = {};
        for(const player in this.players) {
            if(this.players[player].getRole() === type)
                players[player] = this.players[player];
        } return players;
    }

    /**
     * Handle a received packet from the client.
     * @param player The player who sent the packet.
     * @param packet The packet data.
     */
    receivePacket(player: Client, packet: Packet) {
        try {
            const packetName: string = reversedIds[packet.packetId];
            const handler = require(`./packets/${packetName}`);
            handler.default(player, packet);
        } catch { }
    }

    /**
     * Alerts hunters a player has been removed and updates the remaining runners.
     * @param target The player who has been removed.
     * @param reason The reason for removal.
     */
    killPlayer(target: Client, reason: number) {
        const players = this.players;
        for (const player in players) {
            players[player].sendPacket(<GameEventNotify> {
                packetId: packetIds.GameEventNotify,
                type: gameEvents.LEAVE_GAME,
                data: {username: target.getUsername(), reason}
            });
        }
    }
}