import React, { useState, useEffect, Fragment } from 'react'
import '../MiCuenta.css'
import 'react-day-picker/lib/style.css';
import { Container, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let { Control } = Form;

const Sucursales = () => {
    const initialData = {
        nombre: {
            val: '',
            error: false,
            msg: ''
        },
        apellido: {
            val: '',
            error: false,
            msg: ''
        },
        telefono: {
            val: '',
            error: false,
            msg: ''
        },
        cedula: {
            val: '',
            error: false,
            msg: ''
        },
        compra: {
            val: false,
        },
        paga: {
            val: false,
        },
        idContacto: ''
    }
    const [btnAction, setBtnAction] = useState(0)
    const [contactos, setContactos] = useState([])
    const [objDataContacto, setObjDataContacto] = useState(initialData)

    useEffect(() => {
        (() => {
            ConsultarContactos()
        })()
    }, [])

    const ConsultarContactos = () => {
        let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
        //strDataJsonTercero.StrIdTercero = '900433668';
        axios.get(process.env.REACT_APP_IP_BACK + '/api/contactos/' + strDataJsonTercero.StrIdTercero)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    setContactos(strResult.data.strData)
                } else {
                    alert("error contactos " + strResult.data.strMensaje);
                }
            });
    }

    const handleChange = (event) => {
        setObjDataContacto({
            ...objDataContacto,
            [event.target.name]: {
                val: event.target.value,
                error: false,
                msg: ''
            }
        });
    }

    const handleChangeCheck = (event) => {
        setObjDataContacto({
            ...objDataContacto,
            [event.target.name]: {
                val: event.target.checked
            }
        });
    }

    const ValidarFormulario = async () => {
        let error = false;
        if (objDataContacto.nombre.val == '') {
            setObjDataContacto({
                ...objDataContacto,
                nombre: {
                    ...objDataContacto.nombre,
                    error: true,
                    msg: '*Ingresar nombres'
                }
            })
            error = true;
        }
        if (objDataContacto.apellido.val == '') {
            setObjDataContacto({
                ...objDataContacto,
                apellido: {
                    ...objDataContacto.apellido,
                    error: true,
                    msg: '*Ingresar apellidos'
                }
            })
            error = true;
        }
        if (objDataContacto.cedula.val == '') {
            setObjDataContacto({
                ...objDataContacto,
                cedula: {
                    ...objDataContacto.cedula,
                    error: true,
                    msg: '*Ingresar cédula'
                }
            })
            error = true;
        }
        return error;
    }

    const FormatearDatos = () => {
        let data = { ...objDataContacto };
        let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
        data.StrIdTercero = strDataJsonTercero.StrIdTercero;
        return data;
    }

    const CrearContactoHgi = () => {
        ValidarFormulario().then(res => {
            if (!res) {
                try {
                    let data = FormatearDatos();
                    axios.post(process.env.REACT_APP_IP_BACK + '/api/contactos/',
                        data)
                        .then(async (strResult) => {
                            if (strResult.data.Success) {
                                notify(strResult.data.strMensaje);
                                LimpiarCampos();
                                ConsultarContactos();
                            } else {
                                notify("Hubo un error, verifique los datos!");
                            }
                        });
                } catch (error) {
                    alert(error)
                    alert("Contactos");
                }
            }
        })
    }

    const LimpiarCampos = () => {
        setObjDataContacto(initialData)
        setBtnAction(0)
    }

    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const EditarDatos = (id) => {
        let datos = contactos.filter(val => val.StrIdContacto == id);
        DatosFormularioContactos(datos[0]);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    const DatosFormularioContactos = (contacto) => {
        console.log(contacto)
        setObjDataContacto({
            nombre: {
                val: contacto.StrNombres,
                error: false,
                msg: ''
            },
            apellido: {
                val: contacto.StrApellidos,
                error: false,
                msg: ''
            },
            cedula: {
                val: contacto.StrIdContacto,
                error: false,
                msg: ''
            },
            telefono: {
                val: contacto.StrTelefono == "" ? contacto.StrCelular : contacto.StrTelefono,
                error: false,
                msg: ''
            },
            compra: {
                val: contacto.StrCompra == 0 ? false : true,
            },
            paga: {
                val: contacto.StrPaga == 0 ? false : true,
            },
            idContacto: contacto.StrIdContacto
        })
        setBtnAction(1)
    }

    const ActualizarContactoHgi = () => {
        ValidarFormulario().then(res => {
            if (!res) {
                let data = FormatearDatos();
                axios.put(process.env.REACT_APP_IP_BACK + '/api/contactos/',
                    data)
                    .then(async (strResult) => {
                        if (strResult.data.Success) {
                            notify(strResult.data.strMensaje);
                            LimpiarCampos();
                            ConsultarContactos();
                        } else {
                            alert(strResult.data.strMensaje);
                            alert("actualizar contacto");
                        }
                    });
            }
        })
    }

    return (
        <Fragment>
            <ToastContainer />
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>C.C.</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataContacto.cedula.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataContacto.cedula.msg}</span>
                    <Control type={'text'} name={'cedula'} style={objDataContacto.cedula.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataContacto.cedula.val} onChange={handleChange} />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Nombres:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataContacto.nombre.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataContacto.nombre.msg}</span>
                    <Control type={'text'} name={'nombre'} style={objDataContacto.nombre.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataContacto.nombre.val} onChange={handleChange} />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Apellidos:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataContacto.apellido.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataContacto.apellido.msg}</span>
                    <Control type={'text'} name={'apellido'} style={objDataContacto.apellido.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataContacto.apellido.val} onChange={handleChange} />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Teléfono de contacto:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataContacto.telefono.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataContacto.telefono.msg}</span>
                    <Control type={'text'} name={'telefono'} style={objDataContacto.telefono.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataContacto.telefono.val} onChange={handleChange} />
                </Col>
            </Row>
            <Row >
                <Col xs={6} className={'labelContainer'}>
                    <label className={'label'} style={{ display: 'flex', alignItems: 'center' }}>
                        Compra
                        <input
                            style={{ margin: '10px' }}
                            name="compra"
                            type="checkbox"
                            checked={objDataContacto.compra.val}
                            onChange={handleChangeCheck} />
                    </label>
                    <label className={'label'} style={{ display: 'flex', alignItems: 'center' }}>
                        Paga
                        <input
                            style={{ margin: '10px' }}
                            name="paga"
                            type="checkbox"
                            checked={objDataContacto.paga.val}
                            onChange={handleChangeCheck} />
                    </label>
                </Col>
            </Row>
            <Row style={{ paddingTop: '20px' }} className={'centerRow'}>
                {
                    btnAction == 0 ? (
                        <div className={'buttonGeneral centerRow'} onClick={() => CrearContactoHgi()} style={{ width: '100px' }}>
                            Nuevo
                        </div>
                    ) : (
                        <div className={'buttonGeneral centerRow'} onClick={() => ActualizarContactoHgi()} style={{ width: '100px' }}>
                            Actualizar
                        </div>
                    )
                }
            </Row>
            <ListContactos contactos={contactos} EditarDatos={EditarDatos} />
        </Fragment>
    )
}

