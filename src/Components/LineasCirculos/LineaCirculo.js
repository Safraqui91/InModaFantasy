import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './LineasCirculos.css';

export default function LineaCirculo({val, type, hoverColor = true, openMenuResponsive, setOpenMenuResponsive}) {
    const [hover, setHover] = useState(null);
    const onMouseEnter = ()=>{
        hoverColor && setHover(true);
    }
    const onMouseLeave = ()=>{
        hoverColor && setHover(null);
    }
    return (
        <div className={type == "detail" ? "center-row-linea linea" : 'linea'} onMouseEnter={onMouseEnter} onClick={()=>openMenuResponsive && setOpenMenuResponsive(!openMenuResponsive)} onMouseLeave={onMouseLeave} style={hover && {background:'#ADB6B7'} }>
            <Link to={`/` + val.linea} style={{ textDecoration: 'none' }}>
                <div className={'ContenedorLineaTest ' + val.color} >
                    <div className={'ContenedorHover ' + val.hover}>
                        <div className={'ContenedorImage ' + val.img} />
                    </div>
                </div>
            </Link>
            <Link to={`/` + val.linea} style={{ textDecoration: 'none' }}>
                <label className={type == 'detail' ? 'linea-row-detail': ''}>{val.descripcion}</label>
            </Link>
        </div>
    )
}
