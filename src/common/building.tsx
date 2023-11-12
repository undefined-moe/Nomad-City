import { Effects, EffectType, ResourceType } from './interface';

export interface BuildingCard {
    name: string;
    choices: {
        name: string;
        effect: [number, string][];
    }[];
    cost: [number, ResourceType][][],
    imageOffset: [number, number];
    score: number;
    onBuild: Effects[];
    unique?: true;
    color: 'any' | 'red' | 'black' | 'yellow' | 'blue';
    rotate?: true;
}

export enum Buildings {
    '佣兵指挥部' = '佣兵指挥部',
    '载具仓库' = '载具仓库',
    '工业高炉' = '工业高炉',
    '机动载具实验室' = '机动载具实验室',
    '护航调度中心' = '护航调度中心',
    '拓荒工程部' = '拓荒工程部',
    '简陋工程营' = '简陋工程营',
    '开采电铲' = '开采电铲',
    '城邦工业区' = '城邦工业区',
    '源石精炼厂' = '源石精炼厂',
    '源石精炼厂2' = '源石精炼厂2',
    '高性能动力设施' = '高性能动力设施',
    '固源岩提纯厂' = '固源岩提纯厂',
    '固源岩提纯厂2' = '固源岩提纯厂2',
    '物流中枢' = '物流中枢',
    '矿料筛斗' = '矿料筛斗',
    '改良动力燃烧室' = '改良动力燃烧室',
    '运输舷梯' = '运输舷梯',
    '城市化区域' = '城市化区域',
    '延伸枢纽' = '延伸枢纽',
    '贸易街区' = '贸易街区',
    '异铁冶炼厂' = '异铁冶炼厂',
    '城邦行政区' = '城邦行政区',
    '核心指挥塔' = '核心指挥塔',
    '附属能源设施' = '附属能源设施',
    '联邦理事处' = '联邦理事处',
}

const count: Partial<Record<Buildings, number>> = {
    佣兵指挥部: 2,
    载具仓库: 2,
    工业高炉: 2,
    机动载具实验室: 2,
    护航调度中心: 2,
    拓荒工程部: 2,
    简陋工程营: 2,
    开采电铲: 2,
    城邦工业区: 2,
    源石精炼厂: 2,
    源石精炼厂2: 2,
    高性能动力设施: 2,
    固源岩提纯厂: 2,
    固源岩提纯厂2: 2,
    物流中枢: 2,
    矿料筛斗: 2,
    改良动力燃烧室: 2,
    运输舷梯: 2,
    城市化区域: 2,
    贸易街区: 2,
    异铁冶炼厂: 2,
    城邦行政区: 2,
    附属能源设施: 2,
    联邦理事处: 2,
};

