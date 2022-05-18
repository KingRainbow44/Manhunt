export default interface Packet {
    packetId: number;
}

export interface LocationBroadcastNotify extends Packet {
    clear?: boolean;
    username?: string;
    
    longitude?: number;
    latitude?: number;
}

export interface GameEventNotify extends Packet {
    type: number;
    data: object;
}

export interface MessageNotify extends Packet {
    message: string;
}

export interface RefreshMapRequest extends Packet {
    
}

export interface LocationRequestNotify extends Packet {
    
}

export const packetIds = {
    LocationBroadcastNotify: 0,
    GameEventNotify: 1,
    MessageNotify: 2,
    RefreshMapRequest: 3,
    LocationRequestNotify: 5
};

export const reversedIds = (() => {
    const reversed = {};
    for(const key in packetIds)
        reversed[packetIds[key]] = key;
    return reversed;
})();