import ResourceCrystal from '../assets/resource_crystal.png';
import ResourceDoubleStone from '../assets/resource_double_stone.png';
import ResourceIron from '../assets/resource_iron.png';
import ResourceScrap from '../assets/resource_scrap.png';
import ResourceStone from '../assets/resource_stone.png';
import { ResourceType } from './interface.ts';

export const ResourceImage: Record<ResourceType | 'DoubleStone', string> = {
    [ResourceType.Iron]: ResourceIron,
    [ResourceType.Scrap]: ResourceScrap,
    [ResourceType.Stone]: ResourceStone,
    [ResourceType.Crystal]: ResourceCrystal,
    DoubleStone: ResourceDoubleStone,
    [ResourceType.Cash]: '',
};
