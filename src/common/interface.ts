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
export const ResourceDisplay = {
    [ResourceType.Scrap]: '粗制源石',
    [ResourceType.Stone]: '源岩',
    [ResourceType.Iron]: '异铁',
    [ResourceType.Cash]: '钱',
    [ResourceType.Crystal]: '源石',
};

export function isResourceType(type: string): type is ResourceType {
    return type in ResourceType;
}

export type Effects = [number, EffectType | ResourceType][];
export enum EffectType {
    Replace = 'Replace',
    Deploy = 'Deploy',
    Move = 'Move',
    Remove = 'Remove',
    Explore = 'Explore',
    Build = 'Build',
    CityMove = 'CityMove',
    BuildExpanding = 'BuildExpanding',
    Harvest = 'Harvest',
    Trigger = 'Trigger',
    Sell = 'Sell', // +
    Claim = 'Claim',
    SetEnd = 'SetEnd',
    Score = 'Score',
    OthersAddStone = 'OthersAddStone',
    OthersAddIron = 'OthersAddIron',
    PendingRemove = 'PendingRemove', // +
    ChangeBuildingList = 'ChangeBuildingList', // 角色::德克萨斯 +
    CollectCharacter = 'CollectCharacter', // 角色::锡人 +
    RemoveAndScore = 'RemoveAndScore', // 角色::山 +
    SelectBuildingColor = 'SelectBuildingColor', // 角色::玛恩纳 +
    ReturnBuilding = 'ReturnBuilding', // 角色::玛恩纳 +
    ForceSellAllIron = 'ForceSellAllIron', // 角色::银灰 +
    ForceSellAllStone = 'ForceSellAllStone', // 角色::银灰 +
    ForceSellAllScrap = 'ForceSellAllScrap', // 角色::银灰 +
    RemoveForAll = 'RemoveForAll', // 角色::银灰 +
    SuperDeploy = 'SuperDeploy', // 城市::军工化区域
    ExtraMainAction = 'ExtraMainAction', // 城市::源石工业中枢
    RemoveCharacterCard = 'RemoveCharacterCard', // 禁止使用角色牌
}

export interface CardChoice {
    name: string;
    effect: Effects;
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
    usedCards: CharacterCard[];
    buildings: [BuildingLine, BuildingLine, BuildingLine, BuildingLine];
    activeCharacter?: CharacterCard;
    harvest?: boolean;
    endStageQueue: string[];
    declaredCityStyle: Record<string, {
        total: number;
        used: number;
        reset: number;
    }>;
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
    allowGodMode: boolean;
    turnBegin: number;
    count?: number;
    def: Map;
    turn: number;
    stageQueue: string[];
    currentStage?: string;
    advancedCityMove?: boolean;
    cards: Record<EventType, Card[]> & { building: BuildingCard[] };
    pendingCard?: Card;
    pendingEffectChoice?: any;
    effectUsed?: number;
    pendingBuilding?: BuildingCard;
    shownBuildings: (BuildingCard | undefined)[];
    map: {
        rooms: Record<Map['rooms'][number], RoomInfo>
        nodes: Record<Map['nodes'][number], NodeInfo>
    };
    players: Record<string, PlayerInfo>;
    texts: string[];
}
