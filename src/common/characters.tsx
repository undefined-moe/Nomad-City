import { EffectType, ResourceType } from './interface';

export interface CharacterCard {
    name: string;
    effectName: [string, string];
    策略: [number, ResourceType | EffectType][][];
    计谋: [number, ResourceType | EffectType][][];
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
        effectName: ['安保协议', '拦截阵地'],
        策略: [[
            [2, EffectType.Deploy],
            [1, EffectType.PendingRemove],
        ]],
        计谋: [[
            [-3, ResourceType.Cash],
            [1, EffectType.Replace],
        ]],
        imageOffset: 0,
    },
    德克萨斯: {
        name: '德克萨斯',
        effectName: ['特别递送', '叙拉古人'],
        策略: [[
            [12, ResourceType.Cash],
            [1, EffectType.ChangeBuildingList],
        ]],
        计谋: [[
            [-3, ResourceType.Cash],
            [1, EffectType.Remove],
            [2, EffectType.Move],
        ]],
        imageOffset: 600,
    },
    锡人: {
        name: '锡人',
        effectName: ['古老收藏', '人员召集'],
        策略: [[
            [-12, ResourceType.Cash],
            [1, EffectType.Score],
            [1, ResourceType.Crystal],
        ], [
            [-15, ResourceType.Cash],
            [2, ResourceType.Crystal],
        ]],
        计谋: [[
            [1, EffectType.CollectCharacter],
        ]],
        imageOffset: 1200,
    },
    坎诺特: {
        name: '坎诺特',
        imageOffset: 1800,
    },
    山: {
        name: '山',
        effectName: ['外交施压', '秘密合同'],
        策略: [[
            [1, EffectType.RemoveAndScore],
        ]],
        计谋: [], // FIXME 奥秘结算
        imageOffset: 2400,
    },
    玛恩纳: {
        name: '玛恩纳',
        effectName: ['公事公办', '独善其身'],
        策略: [[
            [1, EffectType.SelectBuildingColor],
        ]],
        计谋: [[
            [1, EffectType.ReturnBuilding],
        ]],
        imageOffset: 3000,
    },
    极境: {
        name: '极境',
        imageOffset: 3600,
    },
};
