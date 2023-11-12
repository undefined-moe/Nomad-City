import { BuildingCard } from './building';
import { CharacterCard } from './characters';

export type PlayerID = string;

export enum EventType {
    Green = 'Green',
    Orange = 'Orange',
    Red = 'Red',
}

export enum ResourceType {
    /** 粗制源石 */
    Scrap = 'Scrap',
    /** 土块 */
    Stone = 'Stone',
    /** 异铁 */
    Iron = 'Iron',
    Cash = 'Cash',
    /** 源石 */
    Crystal = 'Crystal',
}

export interface CardChoice {
    name: string;
    effect: [number, ResourceType][];
}

export interface Card {
    name: string;
    type: ResourceType;
    selected?: number;
    choices: CardChoice[];
}

type BuildingLine = [BuildingCard?, BuildingCard?, BuildingCard?];

export interface PlayerInfo {
    name: string;
    id: PlayerID;
    score: number;
    resources: Record<ResourceType, number>;
    cards: CharacterCard[];
    stageQueue: string[];
    currentStage?: string;
    usedCards: CharacterCard[];
    buildings: [BuildingLine, BuildingLine, BuildingLine, BuildingLine];
    activeCharacter?: CharacterCard;
}

export interface RoomInfo {
    main?: PlayerID;
    relatedCard?: Card;
    workers: [PlayerID?, PlayerID?];
}

export interface NodeInfo {
    workers: [PlayerID?, PlayerID?];
}

interface MapShape {
    rooms: readonly string[];
    nodes: readonly string[];
}

export interface GameState<Map extends MapShape> {
    def: Map;
    turn: number;
    cards: Record<EventType, Card[]> & { building: BuildingCard[] };
    pendingCard?: Card;
    pendingBuilding?: BuildingCard;
    shownBuildings: (BuildingCard | undefined)[];
    map: {
        rooms: Record<Map['rooms'][number], RoomInfo>
        nodes: Record<Map['nodes'][number], NodeInfo>
    };
    players: Record<string, PlayerInfo>;
    texts: string[];
}
