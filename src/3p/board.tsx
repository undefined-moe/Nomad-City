import 'allotment/dist/style.css';

import { Allotment } from 'allotment';
import type { BoardProps } from 'boardgame.io/react';
import React from 'react';
import { Building, Character, CityStyle } from '../common/card.tsx';
import { advancedCityStyles, basicCityStyles } from '../common/cityStyle.ts';
import { renderEffects } from '../common/effect.tsx';
import { GameState, ResourceType } from '../common/interface.ts';
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
    console.log(props);
    const currentPlayerStatus = props.G.players[props.playerID!];
    const stage = props.G.currentStage;

    const [buildingOpen, setBuildingOpen] = React.useState(false);
    const [buildingHover, setBuildingHover] = React.useState(false);
    const [buildingPanelHover, setBuildingPanelHover] = React.useState(false);
    const [charactersOpen, setCharactersOpen] = React.useState(false);
    const [charactersHover, setCharactersHover] = React.useState(false);
    const [charactersPanelHover, setCharactersPanelHover] = React.useState(false);
    const [styleOpen, setStyleOpen] = React.useState(false);
    const [styleHover, setStyleHover] = React.useState(false);
    const [stylePanelHover, setStylePanelHover] = React.useState(false);
    const [buildingSelected, setBuildingSelected] = React.useState<number | null>(null);
    const [workerNodesSelected, setWorkerNodesSelected] = React.useState<string[]>([]);
    const selectBuildingPosition = props.isActive && stage === 'placeBuilding';
    const selectEffect = props.isActive && stage === 'selectEffect';
    const [cityStyleSelected, setCityStyleSelected] = React.useState<any | null>(null);
    const [buildingListSelected, setBuildingListSelected] = React.useState<string>('');

    const controlling = {};
    const controlScore = Object.fromEntries(Object.keys(props.G.players).map((i) => [i, 0]));
    for (const region in props.G.def.regions) {
        const players = Object.fromEntries(Object.keys(props.G.players).map((i) => [i, 0]));
        for (const n of props.G.def.regions[region]) {
            if (!n.includes('-')) {
                const room = props.G.map.rooms[n];
                if (room.main) players[room.main] += 2;
                if (room.workers[0]) players[room.workers[0]] += 1;
                if (room.workers[1]) players[room.workers[1]] += 1;
            } else {
                const node = props.G.map.nodes[n];
                if (node.workers[0]) players[node.workers[0]] += 1;
                if (node.workers[1]) players[node.workers[1]] += 1;
            }
        }
        const max = Math.max(...Object.values(players));
        const winners = Object.keys(players).filter((i) => players[i] === max);
        if (winners.length === 1) {
            controlling[region] = winners[0];
            controlScore[winners[0]] += props.G.def.controlScore[region];
        }
    }

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
                        {props.ctx.phase === 'end' && <>
                            游戏结束。<br />
                            {Object.entries(props.G.players).map(([i, p]) => {
                                let resScore = 0;
                                for (const type of [ResourceType.Scrap, ResourceType.Stone, ResourceType.Crystal, ResourceType.Iron] as const) {
                                    resScore += Math.floor(p.resources[type] / props.G.def.resourceScore[type]);
                                }
                                return <p>
                                    玩家{i}: 分数{p.score}，资源分数{resScore}，控制分数{controlScore[i]}，
                                    总分{p.score + resScore + controlScore[i]}，金券{p.resources[ResourceType.Cash]}
                                </p>;
                            })}
                        </>}
                        {props.isActive && <button onClick={() => props.undo()}>撤销</button>}
                        <button
                            onClick={() => { setBuildingOpen(!buildingOpen); setBuildingHover(false); }}
                            onMouseOver={() => setBuildingHover(true)}
                            onMouseLeave={() => setTimeout(() => setBuildingHover(false), 300)}
                        >建筑</button>
                        &nbsp;
                        <button
                            onClick={() => { setCharactersOpen(!charactersOpen); setCharactersHover(false); }}
                            onMouseOver={() => setCharactersHover(true)}
                            onMouseLeave={() => setTimeout(() => setCharactersHover(false), 300)}
                        >角色</button>
                        <button
                            onClick={() => { setStyleOpen(!styleOpen); setStyleHover(false); }}
                            onMouseOver={() => setStyleHover(true)}
                            onMouseLeave={() => setTimeout(() => setStyleHover(false), 300)}
                        >城市样式</button>
                        {props.isActive && stage === 'quickAction' && <button
                            onClick={() => props.moves.Abort()}
                        >跳过快速行动</button>}
                        &nbsp;{props.ctx.phase}第{props.G.turn}回合
                        &nbsp;{props.isActive && <p style={{ display: 'inline-block' }}>
                            你的回合
                            {' '}
                            {props.ctx.phase === 'pickCharacter' && '请选择一个角色盖放'}
                            {props.ctx.phase === 'action' && (stageHint[stage as any] || stage)}
                        </p>}
                        {props.isActive && stage === 'quickAction' && <>
                            <br />
                            快速行动：{cityStyleSelected
                                ? <>宣告：{cityStyleSelected.name} 点击建筑面板选择用于宣告的建筑<button
                                    onClick={() => props.moves.CityStyle(cityStyleSelected.name, buildingListSelected)}
                                >选择完成</button>
                                <button onClick={() => setCityStyleSelected(null)}>取消</button></>
                                : '点击角色发动效果或选择城市样式进行宣告'}
                        </>}
                        {props.isActive && stage === 'mainAction' && <>
                            <br />
                            选择操作：
                            <button onClick={() => props.moves.gotoBuild()}>建设</button>
                            <button onClick={() => props.moves.gotoExplore()}>探索</button>
                            <button onClick={() => props.moves.gotoMove()}>调度</button>
                            <button onClick={() => props.moves.gotoDeploy()}>部署</button>
                            <button onClick={() => props.moves.gotoCityMove()}>城市移动</button>
                            <button onClick={() => props.moves.gotoSpecial()}>特殊行动</button>
                        </>}
                        {props.isActive && stage === 'Special' && <>
                            <br />
                            你已宣告的城市样式：
                            {!Object.keys(currentPlayerStatus.declaredCityStyle).length && '无'}
                            {Object.entries(currentPlayerStatus.declaredCityStyle).map(([i, v]) =>
                                <button onClick={() => props.moves.Special(i)}>{i} (共{v.total},已使用{v.used})</button>,
                            )}
                        </>}
                        {props.isActive && props.ctx.phase === 'harvest' && <>
                            <br />
                            收集资源：请选择希望经过的路径点，将自动收集资源
                            <button onClick={() => props.moves.Harvest(workerNodesSelected.join(','))}>确认选择</button>
                        </>}
                        {props.isActive && stage === 'removeForAll' && <button
                            onClick={() => props.moves.SelectMultipleWorks(workerNodesSelected.join(','))}
                        >完成选择</button>}
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
                    display: selectEffect ? 'inherit' : 'none',
                }}>
                    {props.G.pendingEffectChoice?.map((i, index) => <div
                        onClick={() => props.moves.SelectEffect(index)}
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
                        onClick={() => {
                            if (stage === 'selectBuildingToRemove') props.moves.SelectBuildingToRemove(index);
                            else setBuildingSelected(buildingSelected === index ? null : index);
                        }}
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
                <div
                    style={{
                        ...hoverBoxStyle,
                        display: (styleHover || styleOpen || stylePanelHover) ? 'inherit' : 'none',
                    }}
                    onMouseOver={() => setStylePanelHover(true)}
                    onMouseOut={() => setStylePanelHover(false)}
                >
                    {Object.values(basicCityStyles).map((i) => <CityStyle
                        offset={i.offset}
                        height={100}
                        onClick={() => setCityStyleSelected(cityStyleSelected?.name === i.name ? null : i)}
                    />)}
                    {Object.values(advancedCityStyles).map((i) => <CityStyle
                        offset={i.offset}
                        height={100}
                        onClick={() => setCityStyleSelected(cityStyleSelected?.name === i.name ? null : i)}
                        advanced
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
                        {...(props.playerID === player.id && cityStyleSelected ? { onBuildingSelect: setBuildingListSelected } : {})}
                        {...(props.playerID === player.id && selectBuildingPosition ? { pendingBuilding: props.G.pendingBuilding } : {})}
                    />)}
                </div>
            </Allotment.Pane>
        </Allotment>
    </div>;
}

export default Board;
