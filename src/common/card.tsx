import React from 'react';
import CharacterBack from '../assets/back_operator.jpg';
import BuildingImage from '../assets/building.jpg';
import CharacterImage from '../assets/characters.jpg';

const hoverStyle: React.CSSProperties = {
    borderImageSource: 'radial-gradient(60% 60%, transparent 0px, transparent 100%, red 100%)',
    borderImageSlice: 1,
    borderWidth: 10,
    margin: -10,
    borderStyle: 'solid',
    borderImageOutset: '1cm',
};

export function Character(props: { offset?: number, height: number, onClick?: any }) {
    const [hover, setHover] = React.useState(false);
    const zoom = props.height / 800;

    if (typeof props.offset !== 'number') {
        return <div style={{
            width: 600,
            height: 800,
            background: `url(${CharacterBack}) no-repeat`,
            zoom,
            display: 'inline-block',
        }} />;
    }
    return <>
        <div
            style={{
                width: 600,
                height: 800,
                background: `url(${CharacterImage}) no-repeat -${props.offset}px 0px`,
                zoom,
                display: 'inline-block',
                ...(hover ? hoverStyle : {}),
            }}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={props.onClick || (() => { })}
        />
        {hover && <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 600,
                height: 800,
                background: `url(${CharacterImage}) no-repeat -${props.offset}px 0px`,
                zoom: 0.6,
                display: 'inline-block',
            }}
        />}
    </>;
}

export function Building(props: {
    offset: [number, number],
    onClick?: any,
    height: number,
    style?: React.CSSProperties,
    placeholder?: boolean,
}) {
    const [hover, setHover] = React.useState(false);
    const zoom = props.height / 850;

    return <>
        <div
            style={{
                ...(props.style || {}),
                width: 600,
                height: 850,
                background: `url(${BuildingImage}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`,
                zoom,
                display: 'inline-block',
                ...(props.placeholder ? { opacity: 0.5 } : hover ? hoverStyle : {}),
            }}
            onClick={props.onClick || (() => { })}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            {...props.placeholder ? { className: 'show-on-hover' } : {}}
        />
        {!props.placeholder && hover && <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 600,
                height: 850,
                background: `url(${BuildingImage}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`,
                zoom: 0.6,
                display: 'inline-block',
            }}
        />}
    </>;
}
