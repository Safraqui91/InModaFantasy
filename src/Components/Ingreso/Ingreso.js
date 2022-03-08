import { isEmpty } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Boton from '../Global/Boton/Boton'
import Card from '../Global/Card/Card'
import './Ingreso.css'
import ReactGA from 'react-ga';
import Axios from 'axios'
import { ValidarToken } from '../../helpers';
import RegistroPersonas from './RegistroPersonas'
import RegistroEmpresas from './RegistroEmpresas'
import usuarioContext from '../../Context/Usuario/Context'
let { Control, Text, Check, File } = Form;


export default function Ingreso() {
    const dataInitial = {
        email : {
            error : false,
            msg : '',
            val : ''
        },
        pass : {
            error : false,
            msg : '',
            val : ''
        }
    };
    const {loginUser} = useContext(usuarioContext)
    const [dataForm, setDataForm] = useState(dataInitial)
    const [error, setError] = useState('');
    const [vistaRegistro, setVistaRegistro] = useState({
        type: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async()=>{
            if(await ValidarToken()){
                window.location.href = '/';
            }else{
                setLoading(false);
            }
        })()
    }, [])
    const onKeyDown = (e)=>{
        e.keyCode == "13" && login()
    }



    const onChange = (e)=>{
        setDataForm({
            ...dataForm,
            [e.target.name] : {
                error : false,
                msg : '',
                val : e.target.value
            }
        })
    }

    const login = ()=>{
        if(!validarForm()){
            return
        }
        Axios.post(process.env.REACT_APP_IP_BACK + '/api/usuarios/iniciosesion/',dataForm)
        .then(async (strResult) => {
            if (strResult.data.Success) {
                const { StrNombre, IntTipoTercero, StrIdTercero, intprecio, StrCiudadDescripcion, JsonVendedor } = strResult.data.strMensaje.JsonTercero;
                let UserLogueado = {
                    logueado: true,
                    StrNombre,
                    IntTipoTercero: intprecio,
                    StrIdTercero,
                    StrCiudadDescripcion,
                    JsonVendedor,
                    Token : strResult.data.strMensaje.token,
                    BlDescuento: false,
                }
                loginUser(UserLogueado);
                setDataForm(dataInitial);
                ReactGA.event({
                    category: 'Ingreso',
                    action: 'Login'
                });
                window.location.href = '/MiCuenta';
            } else {
                setError(strResult.data.strMensaje);
            }
        });
    }

    const validarForm = ()=>{
        let isValid = true;
        setError("");
        if(isEmpty(dataForm.pass.val)){
            setDataForm({
                ...dataForm,
                pass : {
                    ...dataForm.pass,
                    error : true,
                    msg : 'Ingresar una contraseña'
                }
            })
            isValid = false;
        }
        if(isEmpty(dataForm.email.val)){
            setDataForm({
                ...dataForm,
                email : {
                    ...dataForm.email,
                    error : true,
                    msg : 'Ingresar un correo electrónico'
                }
            })
            isValid = false;
        } 
        return isValid;
    }

    return (
        <div className="contenedor-view">
            {
                !loading && (
                    <Row className="row-view">
                        {
                            vistaRegistro.type == 1 ? (
                                <RegistroEmpresas setVistaRegistro={setVistaRegistro}/>
                            ) : vistaRegistro.type == 2 ? (
                                <RegistroPersonas setVistaRegistro={setVistaRegistro}/>
                            ) : (
                                <>
                                    <Col xs={12} sm={12} lg={6}>
                                        <Card
                                            title='INICIAR SESIÓN'
                                        >
                                            <label>E-mail:</label>
                                            <input type='text' className='inputLogin' name='email' value={dataForm.email.val} onChange={onChange}></input>
                                            <label className="label-error">{dataForm.email.msg}</label>
                                            <label>Contraseña:</label>
                                            <input type='password' className='inputLogin' name='pass' value={dataForm.pass.val} onKeyDown={onKeyDown} onChange={onChange}></input>
                                            <label className="label-error">{dataForm.pass.msg}</label>
                                            <Boton text="Acceder" onClick={login}/>
                                            <label className="label-error">{error}</label>
                                            <div className="contain-recuperar">
                                                <Link onClick={() => window.location.href = 'RecordarContrasena'}>¿Olvidaste la contraseña?</Link>
                                            </div>
                                        </Card>
                                    </Col >
                                    <Col xs={12} sm={12} lg={6}>
                                        <Card
                                            title='REGISTRARSE'
                                        >
                                            <a href={"https://api.whatsapp.com/send?phone=57" + process.env.REACT_APP_NUMBER_DEFAULT} style={{ textDecoration: 'none' }} target={"_blank"}>
                                            <Boton text="Registrate con un asesor" />
                                            </a>
                                            <Boton text="Empresa" onClick={() => setVistaRegistro({ type: 1 })} />
                                            <Boton text="Persona" onClick={() => setVistaRegistro({ type: 2 })} />
                                        </Card>
                                    </Col>
                                </>
                            )
                        }

                    </Row >
                )
            }
        </div >
    )
}
