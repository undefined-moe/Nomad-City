import { BuildingCard } from './building';
import { CharacterCard } from './characters';

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

type BuildingLine = [BuildingCard | null, BuildingCard | null, BuildingCard | null];

export interface PlayerInfo {
    name: string;
    id: string;
    resources: Record<ResourceType, number>;
    cards: CharacterCard[];
    usedCards: CharacterCard[];
    buildings: [BuildingLine, BuildingLine, BuildingLine, BuildingLine];
    activeCharacter?: CharacterCard;
}

export interface RoomInfo {
    main?: string;
    relatedCard?: Card;
    workers: [string?, string?];
}

export interface NodeInfo {
    workers: [string?, string?];
}

interface MapShape {
    rooms: readonly string[];
    nodes: readonly string[];
}

export interface GameState<Map extends MapShape> {
    def: Map;
    turn: number;
    cards: Record<EventType, Card[]> & { building: BuildingCard };
    pendingCard?: Card;
    shownBuildings: BuildingCard[];
    map: {
        rooms: Record<Map['rooms'][number], RoomInfo>
        nodes: Record<Map['nodes'][number], NodeInfo>
    };
    players: Record<string, PlayerInfo>;
    texts: string[];
}
