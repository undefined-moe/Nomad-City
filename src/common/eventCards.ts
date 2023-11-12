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
    }],
    [EventType.Red]: [],
};
