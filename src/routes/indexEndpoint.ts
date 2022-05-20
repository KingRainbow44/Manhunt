import {Request, Response} from "express";
import {address, apiKey, length} from "../index";

import {gameServer} from "../socketServer";
import {roles} from "../game/constants";

/**
 * @route /
 * @param isAdmin Defines if the user is an administrator.
 */
export function index(request: Request, response: Response) {
    const players = gameServer.getPlayers();
    const runners = gameServer.getAllOf(roles.FUGITIVE);
    
    const playing = length(players); const running = length(runners);
    
    const responseOptions = {
        apiKey: apiKey, address: address,
        script: request.query.isAdmin ? '/public/admin.js' : '',
        color: (playing - running) < running ? '#3492eb' : '#eb6e34',
        playerCount: playing
    }; 
    
    response.render('index', responseOptions);
}