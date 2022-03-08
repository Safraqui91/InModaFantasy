import Axios from 'axios'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Boton from '../../Global/Boton/Boton'
import './RecordadContraseña.css'
import { toast, ToastContainer } from 'react-toastify'

export default function RecordadContraseña() {
    const initialState = {
        email : {
            error : false,
            msg : '',
            val : ''
        }
    }
    const [dataForm, setDataForm] = useState(initialState)
    const [error, setError] = useState('')

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

    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const restablecer = ()=>{
        setError('')
        if(isEmpty(dataForm.email.val)){
            setDataForm({
                ...dataForm,
                email : {
                    ...dataForm.email,
                    error : true,
                    msg : 'Ingresar un correo electrónico'
                }
            })
            return
        }

        Axios.post(process.env.REACT_APP_IP_BACK + '/api/usuarios/enviarTokenEmail/',dataForm)
        .then(async (strResult) => {
            if (strResult.data.Success) {
                notify("Se envió un correo para restablecer su contraseña")
            } else {
                setError(strResult.data.strMensaje);
            }
        });
    }

    return (
        <div className="contenedor-view">
            <ToastContainer />
            <Row className="row-view">
                <Col xs={12}>
                    <label className="label-recordad-contrasena">¿Olvidaste tu contraseña? Por favor, introduce tu correo electrónico.
                    Recibirás un enlace para crear una contraseña nueva.
                    </label>
                    <label className="label-recordad-contrasena">E-mail:</label>
                    <input type='text' className='inputLogin' name='email' value={dataForm.email.val} onChange={onChange} />
                    <label className="label-error">{dataForm.email.msg}</label>
                    <Boton 
                        text="Restablecer contraseña"
                        onClick={restablecer}
                    />
                    <label className="label-error">{error}</label>
                </Col>
            </Row>
        </div>
    )
}