export const buildings: Record<Buildings, BuildingCard> = {
    佣兵指挥部: {
        name: '佣兵指挥部',
        choices: [],
        imageOffset: [0, 0],
        score: 1,
        color: 'red',
        cost: [
            [
                [2, ResourceType.Stone],
                [2, ResourceType.Iron],
                [2, ResourceType.Cash],
            ],
            [[18, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.Deploy]],
            [[1, EffectType.Replace]],
        ],
    },
    载具仓库: {
        name: '载具仓库',
        choices: [],
        imageOffset: [0, 1200],
        score: 0,
        color: 'red',
        cost: [
            [
                [1, ResourceType.Stone],
                [2, ResourceType.Scrap],
            ],
            [[9, ResourceType.Cash]],
        ],
        onBuild: [
            [
                [1, EffectType.Remove],
                [1, EffectType.Move],
            ],
            [[1, EffectType.Explore]],
        ],
    },
    工业高炉: {
        name: '工业高炉',
        choices: [],
        imageOffset: [0, 2400],
        score: 0,
        color: 'red',
        cost: [
            [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
            [[15, ResourceType.Cash]],
        ],
        onBuild: [
            [[4, ResourceType.Iron]],
        ],
    },
    机动载具实验室: {
        name: '机动载具实验室',
        choices: [],
        imageOffset: [0, 3600],
        score: 1,
        color: 'red',
        cost: [
            [
                [2, ResourceType.Scrap],
                [2, ResourceType.Iron],
                [2, ResourceType.Cash],
            ],
            [[18, ResourceType.Cash]],
        ],
        onBuild: [],
    },
    护航调度中心: {
        name: '护航调度中心',
        choices: [],
        imageOffset: [0, 4800],
        score: 0,
        color: 'red',
        cost: [
            [
                [2, ResourceType.Stone],
                [2, ResourceType.Iron],
                [2, ResourceType.Scrap],
            ],
            [[18, ResourceType.Cash]],
        ],
        onBuild: [
            [
                [1, EffectType.Deploy],
                [1, EffectType.Deploy],
            ],
        ],
    },
    拓荒工程部: {
        name: '拓荒工程部',
        choices: [],
        imageOffset: [850, 0],
        score: 0,
        color: 'red',
        cost: [
            [
                [2, ResourceType.Stone],
                [1, ResourceType.Scrap],
            ],
            [[9, ResourceType.Cash]],
        ],
        onBuild: [
            [
                [1, EffectType.Deploy],
                [1, EffectType.Remove],
            ],
            [[1, EffectType.Build]],
        ],
    },
    简陋工程营: {
        name: '简陋工程营',
        choices: [],
        imageOffset: [850, 1200],
        score: -1,
        unique: true,
        color: 'black',
        cost: [
            [
                [2, ResourceType.Stone],
                [1, ResourceType.Scrap],
            ],
            [[8, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.Build]],
        ],
    },
    开采电铲: {
        name: '开采电铲',
        choices: [],
        imageOffset: [850, 2400],
        score: 0,
        color: 'yellow',
        cost: [
            [
                [1, ResourceType.Iron],
                [2, ResourceType.Scrap],
            ],
            [[10, ResourceType.Cash]],
        ],
        onBuild: [
            [[3, ResourceType.Stone]],
            [[3, ResourceType.Iron]],
            [[3, ResourceType.Scrap]],
            [[2, ResourceType.Stone], [1, ResourceType.Iron]],
            [[2, ResourceType.Stone], [1, ResourceType.Scrap]],
            [[2, ResourceType.Iron], [1, ResourceType.Scrap]],
            [[2, ResourceType.Iron], [1, ResourceType.Stone]],
            [[2, ResourceType.Scrap], [1, ResourceType.Stone]],
            [[2, ResourceType.Scrap], [1, ResourceType.Iron]],
            [[1, ResourceType.Stone], [1, ResourceType.Iron], [1, ResourceType.Scrap]],
        ],
    },
    城邦工业区: {
        name: '城邦工业区',
        choices: [],
        imageOffset: [850, 3600],
        score: 2,
        color: 'yellow',
        cost: [
            [
                [4, ResourceType.Stone],
                [3, ResourceType.Scrap],
                [2, ResourceType.Cash],
            ],
            [[24, ResourceType.Cash]],
        ],
        onBuild: [],
    },
    源石精炼厂: {
        name: '源石精炼厂',
        choices: [],
        imageOffset: [850, 4800],
        score: 0,
        color: 'yellow',
        cost: [
            [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
            [[10, ResourceType.Cash]],
        ],
        onBuild: [
            [[4, ResourceType.Scrap]],
        ],
    },
    源石精炼厂2: {
        name: '源石精炼厂',
        choices: [],
        imageOffset: [2550, 4800],
        score: 0,
        color: 'blue',
        cost: [
            [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
            [[10, ResourceType.Cash]],
        ],
        onBuild: [
            [[4, ResourceType.Scrap]],
        ],
    },
    高性能动力设施: {
        name: '高性能动力设施',
        choices: [],
        imageOffset: [1700, 0],
        score: 0,
        color: 'yellow',
        cost: [
            [
                [2, ResourceType.Iron],
                [4, ResourceType.Scrap],
            ],
            [[20, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.CityMove]],
        ],
    },
    固源岩提纯厂: {
        name: '固源岩提纯厂',
        choices: [],
        imageOffset: [1700, 1200],
        score: 0,
        color: 'yellow',
        cost: [
            [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
            [[10, ResourceType.Cash]],
        ],
        onBuild: [
            [[7, ResourceType.Stone]],
        ],
    },
    固源岩提纯厂2: {
        name: '固源岩提纯厂',
        choices: [],
        imageOffset: [3400, 4800],
        score: 0,
        color: 'red',
        cost: [
            [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
            [[10, ResourceType.Cash]],
        ],
        onBuild: [
            [[7, ResourceType.Stone]],
        ],
    },
    物流中枢: {
        name: '物流中枢',
        choices: [],
        imageOffset: [1700, 2400],
        score: 2,
        unique: true,
        color: 'yellow',
        cost: [
            [
                [1, ResourceType.Crystal],
                [2, ResourceType.Cash],
            ],
            [[24, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.BuildExpanding]],
        ],
    },
    矿料筛斗: {
        name: '矿料筛斗',
        choices: [],
        imageOffset: [1700, 3600],
        score: 0,
        color: 'yellow',
        cost: [
            [
                [1, ResourceType.Stone],
                [2, ResourceType.Iron],
            ],
            [[12, ResourceType.Cash]],
        ],
        onBuild: [
            [[5, ResourceType.Scrap]],
        ],
    },
    改良动力燃烧室: {
        name: '改良动力燃烧室',
        choices: [],
        color: 'yellow',
        imageOffset: [2550, 600],
        score: 1,
        cost: [
            [
                [3, ResourceType.Stone],
                [2, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
            [[19, ResourceType.Cash]],
        ],
        onBuild: [],
    },
    运输舷梯: {
        name: '运输舷梯',
        choices: [],
        imageOffset: [2550, 1800],
        score: 0,
        color: 'yellow',
        cost: [
            [
                [1, ResourceType.Stone],
                [2, ResourceType.Scrap],
            ],
            [[10, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.Harvest]],
        ],
    },
    城市化区域: {
        name: '城市化区域',
        choices: [],
        imageOffset: [2550, 3000],
        score: 1,
        color: 'blue',
        cost: [
            [
                [3, ResourceType.Stone],
                [2, ResourceType.Iron],
            ],
            [[16, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.Claim]],
        ],
    },
    延伸枢纽: {
        name: '延伸枢纽',
        choices: [],
        imageOffset: [2550, 4200],
        score: -1,
        color: 'blue',
        cost: [],
        onBuild: [],
    },
    贸易街区: {
        name: '贸易街区',
        choices: [],
        imageOffset: [3400, 1200],
        score: 0,
        color: 'blue',
        cost: [
            [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
            ],
            [[6, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.Sell]],
        ],
    },
    异铁冶炼厂: {
        name: '异铁冶炼厂',
        choices: [],
        imageOffset: [3400, 2400],
        score: 1,
        color: 'blue',
        cost: [
            [
                [2, ResourceType.Stone],
                [1, ResourceType.Iron],
                [2, ResourceType.Scrap],
            ],
            [[15, ResourceType.Cash]],
        ],
        onBuild: [
            [[4, ResourceType.Iron]],
        ],
    },
    城邦行政区: {
        name: '城邦行政区',
        choices: [],
        imageOffset: [3400, 3600],
        score: 3,
        color: 'any',
        unique: true,
        cost: [
            [
                [3, ResourceType.Stone],
                [3, ResourceType.Iron],
                [3, ResourceType.Scrap],
            ],
            [[30, ResourceType.Cash]],
        ],
        onBuild: [],
    },
    核心指挥塔: {
        name: '核心指挥塔',
        choices: [],
        imageOffset: [4250, 0],
        color: 'any',
        score: 0,
        unique: true,
        cost: [],
        onBuild: [],
    },
    附属能源设施: {
        name: '附属能源设施',
        choices: [],
        imageOffset: [4250, 2400],
        score: 1,
        unique: true,
        color: 'any',
        cost: [
            [
                [2, ResourceType.Stone],
                [3, ResourceType.Iron],
                [2, ResourceType.Scrap],
            ],
            [[23, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.Trigger]],
        ],
    },
    联邦理事处: {
        name: '联邦理事处',
        choices: [],
        imageOffset: [4250, 3600],
        score: 1,
        color: 'any',
        cost: [
            [
                [4, ResourceType.Stone],
                [2, ResourceType.Scrap],
            ],
            [[17, ResourceType.Cash]],
        ],
        onBuild: [
            [[1, EffectType.SetEnd]],
        ],
    },
};

export const buildingDeck: BuildingCard[] = Object.entries(count)
    .flatMap(([k, v]) => Array(v).fill(buildings[k as Buildings]));
