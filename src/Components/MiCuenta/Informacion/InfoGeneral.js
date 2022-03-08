import React, { useState, useEffect, Fragment } from 'react'
import '../MiCuenta.css'
import { setUsuarioLogueado } from '../../../Redux/Actions/Modal/Usuario';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let { Control, Text, Check } = Form;
const initialState = {
    PNombre: {
        val: '',
        error: false,
        msg: ''
    },
    SNombre: {
        val: '',
        error: false,
        msg: ''
    },
    PApellido: {
        val: '',
        error: false,
        msg: ''
    },
    SApellido: {
        val: '',
        error: false,
        msg: ''
    },
    razonSocial: {
        val: '',
        error: false,
        msg: ''
    },
    tipoDoc: {
        val: 'CC-Cedula de ciudadania',
        error: false,
        msg: ''
    },
    documento: {
        val: '',
        error: false,
        msg: ''
    },
    telefono: {
        val: '',
        error: false,
        msg: ''
    },
    direccion: {
        val: '',
        error: false,
        msg: ''
    },
    emailFact: {
        val: '',
        error: false,
        msg: ''
    },
    tipoTercero: 2,
    readOnly: true,
    btnAction: 0
}
const InfoGeneral = (props) => {
    const [objDataInformacionGeneral, setObjDataInformacionGeneral] = useState(initialState)
    const [loadInfo, setLoadInfo] = useState(false)

    useEffect(() => {
        (async () => {
            //Consultar informacion general
            let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
            //strDataJsonTercero.StrIdTercero = '900433668';
            if (strDataJsonTercero === null) {
                //redireccionar home
                setLoadInfo(true)
            } else {
                await axios.get(process.env.REACT_APP_IP_BACK + '/api/terceros/tercero/' + strDataJsonTercero.StrIdTercero)
                    .then(async (strResult) => {
                        if (strResult.data.Success) {
                            if(strResult.data.strMensaje !== undefined){
                                const { StrNombre, StrNombre1, StrNombre2, StrApellido1, StrApellido2, StrTipoId, StrTelefono, StrCelular, StrDireccion, StrMailFE, IntTipoPersona,
                                    IntRegimen, IntRegimenFiscal, IntResp05, IntResp07, IntResp09, IntResp35, IntGranContribuyente, IntAutoRetenedor, IntRetenedorIca, IntNoManejaBasesReteIva,
                                    IntNoManejaBases, IntContratoEstabilidad } = strResult.data.strMensaje;
                                let tipoDoc = '';
                                if (StrTipoId == 'NI') {
                                    tipoDoc = 'NI-Numero de identificacion tributaria'
                                } else if (StrTipoId == 'CC') {
                                    tipoDoc = 'CC-Cedula de ciudadania';
                                } else if (StrTipoId == 'TE') {
                                    tipoDoc = 'TE-Tarjeta extranjeria'
                                } else if (StrTipoId == 'CE') {
                                    tipoDoc = 'CE-Cedula extranjeria'
                                }
                                if (IntTipoPersona == 2) {
                                    setObjDataInformacionGeneral({
                                        ...objDataInformacionGeneral,
                                        razonSocial: {
                                            val: StrNombre,
                                            error: false,
                                            msg: ''
                                        },
                                        tipoDoc: {
                                            val: tipoDoc,
                                            error: false,
                                            msg: ''
                                        },
                                        documento: {
                                            val: strDataJsonTercero.StrIdTercero,
                                            error: false,
                                            msg: ''
                                        },
                                        telefono: {
                                            val: StrTelefono,
                                            error: false,
                                            msg: ''
                                        },
                                        direccion: {
                                            val: StrDireccion,
                                            error: false,
                                            msg: ''
                                        },
                                        emailFact: {
                                            val: StrMailFE,
                                            error: false,
                                            msg: ''
                                        },
                                        tipoTercero: 2
                                    });
                                    setLoadInfo(true)
                                    props.EventTipoTercero(IntTipoPersona);
                                } else {
                                    setObjDataInformacionGeneral({
                                        ...objDataInformacionGeneral,
                                        PNombre: {
                                            val: StrNombre1,
                                            error: false,
                                            msg: ''
                                        },
                                        SNombre: {
                                            val: StrNombre2,
                                            error: false,
                                            msg: ''
                                        },
                                        PApellido: {
                                            val: StrApellido1,
                                            error: false,
                                            msg: ''
                                        },
                                        SApellido: {
                                            val: StrApellido2,
                                            error: false,
                                            msg: ''
                                        },
                                        tipoDoc: {
                                            val: tipoDoc,
                                            error: false,
                                            msg: ''
                                        },
                                        documento: {
                                            val: strDataJsonTercero.StrIdTercero,
                                            error: false,
                                            msg: ''
                                        },
                                        telefono: {
                                            val: StrTelefono,
                                            error: false,
                                            msg: ''
                                        },
                                        direccion: {
                                            val: StrDireccion,
                                            error: false,
                                            msg: ''
                                        },
                                        emailFact: {
                                            val: StrMailFE,
                                            error: false,
                                            msg: ''
                                        },
                                        tipoTercero: 1
                                    });
                                    setLoadInfo(true)
                                    props.EventTipoTercero(1);
                                }
                            }
                        }
                    });
            }
        })()
    }, [])

    const EditarForm = () => {
        setObjDataInformacionGeneral({
            ...objDataInformacionGeneral,
            readOnly: false,
            btnAction: 1
        })
    }

    const handleChangeInfoGeneral = (event) => {
        setObjDataInformacionGeneral({
            ...objDataInformacionGeneral,
            [event.target.name]: {
                val: event.target.value,
                error: false,
                msg: ''
            }
        });
    }

    const ActualizarTerceroGeneralHgi = () => {
        axios.post(process.env.REACT_APP_IP_BACK + '/api/terceros/terceroGeneral/',
            objDataInformacionGeneral)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    let usuario = JSON.parse(localStorage.getItem("Usuario"));
                    if (objDataInformacionGeneral.tipoTercero == 1) {
                        usuario.StrNombre = objDataInformacionGeneral.PNombre.val + " " + objDataInformacionGeneral.SNombre.val + " " + objDataInformacionGeneral.PApellido.val + " " + objDataInformacionGeneral.SApellido.val;
                    } else {
                        usuario.StrNombre = objDataInformacionGeneral.razonSocial.val;
                    }
                    localStorage.setItem("Usuario", JSON.stringify(usuario));
                    notify(strResult.data.strMensaje);
                } else {
                    alert(strResult.data.strMensaje);
                    alert("info general");
                }
            });
    }

    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const ValidarFormulario = async () => {
        let error = false;
        if (objDataInformacionGeneral.tipoTercero == 2) {
            if (objDataInformacionGeneral.razonSocial.val == '') {
                await setObjDataInformacionGeneral({
                    ...objDataInformacionGeneral,
                    razonSocial: {
                        ...objDataInformacionGeneral.razonSocial,
                        error: true,
                        msg: '*Ingresar razon social'
                    }
                })
                error = true;
            }
        } else {
            if (objDataInformacionGeneral.PNombre.val == '') {
                await setObjDataInformacionGeneral({
                    ...objDataInformacionGeneral,
                    PNombre: {
                        ...objDataInformacionGeneral.PNombre,
                        error: true,
                        msg: '*Ingresar primer nombre'
                    }
                })
                error = true;
            }
            if (objDataInformacionGeneral.PApellido.val == '') {
                await setObjDataInformacionGeneral({
                    ...objDataInformacionGeneral,
                    PApellido: {
                        ...objDataInformacionGeneral.PApellido,
                        error: true,
                        msg: '*Ingresar primer apellido'
                    }
                })
                error = true;
            }
        }

        if (objDataInformacionGeneral.emailFact.val == '') {
            await setObjDataInformacionGeneral({
                ...objDataInformacionGeneral,
                emailFact: {
                    ...objDataInformacionGeneral.emailFact,
                    error: true,
                    msg: '*Ingresar correo facturación'
                }
            })
            error = true;
        }
        if (objDataInformacionGeneral.telefono.val == '') {
            await setObjDataInformacionGeneral({
                ...objDataInformacionGeneral,
                telefono: {
                    ...objDataInformacionGeneral.telefono,
                    error: true,
                    msg: '*Ingresar teléfono'
                }
            })
            error = true;
        }
        if (objDataInformacionGeneral.direccion.val == '') {
            await setObjDataInformacionGeneral({
                ...objDataInformacionGeneral,
                direccion: {
                    ...objDataInformacionGeneral.direccion,
                    error: true,
                    msg: '*Ingresar dirección'
                }
            })
            error = true;
        }

        return error;
    }

    const ActualizarDatos = (tipo) => {
        if (tipo == 1) {
            ValidarFormulario().then(rpta => {
                if (!rpta) {
                    ActualizarTerceroGeneralHgi();
                    setObjDataInformacionGeneral({
                        ...objDataInformacionGeneral,
                            readOnly: true,
                            btnAction: 0
                    })
                }
            })
        }
    }

    return (
        <Fragment>
            <ToastContainer />
            {
                loadInfo &&
                (<div>
                    <Row>
                        <Col xs={12} lg={4}>
                            <div className='titleForm'>{objDataInformacionGeneral.tipoTercero == 2 ? 'Persona Jurídica' : 'Persona Natural'}</div>
                            <hr />
                        </Col>
                    </Row>
                    {
                        objDataInformacionGeneral.tipoTercero == 2 ?
                            (
                                <>
                                    <Row className='padd-10'>
                                        <Col xs={12} xl={4} className={'labelContainer'}>
                                            <span className={'label'}>Nit:</span>
                                        </Col>
                                        <Col xs={12} xl={8}>
                                            <span className={'label'}>{objDataInformacionGeneral.documento.val}</span>
                                        </Col>
                                    </Row>
                                    <Row className='padd-10'>
                                        <Col xs={12} xl={4} className={'labelContainer'}>
                                            <span className={'label'}>Razón Social:</span>
                                        </Col>
                                        <Col xs={12} xl={8}>
                                            <span className={'label'} style={objDataInformacionGeneral.razonSocial.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataInformacionGeneral.razonSocial.msg}</span>
                                            <span className={'label'}>{objDataInformacionGeneral.razonSocial.val}</span>
                                        </Col>
                                    </Row>
                                </>

                            ) :
                            (
                                <div>
                                    <Row className='padd-10'>
                                        <Col xs={12} xl={4} className={'labelContainer'}>
                                            <span className={'label'}>Tipo de documento:</span>
                                        </Col>
                                        <Col xs={12} xl={8}>
                                            <span className={'label'}>{objDataInformacionGeneral.tipoDoc.val}</span>
                                        </Col>
                                    </Row>
                                    <Row className='padd-10'>
                                        <Col xs={12} xl={4} className={'labelContainer'}>
                                            <span className={'label'}>Nº de Documento:</span>
                                        </Col>
                                        <Col xs={12} xl={8}>
                                            <span className={'label'}>{objDataInformacionGeneral.documento.val}</span>
                                        </Col>
                                    </Row>
                                    <Row className='padd-10'>
                                        <Col xs={12} xl={4} className={'labelContainer'}>
                                            <span className={'label'}>Nombre Completo:</span>
                                        </Col>
                                        <Col xs={12} xl={8}>
                                            <span className={'label'} style={objDataInformacionGeneral.PNombre.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataInformacionGeneral.PNombre.msg}</span>
                                            <span className={'label'}>{objDataInformacionGeneral.PNombre.val + ' ' + objDataInformacionGeneral.SNombre.val + ' ' + objDataInformacionGeneral.PApellido.val + ' ' + objDataInformacionGeneral.SApellido.val}</span>
                                        </Col>
                                    </Row>
                                </div>
                            )
                    }
                    <Row className='padd-10'>
                        <Col xs={12} xl={4} className={'labelContainer'}>
                            <span className={'label'}>Correo facturación:</span>
                        </Col>
                        <Col xs={12} xl={8}>
                            <span className={'label'} style={objDataInformacionGeneral.emailFact.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataInformacionGeneral.emailFact.msg}</span>
                            <Control type={'email'} name={'emailFact'} style={objDataInformacionGeneral.emailFact.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataInformacionGeneral.emailFact.val} readOnly={objDataInformacionGeneral.readOnly} onChange={handleChangeInfoGeneral} />
                        </Col>
                    </Row>
                    {/*<Row >
                        <Col xs={12} xl={4} className={'labelContainer'}>
                            <span className={'label'}>Fecha de nacimiento:</span>
                        </Col>
                        <Col xs={12} xl={8}>
                            <DayPickerInput inputProps={{className:'form-control'}}/>
                        </Col>
                    </Row>*/}
                    <Row className='padd-10'>
                        <Col xs={12} xl={4} className={'labelContainer'}>
                            <span className={'label'}>Telefono de contacto:</span>
                        </Col>
                        <Col xs={12} xl={8}>
                            <span className={'label'} style={objDataInformacionGeneral.telefono.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataInformacionGeneral.telefono.msg}</span>
                            <Control type={'text'} name={'telefono'} style={objDataInformacionGeneral.telefono.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataInformacionGeneral.telefono.val} readOnly={objDataInformacionGeneral.readOnly} onChange={handleChangeInfoGeneral} />
                        </Col>
                    </Row>
                    <Row className='padd-10'>
                        <Col xs={12} xl={4} className={'labelContainer'}>
                            <span className={'label'}>Direccion de Entrega:</span>
                        </Col>
                        <Col xs={12} xl={8}>
                            <span className={'label'} style={objDataInformacionGeneral.direccion.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataInformacionGeneral.direccion.msg}</span>
                            <Control type={'text'} name={'direccion'} style={objDataInformacionGeneral.direccion.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataInformacionGeneral.direccion.val} readOnly={objDataInformacionGeneral.readOnly} onChange={handleChangeInfoGeneral} />
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: '20px' }} className={'centerRow'}>
                        {
                            objDataInformacionGeneral.btnAction == 0 ? (
                                <div className={'buttonGeneral centerRow'} onClick={() => EditarForm()} style={{ width: '100px' }}>
                                    Editar
                                </div>
                            ) : (
                                <div className={'buttonGeneral centerRow'} onClick={() => ActualizarDatos(1)} style={{ width: '100px' }}>
                                    Actualizar
                                </div>
                            )
                        }
                    </Row>
                </div>)
            }
        </Fragment>

    )
}

export default InfoGeneral;