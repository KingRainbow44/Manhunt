import "dotenv/config";

/* Define environment variables. */
export const apiKey = process.env["API-KEY"];
export const address = process.env["ADDRESS"];

/* Start the server. */
import "./server";
import "./socketServer";

/**
 * Get the length of an object.
 * @param object The object to get the length of.
 */
export function length(object: object): number {
    return Object.keys(object).length;
}