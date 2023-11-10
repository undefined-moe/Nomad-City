/* eslint-disable consistent-return */
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core';
import { buildingDeck, buildings } from '../common/building';
import { characters } from '../common/characters';
import { EventCards } from '../common/eventCards';
import {
    EventType, GameState, PlayerInfo, ResourceType,
} from '../common/interface';

export const GameInfo3 = {
    regions: ['A', 'B', 'C', 'D', 'E', 'F'],
    rooms: [
        'A01', 'A02', 'A03',
        'B01', 'B02', 'B03',
        'C01', 'C02', 'C03',
        'D01', 'D02', 'D03',
        'E01', 'E02', 'E03',
        'F01', 'F02', 'F03',
    ],
    nodes: [
        'A01-B01',
        // TODO
    ],
    eventType: {
        A01: EventType.Green,
        A02: EventType.Green,
        A03: EventType.Orange,
        B01: EventType.Green,
        B02: EventType.Green,
        B03: EventType.Orange,
        C01: EventType.Green,
        C02: EventType.Orange,
        C03: EventType.Orange,
        D01: EventType.Orange,
        D02: EventType.Orange,
        D03: EventType.Orange,
        E01: EventType.Orange,
        E02: EventType.Red,
        E03: EventType.Red,
        F01: EventType.Red,
        F02: EventType.Red,
        F03: EventType.Red,
    },
    controlScore: {
        A: 3,
        B: 3,
        C: 3,
        D: 3,
        E: 4,
        F: 4,
        R: 3,
    },
    resourceScore: {
        [ResourceType.Stone]: 9,
        [ResourceType.Iron]: 6,
        [ResourceType.Scrap]: 8,
    },
} as const;
export type RoomNames3 = typeof GameInfo3.rooms[number];
export type GameInfo3 = typeof GameInfo3;

function clone(i) {
    return JSON.parse(JSON.stringify(i));
}

function executeMoveOperation(G, playerID, events, source, target) {
    if (source.includes('-')) {
        const node = G.map.nodes[source as keyof typeof G.map.nodes];
        if (!node.workers.includes(playerID)) return INVALID_MOVE;
    } else {
        const room = G.map.rooms[source as keyof typeof G.map.rooms];
        if (!room.workers.includes(playerID)) return INVALID_MOVE;
    }
    if (target.includes('-')) {
        const node = G.map.nodes[target as keyof typeof G.map.nodes];
        if (node.workers[0] && node.workers[1]) return INVALID_MOVE;
        node.workers[node.workers[0] ? 1 : 0] = playerID;
    } else {
        const room = G.map.rooms[target as keyof typeof G.map.rooms];
        if (room.workers[0] && room.workers[1]) return INVALID_MOVE;
        if (!room.relatedCard?.type) return INVALID_MOVE;
        if (room.main && room.main !== playerID) return INVALID_MOVE;
        room.workers[room.workers[0] ? 1 : 0] = playerID;
    }
    if (source.includes('-')) {
        const node = G.map.nodes[source as keyof typeof G.map.nodes];
        node.workers[node.workers[0] ? 1 : 0] = undefined;
    } else {
        const room = G.map.rooms[source as keyof typeof G.map.rooms];
        room.workers[room.workers[0] ? 1 : 0] = undefined;
    }
}

const moves = {
    SelectChoice({ G, playerID }, choice: number) {
        if (!G.pendingCard) return INVALID_MOVE;
        const card = G.pendingCard;
        if (!card.choices[choice]) return INVALID_MOVE;
        card.selected = choice;
        const effect = card.choices[choice].effect;
        for (const [amount, type] of effect) {
            G.players[playerID].resources[type] += amount;
        }
        G.pendingCard = undefined;
    },
} satisfies Record<string, Move<GameState<GameInfo3>>>;

function isValidRoom(id: string): id is RoomNames3 {
    return GameInfo3.rooms.includes(id as RoomNames3);
}

