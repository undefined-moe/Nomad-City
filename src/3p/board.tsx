import 'allotment/dist/style.css';

import { Allotment } from 'allotment';
import type { BoardProps } from 'boardgame.io/react';
import React from 'react';
import { Building, Character } from '../common/card.tsx';
import { renderEffects } from '../common/effect.tsx';
import { GameState } from '../common/interface.ts';
import PlayerStatus from '../common/PlayerStatus.tsx';
import { stageHint } from '../common/stageHints.ts';
import type { GameInfo3 } from './game.ts';
import { Map } from './map.tsx';

interface GameProps extends BoardProps<GameState<GameInfo3>> {
}

const hoverBoxStyle: React.CSSProperties = {
    alignSelf: 'center',
    justifySelf: 'center',
    zIndex: 999999,
    backgroundColor: 'white',
    border: '1px solid black',
    background: 'fill',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
};

export function Board(props: GameProps) {
    console.log(props.G);
    console.log(props);
    const currentPlayerStatus = props.G.players[props.playerID!];
    const stage = props.G.currentStage;

    const [buildingOpen, setBuildingOpen] = React.useState(false);
    const [buildingHover, setBuildingHover] = React.useState(false);
    const [buildingPanelHover, setBuildingPanelHover] = React.useState(false);
    const [charactersOpen, setCharactersOpen] = React.useState(false);
    const [charactersHover, setCharactersHover] = React.useState(false);
    const [charactersPanelHover, setCharactersPanelHover] = React.useState(false);
    const [buildingSelected, setBuildingSelected] = React.useState<number | null>(null);
    const [workerNodesSelected, setWorkerNodesSelected] = React.useState<string[]>([]);
    const selectBuildingPosition = props.isActive && stage === 'placeBuilding';
    const selectBuildingEffect = props.isActive && stage === 'selectBuildingEffect';

    return <div style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        backgroundColor: 'white',
        background: 'fill',
        left: 0,
        top: 0,
    }}>
        <Allotment onChange={() => {
            window.dispatchEvent(new Event('resize'));
        }}>
            <Allotment.Pane minSize={200}>
                <div id="gameMap">
                    <Map setWorkerNodes={setWorkerNodesSelected} {...props} />
                    <div>
                        {props.isActive && <button onClick={() => props.undo()}>撤销</button>}
                        <button
                            onClick={() => setBuildingOpen(!buildingOpen)}
                            onMouseOver={() => setBuildingHover(true)}
                            onMouseLeave={() => setTimeout(() => setBuildingHover(false), 300)}
                        >建筑</button>
                        &nbsp;
                        <button
                            onClick={() => setCharactersOpen(!charactersOpen)}
                            onMouseOver={() => setCharactersHover(true)}
                            onMouseLeave={() => setTimeout(() => setCharactersHover(false), 300)}
                        >角色</button>
                        {props.isActive && stage === 'quickAction' && <button
                            onClick={() => props.moves.Abort()}
                        >跳过快速行动</button>}
                        &nbsp;{props.ctx.phase}第{props.G.turn}回合 count{props.G.count}
                        &nbsp;{props.isActive && <p style={{ display: 'inline-block' }}>
                            你的回合
                            {' '}
                            {props.ctx.phase === 'pickCharacter' && '请选择一个角色盖放'}
                            {props.ctx.phase === 'action' && (stageHint[stage as any] || stage)}
                        </p>}
                        {props.isActive && stage === 'mainAction' && <>
                            <br />
                            选择一项操作：
                            <button onClick={() => props.moves.gotoBuild()}>建设</button>
                            <button onClick={() => props.moves.gotoExplore()}>探索</button>
                            <button onClick={() => props.moves.gotoMove()}>调度</button>
                            <button onClick={() => props.moves.gotoDeploy()}>部署</button>
                            <button onClick={() => props.moves.gotoCityMove()}>城市移动</button>
                        </>}
                        {props.isActive && props.ctx.phase === 'harvest' && <>
                            <br />
                            收集资源：请选择希望经过的路径点，将自动收集资源
                            <button onClick={() => props.moves.Harvest(workerNodesSelected.join(','))}>确认选择</button>
                        </>}
                    </div>
                </div>
                <div id="buildingPanel" style={{
                    display: buildingSelected !== null ? 'inherit' : 'none',
                }}>
                    选择支付方式：
                    {props.G.shownBuildings[buildingSelected!]?.cost?.map((i, index) => <div
                        onClick={() => {
                            setBuildingSelected(null);
                            if (stage === 'mainAction') props.moves.gotoBuild();
                            props.moves.Build(buildingSelected, index);
                        }}
                    >{JSON.stringify(i)}</div>)}
                </div>
                <div id="buildingEffectPanel" style={{
                    display: selectBuildingEffect ? 'inherit' : 'none',
                }}>
                    {props.G.pendingBuilding?.onBuild?.map((i, index) => <div
                        onClick={() => props.moves.SelectBuildingEffect(index)}
                    >{renderEffects(i)}</div>)}
                </div>
                <div
                    style={{
                        ...hoverBoxStyle,
                        display: (buildingHover || buildingOpen || buildingPanelHover) ? 'inherit' : 'none',
                    }}
                    onMouseOver={() => setBuildingPanelHover(true)}
                    onMouseOut={() => setBuildingPanelHover(false)}
                >
                    {props.G.shownBuildings.map((i, index) => i && <Building
                        onClick={() => setBuildingSelected(buildingSelected === index ? null : index)}
                        offset={i.imageOffset}
                        height={200}
                    />)}
                </div>
                <div
                    style={{
                        ...hoverBoxStyle,
                        display: (charactersHover || charactersOpen || charactersPanelHover) ? 'inherit' : 'none',
                    }}
                    onMouseOver={() => setCharactersPanelHover(true)}
                    onMouseOut={() => setCharactersPanelHover(false)}
                >
                    {props.G.players[props.playerID!].cards.map((i, index) => <Character
                        offset={i.imageOffset}
                        height={200}
                        onClick={() => {
                            if (props.ctx.phase === 'pickCharacter') props.moves.PickCharacter(index);
                        }}
                    />)}
                </div>
                <div id="misc">
                    {props.G.pendingCard && (
                        <div>
                            <p>{props.G.pendingCard.name}</p>
                            {props.G.pendingCard.choices.map((c, i) => <div onClick={() => props.moves.SelectChoice(i)}>
                                {c.name} {renderEffects(c.effect)}
                            </div>)}
                        </div>
                    )}
                    <div>
                    </div>
                    <div style={{ height: 200, overflowY: 'scroll' }}>
                        {[...props.chatMessages].reverse().map((i) => <p>{i.sender}: {i.payload}</p>)}
                    </div>
                    Type to chat: <input onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            props.sendChatMessage(ev.currentTarget.value);
                            ev.currentTarget.value = '';
                        }
                    }}></input>
                </div>
            </Allotment.Pane>
            <Allotment.Pane minSize={200}>
                <div id="playerStatus" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, [col-start] 1fr)', maxHeight: '100vh' }}>
                    {Object.values(props.G.players).map((player) => <PlayerStatus
                        playerID={props.playerID!}
                        moves={props.moves}
                        status={player}
                        key={player.id}
                        stage={stage}
                        {...(props.playerID === player.id && selectBuildingPosition ? { pendingBuilding: props.G.pendingBuilding } : {})}
                    />)}
                </div>
            </Allotment.Pane>
        </Allotment>
    </div>;
}

export default Board;
