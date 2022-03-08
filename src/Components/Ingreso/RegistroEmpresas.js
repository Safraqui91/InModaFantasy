import { forEach, isEmpty, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Col, Row, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Boton from '../Global/Boton/Boton'
import Card from '../Global/Card/Card'
import './Ingreso.css'
import ReactGA from 'react-ga';
import Axios from 'axios'
import { ValidarToken } from '../../helpers';
let { Control, Text, Check, File } = Form;

export default function RegistroEmpresas({ setVistaRegistro }) {
    const initialState = {
        names: {
            error: false,
            msg: '',
            val: ''
        },
        phone: {
            error: false,
            msg: '',
            val: ''
        },
        tipoDoc: {
            val: 'CC',
            error: false,
            msg: ''
        },
        documento: {
            val: '',
            error: false,
            msg: ''
        },
        email: {
            error: false,
            msg: '',
            val: ''
        },
        pass: {
            error: false,
            msg: '',
            val: ''
        },
        passConfirm: {
            error: false,
            msg: '',
            val: ''
        },
        file: {
            error: false,
            msg: '',
            val: []
        },
        departament: {
            error: false,
            msg: '',
            val: ''
        },
        city: {
            error: false,
            msg: '',
            val: ''
        },
        address: {
            error: false,
            msg: '',
            val: ''
        },
        checkInfoEmail: {
            error: false,
            msg: '',
            val: false
        },
        checkPoliticas: {
            error: false,
            msg: '',
            val: false
        }
    };
    const [dataForm, setDataForm] = useState(initialState)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1);

    const onChange = (e) => {
        console.log(e.target.name);
        setDataForm({
            ...dataForm,
            [e.target.name]: {
                error: false,
                msg: '',
                val: e.target.type == "checkbox" ? !dataForm[e.target.name].val : e.target.value
            }
        })
    }

    const Registrar = () => {
        if (!ValidarStep(3)) {
            return
        }
        const formData = new FormData();
        const array = dataForm.file.val;
        for (let index = 0; index < array.length; index++) {
            const file = array[index];
            formData.append('file', file)
        }
        formData.append('names', dataForm.names.val)
        formData.append('lastName', '')
        formData.append('email', dataForm.email.val)
        formData.append('pass', dataForm.pass.val)
        formData.append('checkInfoEmail', dataForm.checkInfoEmail.val)
        formData.append('documento', dataForm.documento.val)
        formData.append('TipoFormulario', 0)
        formData.append('phone', dataForm.phone.val)
        formData.append('address', dataForm.address.val)
        formData.append('TipoDoc', dataForm.tipoDoc.val)
        formData.append('city', dataForm.city.val)
        Axios.post(process.env.REACT_APP_IP_BACK + '/api/usuarios/registro/', formData)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    localStorage.setItem("Usuario", JSON.stringify(strResult.data.data));
                    ReactGA.event({
                        category: 'Registro',
                        action: 'Sign up'
                    });
                    window.location.href = '/MiCuenta';
                } else {
                    setError(strResult.data.strMensaje);
                }
            });
    }

    const validarForm = () => {
        let isValid = true;
        //setError("");
        let data = { ...dataForm };
        if (!data.checkPoliticas.val) {
            setError("Debe aceptar las políticas de tratamiento")
            isValid = false;
        }
        if (isEmpty(data.documento.val)) {
            data = {
                ...data,
                documento: {
                    ...data.documento,
                    error: true,
                    msg: '*Ingresar documento'
                }
            }
            isValid = false;
        }
        if (isEmpty(data.pass.val)) {
            data = {
                ...data,
                pass: {
                    ...data.pass,
                    error: true,
                    msg: '*Ingresar una contraseña'
                }
            }
            isValid = false;
        }
        if (data.pass.val.length < 8) {
            data = {
                ...data,
                pass: {
                    ...data.pass,
                    error: true,
                    msg: '*Ingresar una contraseña válida'
                }
            }
            isValid = false;
        }
        if (isEmpty(data.email.val)) {
            data = {
                ...data,
                email: {
                    ...data.email,
                    error: true,
                    msg: '*Ingresar un correo electrónico'
                }
            }
            isValid = false;
        }
        if (isEmpty(data.names.val)) {
            data = {
                ...data,
                names: {
                    ...data.names,
                    error: true,
                    msg: '*Ingresar nombres completos'
                }
            }
            isValid = false;
        }
        if (isEmpty(data.passConfirm.val)) {
            data = {
                ...data,
                passConfirm: {
                    ...data.passConfirm,
                    error: true,
                    msg: '*Confirmar contraseña'
                }
            }
            isValid = false;
        }
        if (data.pass.val !== data.passConfirm.val) {
            data = {
                ...data,
                passConfirm: {
                    ...data.passConfirm,
                    error: true,
                    msg: '*Las contraseñas deben coincidir'
                }
            }
            isValid = false;
        }
        setDataForm(data);
        return isValid;
    }

    const ValidarStep = (step) => {
        let isValid = true;
        let data = { ...dataForm };
        switch (step) {
            case 1:
                if (isEmpty(data.names.val)) {
                    data = {
                        ...data,
                        names: {
                            ...data.names,
                            error: true,
                            msg: '*Ingresar nombres completos'
                        }
                    }
                    isValid = false;
                }
                if (isEmpty(data.phone.val)) {
                    data = {
                        ...data,
                        phone: {
                            ...data.phone,
                            error: true,
                            msg: '*Ingresar número de contacto'
                        }
                    }
                    isValid = false;
                }
                break;
            case 2:
                if (isEmpty(data.documento.val)) {
                    data = {
                        ...data,
                        documento: {
                            ...data.documento,
                            error: true,
                            msg: '*Ingresar documento'
                        }
                    }
                    isValid = false;
                }
                if (isEmpty(data.pass.val)) {
                    data = {
                        ...data,
                        pass: {
                            ...data.pass,
                            error: true,
                            msg: '*Ingresar una contraseña'
                        }
                    }
                    isValid = false;
                }
                if (data.pass.val.length < 8) {
                    data = {
                        ...data,
                        pass: {
                            ...data.pass,
                            error: true,
                            msg: '*Ingresar una contraseña válida'
                        }
                    }
                    isValid = false;
                }
                if (isEmpty(data.email.val)) {
                    data = {
                        ...data,
                        email: {
                            ...data.email,
                            error: true,
                            msg: '*Ingresar un correo electrónico'
                        }
                    }
                    isValid = false;
                }
                break;
            case 3:
                if (!data.checkPoliticas.val) {
                    setError("Debe aceptar las políticas de tratamiento")
                    isValid = false;
                }
                if (isEmpty(data.address.val)) {
                    data = {
                        ...data,
                        address: {
                            ...data.address,
                            error: true,
                            msg: '*Ingresar una dirección'
                        }
                    }
                    isValid = false;
                }
                break;
            default:
                break;
        }
        setDataForm(data);
        return isValid;
    }

    return (
        <Col xs={12}>
            <Row className="row-column-flex">
                <Row>
                    <Col xs={4}>
                        <Boton text="Regresar" onClick={() => setVistaRegistro({ type: 0 })} />
                    </Col>
                    <Col xs={8}>
                        <a href={"https://api.whatsapp.com/send?phone=57" + process.env.REACT_APP_NUMBER_DEFAULT} style={{ textDecoration: 'none' }} target={"_blank"}>
                            <Boton text="Registrate con un asesor" />
                        </a>
                    </Col>
                </Row>
                <Col xs={12}>
                    <div className='title-form'>Registro Persona Júridica (Empresa)</div>
                    <hr />
                </Col>
                <Col xs={12}>
                    <label className='label-small'>Todos los campos son obligatorios</label><br />
                </Col>
                <Col xs={12}>
                    <div className="subtitle-form">Datos de la cuenta</div>
                    <hr />
                </Col>
            </Row>


            {
                step == 1 ? (
                    <Step1
                        dataForm={dataForm}
                        onChange={onChange}
                        ValidarStep={(step) => { ValidarStep(step) && setStep(2) }}
                    />
                ) : step == 2 ? (
                    <Step2
                        dataForm={dataForm}
                        onChange={onChange}
                        ValidarStep={(step) => { ValidarStep(step) && step == 1 ? setStep(1) : setStep(3) }}
                    />
                ) : step == 3 && (
                    <Step3
                        dataForm={dataForm}
                        onChange={onChange}
                        Registrar={Registrar}
                        error={error}
                        setDataForm={setDataForm}
                        ValidarStep={(step) => { ValidarStep(step) && setStep(2) }}
                    />
                )
            }







            {/*<Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Adjuntar Archivo:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <File
                        id="custom-file-translate-html"
                        label={dataForm.file.val == "" ? "Adjuntar RUT o documento de identidad" : map(dataForm.file.val, file => file.name+" ")}
                        data-browse="Explorar"
                        name="file"
                        onChange={onChange}
                        custom
                        multiple
                    />
                </Col>
            </Row>*/}
        </Col>
    )
}



