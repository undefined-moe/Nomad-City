import {
    Card, EffectType, EventType, ResourceType,
} from './interface';

export const EventCards: Record<EventType, Card[]> = {
    [EventType.Green]: [{
        name: '中立采石场',
        type: ResourceType.Stone,
        choices: [{
            name: '换一些燃料',
            effect: [
                [3, ResourceType.Scrap],
            ],
        }, {
            name: '换一些建筑材料',
            effect: [
                [2, ResourceType.Iron],
                [2, ResourceType.Cash],
            ],
        }],
    }, {
        name: '废弃异铁矿',
        type: ResourceType.Iron,
        choices: [{
            name: '这个箱子看起来不错！',
            effect: [
                [4, ResourceType.Stone],
            ],
        }, {
            name: '那个箱子好像也很棒...',
            effect: [
                [2, ResourceType.Iron],
                [2, ResourceType.Cash],
            ],
        }],
    }, {
        name: '外露矿床',
        type: ResourceType.Scrap,
        choices: [{
            name: '清理出一片场地来建设矿区',
            effect: [
                [4, ResourceType.Stone],
            ],
        }, {
            name: '把成堆的粗劣源石带回去',
            effect: [
                [3, ResourceType.Scrap],
            ],
        }],
    }, {
        name: '富饶岩层',
        type: ResourceType.Stone,
        choices: [{
            name: '?',
            effect: [
                [4, ResourceType.Stone],
            ],
        }, {
            name: '?',
            effect: [
                [3, ResourceType.Scrap],
            ],
        }],
    }, {
        name: '矿业聚落',
        type: ResourceType.Scrap,
        choices: [{
            name: '用约翰老妈提供的抑制剂换取开采合同',
            effect: [
                [3, ResourceType.Scrap],
            ],
        }, {
            name: '收取费用，提供一片相对安全的聚居区',
            effect: [
                [7, ResourceType.Cash],
            ],
        }],
    }, {
        name: '荒野聚落',
        type: ResourceType.Scrap,
        choices: [{
            name: '?',
            effect: [
                [2, ResourceType.Iron],
            ],
        }, {
            name: '?',
            effect: [
                [3, ResourceType.Stone],
            ],
        }],
    }],
    [EventType.Orange]: [{
        name: '大型源岩场',
        type: ResourceType.Stone,
        choices: [{
            name: '选择海德兄弟',
            effect: [
                [5, ResourceType.Stone],
            ],
        }, {
            name: '选择富森银行',
            effect: [
                [4, ResourceType.Cash],
                [1, EffectType.Score],
            ],
        }],
    }, {
        name: '洞穴遗迹',
        type: ResourceType.Stone,
        choices: [{
            name: '爆破！我们不是来考古的',
            effect: [
                [5, ResourceType.Stone],
            ],
        }, {
            name: '给梅兰德历史协会写一封信',
            effect: [
                [10, ResourceType.Cash],
            ],
        }],
    }, {
        name: '饮水地',
        type: ResourceType.Stone,
        choices: [{
            name: '建造一个水塔',
            effect: [
                [5, ResourceType.Scrap],
            ],
        }, {
            name: '建造一个水塔',
            effect: [
                [12, ResourceType.Cash],
                [1, EffectType.OthersAddStone],
            ],
        }],
    }, {
        name: '锈锤领地',
        type: ResourceType.Scrap,
        choices: [{
            name: '尝试打听矿产的消息',
            effect: [
                [5, ResourceType.Scrap],
            ],
        }, {
            name: '交换一些商队的遗留物',
            effect: [
                [10, ResourceType.Cash],
            ],
        }],
    }, {
        name: '废弃矿坑',
        type: ResourceType.Scrap,
        choices: [{
            name: '挖掘一些矿物',
            effect: [
                [3, ResourceType.Iron],
                [1, ResourceType.Scrap],
            ],
        }, {
            name: '交换一些商队的遗留物',
            effect: [
                [-1, ResourceType.Scrap],
                [13, ResourceType.Cash],
            ],
        }],
    }, {
        name: '沙中寻宝',
        type: ResourceType.Scrap,
        choices: [{
            name: '挖掘一些矿物',
            effect: [
                [4, ResourceType.Stone],
                [1, ResourceType.Iron],
            ],
        }, {
            name: '交换一些商队的遗留物',
            effect: [
                [10, ResourceType.Cash],
            ],
        }],
    }, {
        name: '异铁开采权',
        type: ResourceType.Iron,
        choices: [{
            name: '“我可没有义务分享成果”你打发走了治安官',
            effect: [
                [3, ResourceType.Stone],
                [1, ResourceType.Iron],
            ],
        }, {
            name: '“联邦万岁！”你向治安官伸出了手',
            effect: [
                [13, ResourceType.Cash],
                [1, EffectType.OthersAddIron],
            ],
        }],
    }, {
        name: '敌对生态圈',
        type: ResourceType.Iron,
        choices: [{
            name: '派一队佣兵和磐蟹',
            effect: [
                [3, ResourceType.Iron],
            ],
        }, {
            name: '雇佣萨尔贡术士奴役这些大块头',
            effect: [
                [2, ResourceType.Stone],
                [1, EffectType.Score],
            ],
        }],
    }, {
        name: '遗弃平台',
        type: ResourceType.Iron,
        choices: [{
            name: '?',
            effect: [
                [-2, ResourceType.Stone],
                [2, ResourceType.Iron],
                [2, ResourceType.Scrap],
                [4, ResourceType.Cash],
            ],
        }, {
            name: '?',
            effect: [
                [12, ResourceType.Cash],
            ],
        }],
    }, {
        name: '无人车队',
        type: ResourceType.Scrap,
        choices: [{
            name: '拆解一些零件',
            effect: [
                [1, EffectType.Deploy],
                [1, EffectType.Move],
            ],
        }, {
            name: '拆解一些零件',
            effect: [
                [1, ResourceType.Stone],
                [1, ResourceType.Iron],
                [1, ResourceType.Scrap],
                [1, ResourceType.Cash],
            ],
        }],
    }],
    [EventType.Red]: [],
};
