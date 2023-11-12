import {
    EffectType, isResourceType, ResourceDisplay, ResourceType,
} from './interface';

export function renderEffects(effects: [number, ResourceType | EffectType][]) {
    const res = [];
    for (const [count, effect] of effects) {
        if (isResourceType(effect)) {
            res.push(`${count > 0 ? '+' : ''}${count} ${ResourceDisplay[effect]}`);
        } else {
            res.push(`${count} ${effect}`);
        }
    }
    return res.join(',');
}