const Step1 = ({ dataForm, onChange, error, ValidarStep }) => {

    const onKeyDown = (e)=>{
        e.keyCode == "13" && ValidarStep(1)
    }

    return (
        <>
            <Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Nombre de la empresa:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <input className='inputLogin' type='text' value={dataForm.names.val} name='names' onChange={onChange} />
                    <label className="label-error">{dataForm.names.msg}</label>
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Número de contacto:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <input onKeyDown={onKeyDown} className='inputLogin' type='text' name='phone' value={dataForm.phone.val} onChange={onChange} />
                    <label className="label-error">{dataForm.phone.msg}</label>
                </Col>
            </Row>
            <Row className='contain-center'>
                <Boton text="Continuar" onClick={() => ValidarStep(1)} />
                <label className="label-error">{error}</label>
            </Row>
        </>
    )
}

const Step2 = ({ dataForm, onChange, ValidarStep, error }) => {

    const onKeyDown = (e)=>{
        e.keyCode == "13" && ValidarStep(2)
    }
    return (
        <>
            <Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Tipo de documento:</span>
                    <Control as={'select'} name={'tipoDoc'} style={{ height: '24px', fontSize: 'small', padding: '0px' }} value={dataForm.tipoDoc.val} onChange={onChange}>
                        <option value='CC'>CC</option>
                        <option value='TE'>TE</option>
                        <option value='CE'>CE</option>
                        <option value='NI'>NI</option>
                    </Control>
                </Col>
                <Col xs={12} xl={7}>
                    <span className={'label'}>Nº de Documento:</span>
                    <input type='text' className='inputLogin' name='documento' value={dataForm.documento.val} onChange={onChange} />
                    <label className="label-error">{dataForm.documento.msg}</label>
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>E-mail:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <input type='email' className='inputLogin' name='email' value={dataForm.email.val} onChange={onChange} />
                    <label className="label-error">{dataForm.email.msg}</label>
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Contraseña:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <input type='password' className='inputLogin' name='pass' value={dataForm.pass.val} onChange={onChange} />
                    <label className="label-error">{dataForm.pass.msg}</label>
                </Col>
            </Row>
            <Row >
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Confirmar tu contraseña:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <Row >
                        <Col xs={12} className='padd-cero'>
                            <input onKeyDown = {onKeyDown} type='password' className='inputLogin' name='passConfirm' value={dataForm.passConfirm.val} onChange={onChange} />
                            <label className="label-error">{dataForm.passConfirm.msg}</label>
                        </Col>
                        <Col xs={12}>
                            <span className='label' style={{ fontSize: '10px' }}>Tu contraseña debe ser de al menos 8 carácteres,
                                contener al menos una mayúscula y un número.</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='contain-center'>
                <Col xs={6}>
                    <Boton text="Regresar" onClick={() => ValidarStep(1)} />
                </Col>
                <Col xs={6}>
                    <Boton text="Continuar" onClick={() => ValidarStep(2)} />
                </Col>
                <label className="label-error">{error}</label>
            </Row>
        </>
    )
}