const ListContactos = ({ contactos, EditarDatos }) => {
    return (
        <Fragment>
            {
                contactos.map((val, index) => (
                    <Row style={{ background: '#D9D9D9', cursor: 'pointer' }} onClick={() => EditarDatos(val.StrIdContacto)}>
                        <Col xs={3}  className='col-pad-0'>
                            {index == 0 && (<Row style={{ justifyContent: 'center', background: '#acacad', paddingBlock: '8px' }}>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Nombres</span>
                            </Row>)}
                            <Row style={{ justifyContent: 'center' , padding : '8px'}}>
                                <span className={'label'} style={{ color: '#111111' }}>{val.StrNombres}</span>
                            </Row>
                        </Col>
                        <Col xs={3}  className='col-pad-0'>
                            {index == 0 && (<Row style={{ justifyContent: 'center', background: '#acacad', paddingBlock: '8px' }}>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Apellidos</span>
                            </Row>)}
                            <Row style={{ justifyContent: 'center' , padding : '8px'}}>
                                <span className={'label'} style={{ color: '#111111' }}>{val.StrApellidos}</span>
                            </Row>
                        </Col>
                        <Col xs={3}  className='col-pad-0'>
                            {index == 0 && (<Row style={{ justifyContent: 'center', background: '#acacad', paddingBlock: '8px' }}>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Compra</span>
                            </Row>)}
                            <Row style={{ justifyContent: 'center' , padding : '8px'}}>
                                <span className={'label'} style={{ color: '#111111' }}>{val.StrCompra == '0' ? 'NO' : 'SI'}</span>
                            </Row>
                        </Col>
                        <Col xs={3}  className='col-pad-0'>
                            {index == 0 && (<Row style={{ justifyContent: 'center', background: '#acacad', paddingBlock: '8px' }}>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Paga</span>
                            </Row>)}
                            <Row style={{ justifyContent: 'center' , padding : '8px'}}>
                                <span className={'label'} style={{ color: '#111111' }}>{val.StrPaga == '0' ? 'NO' : 'SI'}</span>
                            </Row>
                        </Col>
                    </Row>
                ))
            }
        </Fragment>
    )
}

export default Sucursales;