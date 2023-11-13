import { PlayerID } from 'boardgame.io';
import React from 'react';
import PlayerInfoImage from '../assets/playerInfo.png';
import ResourceIron from '../assets/resource_iron.png';
import ResourceScrap from '../assets/resource_scrap.png';
import ResourceStone from '../assets/resource_stone.png';
import { BuildingCard } from './building';
import { Building, Character } from './card';
import { PlayerInfo } from './interface';
import { useResizeObserver } from './resizeObserver';

export default function PlayerStatus({
    status, playerID, pendingBuilding, moves, stage, onBuildingSelect,
}: {
    status: PlayerInfo, stage?: string,
    playerID: PlayerID, pendingBuilding?: BuildingCard, moves: any,
    onBuildingSelect?: (b: string) => void,
}) {
    const ref = React.useRef<HTMLImageElement>();
    useResizeObserver();
    const [buildingSelected, setBuildingSelected] = React.useState<string[]>([]);
    React.useEffect(() => {
        setBuildingSelected([]);
    }, [onBuildingSelect]);
    React.useEffect(() => {
        if (buildingSelected) onBuildingSelect?.(buildingSelected.join(','));
    }, [buildingSelected, onBuildingSelect]);

    return <div style={playerID === status.id ? { border: '3px solid', borderColor: 'green' } : {}}>
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 80,
                zIndex: 9999,
                lineHeight: '0px',
                zoom: (ref.current?.clientWidth || 350) / 380,
            }}>
                <p>Player {status.name}</p>
                <div style={{ display: 'inline' }}>
                    <img src={ResourceStone} style={{ width: 50, height: 50, display: 'inline-block' }}></img>
                    <p style={{ display: 'inline-block', alignSelf: 'center' }}>{status.resources.Stone}</p>
                </div>
                <div style={{ display: 'inline' }}>
                    <img src={ResourceIron} style={{ width: 50, height: 50, display: 'inline-block' }}></img>
                    <p style={{ display: 'inline-block', alignSelf: 'center' }}>{status.resources.Iron}</p>
                </div>
                <div style={{ display: 'inline' }}>
                    <img src={ResourceScrap} style={{ width: 50, height: 50, display: 'inline-block' }}></img>
                    <p style={{ display: 'inline-block', alignSelf: 'center' }}>{status.resources.Scrap}</p>
                </div>
                <br />
                <div style={{ display: 'inline' }}>
                    <p>Cash: {status.resources.Cash}</p>
                    <p>Score: {status.score}</p>
                </div>
            </div>
            <img
                ref={ref}
                src={PlayerInfoImage}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            {ref.current && <div>
                {status.buildings.flatMap((line, lineIndex) => line.map((b, col) => <div
                    style={{
                        position: 'absolute',
                        left: (670 + col * 630) / 2600 * ref.current!.clientWidth,
                        top: (lineIndex * 900) / 3600 * ref.current!.clientHeight,
                    }}
                >
                    {b
                        ? <Building
                            offset={b.imageOffset}
                            height={ref.current!.clientHeight / 4}
                            rotate={b.rotate}
                            onClick={() => {
                                if (onBuildingSelect) {
                                    const id = `BD${lineIndex}${col}`;
                                    if (buildingSelected.includes(id)) {
                                        setBuildingSelected(buildingSelected.filter((i) => i !== id));
                                    } else {
                                        setBuildingSelected([...buildingSelected, id]);
                                    }
                                }
                                if (stage === 'selectBuilding') moves.SelectBuilding(lineIndex, col);
                            }}
                            selected={buildingSelected.includes(`BD${lineIndex}${col}`)}
                        />
                        : pendingBuilding
                            ? <Building
                                offset={pendingBuilding.imageOffset}
                                height={ref.current!.clientHeight / 4}
                                placeholder
                                onClick={() => moves.PlaceBuilding(lineIndex, col)}
                            /> : null}
                </div>))}
                {status.activeCharacter && <div style={{
                    position: 'absolute',
                    left: 10 / 2600 * ref.current.clientWidth,
                    top: 1990 / 3600 * ref.current.clientHeight,
                }}>
                    <Character
                        height={ref.current!.clientHeight / 4.2}
                        offset={status.activeCharacter.imageOffset}
                    />
                </div>}
            </div>}
        </div>
    </div >;
}
