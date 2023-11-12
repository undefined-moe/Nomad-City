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

const interactiveElements = {
    BD00: {
        type: 'building',
        bound: [[670, 0], [1290, 900]],
    },
    BD01: {
        type: 'building',
        bound: [[1290, 0], [1950, 900]],
    },
    BD02: {
        type: 'building',
        bound: [[1950, 0], [2610, 900]],
    },
    BD10: {
        type: 'building',
        bound: [[670, 900], [1290, 1800]],
    },
    BD11: {
        type: 'building',
        bound: [[1290, 900], [1950, 1800]],
    },
    BD12: {
        type: 'building',
        bound: [[1950, 900], [2610, 1800]],
    },
    BD20: {
        type: 'building',
        bound: [[670, 1800], [1290, 2700]],
    },
    BD21: {
        type: 'building',
        bound: [[1290, 1800], [1950, 2700]],
    },
    BD22: {
        type: 'building',
        bound: [[1950, 1800], [2610, 2700]],
    },
    BD30: {
        type: 'building',
        bound: [[670, 2700], [1290, 3600]],
    },
    BD31: {
        type: 'building',
        bound: [[1290, 2700], [1950, 3600]],
    },
    BD32: {
        type: 'building',
        bound: [[1950, 2700], [2610, 3600]],
    },
    BD40: {
        type: 'building',
        bound: [[670, 3600], [1290, 4500]],
    },
    BD41: {
        type: 'building',
        bound: [[1290, 3600], [1950, 4500]],
    },
    BD42: {
        type: 'building',
        bound: [[1950, 3600], [2610, 4500]],
    },
};
function inRange(x: number, y: number, bound: [[number, number], [number, number]]) {
    return x >= bound[0][0] && x <= bound[1][0] && y >= bound[0][1] && y <= bound[1][1];
}
function getPosition(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    return {
        x: Math.round(2600 * e.nativeEvent.offsetX / e.currentTarget.clientWidth),
        y: Math.round(3600 * e.nativeEvent.offsetY / e.currentTarget.clientHeight),
    };
}

export default function PlayerStatus({
    status, playerID, pendingBuilding, moves,
}: {
    status: PlayerInfo, playerID: PlayerID, pendingBuilding?: BuildingCard, moves: any,
}) {
    const ref = React.useRef<HTMLImageElement>();
    useResizeObserver();

    function onMouseDown(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const pos = getPosition(e);
        console.log(pos.x, pos.y);
        for (const id in interactiveElements) {
            const element = interactiveElements[id];
            if (!inRange(pos.x, pos.y, element.bound)) continue;
            // alert(id);
        }
    }
    function onMouseOver(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const pos = getPosition(e);
        console.log(pos.x, pos.y);
        for (const id in interactiveElements) {
            const element = interactiveElements[id];
            if (!inRange(pos.x, pos.y, element.bound)) continue;
            // alert(id);
            const [x, y] = [+id[2], +id[3]];
            if (!status.buildings[x][y]) {

            }
        }
    }

    return <div>
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
                onMouseDown={onMouseDown}
                onMouseOver={onMouseOver}
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
                    }}>
                    {b
                        ? <Building
                            offset={b.imageOffset}
                            height={ref.current!.clientHeight / 4}
                        />
                        : pendingBuilding
                            ? <Building
                                offset={pendingBuilding.imageOffset}
                                height={ref.current!.clientHeight / 4}
                                placeholder
                                onClick={() => moves.PlaceBuilding(lineIndex, col)}
                            /> : null}
                </div>,
                ))}
                {status.activeCharacter && <div style={{
                    position: 'absolute',
                    left: 10 / 2600 * ref.current.clientWidth,
                    top: 1990 / 3600 * ref.current.clientHeight,
                }}>
                    {status.id === playerID
                        ? <Character height={ref.current!.clientHeight / 4.2} offset={status.activeCharacter.imageOffset} />
                        : <Character height={ref.current!.clientHeight / 4.2} />}
                </div>}
            </div>}
        </div>
    </div >;
}
