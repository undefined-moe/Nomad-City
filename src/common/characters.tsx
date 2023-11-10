export interface CharacterCard {
    name: string;
    choices: {
        name: string;
        effect: [number, string][];
    }[];
    imageOffset: number;
}

export enum Characters {
    '雷蛇' = '雷蛇',
    '德克萨斯' = '德克萨斯',
    '锡人' = '锡人',
    '坎诺特' = '坎诺特',
    '山' = '山',
    '玛恩纳' = '玛恩纳',
    '极境' = '极境',
}

export const characters: Record<Characters, CharacterCard> = {
    雷蛇: {
        name: '雷蛇',
        choices: [
            {
                name: '安保协议',
                effect: [
                    [-1, 'effect'],
                ],
            },
        ],
        imageOffset: 0,

    },
    德克萨斯: {
        name: '德克萨斯',
        choices: [],
        imageOffset: 600,
    },
    锡人: {
        name: '锡人',
        choices: [],
        imageOffset: 1200,
    },
    坎诺特: {
        name: '坎诺特',
        choices: [],
        imageOffset: 1800,
    },
    山: {
        name: '山',
        choices: [],
        imageOffset: 2400,
    },
    玛恩纳: {
        name: '玛恩纳',
        choices: [],
        imageOffset: 3000,
    },
    极境: {
        name: '极境',
        choices: [],
        imageOffset: 3600,
    },
};
