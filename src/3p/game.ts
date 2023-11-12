/* eslint-disable consistent-return */
import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core';
import {
    buildingDeck, buildings,
} from '../common/building';
import { characters } from '../common/characters';
import { EventCards } from '../common/eventCards';
import {
    Effects, EffectType, EventType, GameState, PlayerInfo, ResourceType,
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
        [ResourceType.Crystal]: 1,
    },
} as const;
export type RoomNames3 = typeof GameInfo3.rooms[number];
export type NodeNames3 = typeof GameInfo3.nodes[number];
export type GameInfo3 = typeof GameInfo3;

function clone<T>(i: T): T {
    return JSON.parse(JSON.stringify(i));
}
function isValidRoom(id: string): id is RoomNames3 {
    return GameInfo3.rooms.includes(id as RoomNames3);
}
function isResource(type: string): type is ResourceType {
    return Object.values(ResourceType).includes(type as ResourceType);
}
function parseWorkerName(name: string): [string, number] {
    const info = name.split('-');
    const idx = +(info.pop() || 0);
    const id = info.join('-');
    return [id, idx];
}
function getWorkerNode(G: GameState<GameInfo3>, target: string) {
    const [id, idx] = parseWorkerName(target);
    const item = isValidRoom(id) ? G.map.rooms[id] : G.map.nodes[id];
    return [item, idx, id] as const;
}
function getReachableRooms(source: RoomNames3, nodes: string[]) {
    const unused = new Set(nodes);
    const reachable = new Set<RoomNames3>([source]);
    let newNode = true;
    while (newNode) {
        newNode = false;
        for (const node of unused) {
            const [id] = parseWorkerName(node);
            if (isValidRoom(id)) return INVALID_MOVE; // only accept nodes as route
            if (Array.from(reachable).some((i) => i.includes(i))) {
                for (const r of id.split('-')) reachable.add(r as RoomNames3);
                unused.delete(node);
                newNode = true;
            }
        }
    }
    return reachable;
}

