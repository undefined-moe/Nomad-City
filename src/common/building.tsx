export interface BuildingCard {
    name: string;
    choices: {
        name: string;
        effect: [number, string][];
    }[];
    imageOffset: [number, number];
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
    '高性能动力设施' = '高性能动力设施',
    '固源岩提纯厂' = '固源岩提纯厂',
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
    源石精炼厂: 4,
    高性能动力设施: 2,
    固源岩提纯厂: 4,
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
    },
    载具仓库: {
        name: '载具仓库',
        choices: [],
        imageOffset: [0, 1200],
    },
    工业高炉: {
        name: '工业高炉',
        choices: [],
        imageOffset: [0, 2400],
    },
    机动载具实验室: {
        name: '机动载具实验室',
        choices: [],
        imageOffset: [0, 3600],
    },
    护航调度中心: {
        name: '护航调度中心',
        choices: [],
        imageOffset: [0, 4800],
    },
    拓荒工程部: {
        name: '拓荒工程部',
        choices: [],
        imageOffset: [850, 0],
    },
    简陋工程营: {
        name: '简陋工程营',
        choices: [],
        imageOffset: [850, 1200],
    },
    开采电铲: {
        name: '开采电铲',
        choices: [],
        imageOffset: [850, 2400],
    },
    城邦工业区: {
        name: '城邦工业区',
        choices: [],
        imageOffset: [850, 3600],
    },
    源石精炼厂: {
        name: '源石精炼厂',
        choices: [],
        imageOffset: [850, 4800],
    },
    高性能动力设施: {
        name: '高性能动力设施',
        choices: [],
        imageOffset: [1700, 0],
    },
    固源岩提纯厂: {
        name: '固源岩提纯厂',
        choices: [],
        imageOffset: [1700, 1200],
    },
    物流中枢: {
        name: '物流中枢',
        choices: [],
        imageOffset: [1700, 2400],
    },
    矿料筛斗: {
        name: '矿料筛斗',
        choices: [],
        imageOffset: [1700, 3600],
    },
    改良动力燃烧室: {
        name: '改良动力燃烧室',
        choices: [],
        imageOffset: [2550, 600],
    },
    运输舷梯: {
        name: '运输舷梯',
        choices: [],
        imageOffset: [2550, 1800],
    },
    城市化区域: {
        name: '城市化区域',
        choices: [],
        imageOffset: [2550, 3000],
    },
    延伸枢纽: {
        name: '延伸枢纽',
        choices: [],
        imageOffset: [2550, 4200],
    },
    贸易街区: {
        name: '贸易街区',
        choices: [],
        imageOffset: [3400, 1200],
    },
    异铁冶炼厂: {
        name: '异铁冶炼厂',
        choices: [],
        imageOffset: [3400, 2400],
    },
    城邦行政区: {
        name: '城邦行政区',
        choices: [],
        imageOffset: [3400, 3600],
    },
    核心指挥塔: {
        name: '核心指挥塔',
        choices: [],
        imageOffset: [4250, 0],
    },
    附属能源设施: {
        name: '附属能源设施',
        choices: [],
        imageOffset: [4250, 2400],
    },
    联邦理事处: {
        name: '联邦理事处',
        choices: [],
        imageOffset: [4250, 3600],
    },
};

export const buildingDeck: Buildings[] = Object.entries(count)
    .flatMap(([k, v]) => Array(v).fill(buildings[k as Buildings]));
