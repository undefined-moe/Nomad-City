import type { BoardProps } from 'boardgame.io/react';
import React from 'react';
import GameMap3 from '../assets/gameMap3.jpg';
import { Building, Character } from '../common/card.tsx';
import { GameState } from '../common/interface.ts';
import PlayerStatus from '../common/PlayerStatus.tsx';
import { useResizeObserver } from '../common/resizeObserver.ts';
import { ResourceImage } from '../common/resourceImages.ts';
import type { GameInfo3 } from './game.ts';

interface GameProps extends BoardProps<GameState<GameInfo3>> {
}

const interactiveElements = {
    F03: {
        type: 'room',
        bound: [[264, 1773], [754, 2286]],
    },
    F01: {
        type: 'room',
        bound: [[1089, 1042], [1563, 1540]],
    },
    'F01-F03': {
        type: 'node',
        bound: [[785, 1501], [995, 1602]],
    },
    A01: {
        type: 'room',
        bound: [[4199, 863], [4681, 1361]],
    },
    A02: {
        type: 'room',
        bound: [[3974, 1967], [4456, 2473]],
    },
    A03: {
        type: 'room',
        bound: [[3204, 1649], [3686, 2146]],
    },
    B01: {
        type: 'room',
        bound: [[4253, 3064], [4736, 3561]],
    },
    D01: {
        type: 'room',
        bound: [[3071, 781], [3559, 1284]],
    },
};

function inRange(x: number, y: number, bound: [[number, number], [number, number]]) {
    return x >= bound[0][0] && x <= bound[1][0] && y >= bound[0][1] && y <= bound[1][1];
}
function getPosition(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    return {
        x: Math.round(5000 * e.nativeEvent.offsetX / e.currentTarget.clientWidth),
        y: Math.round(5000 * e.nativeEvent.offsetY / e.currentTarget.clientHeight),
    };
}

const colorOfPlayer = {
    0: 'red',
    1: 'yellow',
    2: 'blue',
    3: 'green',
};

interface MapDecoration {
    image?: string;
    color?: string;
    position: [number, number];
    size: [number, number];
    onClick?: () => void;
    selected?: boolean;
}

const selectedStyle: React.CSSProperties = {
    borderImageSource: 'radial-gradient(60% 60%, transparent 0px, transparent 100%, cyan 100%)',
    borderImageSlice: 1,
    borderWidth: 3,
    margin: -3,
    borderStyle: 'solid',
    borderImageOutset: '5px',
};

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

export function Board(props: GameProps) {
    console.log(props.G);

    const ref = React.useRef<HTMLImageElement>(null);
    useResizeObserver();

    const [selfCitySelected, setSelfCitySelected] = React.useState(false);

    function onMouseDown(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        const pos = getPosition(e);
        console.log(pos.x, pos.y);
        for (const id in interactiveElements) {
            const element = interactiveElements[id];
            if (!inRange(pos.x, pos.y, element.bound)) continue;
            alert(id);
            if (props.ctx.phase === 'setup' && element.type === 'room') {
                props.moves.SelectArea(id);
            }
            console.log(props.ctx.phase, selfCitySelected, element.type);
            if (props.ctx.phase === 'action' && selfCitySelected && element.type === 'room') {
                props.moves.CityMove(id);
            }
        }
    }

    const decorations: MapDecoration[] = [];

    for (const [id, t] of Object.entries(props.G.map.rooms)) {
        if (t.relatedCard) {
            decorations.push({
                image: ResourceImage[t.relatedCard.type],
                position: interactiveElements[id].bound[0],
                size: [200, 200],
            });
        }
        if (t.main) {
            const position = interactiveElements[id].bound[0];
            console.log([t.main, props.playerID, selfCitySelected]);
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
        if (t.workers[0]) {
            const position = interactiveElements[id].bound[0];
            decorations.push({
                color: colorOfPlayer[t.workers[0]],
                position: [position[0] + 100, position[1] + 200],
                size: [200, 200],
            });
        }
    }

    return <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        backgroundColor: 'white',
        fill: 'white',
    }}>
        <div>
            <img
                ref={ref}
                src={GameMap3}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                onMouseDown={onMouseDown}
            />
            <div>{decorations.map((i) => <Decoration decoration={i} img={ref.current} />)}</div>
            {props.ctx.currentPlayer === props.playerID && <p>你的回合</p>}
            {props.G.pendingCard && (
                <div>
                    <p>{props.G.pendingCard.name}</p>
                    {props.G.pendingCard.choices.map((c, i) => <div onClick={() => props.moves.SelectChoice(i)}>
                        {c.name} {c.effect.map(([d, t]) => <p style={{ display: 'inline-block' }}>{d > 0 ? '+' : '-'}{d} {t}&nbsp;&nbsp;</p>)}
                    </div>)}
                </div>
            )}
            <div>
                {props.G.shownBuildings.map((i) => <Building offset={i.imageOffset} height={200} />)}
            </div>
            <div>
                {props.G.players[props.playerID!].cards.map((i, index) => <Character
                    offset={i.imageOffset}
                    onClick={() => {
                        if (props.ctx.phase === 'pickCharacter') {
                            props.moves.PickCharacter(index);
                        }
                    }}
                />)}
            </div>
            <div>
                {props.G.texts?.map((i) => <p>{i}</p>)}
            </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, [col-start] 1fr)', maxHeight: '100vh' }}>
            {Object.values(props.G.players).map((player) => <PlayerStatus status={player} key={player.id} />)}
        </div>
    </div>;
}

export default Board;
