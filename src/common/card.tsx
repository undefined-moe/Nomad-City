import React from 'react';
import CharacterBack from '../assets/back_operator.jpg';
import BuildingImage from '../assets/building.jpg';
import CharacterImage from '../assets/characters.jpg';
import BasicCityStyle from '../assets/cityStyle1.jpg';
import AdvancedCityStyle from '../assets/cityStyle2.jpg';

const hoverStyle: React.CSSProperties = {
    borderImageSource: 'radial-gradient(60% 60%, transparent 0px, transparent 100%, red 100%)',
    borderImageSlice: 1,
    borderWidth: 10,
    margin: -10,
    borderStyle: 'solid',
    borderImageOutset: '1cm',
};

const selectedStyle: React.CSSProperties = {
    borderImageSource: 'radial-gradient(60% 60%, transparent 0px, transparent 100%, cyan 100%)',
    borderImageSlice: 1,
    borderWidth: 10,
    margin: -10,
    borderStyle: 'solid',
    borderImageOutset: '1cm',
};

export function Character(props: {
    offset?: [number, number],
    height: number,
    onClick?: any,
    hide?: boolean,
}) {
    const [hover, setHover] = React.useState(false);
    const zoom = props.height / 800;

    return <>
        <div
            style={{
                width: 600,
                height: 800,
                background: (props.offset && !props.hide)
                    ? `url(${CharacterImage}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`
                    : `url(${CharacterBack}) no-repeat`,
                zoom,
                display: 'inline-block',
                ...(hover ? hoverStyle : {}),
            }}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={props.onClick || (() => { })}
        />
        {props.offset && hover && <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 600,
                height: 800,
                background: `url(${CharacterImage}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`,
                zoom: 0.6,
                display: 'inline-block',
            }}
        />}
    </>;
}

export function Building(props: {
    offset: [number, number],
    onClick?: any,
    rotate?: true,
    height: number,
    style?: React.CSSProperties,
    placeholder?: boolean,
    selected?: boolean,
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
                ...(props.placeholder ? { opacity: 0.5 } : props.selected ? selectedStyle : hover ? hoverStyle : {}),
                ...(props.rotate ? { transform: 'rotate(180deg)' } : {}),
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

export function CityStyle(props: {
    offset: [number, number],
    advanced?: boolean,
    onClick?: any,
    height: number,
    style?: React.CSSProperties,
    placeholder?: boolean,
}) {
    const [hover, setHover] = React.useState(false);
    const zoom = props.height / 1200;
    const img = props.advanced ? AdvancedCityStyle : BasicCityStyle;

    return <>
        <div
            style={{
                ...(props.style || {}),
                width: 1600,
                height: 1200,
                background: `url(${img}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`,
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
                width: 1600,
                height: 1200,
                background: `url(${img}) no-repeat -${props.offset[1]}px -${props.offset[0]}px`,
                zoom: 0.4,
                display: 'inline-block',
            }}
        />}
    </>;
}