const Step3 = ({ dataForm, onChange, Registrar, error, setDataForm, ValidarStep }) => {
    useEffect(() => {
        (() => {
            ConsultarDepartamentos();
        })()
    }, [])
    const [objDepartamentos, setObjDepartamentos] = useState([])
    const [objCiudades, setObjCiudades] = useState([])

    const ConsultarDepartamentos = () => {
        Axios.get(process.env.REACT_APP_IP_BACK + '/api/zonas/departamentos/')
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    setObjDepartamentos(strResult.data.strMensaje);
                    ConsultarCiudades(strResult.data.strMensaje[1].StrIdZona);
                }
            });
    }

    const ConsultarCiudades = (strIdDepartamento, selectCiudad = "") => {
        Axios.get(process.env.REACT_APP_IP_BACK + '/api/zonas/ciudades/' + strIdDepartamento)
            .then(async (strResult) => {
                if (strResult.data.Success) {
                    let ciudad = selectCiudad == "" ? strResult.data.strMensaje[0].StrIdCiudad : selectCiudad;
                    setObjCiudades(strResult.data.strMensaje);
                    setDataForm({
                        ...dataForm,
                        city: {
                            val: ciudad,
                            error: false,
                            msg: ''
                        }
                    })
                }
            });
    }

    return (
        <>
            <Row className='padd-10'>
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Departamento: </span>
                    <Control as={'select'} name={'departament'} value={dataForm.departament.val} onChange={(e) => { ConsultarCiudades(e.target.value) }}>
                        {
                            objDepartamentos.map(val => (
                                <option value={val.StrIdZona}>{val.StrDescripcion}</option>
                            ))
                        }
                    </Control>
                </Col>
                <Col xs={12} xl={7}>
                    <span className={'label'}>Ciudad: </span>
                    <Control as={'select'} name={'city'} value={dataForm.city.val} onChange={(e) => {
                        setDataForm({
                            ...dataForm,
                            city: {
                                val: e.target.value,
                                error: false,
                                msg: ''
                            }
                        })
                    }}>
                        {
                            objCiudades.map(val => (
                                <option value={val.StrIdCiudad}>{val.StrDescripcion}</option>
                            ))
                        }
                    </Control>
                </Col>
            </Row>
            <Row className='padd-10' >
                <Col xs={12} xl={5} className={'labelContainer'}>
                    <span className={'label'}>Direccion:</span>
                </Col>
                <Col xs={12} xl={7}>
                    <input type='text' className='inputLogin' name='address' value={dataForm.address.val} onChange={onChange} />
                    <label className="label-error">{dataForm.address.msg}</label>
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12}>
                    <Check
                        type={'checkbox'}
                        id={`novedades`}
                        name='checkInfoEmail'
                        checked={dataForm.checkInfoEmail.val}
                        onChange={onChange}
                        label={'Deseo recibir información con las últimas novedades, promociones sobre productos y servivos por E-mail.'}
                    />
                </Col>
            </Row>
            <Row className='padd-10'>
                <Col xs={12}>
                    <Check
                        type={'checkbox'}
                        id={`politicas`}
                        name='checkPoliticas'
                        checked={dataForm.checkPoliticas.val}
                        onChange={onChange}
                        label={'Acepto las politicas de tratamiento de base de datos.'}
                    />
                </Col>
            </Row>
            <Row className='contain-center'>
                <Col xs={6}>
                    <Boton text="Regresar" onClick={() => ValidarStep(2)} />
                </Col>
                <Col xs={6}>
                    <Boton text="Enviar Registro" onClick={Registrar} />
                </Col>
                <label className="label-error">{error}</label>
            </Row>
        </>
    )
}