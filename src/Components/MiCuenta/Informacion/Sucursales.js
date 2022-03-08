import React, { useEffect, useState, Fragment } from 'react'
import '../MiCuenta.css'
import 'react-day-picker/lib/style.css';
import { Container, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isValidEmail } from '../../../helpers';

let { Control } = Form;

const initialState = {
    nombresSucursal: {
        val: '',
        error: false,
        msg: ''
    },
    telefonoSucursal: {
        val: '',
        error: false,
        msg: ''
    },
    DepartamentoEntrega: {
        val: '',
        error: false,
        msg: ''
    },
    CiudadEntrega: {
        val: '',
        error: false,
        msg: ''
    },
    direccionEntrega: {
        val: '',
        error: false,
        msg: ''
    },
    emailSucursal: {
        val: '',
        error: false,
        msg: ''
    },
    idVinculado: 0,
    readOnly: true,
    btnAction: 0
}

const Sucursales = () => {
    const [TipoFormulario, setTipoFormulario] = useState(1)
    const [detalleFactura, setDetalleFactura] = useState(0)
    const [arrDependencias, setArrDependencias] = useState([])
    const [arrDetalleFact, setArrDetalleFact] = useState([])
    const [objDataSucursal, setObjDataSucursal] = useState(initialState)
    const [objDepartamentos, setObjDepartamentos] = useState([])
    const [objCiudades, setObjCiudades] = useState([])

    useEffect(() => {
        (() => {
            ConsultarDependencias();
            ConsultarDepartamentos();
        })()
    }, [])

    const ConsultarDependencias = () => {
        let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
        //strDataJsonTercero.StrIdTercero = '1017252637';
        axios.get(process.env.REACT_APP_IP_BACK + '/api/dependencias/' + strDataJsonTercero.StrIdTercero)
            .then(async (strResult) => {
                setArrDependencias(strResult.data.strMensaje);
            });
    }

    const ConsultarDepartamentos = () => {
        axios.get(process.env.REACT_APP_IP_BACK + '/api/zonas/departamentos/')
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    setObjDepartamentos(strResult.data.strMensaje);
                    ConsultarCiudades(strResult.data.strMensaje[1].StrIdZona);
                }
            });
    }

    const ConsultarCiudades = (strIdDepartamento, selectCiudad = "") => {
        axios.get(process.env.REACT_APP_IP_BACK + '/api/zonas/ciudades/' + strIdDepartamento)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    let ciudad = selectCiudad == "" ? strResult.data.strMensaje[0].StrIdCiudad : selectCiudad;
                    setObjCiudades(strResult.data.strMensaje);
                    objDataSucursal.CiudadEntrega.val = ciudad;
                }
            });
    }

    const Collapsible = (id) => {
        let datos = arrDependencias.filter(val => val.IntIdVinculado == id);
        DatosFormularioDependencia(datos[0]);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    const ValidarFormulario = async (tipo) => {
        let error = false;
        let copyData = {...objDataSucursal};
        if (copyData.nombresSucursal.val == '') {
            copyData = {
               ...copyData,
                nombresSucursal: {
                   ...copyData.nombresSucursal,
                    error: true,
                    msg: '*Ingresar nombres'
                }
            }
            error = true;
        }
        if (copyData.telefonoSucursal.val == '') {
            copyData = {
               ...copyData,
                telefonoSucursal: {
                   ...copyData.telefonoSucursal,
                    error: true,
                    msg: '*Ingresar telefono'
                }
            }
            error = true;
        }
        if (copyData.direccionEntrega.val == '') {
            copyData = {
               ...copyData,
                direccionEntrega: {
                   ...copyData.direccionEntrega,
                    error: true,
                    msg: '*Ingresar direccion de entrega'
                }
            }
            error = true;
        }
        /*if (copyData.CiudadEntrega.val == '') {
            copyData = {
               ...copyData,
                CiudadEntrega: {
                   ...copyData.CiudadEntrega,
                    error: true,
                    msg: '*Ingresar ciudad de entrega'
                }
            }
            error = true;
        }*/
        if (!isValidEmail(copyData.emailSucursal.val)) {
            copyData = {
               ...copyData,
                emailSucursal: {
                   ...copyData.emailSucursal,
                    error: true,
                    msg: '*Ingresar correo válido'
                }
            }
            error = true;
        }
        setObjDataSucursal(copyData);
        return error;
    }

    const DatosFormularioDependencia = (data) => {
        setObjDataSucursal({
            nombresSucursal: {
                val: data.StrNombre,
                error: false,
                msg: ''
            },
            telefonoSucursal: {
                val: data.StrTelefono,
                error: false,
                msg: ''
            },
            DepartamentoEntrega: {
                val: data.StrIdDepartamento,
                error: false,
                msg: ''
            },
            CiudadEntrega: {
                val: data.StrZona,
                error: false,
                msg: ''
            },
            direccionEntrega: {
                val: data.StrDireccion,
                error: false,
                msg: ''
            },
            emailSucursal: {
                val: data.StrMail,
                error: false,
                msg: ''
            },
            idVinculado: data.IntIdVinculado,
            readOnly: true,
            btnAction: 1
        })
        setObjCiudades([])
        ConsultarCiudades(data.StrIdDepartamento, data.StrZona);
    }

    const handleChangeContactos = (event) => {
        setObjDataSucursal({
            ...objDataSucursal,
            [event.target.name]: {
                val: event.target.value,
                error: false,
                msg: ''
            }
        });
    }

    const handleChange = (event) => {
        setObjDataSucursal({
            ...objDataSucursal,
            [event.target.name]: {
                val: event.target.value,
                error: false,
                msg: ''
            }
        });
        ConsultarCiudades(event.target.value);
    }

    const EditarForm = () => {
        setObjDataSucursal({
            ...objDataSucursal,
            readOnly: false,
            btnAction: 1
        })
    }

    const CrearDependencia = () => {
        let data = { ...objDataSucursal };
        let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
        data.documento = strDataJsonTercero.StrIdTercero;
        ValidarFormulario(3).then(rpta => {
            if (!rpta) {
                axios.post(process.env.REACT_APP_IP_BACK + '/api/dependencias/dependencia/new',
                    data)
                    .then(async (strResult) => {
                        if (strResult.data.Success) {
                            notify(strResult.data.strMensaje);
                            LimpiarCampos();
                            ConsultarDependencias();
                        } else {
                            alert(strResult.data.strMensaje);
                        }
                    }).catch(e=>{
                        alert(e)
                    });
            }
        })
    }

    const ActualizarDatos = () => {
        console.log(objDataSucursal);
        ValidarFormulario(3).then(rpta => {
            if (!rpta) {
                ActualizarTerceroDependenciaHgi();
            }
        })
    }

    const ActualizarTerceroDependenciaHgi = () => {
        let data = { ...objDataSucursal };
        let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario"));
        data.documento = strDataJsonTercero.StrIdTercero;
        axios.post(process.env.REACT_APP_IP_BACK + '/api/dependencias/dependencia/',
            data)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    notify(strResult.data.strMensaje);
                    LimpiarCampos();
                    ConsultarDependencias();
                    ConsultarDepartamentos();
                } else {
                    alert(strResult.data.strMensaje);
                }
            });
    }

    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const LimpiarCampos = () => {
        setObjDataSucursal(initialState)
    }

    return (
        <div>
            <ToastContainer />
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Nombre de la sucursal:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataSucursal.nombresSucursal.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataSucursal.nombresSucursal.msg}</span>
                    <Control type={'text'} name={'nombresSucursal'} style={objDataSucursal.nombresSucursal.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataSucursal.nombresSucursal.val} onChange={handleChangeContactos} />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Telefono de Contacto:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataSucursal.telefonoSucursal.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataSucursal.telefonoSucursal.msg}</span>
                    <Control type={'text'} name={'telefonoSucursal'} style={objDataSucursal.telefonoSucursal.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataSucursal.telefonoSucursal.val} onChange={handleChangeContactos} />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Direccion de entrega:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataSucursal.direccionEntrega.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataSucursal.direccionEntrega.msg}</span>
                    <Control type={'text'} name={'direccionEntrega'} style={objDataSucursal.direccionEntrega.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataSucursal.direccionEntrega.val} onChange={handleChangeContactos} />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Departamento</span>
                </Col>
                <Col xs={12} xl={8}>
                    <Control as={'select'} name={'DepartamentoEntrega'} value={objDataSucursal.DepartamentoEntrega.val} onChange={handleChange}>
                        {
                            objDepartamentos.map(val => (
                                <option value={val.StrIdZona}>{val.StrDescripcion}</option>
                            ))
                        }
                    </Control>
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Ciudad</span>
                </Col>
                <Col xs={12} xl={8}>
                    <Control as={'select'} name={'CiudadEntrega'} value={objDataSucursal.CiudadEntrega.val} onChange={handleChangeContactos}>
                        {
                            objCiudades.map(val => (
                                <option value={val.StrIdCiudad}>{val.StrDescripcion}</option>
                            ))
                        }
                    </Control>
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={4} className={'labelContainer'}>
                    <span className={'label'}>Email:</span>
                </Col>
                <Col xs={12} xl={8}>
                    <span className={'label'} style={objDataSucursal.emailSucursal.error ? { color: 'red', display: 'inline' } : { color: 'red', display: 'none' }} >{objDataSucursal.emailSucursal.msg}</span>
                    <Control type={'email'} name={'emailSucursal'} style={objDataSucursal.emailSucursal.error ? { borderColor: 'red' } : { borderColor: '#ced4da' }} value={objDataSucursal.emailSucursal.val} onChange={handleChangeContactos} />
                </Col>
            </Row>
            <Row style={{ paddingTop: '20px' }} className={'centerRow'}>
                {
                    objDataSucursal.btnAction == 0 ? (
                        <div className={'buttonGeneral centerRow'} onClick={() => CrearDependencia()} style={{ width: '100px' }}>
                            Nuevo
                        </div>
                    ) : (
                        <div className={'buttonGeneral centerRow'} onClick={() => ActualizarDatos()} style={{ width: '100px' }}>
                            Actualizar
                        </div>
                    )
                }
            </Row>
            <ListSucursales arrDependencias={arrDependencias} Collapsible={Collapsible} detalleFactura={detalleFactura} />
        </div>
    )
}

