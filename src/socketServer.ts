import {RawData, Server, WebSocket} from "ws";
import {IncomingMessage} from "http";
import {readFileSync} from "fs";
import * as https from "https";

import Packet from "./game/packets";
import Client from "./game/client";
import GameServer from "./game/gameServer";

export const gameServer: GameServer = new GameServer();

const server: https.Server = https.createServer({
    cert: readFileSync(process.env["SSL-CERT"]),
    key: readFileSync(process.env["SSL-KEY"])
});
const socketServer: Server = new Server({ server });

socketServer.on('connection', connect);
server.listen(6369, () => {
    console.log("Server started on port 6369");
});

/**
 * Event handler for websocket connections.
 * @param socket The socket client.
 * @param request The request object.
 */
function connect(socket: WebSocket, request: IncomingMessage): void {
    const client: Client = new Client(socket);
    gameServer.addPlayer(client);
    
    console.info(`Player ${client.getIdentifier()} connected from ${request.socket.remoteAddress}.`);
    
    socket.on('message', data => message(client, data));
    socket.on('close', () => {
        gameServer.removePlayer(client);
        
        const username: string = client.getUsername();
        console.info(`Player ${username.length == 0 ? client.getIdentifier() : username} disconnected.`);
    });
}

/**
 * Event handler for websocket messages.
 * @param player The player sending the message.
 * @param data The message data.
 */
function message(player: Client, data: RawData): void {
    const message: string = String(data);
    const packet: Packet = JSON.parse(message);

    // Check if the packet is valid.
    if(packet.packetId == null)
        return;

    // Accept the packet if it is valid.
    gameServer.receivePacket(player, packet);
}
