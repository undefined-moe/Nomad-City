import { BoardProps } from 'boardgame.io/dist/types/packages/react';
import React from 'react';
import GameMap3 from '../assets/gameMap3.jpg';
import { GameState, RoomInfo } from '../common/interface';
import { useResizeObserver } from '../common/resizeObserver';
import { ResourceImage } from '../common/resourceImages';
import { Bound, interactiveElements } from './elements';
import type { GameInfo3, RoomNames3 } from './game';

const selectedStyle: React.CSSProperties = {
    borderImageSource: 'radial-gradient(60% 60%, transparent 0px, transparent 100%, cyan 100%)',
    borderImageSlice: 1,
    borderWidth: 3,
    margin: -3,
    borderStyle: 'solid',
    borderImageOutset: '3px',
};

interface MapDecoration {
    image?: string;
    color?: string;
    position: readonly [number, number];
    size: readonly [number, number];
    onClick?: () => void;
    selected?: boolean;
}

function Decoration(props: { decoration: MapDecoration, img?: HTMLImageElement | null }) {
    if (!props.img) return null;
    const onClick = props.decoration.onClick || (() => { });
    const style: React.CSSProperties = {
        ...(props.decoration.selected ? selectedStyle : {}),
        position: 'absolute',
        left: (props.decoration.position[0] / 5000) * props.img.clientWidth,
        top: (props.decoration.position[1] / 5000) * props.img.clientHeight,
        width: (props.decoration.size[0] / 5000) * props.img.clientWidth,
        height: (props.decoration.size[1] / 5000) * props.img.clientHeight,
        zIndex: 9999,
    };
    if (props.decoration.color) {
        return <div style={style} onClick={onClick} >
            <div style={{
                width: '100%', height: '100%', backgroundColor: props.decoration.color, opacity: 0.5,
            }} />
        </div>;
    }
    return <img src={props.decoration.image} style={style} onClick={onClick} />;
}

function inRange(x: number, y: number, bound: Bound) {
    return x >= bound[0][0] && x <= bound[1][0] && y >= bound[0][1] && y <= bound[1][1];
}
function getPosition(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    return {
        x: Math.round((5000 * e.nativeEvent.offsetX) / e.currentTarget.clientWidth),
        y: Math.round((5000 * e.nativeEvent.offsetY) / e.currentTarget.clientHeight),
    };
}

const colorOfPlayer: Record<string, string> = {
    0: 'red',
    1: 'yellow',
    2: 'blue',
    3: 'green',
};

export function Map(props: BoardProps<GameState<GameInfo3>>) {
    const ref = React.useRef<HTMLImageElement>(null);
    useResizeObserver();
    const currentPlayerStatus = props.G.players[props.playerID!];
    const [selfCitySelected, setSelfCitySelected] = React.useState(false);
    const [workerSelection, setWorkerSelection] = React.useState<string[]>([]);

    function onClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const pos = getPosition(e);
        console.log(pos.x, pos.y);
        for (const [id, element] of Object.entries(interactiveElements)) {
            if (!inRange(pos.x, pos.y, element.bound)) continue;
            alert(id);
            if (props.ctx.phase === 'setup' && element.type === 'room') {
                return props.moves.SelectArea(id);
            }
            console.log(props.ctx.phase, selfCitySelected, element.type);
            if (props.ctx.phase === 'action' && selfCitySelected && element.type === 'room') {
                return props.moves.CityMove(id);
            }
            if (props.ctx.phase === 'action' && element.type === 'work' && currentPlayerStatus.currentStage === 'mainAction') {
                const [room, work] = id.split('-') as [RoomNames3, string];

                const current = props.G.map.rooms[room].workers[+work];
                if (!current) {
                    if (!workerSelection.length) return props.moves.Deploy(room);
                    setWorkerSelection([]);
                    return props.moves.Move(workerSelection[0], room);
                }
            }
        }
    }

    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    function onMouseDown(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const pos = getPosition(e);
        setX(pos.x);
        setY(pos.y);
    }
    function onMouseUp(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const pos = getPosition(e);
        const data = [[x, y], [pos.x, pos.y]];
        // copy to clipboard
        const el = document.createElement('textarea');
        el.value = JSON.stringify(data);
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    const decorations: MapDecoration[] = [];
    // for (const k of Object.values(interactiveElements)) {
    //     const t = k.bound;
    //     decorations.push({
    //         color: 'red',
    //         position: t[0],
    //         size: [t[1][0] - t[0][0], t[1][1] - t[0][1]],
    //     });
    // }
    for (const [id, t] of Object.entries(props.G.map.rooms) as [RoomNames3, RoomInfo][]) {
        if (t.relatedCard) {
            decorations.push({
                image: ResourceImage[t.relatedCard.type],
                position: interactiveElements[id].bound[0],
                size: [200, 200],
            });
        }
        const position = interactiveElements[id].bound[0];
        if (t.main) {
            decorations.push({
                color: colorOfPlayer[t.main],
                position: [position[0] + 220, position[1] + 80],
                size: [250, 400],
                ...(t.main === props.playerID ? {
                    onClick: () => setSelfCitySelected(!selfCitySelected),
                    selected: selfCitySelected,
                } : {}),
            });
        }
    }
    for (const [id, t] of Object.entries(props.G.map.rooms).concat(Object.entries(props.G.map.nodes)) as [RoomNames3, RoomInfo][]) {
        const position = interactiveElements[id].bound[0];
        if (t.workers[0]) {
            decorations.push({
                color: colorOfPlayer[t.workers[0]],
                position: [position[0] + 90, position[1] + 235],
                size: [90, 90],
                ...(t.workers[0] === props.playerID ? {
                    onClick: () => {
                        if (workerSelection.includes(`${id}-0`)) {
                            setWorkerSelection(workerSelection.filter((i) => i !== `${id}-0`));
                        } else {
                            setWorkerSelection([...workerSelection, `${id}-0`]);
                        }
                    },
                    selected: workerSelection.includes(`${id}-0`),
                } : {}),
            });
        }
        if (t.workers[1]) {
            decorations.push({
                color: colorOfPlayer[t.workers[1]],
                position: [position[0] + 90, position[1] + 335],
                size: [90, 90],
                ...(t.workers[1] === props.playerID ? {
                    onClick: () => {
                        if (workerSelection.includes(`${id}-1`)) {
                            setWorkerSelection(workerSelection.filter((i) => i !== `${id}-1`));
                        } else {
                            setWorkerSelection([...workerSelection, `${id}-1`]);
                        }
                    },
                    selected: workerSelection.includes(`${id}-1`),
                } : {}),
            });
        }
    }

    console.log(decorations);

    return <>
        <img
            ref={ref}
            src={GameMap3}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onClick={onClick}
            onDragStart={onMouseDown}
            onDragEnd={onMouseUp}
        />
        <div>{decorations.map((i) => <Decoration decoration={i} img={ref.current} />)}</div>
    </>;
}
