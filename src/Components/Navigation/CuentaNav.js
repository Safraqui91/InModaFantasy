import React from 'react'
import './Navigation2.css';
import IconPersona from '../../Global/Images/IconPersona.png';
import {
    BrowserRouter as Router,
    Link,
    Switch,
    useLocation
} from "react-router-dom";
import { ValidarToken } from '../../helpers';

export default function CuentaNav() {
    const redirect = (url)=>{
        window.location.href = url;
    }
    return (
        <div className='contain-cuenta'>
            <img className="icon-persona" src={IconPersona} />
            {
                !ValidarToken() ? (
                    <Link to={'/Ingreso'} /*onClick={() =>redirect('/Ingreso')}*/ style={{ textDecoration: 'none' }}>INGRESAR</Link>
                ):(
                    <Link to={'/miCuenta'} /*onClick={() =>redirect('/miCuenta')}*/ style={{ textDecoration: 'none' }}>MI CUENTA</Link>
                )
            }
        </div>
    )
}
