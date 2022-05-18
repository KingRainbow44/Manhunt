export const gameEvents = {
    SWITCH_ROLES: 0,
    START_GAME: 1,
    STOP_GAME: 2,
    JOIN_GAME: 3
};

export const roles = {
    FUGITIVE: 0,
    HUNTER: 1
};

export interface RoleSwitchData {
    role: number;
}