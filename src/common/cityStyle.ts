import { EffectType, ResourceType } from './interface';

type Color = 'red' | 'blue' | 'yellow';

export interface CityStyle {
    name: string;
    condition: (Color | undefined)[][][];
    onDeclare: [number, ResourceType | EffectType][][];
    special: [number, ResourceType | EffectType][][];
    offset: [number, number];
}

export function styleMatch(expected: (string | undefined)[][][], actual: (Color | undefined | 'any')[][]) {
    const totalCount = actual.flat().filter((i) => i).length;
    const expectedCount = expected[0].flat().filter((i) => i).length;
    if (totalCount !== expectedCount) return false;
    for (const layout of expected) {
        for (let matchIndexX = 0; matchIndexX < 4; matchIndexX++) {
            for (let matchIndexY = 0; matchIndexY < 3; matchIndexY++) {
                let success = true;
                for (let x = 0; x < layout.length; x++) {
                    for (let y = 0; y < layout[0].length; y++) {
                        if (!layout[x][y]) continue;
                        if (actual[x + matchIndexX][y + matchIndexY] === 'any') continue;
                        if (layout[x][y] !== actual[x + matchIndexX][y + matchIndexY]) {
                            success = false;
                            break;
                        }
                    }
                }
                if (success) return true;
            }
        }
    }
    return false;
}

export const basicCityStyles: Record<string, CityStyle> = {
    军工化区域: {
        name: '军工化区域',
        condition: [
            [['yellow', 'red']],
            [['blue', 'red']],
            [['red', 'yellow']],
            [['red', 'blue']],
            [['yellow'], ['red']],
            [['blue'], ['red']],
            [['red'], ['yellow']],
            [['red'], ['blue']],
        ],
        onDeclare: [],
        special: [[[1, EffectType.SuperDeploy]]],
        offset: [0, 0],
    },
    物资中继站: {
        name: '物资中继站',
        condition: [
            [['blue', 'yellow']],
            [['red', 'yellow']],
            [['yellow', 'blue']],
            [['yellow', 'red']],
            [['blue'], ['yellow']],
            [['red'], ['yellow']],
            [['yellow'], ['blue']],
            [['yellow'], ['red']],
        ],
        onDeclare: [[
            [1, ResourceType.Stone],
            [1, ResourceType.Iron],
            [1, ResourceType.Scrap],
        ]],
        special: [],
        offset: [0, 1700],
    },
    动员配套体系: {
        name: '动员配套体系',
        condition: [
            [['yellow', 'yellow', 'red']],
            [['red', 'yellow', 'yellow']],
            [['yellow'], ['yellow'], ['red']],
            [['red'], ['yellow'], ['yellow']],
        ],
        onDeclare: [],
        special: [[[1, EffectType.Replace]]],
        offset: [1200, 0],
    },
    复合动力系统: {
        name: '复合动力系统',
        condition: [[
            ['yellow', undefined],
            ['red', 'yellow'],
        ], [
            [undefined, 'yellow'],
            ['yellow', 'red'],
        ], [
            ['red', 'yellow'],
            ['yellow', undefined],
        ], [
            ['yellow', 'red'],
            [undefined, 'yellow'],
        ]],
        onDeclare: [],
        special: [[
            [-1, ResourceType.Scrap],
            [-3, ResourceType.Stone],
            [1, EffectType.CityMove],
        ], [
            [-1, ResourceType.Scrap],
            [-2, ResourceType.Stone],
            [-1, ResourceType.Iron],
            [1, EffectType.CityMove],
        ], [
            [-1, ResourceType.Scrap],
            [-1, ResourceType.Stone],
            [-2, ResourceType.Iron],
            [1, EffectType.CityMove],
        ], [
            [-1, ResourceType.Scrap],
            [-3, ResourceType.Iron],
            [1, EffectType.CityMove],
        ]],
        offset: [1200, 1700],
    },
};

export const advancedCityStyles: Record<string, CityStyle> = {
    源石工业中枢: {
        name: '源石工业中枢',
        condition: [[
            ['blue', undefined, undefined],
            ['red', 'blue', undefined],
            ['yellow', 'yellow', 'red'],
        ], [
            [undefined, undefined, 'red'],
            [undefined, 'blue', 'yellow'],
            ['blue', 'red', 'yellow'],
        ], [
            ['red', 'yellow', 'yellow'],
            [undefined, 'blue', 'red'],
            [undefined, undefined, 'blue'],
        ], [
            ['yellow', 'red', 'blue'],
            ['yellow', 'blue', undefined],
            ['red', undefined, undefined],
        ]],
        onDeclare: [],
        special: [[
            [-6, ResourceType.Cash],
            [1, EffectType.RemoveCharacterCard],
            [2, EffectType.ExtraMainAction],
        ]],
        offset: [0, 0],
    },
    高效移动管理体系: {
        name: '高效移动管理体系',
        condition: [[
            ['yellow', undefined, undefined],
            ['red', 'yellow', undefined],
            ['blue', 'blue', 'red'],
        ], [
            [undefined, undefined, 'red'],
            [undefined, 'yellow', 'blue'],
            ['yellow', 'red', 'blue'],
        ], [
            ['red', 'blue', 'blue'],
            [undefined, 'yellow', 'red'],
            [undefined, undefined, 'yellow'],
        ], [
            ['blue', 'red', 'yellow'],
            ['blue', 'yellow', undefined],
            ['red', undefined, undefined],
        ]],
        onDeclare: [],
        special: [[
            [-3, ResourceType.Scrap],
            [1, EffectType.RemoveCharacterCard],
            [1, EffectType.CityMove],
            [1, EffectType.CityMove],
        ]],
        offset: [0, 1700],
    },
};
