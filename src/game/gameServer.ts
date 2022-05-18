import Client from "./client";
import Packet, {reversedIds} from "./packets";

export default class GameServer {
    readonly players: object = {};

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
    }

    /**
     * Returns all players in the game.
     */
    getPlayers(): object {
        return this.players;
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
}