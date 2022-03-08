import React from 'react'
import { FaTimes } from 'react-icons/fa';
import LogoHome from '../../Global/Images/LogoInmoda.png';
import './Navigation2.css';
import IconPersona from '../../Global/Images/IconPersona.png';
import CuentaNav from './CuentaNav';

export default function NavigationResponsive({ setOpenMenuResponsive, openMenuResponsive }) {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <a href="./">
                    <img src={LogoHome} />
                </a>
                <div style={{ cursor: 'pointer' }} onClick={() => setOpenMenuResponsive(!openMenuResponsive)}>
                    <FaTimes
                        size="20px"
                    />
                </div>
            </div>
            <div className='contain-center'>
                <CuentaNav />
            </div>
        </>
    )
}
