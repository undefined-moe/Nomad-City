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
        'A01-A02',
        'A01-B01',
        'A01-B01',
        'A01-D01',
        'A02-B01',
        'A02-B02',
        'A02-A03-B03',
        'A03-D01-D02-D03',
        'B01-B02-C01',
        'B02-B03-C01-C02',
        'B03-D03-E01',
        'C02-C03',
        'C02-E01',
        'C03-E01',
        'C03-E02-E03',
        'D02-D03-F02',
        'D02-F01',
        'E01-E02-F02',
        'E03-F02-F03',
        'F01-F02',
        'F01-F03',
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
export type NodeNames3 = typeof GameInfo3.nodes[number];
export type GameInfo3 = typeof GameInfo3;

function clone<T>(i: T): T {
    return JSON.parse(JSON.stringify(i));
}

function executeMoveOperation(G, playerID, source, target) {
    const sourceInfo = source.split('-');
    const sourceIndex = +sourceInfo.pop();
    const sourceId = sourceInfo.join('-');
    const targetInfo = target.split('-');
    const targetIndex = +targetInfo.pop();
    const targetId = targetInfo.join('-');
    const sourceItem = sourceId.includes('-') ? G.map.nodes[sourceId] : G.map.rooms[sourceId];
    const targetItem = targetId.includes('-') ? G.map.nodes[targetId] : G.map.rooms[targetId];
    if (!sourceItem || !targetItem || [sourceIndex, targetIndex].every((i) => [0, 1].includes(i))) return INVALID_MOVE;
    if (sourceItem.workers[sourceIndex] !== playerID) return INVALID_MOVE;
    if (targetItem.workers[targetIndex]) return INVALID_MOVE;
    if (targetId.includes('-')) {
        if (targetId.split('-').length === 2 && targetIndex === 1) return INVALID_MOVE;
    } else {
        const room = G.map.rooms[target as keyof typeof G.map.rooms];
        if (!room.relatedCard?.type) return INVALID_MOVE;
        if (room.main && room.main !== playerID) return INVALID_MOVE;
    }
    targetItem.workers[targetIndex] = playerID;
    sourceItem.workers[sourceIndex] = undefined;
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
                score: 0,
                resources: {
                    Stone: 0,
                    Cash: i === 0 ? 10 : i === 1 ? 12 : 14,
                    Iron: 0,
                    Scrap: 0,
                    Crystal: 0,
                },
                stageQueue: [],
                cards: [
                    clone(characters['坎诺特']),
                    clone(characters['锡人']),
                    clone(characters['极境']),
                    clone(characters['雷蛇']),
                    clone(characters['德克萨斯']),
                ],
                usedCards: [],
                buildings: [
                    [undefined, undefined, undefined],
                    [undefined, undefined, undefined],
                    [undefined, clone(buildings['核心指挥塔']), undefined],
                    [undefined, undefined, undefined],
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
            turn: {
                order: TurnOrder.ONCE,
                onBegin: ({ G }) => {
                    for (const p in G.players) {
                        if (!G.players[p].cards.length) {
                            G.players[p].cards = G.players[p].usedCards;
                            G.players[p].usedCards = [];
                        }
                        console.log('pick');
                        G.turn++;
                    }
                },
                activePlayers: {
                    all: {
                        stage: 'pickCharacter',
                        maxMoves: 1,
                    },
                },
                stages: {
                    pickCharacter: {
                        moves: {
                            PickCharacter({ G, playerID, events }, index: number) {
                                if (!G.players[playerID].cards[index]) return INVALID_MOVE;
                                const card = G.players[playerID].cards.splice(index, 1)[0];
                                G.players[playerID].activeCharacter = card;
                                G.players[playerID].stageQueue = ['mainAction'];
                                if (Object.values(G.players).every((p) => p.activeCharacter)) {
                                    events.endPhase();
                                }
                            },
                        },
                    },
                },
            },
        },
        action: {
            next: 'harvest',
            moves: {
                SetQuickAction({ G, events, playerID }, a: boolean) {
                    if (a) G.players[playerID].stageQueue.unshift('quickAction');
                    events.setStage(G.players[playerID].stageQueue.shift() || 'quickAction');
                },
            },
            turn: {
                order: TurnOrder.CUSTOM(['0', '1', '2', '0', '1', '2']),
                onMove: ({ G, events, playerID }) => {
                    if (G.players[playerID].currentStage === 'quickAction') return;
                    const next = G.players[playerID].stageQueue.shift();
                    if (!next) return events.endTurn();
                    console.log(`to ${next}`);
                    G.players[playerID].currentStage = next;
                    events.setStage(next);
                },
                onBegin: ({ G }) => {
                    console.log('turn.onbegin');
                    for (const p in G.players) {
                        G.players[p].stageQueue = ['mainAction', 'quickAction'];
                        G.players[p].currentStage = 'quickAction';
                    }
                },
                activePlayers: {
                    currentPlayer: {
                        stage: 'quickAction',
                    },
                },
                stages: {
                    mainAction: {
                        moves: {
                            Deploy({ G, playerID }, target: string) {
                                const node = isValidRoom(target) ? G.map.rooms[target] : G.map.nodes[target as keyof typeof G.map.nodes];
                                if (node.workers[0] && node.workers[1]) return INVALID_MOVE;
                                if (isValidRoom(target)) {
                                    if (!G.map.rooms[target].relatedCard?.type) return INVALID_MOVE;
                                    if (G.map.rooms[target].main && G.map.rooms[target].main !== playerID) return INVALID_MOVE;
                                }
                                node.workers[node.workers[0] ? 1 : 0] = playerID;
                            },
                            Move({ G, playerID }, source: string, target: string) {
                                const result = executeMoveOperation(G, playerID, source, target);
                                if (result === INVALID_MOVE) return result;
                                G.players[playerID].stageQueue.unshift('secondMove');
                            },
                            Explore({ G, playerID, events }, target: string) {
                                if (!isValidRoom(target)) return INVALID_MOVE;
                                const room = G.map.rooms[target];
                                if (room.main || room.relatedCard) return INVALID_MOVE;
                                // TODO route planning and fee
                                if (G.def.eventType[target] === EventType.Red && G.turn <= 4) return INVALID_MOVE;
                                const card = G.cards[G.def.eventType[target]].pop();
                                room.relatedCard = card;
                                G.pendingCard = card;
                            },
                            CityMove({ G, playerID }, target: string) {
                                if (!isValidRoom(target)) return INVALID_MOVE;
                                const room = G.map.rooms[target];
                                if (G.players[playerID].resources[ResourceType.Crystal] < 3) return INVALID_MOVE;
                                if (room.main) return INVALID_MOVE;
                                const currentPos = Object.entries(G.map.rooms).find(([, v]) => v.main === playerID)![0] as RoomNames3;
                                let route: NodeNames3 | null = null;
                                for (const key of G.def.nodes) {
                                    if (key.includes(target) && key.includes(currentPos)) route = key;
                                }
                                if (!route) return INVALID_MOVE;
                                if (G.def.eventType[target] === EventType.Red && G.turn <= 4) return INVALID_MOVE;
                                const c = G.map.rooms[currentPos];
                                c.main = undefined;
                                c.workers[c.workers[0] ? 1 : 0] = playerID;
                                G.map.rooms[target].main = playerID;
                                G.map.rooms[target].workers = [undefined, undefined];
                                G.map.nodes[route].workers = [undefined, undefined];
                                G.players[playerID].resources[ResourceType.Crystal] -= 3;
                                if (!G.map.rooms[target].relatedCard) {
                                    const card = G.cards[G.def.eventType[target]].pop();
                                    room.relatedCard = card;
                                    G.pendingCard = card;
                                    G.players[playerID].stageQueue.unshift('cardChoice');
                                }
                            },
                            Build({ G, playerID }, target: number, payment: number) {
                                const card = G.shownBuildings[target];
                                if (!card) return INVALID_MOVE;
                                const paymentRequireMents = card.cost[payment];
                                if (!paymentRequireMents) return INVALID_MOVE;
                                // TODO calc special price
                                for (const [amount, type] of paymentRequireMents) {
                                    if (G.players[playerID].resources[type] < amount) return INVALID_MOVE;
                                }
                                for (const [amount, type] of paymentRequireMents) {
                                    G.players[playerID].resources[type] -= amount;
                                }
                                G.pendingBuilding = card;
                                G.shownBuildings[target] = G.cards.building.pop();
                                G.players[playerID].stageQueue.unshift('placeBuilding');
                            },
                            Special() { },
                        },
                    },
                    quickAction: {
                        moves: {
                            CharacterCard() { },
                            CityStyle() { },
                            Abort({ G, playerID }) {
                                G.players[playerID].currentStage = '';
                            },
                        },
                    },
                    secondMove: {
                        moves: {
                            Move({ G, playerID }, source: string, target: string) {
                                return executeMoveOperation(G, playerID, source, target);
                            },
                        },
                    },
                    cardChoice: {
                        moves: {
                            SelectChoice: moves.SelectChoice,
                        },
                    },
                    placeBuilding: {
                        moves: {
                            PlaceBuilding({ G, playerID }, x: number, y: number) {
                                if (x < 0 || x > 3 || y < 0 || y > 2) return INVALID_MOVE;
                                if (G.players[playerID].buildings[x][y]) return INVALID_MOVE;
                                G.players[playerID].buildings[x][y] = G.pendingBuilding;
                                delete G.pendingBuilding;
                                // TOOD process building onBuild Effect
                            },
                        },
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
