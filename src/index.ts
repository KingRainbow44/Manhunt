import "dotenv/config";

/* Define environment variables. */
export const apiKey = process.env["API-KEY"];
export const address = process.env["ADDRESS"];

/* Start the server. */
import "./server";
import "./socketServer";