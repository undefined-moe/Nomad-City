import React from 'react';
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

export function Character(props) {
    const [hover, setHover] = React.useState(false);

    return <>
        <div
            style={{
                width: 600,
                height: 800,
                background: `url(${CharacterImage}) no-repeat -${props.offset}px 0px`,
                zoom: 0.2,
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
                zoom: 0.5,
                display: 'inline-block',
            }}
        />}
    </>;
}

export function Building(props: { offset: [number, number], height: number, style?: React.CSSProperties }) {
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
                ...(hover ? hoverStyle : {}),
            }}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        />
        {hover && <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 600,
                height: 850,
                background: `url(${BuildingImage}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`,
                zoom: 0.5,
                display: 'inline-block',
            }}
        />}
    </>;
}
