import { GameInfo3, type NodeNames3, type RoomNames3 } from './game.ts';

export type Bound = readonly [readonly [number, number], readonly [number, number]];
type WorkName = `${RoomNames3 | NodeNames3}-${'0' | '1'}`;
interface MapElement<T extends 'room' | 'node' | 'work'> {
    type: T;
    bound: Bound;
}

const roomElements = Object.fromEntries(Object.entries({
    A01: [[4199, 863], [4681, 1361]],
    A02: [[3974, 1967], [4456, 2473]],
    A03: [[3204, 1649], [3686, 2146]],
    B01: [[4253, 3064], [4736, 3561]],
    B02: [[3574, 3410], [4062, 3911]],
    B03: [[2957, 2949], [3440, 3447]],
    C01: [[3432, 4250], [3912, 4739]],
    C02: [[2221, 4034], [2704, 4532]],
    C03: [[624, 4086], [1107, 4584]],
    D01: [[3071, 781], [3559, 1284]],
    D02: [[2132, 847], [2615, 1352]],
    D03: [[2169, 2013], [2652, 2519]],
    E01: [[2155, 3076], [2637, 3581]],
    E02: [[973, 3135], [1456, 3640]],
    E03: [[253, 2838], [736, 3343]],
    F01: [[1089, 1042], [1563, 1540]],
    F02: [[1204, 2073], [1694, 2578]],
    F03: [[264, 1773], [754, 2286]],
} as const satisfies Record<RoomNames3, Bound>).map(([k, v]) => [k, { type: 'room', bound: v }])) as Record<RoomNames3, MapElement<'room'>>;

const nodeElements = Object.fromEntries(Object.entries({
    'A01-B01': [[4547, 1783], [4747, 1880]],
    'A01-A02': [[4220, 1605], [4421, 1701]],
    'A01-D01': [[3796, 884], [4004, 996]],
    'A02-A03-B03': [[3440, 2474], [3744, 2578]],
    'A02-B01': [[4346, 2637], [4539, 2734]],
    'A02-B02': [[3826, 2912], [4027, 3009]],
    'A03-D01-D02-D03': [[2853, 1322], [3158, 1426]],
    'B01-B02-C01': [[4168, 4272], [4473, 4368]],
    'B02-B03-C01-C02': [[3083, 3975], [3388, 4079]],
    'B03-D03-E01': [[2571, 2756], [2875, 2860]],
    'C02-C03': [[1620, 4473], [1820, 4577]],
    'C02-E01': [[2474, 3759], [2675, 3863]],
    'C03-E01': [[1657, 3841], [1857, 3945]],
    'C03-E02-E03': [[587, 3759], [899, 3863]],
    'D02-F01': [[1776, 1100], [1976, 1196]],
    'D02-D03-F02': [[1872, 1679], [2177, 1776]],
    'E01-E02-F02': [[1404, 2831], [1716, 2927]],
    'E03-F02-F03': [[364, 2519], [676, 2623]],
    'F01-F02': [[1360, 1761], [1560, 1857]],
    'F01-F03': [[785, 1501], [995, 1602]],
} as const satisfies Record<NodeNames3, Bound>).map(([k, v]) => [k, { type: 'node', bound: v }])) as Record<NodeNames3, MapElement<'node'>>;

const workElements: Record<WorkName, MapElement<'work'>> = {} as any;
for (const room of GameInfo3.rooms) {
    const roomBound = roomElements[room].bound;
    workElements[`${room}-0`] = {
        type: 'work',
        bound: [[roomBound[0][0] + 90, roomBound[0][1] + 235], [roomBound[0][0] + 90 + 90, roomBound[0][1] + 235 + 90]],
    };
    workElements[`${room}-1`] = {
        type: 'work',
        bound: [[roomBound[0][0] + 90, roomBound[0][1] + 235 + 90 + 10], [roomBound[0][0] + 90 + 90, roomBound[0][1] + 235 + 90 + 10 + 90]],
    };
}
for (const node of GameInfo3.nodes) {
    const nodeBound = nodeElements[node].bound;
    workElements[`${node}-0`] = {
        type: 'work',
        bound: [[nodeBound[0][0] + 80, nodeBound[0][1] + 10], [nodeBound[0][0] + 80 + 90, nodeBound[0][1] + 10 + 90]],
    };
    if (node.split('-').length > 2) {
        workElements[`${node}-1`] = {
            type: 'work',
            bound: [[nodeBound[0][0] + 80 + 100, nodeBound[0][1] + 10], [nodeBound[0][0] + 80 + 90 + 90, nodeBound[0][1] + 10 + 90]],
        };
    }
}

export const interactiveElements = {
    ...roomElements,
    ...nodeElements,
    ...workElements,
};