const ListSucursales = ({ arrDependencias, Collapsible, detalleFactura }) => {
    return (
        <Fragment>
            {
                arrDependencias.map((val, index) => (
                    <>
                    <Row style={{background:'#D9D9D9', cursor:'pointer'}} onClick={()=>Collapsible(val.IntIdVinculado)}>
                        <Col className='col-pad-0'>
                            {index == 0 && (<Row style={{justifyContent:'center', background : '#acacad', paddingBlock : '8px'}}>
                                <span className={'label'} style={{fontWeight:'bold', color:'#616160'}}>Nombre de la sucursal</span>
                            </Row>)}
                            <Row style={{justifyContent:'center', padding : '8px'}}>
                                <span className={'label'} style={{color:'#111111'}}>{val.StrNombre}</span>
                            </Row>
                        </Col>
                        <Col  className='col-pad-0'>
                           {index == 0 && ( <Row style={{justifyContent:'center', background : '#acacad', paddingBlock : '8px'}}>
                                <span className={'label'} style={{fontWeight:'bold', color:'#616160'}}>Departamento</span>
                            </Row>)}
                            <Row style={{justifyContent:'center', padding : '8px'}}>
                                <span className={'label'} style={{color:'#111111'}}>{val.StrDepartamento}</span>
                            </Row>
                        </Col>
                        <Col  className='col-pad-0'>
                           {index == 0 && ( <Row style={{justifyContent:'center', background : '#acacad', paddingBlock : '8px'}}>
                                <span className={'label'} style={{fontWeight:'bold', color:'#616160'}}>Ciudad</span>
                            </Row>)}
                            <Row style={{justifyContent:'center', padding : '8px'}}>
                                <span className={'label'} style={{color:'#111111'}}>{val.StrDescripcionCiudad}</span>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={detalleFactura == val.IntIdVinculado ?{ display:'inline'}:{display:'none'}}>
                        {
                            detalleFactura == val.IntIdVinculado ?
                            (
                                <div>
                                        Detalle
                                </div>
                            ):null
                        }
                        
                    </Row>
                    </>
                ))
            }
        </Fragment>
    )
}

export default Sucursales;