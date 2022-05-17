import express, {Express} from 'express';
import {createServer, Server} from "http";

const app: Express = express();
const server: Server = createServer(app);

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.all('/', (request, response) => response.render('index'));
app.use('/public', express.static(`${__dirname}/public`));

server.listen(6287, () => {
    console.log('Server is listening on port 6287');
});