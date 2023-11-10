import './lobby.css';

import { Lobby } from 'boardgame.io/react';
import { default as BoardFounders3 } from '../3p/board';
import { default as GameFounders3 } from '../3p/game';

GameFounders3.minPlayers = 3;
GameFounders3.maxPlayers = 3;

const hostname = window.location.hostname;
const importedGames = [
    { game: GameFounders3, board: BoardFounders3 },
];

const LobbyView = () => (
    <div style={{ padding: 50 }}>
        <h1>Lobby</h1>
        <Lobby
            gameServer={`http://${hostname}:8011`}
            lobbyServer={`http://${hostname}:8011`}
            gameComponents={importedGames}
        />
    </div>
);

export default LobbyView;
