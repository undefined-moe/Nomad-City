import { Card, EventType, ResourceType } from './interface';

export const EventCards: Record<EventType, Card[]> = {
    [EventType.Green]: [
        {
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
        },
        {
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
        },
        {
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
        },
    ],
    [EventType.Orange]: [],
    [EventType.Red]: [],
};
