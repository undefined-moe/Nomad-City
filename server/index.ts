import { Origins, Server } from 'boardgame.io/server';
import TheFounders3 from '../src/3p/game';

const server = Server({
    games: [TheFounders3],
    origins: [Origins.LOCALHOST],
});

server.run(8011);
