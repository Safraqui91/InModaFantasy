import React, { useEffect, useState } from 'react'
import './MiCuenta.css'
import LogoHome from '../../Global/Images/LogoInmoda.png';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import ImgAyuda from '../../Global/Images/Ayuda.png';
import 'react-day-picker/lib/style.css';
import { Container, Row, Col, Form } from 'react-bootstrap'
import Facturas from './Informacion/Facturas';
import Sucursales from './Informacion/Sucursales';
import InfoGeneral from './Informacion/InfoGeneral';
import InfoTributaria from './Informacion/InfoTributaria';
import Contactos from './Informacion/Contactos';
import { delUsuarioLogueado, setUsuarioLogueado } from '../../Redux/Actions/Modal/Usuario';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import LineasCirculos from '../LineasCirculos/LineasCirculos';
import { ValidarToken } from '../../helpers';
import Loadingg from '../../Common/Loading/Loadingg';


const MiCuenta = (props) => {
    const [tipoFormulario, setTipoFormulario] = useState(1)
    const [btnAction, setBtnAction] = useState(0)
    const [tipoTercero, setTipoTercero] = useState(1)
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(false)

    useEffect(() => {
        (()=>{
            if(!ValidarToken()){
                window.location.href = '/Ingreso';
            }
            ValidarTercero();
            setLoading(false);
        })()
    }, [])

    const ValidarTercero = () => {
        let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
        //strDataJsonTercero.StrIdTercero = '900433668';
        axios.get(process.env.REACT_APP_IP_BACK + '/api/terceros/tercero/' + strDataJsonTercero.StrIdTercero)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    if(strResult.data.strMensaje == undefined){
                        setDisable(true);
                    }
                } else {
                    alert("error miCuenta" + strResult.data.strMensaje);
                }
            });
    }

    const CambiarFormulario = (tipo) => {
        setTipoFormulario(tipo);
    }

    const SalirCuenta = () => {
        localStorage.removeItem("Usuario");
        window.location.href = "/";
    }

    const EventTipoTercero = (tipo) => {
        setTipoTercero(tipo);
    }

    return (
        <div className="contenedor-view">
            <Row className='ContenedorRegistro'>
                {
                    loading ? (
                        <Loadingg />
                    ) : (
                        <Col xs={12} sm={12} lg={12} xl={{ order: 1 }} className={'Col1'}>
                            <div className={'ContenedorFormularioRegistro'}>
                                <Row>
                                    <Col xs={4} sm={6} lg={8}>
                                        <div className={'lblTitulo'} style={{ color: ' #e3097e' }}>¡Bienvenido!</div>
                                    </Col>
                                    <Col xs={8} sm={6} lg={4} >
                                        <Row >
                                            <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <div className={'buttonGeneral'} onClick={SalirCuenta}>
                                                    Salir de la cuenta
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col xs={12} lg={4}>
                                        <div className={disable ? 'disableItem list' : 'list'} style={tipoFormulario == 1 ? { background: '#D9D9D9' } : {}} onClick={() => CambiarFormulario(1)}>Información General</div><hr />
                                        {
                                            /*tipoTercero == 2 ?
                                                (
                                                    <div><div className={'list'} style={tipoFormulario == 2 ? { background: '#D9D9D9' } : {}} onClick={() => CambiarFormulario(2)}>Información Tributaria</div><hr /></div>
                                                ) : (null)*/
                                        }
                                        <div className={disable ? 'disableItem list' : 'list'} style={tipoFormulario == 3 ? { background: '#D9D9D9' } : {}} onClick={() => CambiarFormulario(3)}>Contactos</div><hr />
                                        <div className={disable ? 'disableItem list' : 'list'} style={tipoFormulario == 4 ? { background: '#D9D9D9' } : {}} onClick={() => CambiarFormulario(4)}>Sucursales</div><hr />
                                        <div className={disable ? 'disableItem list' : 'list'} style={tipoFormulario == 5 ? { background: '#D9D9D9' } : {}} onClick={() => CambiarFormulario(5)}>Historial de compras</div><hr />
                                    </Col>
                                    <Col xs={12} lg={8} className={'col'}>
                                        <div className={'ContenedorDatosPersonales'}>
                                            {
                                                disable ? (
                                                    <div className="disable">
                                                        BIENVENIDO en estos momentos estamos validando tu información, puedes comunicarte con uno de nuestros asesores para saber el estado actual de tu registro
                                                    </div>
                                                ) : (
                                                    tipoFormulario == 1 ?
                                                    (
                                                        <InfoGeneral EventTipoTercero={(tipo) => EventTipoTercero(tipo)} setLoadInfo={setLoading} loadInfo={loading}/>
                                                    ) :
                                                    tipoFormulario == 2 ? (
                                                        <InfoTributaria setLoading={setLoading}/>
                                                    ) :
                                                        tipoFormulario == 3 ? (
                                                            <Contactos setLoading={setLoading}/>
                                                        ) :
                                                            tipoFormulario == 4 ? (
                                                                <Sucursales setLoading={setLoading}/>
                                                            ) :
                                                                tipoFormulario == 5 ? (
                                                                    <Facturas setLoading={setLoading}/>
                                                                ) :
                                                                    (
                                                                        <div></div>
                                                                    )
                                                )
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <hr />
                            </div>
                        </Col>
                    )
                }
            </Row>
        </div>
    )
}

export default MiCuenta;