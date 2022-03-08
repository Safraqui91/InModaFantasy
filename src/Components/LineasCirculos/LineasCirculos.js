import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import { Col } from 'react-bootstrap';
import './LineasCirculos.css';
import LineaCirculo from './LineaCirculo';
import { lineasInfo } from '../../helpers';
const LineasCirculos = ({openMenuResponsive, setOpenMenuResponsive})=>{
    const lineas = lineasInfo;
    return (
        <>
         <div className='ContenedorLineas' style={openMenuResponsive ? {flexDirection: 'column', display: 'flex'} : {display:'none'}}>
            {
                lineas.map((val,index) => {
                    return (
                        <LineaCirculo 
                            openMenuResponsive={openMenuResponsive}
                            setOpenMenuResponsive={setOpenMenuResponsive}
                            val={val}
                            key={index}
                        />
                    )
                })
            }
        </div>
        </>
       
    )
}

export default LineasCirculos;