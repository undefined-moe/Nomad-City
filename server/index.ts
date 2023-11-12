import path from 'path';
import { FlatFile, Origins, Server } from 'boardgame.io/server';
import TheFounders3 from '../src/3p/game';

const server = Server({
    games: [TheFounders3],
    origins: [Origins.LOCALHOST],
    db: new FlatFile({
        dir: path.join(__dirname, '..', '__storage'),
        logging: false,
    }),
});

server.run(8011);
