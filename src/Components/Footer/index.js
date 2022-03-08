import React from 'react'
import './footer.css'
import { Row, Col } from 'react-bootstrap';
import LogoHome from '../../Global/Images/LogoInmoda.png';
import LogoInstagram from '../../Global/Images/Instagram.png';
import ReactGA from 'react-ga';
import { FaInstagram, FaFacebookSquare, FaRegCopyright } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function Footer() {
    const redirect = (url) => {
        window.location.href = url;
    }
    return (
        <Row className="contain-row">
            <Col xs={12} lg={3} className="col-footer">
                <div>
                    <a href="./">
                        <img src={LogoHome} />
                    </a><br />
                    <label>
                        Siguenos en
                    </label><br />
                    <a href={'https://www.instagram.com/inmodafantasy/'} onClick={() => {
                        ReactGA.event({
                            category: 'Redes Sociales',
                            action: 'Instagram'
                        });
                    }} target={'_blank'}>
                        <FaFacebookSquare color="white" size={30} />
                        <FaInstagram color="white" size={30} />
                    </a>
                </div>
                <div>
                    <p><FaRegCopyright color="white" size={9} /> 2021 Hecho para IN MODA FANTASY</p>
                </div>
            </Col>
            <Col xs={12} lg={3} className="padd-cero col-title-footer">
                <div className="title-footer">
                    Servicio al Cliente
                </div>
                <div className="contain-info">
                    <h6>
                        Líneas Medellín:
                    </h6>
                    <p>Tel: (604) 512 41 29</p>
                    <p>Cel: +57 317 434 9040</p>
                    <h6>
                        Mail:
                    </h6>
                    <p>ventas@inmodafantasy.com.co</p>
                    <h6>
                        Horario de Atención:
                    </h6>
                    <p>Lunes a Viernes de 8:30 AM a 6 PM y Sábados de 7:30 AM a 1:10 PM</p>
                    <h6>
                        Dirección:
                    </h6>
                    <p>Cra 52A #45-33B (Centro comercial El Dorado #2) Bodega 501</p>
                </div>

            </Col>
            <Col xs={12} lg={3} className="padd-cero col-title-footer">
                <div className="title-footer">
                    Más de IN MODA FANTASY
                </div>
                <div className="contain-info">
                    <a href="">Sobre In Moda Fantasy</a>
                    <a href="">Servicios</a>
                    <a href="">Trabaja con nosotros</a>
                </div>
            </Col>
            <Col xs={12} lg={3} className="padd-cero col-title-footer">
                <div className="title-footer">
                    Links de Interés
                </div>
                <div className="contain-info">
                    <a href="">Preguntas frecuentes</a>
                    <a href="">¿Como comprar en In Moda Fantasy?</a>
                    <a href="">Polílica de entrega y devoluciones.</a>
                    <a href="">Política de privacidad</a>
                    <Link to="/#" onClick={() => redirect('/Contactanos')}>Contáctanos</Link>
                </div>
            </Col>
        </Row>
    )
}
