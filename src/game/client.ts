import {WebSocket} from "ws";
import Packet from "./packets";

import {randomUUID} from "crypto";

import {roles} from "./constants";

export class GameData {
    private role: number = roles.FUGITIVE;
    private username: string = "Someone";

    /**
     * Returns the player's role in the game.
     */
    getRole(): number {
        return this.role;
    }
    
    /**
     * Sets the player's game role.
     */
    setRole(role: number) {
        this.role = role;
    }

    /**
     * Returns the player's username.
     */
    getUsername(): string {
        return this.username;
    }

    /**
     * Sets the player's username.
     */
    setUsername(username: string) {
        this.username = username;
    }
}

export default class Client extends GameData {
    private readonly socket: WebSocket;
    private readonly identifier: string;
    
    constructor(socket: WebSocket) {
        super();
        
        this.socket = socket;
        this.identifier = randomUUID();
    }

    /**
     * Returns the player's unique identifier.
     */
    getIdentifier(): string {
        return this.identifier;
    }

    /**
     * Sends a packet to the player.
     * @param packet The packet object.
     */
    sendPacket(packet: Packet) {
        this.socket.send(JSON.stringify(packet));
    }
}