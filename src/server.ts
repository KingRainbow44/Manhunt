import {address, apiKey} from "./index";
import express, {Express} from 'express';
import * as http from "http";
import * as https from "https";

import {readFileSync} from "fs";

const app: Express = express();

let server: http.Server;
if(process.env["SSL-KEY"] && process.env["SSL-CERT"]) {
    server = https.createServer({
        key: readFileSync(process.env["SSL-KEY"]),
        cert: readFileSync(process.env["SSL-CERT"])
    }, app);
} else {
    server = http.createServer(app);
}

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.all('/', (request, response) => {
    const responseOptions = {
        apiKey: apiKey, address: address,
        script: request.query.isAdmin ? '/public/admin.js' : ''
    }; response.render('index', responseOptions);
});
app.use('/public', express.static(`${__dirname}/public`));

server.listen(6287, () => {
    console.log('Server is listening on port 6287');
});