const TheFounders3: Game<GameState<GameInfo3>> = {
    name: 'Founders',
    // playerView: PlayerView.STRIP_SECRETS,
    setup: ({ ctx, random }) => {
        console.log(ctx);
        const players: Record<string, PlayerInfo> = {};
        for (let i = 0; i < ctx.playOrder.length; i++) {
            players[ctx.playOrder[i]] = {
                name: ctx.playOrder[i],
                id: `${i}`,
                resources: {
                    Stone: 0,
                    Cash: i == 0 ? 10 : i == 1 ? 12 : 14,
                    Iron: 0,
                    Scrap: 0,
                },
                cards: [
                    clone(characters['坎诺特']),
                    clone(characters['锡人']),
                    clone(characters['极境']),
                    clone(characters['雷蛇']),
                    clone(characters['德克萨斯']),
                ],
                usedCards: [],
                buildings: [
                    [null, null, null],
                    [null, null, null],
                    [null, clone(buildings['核心指挥塔']), null],
                    [null, null, null],
                ],
            };
        }

        const building = random.Shuffle(clone(buildingDeck));
        const shownBuildings = [];
        for (let i = 1; i <= 6; i++) {
            shownBuildings.push(building.pop());
        }

        return {
            map: {
                rooms: Object.fromEntries(Object.values(GameInfo3.rooms).map((name) => ([name, {
                    main: 0,
                    resType: undefined,
                    workers: [undefined, undefined],
                }]))) as any,
                nodes: Object.fromEntries(Object.values(GameInfo3.nodes).map((name) => ([name, {
                    workers: [undefined, undefined],
                }]))) as any,
            },
            cards: {
                [EventType.Green]: random.Shuffle(clone(EventCards[EventType.Green])),
                [EventType.Orange]: random.Shuffle(clone(EventCards[EventType.Orange])),
                [EventType.Red]: random.Shuffle(clone(EventCards[EventType.Red])),
                building,
            },
            shownBuildings,
            players,
            texts: [],
            def: GameInfo3,
            turn: 0,
        };
    },

    phases: {
        setup: {
            start: true,
            next: 'pickCharacter',
            moves: {
                SelectArea({ G, playerID, events }, id) {
                    if (!(isValidRoom(id)) || G.map.rooms[id].main) return INVALID_MOVE;
                    if (G.def.eventType[id] === EventType.Red) return INVALID_MOVE;
                    G.map.rooms[id].main = playerID;
                    const card = G.cards[G.def.eventType[id]].pop();
                    G.map.rooms[id].relatedCard = card;
                    G.pendingCard = card;
                    if (id === 'B01') {
                        G.players[playerID].resources[ResourceType.Stone] += 2;
                        G.players[playerID].resources[ResourceType.Scrap] += 2;
                        G.players[playerID].resources[ResourceType.Iron] += 2;
                    }
                    events.setStage('cardChoice');
                },
            },
            turn: {
                order: TurnOrder.ONCE,
                stages: {
                    cardChoice: {
                        moves: {
                            SelectChoice({ G, playerID, events }, choice: number) {
                                if (!G.pendingCard) return INVALID_MOVE;
                                const card = G.pendingCard;
                                if (!card.choices[choice]) return INVALID_MOVE;
                                card.selected = choice;
                                const effect = card.choices[choice].effect;
                                for (const [amount, type] of effect) {
                                    G.players[playerID].resources[type] += amount;
                                }
                                G.pendingCard = undefined;
                                events.endTurn();
                            },
                        },
                    },
                },
            },
        },
        pickCharacter: {
            next: 'action',
            onBegin: ({ G }) => {
                for (const p in G.players) {
                    if (!G.players[p].cards.length) {
                        G.players[p].cards = G.players[p].usedCards;
                        G.players[p].usedCards = [];
                    }
                    G.turn++;
                }
            },
            moves: {
                PickCharacter({ G, playerID, events }, index: number) {
                    if (!G.players[playerID].cards[index]) return INVALID_MOVE;
                    const card = G.players[playerID].cards.splice(index, 1)[0];
                    G.players[playerID].activeCharacter = card;
                    events.endTurn();
                },
            },
            turn: { order: TurnOrder.ONCE },
        },
        action: {
            next: 'harvest',
            moves: {
                Deploy({ G, playerID, events }, target: string) {
                    const node = isValidRoom(target) ? G.map.rooms[target] : G.map.nodes[target as keyof typeof G.map.nodes];
                    if (node.workers[0] && node.workers[1]) return INVALID_MOVE;
                    if (isValidRoom(target)) {
                        if (!G.map.rooms[target].relatedCard?.type) return INVALID_MOVE;
                        if (G.map.rooms[target].main && G.map.rooms[target].main !== playerID) return INVALID_MOVE;
                    }
                    node.workers[node.workers[0] ? 1 : 0] = playerID;
                    events.setStage('quickAction');
                },
                Move({ G, playerID, events }, source: string, target: string) {
                    const result = executeMoveOperation(G, playerID, events, source, target);
                    if (result === INVALID_MOVE) return result;
                    events.setStage('secondMove');
                },
                Explore({ G, events }, target: string) {
                    if (!isValidRoom(target)) return INVALID_MOVE;
                    const room = G.map.rooms[target];
                    if (room.main || room.relatedCard) return INVALID_MOVE;
                    // TODO route planning and fee
                    if (GameInfo3.eventType[target] === EventType.Red && G.turn <= 4) return INVALID_MOVE;
                    const card = G.cards[GameInfo3.eventType[target]].pop();
                    room.relatedCard = card;
                    G.pendingCard = card;
                    events.setStage('cardChoice');
                },
                CityMove({ G, events, playerID }, target: string) {
                    if (!isValidRoom(target)) return INVALID_MOVE;
                    const room = G.map.rooms[target];
                    if (G.players[playerID].resources[ResourceType.Scrap] < 3) return INVALID_MOVE;
                    if (room.main) return INVALID_MOVE;
                    const currentPos = Object.entries(G.map.rooms).find(([, v]) => v.main === playerID)![0] as RoomNames3;
                    let route = '';
                    for (const key in G.map.nodes) {
                        if (key.includes(target) && key.includes(currentPos)) route = key;
                    }
                    if (!route) return INVALID_MOVE;
                    if (GameInfo3.eventType[target] === EventType.Red && G.turn <= 4) return INVALID_MOVE;
                    const c = G.map.rooms[currentPos];
                    c.main = undefined;
                    c.workers[c.workers[0] ? 1 : 0] = playerID;
                    G.map.rooms[target].main = playerID;
                    G.map.rooms[target].workers = [undefined, undefined];
                    G.map.nodes[route].workers = [undefined, undefined];
                    G.players[playerID].resources[ResourceType.Scrap] -= 3;
                    if (!G.map.rooms[target].relatedCard) {
                        const card = G.cards[GameInfo3.eventType[target]].pop();
                        room.relatedCard = card;
                        G.pendingCard = card;
                        events.setStage('cardChoice');
                    } else events.setStage('quickAction');
                },
                Build() { },
                Special() { },
            },
            turn: {
                order: TurnOrder.CUSTOM(['0', '1', '2', '0', '1', '2']),
                maxMoves: 1,
                stages: {
                    quickAction: {
                        moves: {
                            CharacterCard() { },
                            CityStyle() { },
                            Abort({ events }) {
                                events.endTurn();
                            },
                        },
                    },
                    secondMove: {
                        moves: {
                            Move({ G, playerID, events }, source: string, target: string) {
                                const result = executeMoveOperation(G, playerID, events, source, target);
                                if (result === INVALID_MOVE) return result;
                                events.setStage('quickAction');
                            },
                        },
                    },
                    cardChoice: {
                        moves: {
                            SelectChoice: moves.SelectChoice,
                        },
                        next: 'quickAction',
                    },
                },
            },
        },
        end: {},
    },

    endIf: ({ G }) => {
        // TODO calculate game score
    },
};

export default TheFounders3;
