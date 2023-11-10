import ResourceIron from '../assets/resource_iron.png';
import ResourceScrap from '../assets/resource_scrap.png';
import ResourceStone from '../assets/resource_stone.png';
import { ResourceType } from './interface.ts';

export const ResourceImage: Record<ResourceType, string> = {
    [ResourceType.Iron]: ResourceIron,
    [ResourceType.Scrap]: ResourceScrap,
    [ResourceType.Stone]: ResourceStone,
};

export const PureColor: Record<string, string> = {
    blue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVQ',
    red: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVQIW2P8z8AARAwMjDAGACwBA/+8RVWvAAAAAElFTkSuQmCC',
};
