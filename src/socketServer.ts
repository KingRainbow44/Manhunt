import {RawData, Server, WebSocket} from "ws";
import Packet from "./game/packets";
import Client from "./game/client";
import GameServer from "./game/gameServer";
import {IncomingMessage} from "http";

export const gameServer: GameServer = new GameServer();
const server: Server = new Server({port: 6369}, () => {
    console.log("Server started on port 6369");
});

server.on('connection', connect);

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
