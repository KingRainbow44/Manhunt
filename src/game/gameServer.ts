import Client from "./client";
import Packet, {GameEventNotify, packetIds, reversedIds} from "./packets";

import {gameEvents, killReasons, roles} from "./constants";
import {length} from "../index";
import {gameServer} from "../socketServer";

export default class GameServer {
    readonly players: object = {};
    
    remainingRunners: number = 0;
    isInGame: boolean = false;

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
        this.broadcastPacket(<GameEventNotify> {
            packetId: packetIds.GameEventNotify,
            type: gameEvents.LEAVE_GAME,
            data: {username: target.getUsername(), reason}
        }, target);
        
        if(this.inGame() && --this.remainingRunners <= 0) {
            gameServer.setGameStatus(false);
            gameServer.broadcastPacket(<GameEventNotify> {
                packetId: packetIds.GameEventNotify,
                type: gameEvents.STOP_GAME,
                data: {}
            });
        }
    }

    /**
     * Broadcasts a packet to all players.
     * @param packet The packet to send.
     */
    broadcastPacket(packet: Packet, exceptTo: Client = undefined) {
        for(const player in this.players) {
            if(exceptTo != undefined && exceptTo.getIdentifier() != player)
                this.players[player].sendPacket(packet);
            else if(exceptTo == undefined)
                this.players[player].sendPacket(packet);
        }
    }

    /**
     * Returns the current game state.
     */
    inGame(): boolean {
        return this.isInGame;
    }

    /**
     * Sets the game state to in-game.
     * @param status The new game state.
     */
    setGameStatus(status: boolean) {
        this.isInGame = status;
        
        if(status)
            this.remainingRunners = length(this.getAllOf(roles.FUGITIVE));
    }
}