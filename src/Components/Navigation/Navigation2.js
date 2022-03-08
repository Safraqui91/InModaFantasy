import React, { useContext, useEffect, useState } from 'react';
import './Navigation2.css';
import LogoHome from '../../Global/Images/LogoInmoda.png';
import { Row, Col, FormControl } from 'react-bootstrap';
import ReactGA from 'react-ga';
import LogoWhatsapp from '../../Global/Images/Whatsapp.png';
import LogoInstagram from '../../Global/Images/Instagram.png';
import Carrito from '../../Global/Images/Carrito.png';
import { FaMapMarkerAlt, FaRegHeart, FaBars } from 'react-icons/fa';
import LineasCirculos from '../LineasCirculos/LineasCirculos';
import NavigationResponsive from './NavigationResponsive';
import CuentaNav from './CuentaNav';
import ModalBolsa from '../ModalBolsa/ModalBolsa';
import favoritosContext from '../../Context/Favoritos/Context';
import carritoContext from '../../Context/Carrito/Context';
import usuarioContext from '../../Context/Usuario/Context';
import modalProductoContext from '../../Context/ModalProducto/Context';
import ModalIm from '../Modal/ModalIM.js';



export default function Navigation2() {
    const [openMenuResponsive, setOpenMenuResponsive] = useState(false);
    const { favoritos } = useContext(favoritosContext)
    const { carrito } = useContext(carritoContext)
    const { StatusModal, DataModal, OpenModal, CloseModal } = useContext(modalProductoContext);

    return (
        <>
            <div style={{ position: 'sticky', zIndex: '2', width: '100%', top: '0' }}>
                <ModalIm
                    show={StatusModal}
                    close={CloseModal}
                    data={DataModal}
                />
                <NavRow1 />
                <NavRow2 />
                <NavRow3 setOpenMenuResponsive={setOpenMenuResponsive} openMenuResponsive={openMenuResponsive} favoritos={favoritos} carrito={carrito} />
                <NavRow4 openMenuResponsive={openMenuResponsive} setOpenMenuResponsive={setOpenMenuResponsive} />
            </div>

        </>
    )
}

const NavRow1 = () => {
    return (
        <Row className="row" id="Nav1">
            <Col xs={12} className="nav-politicas">
                <p>El mínimo monto de compras es de $300.000 y por compras mayores a $500.000 obtienes grandes descuentos!</p>
            </Col>
        </Row>
    )
}

const NavRow2 = () => {
    const { usuario } = useContext(usuarioContext)
    let user = JSON.parse(localStorage.getItem("Usuario"));
    user = user == null || !user.JsonVendedor ? process.env.REACT_APP_NUMBER_DEFAULT : user.JsonVendedor.strCelular;
    return (
        <Row className="row" id="Nav2">
            <Col xs={12} className="nav-redes">
                <label>{usuario.StrNombre !== undefined ? 'Bienvenido ' + usuario.StrNombre : ''}</label>
                <a href={'https://api.whatsapp.com/send?phone=57' + user} onClick={() => {
                    ReactGA.event({
                        category: 'Redes Sociales',
                        action: 'Whatsapp'
                    });
                }} target={'_blank'}>
                    <img src={LogoWhatsapp} />
                </a>
                <a href={'https://www.instagram.com/inmodafantasy/'} onClick={() => {
                    ReactGA.event({
                        category: 'Redes Sociales',
                        action: 'Instagram'
                    });
                }} target={'_blank'}>
                    <img src={LogoInstagram} />
                </a>
            </Col>
        </Row>
    )
}

const NavRow3 = ({ openMenuResponsive, setOpenMenuResponsive, favoritos, carrito }) => {
    const [filtroTextoGeneral, setFiltroTextoGeneral] = useState("")
    const [showModalBolsa, setShowModalBolsa] = useState(false)

    const Buscar = (e) => {
        if (e.key == "Enter") {
            ReactGA.event({
                category: 'Filtros',
                action: 'Filtro global: ' + filtroTextoGeneral
            });
            window.location.href = '/?' + filtroTextoGeneral;
        }
    }

    return (
        <Row className="row" id="Nav3">
            <ModalBolsa
                show={showModalBolsa}
                setShow={setShowModalBolsa}
            />
            <Col xs={1} className='contain-center padd-cero' id="icon-mobil" onClick={() => setOpenMenuResponsive(!openMenuResponsive)}>
                <FaBars
                    size="20px"
                />
            </Col>
            <Col lg={2} id="logo">
                <a href="./">
                    <img src={LogoHome} />
                </a>
            </Col>
            <Col lg={2} className='contain-center padd-cero' id="envios">
                <div className="contain-envios">
                    <FaMapMarkerAlt style={{ color: '#D71C7A' }} size='30px' />
                    <p>Envios a Toda<br />Colombia</p>
                </div>
            </Col>
            <Col xs={8} lg={5} className='contain-center'>
                <FormControl type="text" placeholder="¿Qué estás buscando?"
                    value={filtroTextoGeneral}
                    style={{ background: '#C7C6C4', borderRadius: '10px' }}
                    onChange={(e) => { setFiltroTextoGeneral(e.target.value) }}
                    onKeyPress={(e) => { Buscar(e) }}
                />
            </Col>
            <Col lg={2} className='contain-end padd-cero' id="cuenta">
                <CuentaNav />
            </Col>
            <Col xs={3} lg={1} className="contain-center padd-cero">
                <div className='contain-nav'>
                    <div className="contain-button" onClick={() => window.location.href = '/Favoritos'}>
                        <label>{favoritos !== null ? favoritos.length : '0'}</label><FaRegHeart color='#D71C7A' />
                    </div>
                    <div className="contain-button" onClick={() => setShowModalBolsa(true)}>
                        <label>{carrito !== null ? carrito.length : '0'}</label><img src={Carrito} />
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const NavRow4 = ({ openMenuResponsive, setOpenMenuResponsive }) => {
    return (
        <>
            <div className="row lineas" style={openMenuResponsive ? {
                width: '80%',
                position: 'absolute',
                zIndex: 1,
                top: 0,
                height: '100vh',
                overflowY: 'scroll'
            } : {}}>
                {
                    openMenuResponsive ? (
                        <NavigationResponsive
                            setOpenMenuResponsive={setOpenMenuResponsive}
                            openMenuResponsive={openMenuResponsive}
                        />
                    ) : null
                }
                <LineasCirculos openMenuResponsive={openMenuResponsive} setOpenMenuResponsive={setOpenMenuResponsive} />
            </div>
            {
                openMenuResponsive && (
                    <div
                        style={{
                            height: '100vh',
                            width: '100%',
                            background: 'transparent',
                            position: 'absolute',
                            top: 0,
                            zIndex: 0
                        }}

                        onClick={() => setOpenMenuResponsive(!openMenuResponsive)}
                    />
                )
            }
        </>

    )
}