function processEffect(G: GameState<GameInfo3>, playerID: string, effect: Effects) {
    const buildingMap = G.players[playerID].buildings;
    for (const [amount, type] of effect) {
        if (isResource(type)) {
            if (amount < 0 && G.players[playerID].resources[type] < -amount) return INVALID_MOVE;
            G.players[playerID].resources[type] += amount;
        } else if ([
            EffectType.Move, EffectType.Replace,
            EffectType.Remove, EffectType.Explore,
            EffectType.Build, EffectType.Deploy,
        ].includes(type)) {
            for (let i = 1; i <= amount; i++) G.stageQueue.unshift(type);
        } else if (type === EffectType.CityMove) {
            G.advancedCityMove = true;
            G.stageQueue.unshift(type);
        } else if (type === EffectType.BuildExpanding) {
            G.pendingBuilding = buildings['延伸枢纽'];
            G.stageQueue.unshift('placeBuilding');
        } else if (type === EffectType.Claim) {
            let tot = 0;
            if (buildingMap[1][1]) tot += 4;
            if (buildingMap[2][0]) tot += 4;
            if (buildingMap[2][2]) tot += 4;
            if (buildingMap[3][1]) tot += 4;
            G.players[playerID].resources[ResourceType.Cash] += tot;
        } else if (type === EffectType.Harvest) {
            const room = Object.entries(G.map.rooms).find(([, v]) => v.main === playerID)![0] as RoomNames3;
            let list = [room];
            for (const key of G.def.rooms) {
                if (G.def.nodes.some((i) => i.includes(key) && i.includes(room))) list.push(key as RoomNames3);
            }
            list = list.filter((i) => G.map.rooms[i].relatedCard?.type);
            if (list.length > 4) list.length = 4;
            for (const r of list) {
                G.players[playerID].resources[G.map.rooms[r].relatedCard!.type!] += 1;
            }
        } else if (type === EffectType.Score) {
            G.players[playerID].score += amount;
        } else if ([EffectType.OthersAddIron, EffectType.OthersAddStone].includes(type)) {
            const map: Partial<Record<EffectType, ResourceType>> = {
                [EffectType.OthersAddIron]: ResourceType.Iron,
                [EffectType.OthersAddStone]: ResourceType.Stone,
            };
            for (const p in G.players) {
                if (p !== playerID) G.players[p].resources[map[type]!] += amount;
            }
        } else if (type === EffectType.Trigger) {
            G.stageQueue.unshift('selectBuilding');
        } else if (type === EffectType.PendingRemove) {
            G.players[playerID].endStageQueue.push('Remove');
        } else {
            console.log('unknown effect type:', type);
        }
    }
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
                endStageQueue: [],
            };
        }

        const building = random.Shuffle(clone(buildingDeck));
        const shownBuildings = [];
        for (let i = 1; i <= 6; i++) {
            shownBuildings.push(building.pop());
        }

        return {
            allowGodMode: true,
            turnBegin: 0,
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
            stageQueue: [],
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
                        G.count = 6;
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
                                G.players[playerID].harvest = false;
                                G.stageQueue = ['mainAction'];
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
                _godMode({ G }) {
                    if (!G.allowGodMode) return INVALID_MOVE;
                    G.stageQueue.unshift('godMode');
                },
            },
            turn: {
                order: {
                    first: ({ G }) => {
                        G.turnBegin++;
                        return G.turnBegin - 1;
                    },
                    next: ({ G, ctx }) => {
                        if (!G.count) return undefined;
                        G.count--;
                        return (ctx.playOrderPos + 1) % ctx.numPlayers;
                    },
                },
                onMove: ({ G, events }) => {
                    if (G.currentStage === 'quickAction') return;
                    if (G.currentStage === 'godMode') return;
                    const next = G.stageQueue.shift();
                    if (!next) return events.endTurn();
                    console.log(`to ${next}`);
                    G.currentStage = next;
                    events.setStage(next);
                },
                onBegin: ({ G }) => {
                    console.log('turn.onbegin');
                    G.stageQueue = ['mainAction', 'quickAction'];
                    G.currentStage = 'quickAction';
                },
                activePlayers: {
                    currentPlayer: {
                        stage: 'quickAction',
                    },
                },
                stages: {
                    mainAction: {
                        moves: {
                            gotoDeploy({ G }) {
                                G.stageQueue.unshift('Deploy');
                            },
                            gotoMove({ G }) {
                                G.stageQueue.unshift('Move', 'Move');
                            },
                            gotoCityMove({ G }) {
                                G.stageQueue.unshift('CityMove');
                            },
                            gotoBuild({ G }) {
                                G.stageQueue.unshift('Build');
                            },
                            gotoExplore({ G }) {
                                G.stageQueue.unshift('Explore');
                            },
                            Special() { },
                        },
                    },
                    quickAction: {
                        moves: {
                            CharacterCard({ G, playerID }, type: number, index: number = 0) {
                                const card = G.players[playerID].activeCharacter;
                                if (!card) return INVALID_MOVE;
                                if (G.effectUsed === type) return INVALID_MOVE;
                                G.stageQueue.unshift('quickAction');
                                if (processEffect(G, playerID, card[type === 0 ? '策略' : '计谋'][index]) === INVALID_MOVE) {
                                    G.stageQueue.shift();
                                    return INVALID_MOVE;
                                }
                                G.effectUsed = type;
                                G.currentStage = '';
                            },
                            CityStyle() { },
                            Abort({ G }) {
                                G.currentStage = '';
                            },
                        },
                    },
                    Deploy: {
                        moves: {
                            Deploy({ G, playerID }, target: string) {
                                const [item, idx, id] = getWorkerNode(G, target);
                                if (isValidRoom(id)) {
                                    if (!G.map.rooms[id].relatedCard?.type) return INVALID_MOVE;
                                    if (G.map.rooms[id].main && G.map.rooms[id].main !== playerID) return INVALID_MOVE;
                                }
                                if (item.workers[idx]) return INVALID_MOVE;
                                item.workers[idx] = playerID;
                            },
                            Cancel() { },
                        },
                    },
                    Move: {
                        moves: {
                            Move({ G, playerID }, source: string, target: string) {
                                const [sourceItem, sourceIndex] = getWorkerNode(G, source);
                                const [targetItem, targetIndex, targetId] = getWorkerNode(G, target);
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
                            },
                            Cancel() { },
                        },
                    },
                    Remove: {
                        moves: {
                            Remove({ G, playerID }, target: string) {
                                const [item, idx] = getWorkerNode(G, target);
                                if (!item) return INVALID_MOVE;
                                if (!item.workers[idx] || item.workers[idx] === playerID) return INVALID_MOVE;
                                item.workers[idx] = undefined;
                            },
                            Cancel() { },
                        },
                    },
                    Replace: {
                        moves: {
                            Replace({ G, playerID }, target: string) {
                                const [item, idx] = getWorkerNode(G, target);
                                if (!item) return INVALID_MOVE;
                                if (!item.workers[idx]) return INVALID_MOVE;
                                item.workers[idx] = playerID;
                            },
                            Cancel() { },
                        },
                    },
                    CityMove: {
                        moves: {
                            CityMove({ G, playerID }, target: string) {
                                if (!isValidRoom(target)) return INVALID_MOVE;
                                const room = G.map.rooms[target];
                                const resources = G.players[playerID].resources;
                                const cheapMove = G.players[playerID].buildings.flat().some((i) => i?.name === '改良动力燃烧室');
                                if (!G.advancedCityMove) {
                                    if (cheapMove && resources[ResourceType.Scrap] < 2) return INVALID_MOVE;
                                    if (!cheapMove && resources[ResourceType.Crystal] < 3) return INVALID_MOVE;
                                }
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
                                G.map.nodes[route].workers = [G.advancedCityMove ? playerID : undefined, undefined];
                                if (G.advancedCityMove) G.advancedCityMove = false;
                                else if (cheapMove) resources[ResourceType.Scrap] -= 2;
                                else resources[ResourceType.Crystal] -= 3;
                                if (!G.map.rooms[target].relatedCard) {
                                    const card = G.cards[G.def.eventType[target]].pop();
                                    room.relatedCard = card;
                                    G.pendingCard = card;
                                    G.stageQueue.unshift('cardChoice');
                                }
                            },
                        },
                    },
                    Explore: {
                        moves: {
                            Explore({ G, playerID }, target: string/** workernode */, payment: string/** worker nodes */) {
                                const [item, idx, id] = getWorkerNode(G, target);
                                if (!item || !isValidRoom(id) || item.main || item.relatedCard) return INVALID_MOVE;
                                const currentPosition = Object.entries(G.map.rooms).find(([, v]) => v.main === playerID)![0] as RoomNames3;
                                const paymentNodes = payment.split(',');
                                if (paymentNodes.length * 2 > G.players[playerID].resources[ResourceType.Cash]) return INVALID_MOVE;
                                for (const key of paymentNodes) {
                                    const [i, index] = getWorkerNode(G, key);
                                    if (!i.workers[index] && i.workers[index === 1 ? 0 : 1]) return INVALID_MOVE;
                                }
                                const reachable = getReachableRooms(currentPosition, paymentNodes);
                                if (reachable === INVALID_MOVE || !reachable.has(id)) return INVALID_MOVE;
                                if (G.def.eventType[id] === EventType.Red && G.turn <= 4) return INVALID_MOVE;
                                G.players[playerID].resources[ResourceType.Cash] -= paymentNodes.length * 2;
                                for (const key of paymentNodes) {
                                    const [{ workers }, index] = getWorkerNode(G, key);
                                    if (workers[index]) G.players[workers[index]].resources[ResourceType.Cash] += 2;
                                }
                                const card = G.cards[G.def.eventType[id]].pop();
                                item.relatedCard = card;
                                item.workers[idx] = playerID;
                                G.pendingCard = card;
                                G.stageQueue.unshift('cardChoice');
                            },
                        },
                    },
                    Build: {
                        moves: {
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
                                G.stageQueue.unshift('placeBuilding');
                            },
                        },
                    },
                    cardChoice: {
                        moves: {
                            SelectChoice({ G, playerID }, choice: number) {
                                if (!G.pendingCard) return INVALID_MOVE;
                                const card = G.pendingCard;
                                if (!card.choices[choice]) return INVALID_MOVE;
                                card.selected = choice;
                                if (processEffect(G, playerID, card.choices[choice].effect) === INVALID_MOVE) return INVALID_MOVE;
                                G.pendingCard = undefined;
                            },
                        },
                    },
                    placeBuilding: {
                        moves: {
                            PlaceBuilding({ G, playerID }, x: number, y: number) {
                                if (x < 0 || x > 3 || y < 0 || y > 2) return INVALID_MOVE;
                                if (G.players[playerID].buildings[x][y]) return INVALID_MOVE;
                                const card = G.pendingBuilding!;
                                G.players[playerID].buildings[x][y] = card;
                                // TOOD process building onBuild Effect
                                if (!card.onBuild.length) delete G.pendingBuilding;
                                else G.stageQueue.unshift('selectBuildingEffect');
                            },
                        },
                    },
                    selectBuilding: { // 由附属能源设施触发
                        moves: {
                            SelectBuilding({ G, playerID }, x: number, y: number) {
                                if (x < 0 || x > 3 || y < 0 || y > 2) return INVALID_MOVE;
                                const building = G.players[playerID].buildings[x][y];
                                if (!building) return INVALID_MOVE;
                                if (!building.onBuild.length) return;
                                G.pendingBuilding = building;
                                G.stageQueue.unshift('selectBuildingEffect');
                            },
                        },
                    },
                    selectBuildingEffect: {
                        moves: {
                            SelectBuildingEffect({ G, playerID }, index: number) {
                                const card = G.pendingBuilding!;
                                const effect = card.onBuild[index];
                                if (!effect) return INVALID_MOVE;
                                delete G.pendingBuilding;
                                if (processEffect(G, playerID, effect) === INVALID_MOVE) {
                                    G.pendingBuilding = card;
                                    return INVALID_MOVE;
                                }
                            },
                        },
                    },
                    godMode: {
                        moves: {
                            Deploy({ G, playerID }, target: string) {
                                const [item, idx] = getWorkerNode(G, target);
                                item.workers[idx] = playerID;
                            },
                            Remove({ G }, target: string) {
                                const [item, idx] = getWorkerNode(G, target);
                                item.workers[idx] = undefined;
                            },
                            ModResource({ G }, targetPlayerID, resourceType, amount) {
                                G.players[targetPlayerID].resources[resourceType] += amount;
                            },
                            Leave({ G }) {
                                G.currentStage = '';
                            },
                        },
                    },
                },
                onEnd: ({ G, ctx }) => {
                    const playerInfo = G.players[ctx.currentPlayer];
                    if (G.effectUsed) {
                        G.effectUsed = undefined;
                        playerInfo.usedCards.push(playerInfo.activeCharacter!);
                        playerInfo.activeCharacter = undefined;
                    }
                },
            },
        },
        harvest: {
            turn: {
                order: TurnOrder.ONCE,
                activePlayers: {
                    all: {
                        stage: 'harvest',
                        maxMoves: 1,
                    },
                },
                stages: {
                    harvest: {
                        moves: {
                            Harvest({ G, playerID, events }, targets: string) {
                                const source = Object.entries(G.map.rooms).find(([, v]) => v.main === playerID)![0] as RoomNames3;
                                const reachable = getReachableRooms(source, targets.split(','));
                                if (reachable === INVALID_MOVE) return INVALID_MOVE;
                                for (const node of reachable) {
                                    const room = G.map.rooms[node];
                                    if (!room.relatedCard?.type) continue;
                                    if (room.workers[0] === playerID) G.players[playerID].resources[room.relatedCard.type] += 1;
                                    if (room.workers[1] === playerID) G.players[playerID].resources[room.relatedCard.type] += 1;
                                }
                                G.players[playerID].harvest = true;
                                if (Object.values(G.players).every((p) => p.harvest)) {
                                    events.endPhase();
                                }
                            },
                        },
                    },
                },
            },
            onEnd: ({ G }) => {
                // TODO
            },
            next({ G }) {
                return G.turn === 8 ? 'end' : 'pickCharacter';
            },
        },
        end: {
        },
    },
    endIf: ({ G }) => {
        // TODO calculate game score
    },
};

export default TheFounders3;
