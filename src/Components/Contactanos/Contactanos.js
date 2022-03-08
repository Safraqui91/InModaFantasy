import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Boton from '../Global/Boton/Boton'
import Card from '../Global/Card/Card'
import { FaWhatsapp } from 'react-icons/fa';
import './Contactanos.css'
import { isEmpty } from 'lodash';
import {isValidEmail} from '../../helpers';
import Axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function Contactanos() {
    const initialState = {
        name : {
            val : '',
            msg : '',
            error : false
        },
        email : {
            val : '',
            msg : '',
            error : false
        },
        phone : {
            val : '',
            msg : '',
            error : false
        },
        city : {
            val : '',
            msg : '',
            error : false
        },
        comments : {
            val : '',
            msg : '',
            error : false
        }
    }
    const [dataForm, setDataForm] = useState(initialState)
    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const handleChange = (e)=>{
        setDataForm({
            ...dataForm,
            [e.target.name] : {
                val : e.target.value,
                msg : '',
                error : false
            }
        })
    }

    const onSubmit =()=>{
        if(!validarForm()){
            return
        }
        Axios.post(process.env.REACT_APP_IP_BACK + '/api/contactanos', dataForm)
        .then(res=>{
            if(res.data.Success){
                setDataForm(initialState)
                notify("Información enviada con éxito!")
            }
        })
    }

    const validarForm = ()=>{
        let isValid = true;
        let dataCopy = {...dataForm};
        if(isEmpty(dataCopy.name.val)){
            dataCopy = {
                ...dataCopy,
                name : {
                    ...dataCopy.name,
                    error : true,
                    msg : 'Ingresar una contraseña'
                }
            }
            isValid = false;
        }
        if(isEmpty(dataCopy.email.val)){
            dataCopy = {
                ...dataCopy,
                email : {
                    ...dataCopy.email,
                    error : true,
                    msg : 'Ingresar un correo electrónico'
                }
            }
            isValid = false;
        }else if(!isValidEmail(dataCopy.email.val)){
            dataCopy = {
                ...dataCopy,
                email : {
                    ...dataCopy.email,
                    error : true,
                    msg : 'Ingresar un correo electrónico válido'
                }
            }
            isValid = false;
        }
        if(isEmpty(dataCopy.phone.val)){
            dataCopy = {
                ...dataCopy,
                phone : {
                    ...dataCopy.phone,
                    error : true,
                    msg : 'Ingresar número de contacto'
                }
            }
            isValid = false;
        } 
        if(isEmpty(dataCopy.city.val)){
            dataCopy = {
                ...dataCopy,
                city : {
                    ...dataCopy.city,
                    error : true,
                    msg : 'Ingresar ciudad'
                }
            }
            isValid = false;
        } 
        /*if(isEmpty(dataCopy.comments.val)){
            dataCopy = {
                ...dataCopy,
                comments : {
                    ...dataCopy.comments,
                    error : true,
                    msg : 'Ingresar un comentario'
                }
            }
            isValid = false;
        } */
        setDataForm(dataCopy);
        return isValid;
    }

    return (
        <div className="contenedor-view">
            <Row className="row-view">
            <ToastContainer />
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        title='¡ESCRÍBENOS!'
                    >
                        <input type='text' className='inputLogin' placeholder="* Tu nombre" name='name' value={dataForm.name.val} onChange={handleChange}/>
                        <label className="label-error">{dataForm.name.msg}</label><br/>
                        <input type='text' className='inputLogin' placeholder="* Tu correo" name='email' value={dataForm.email.val} onChange={handleChange}/>
                        <label className="label-error">{dataForm.email.msg}</label><br/>
                        <input type='text' className='inputLogin' placeholder="* Tu número celular" name='phone' value={dataForm.phone.val} onChange={handleChange}/>
                        <label className="label-error">{dataForm.phone.msg}</label><br/>
                        <input type='text' className='inputLogin' placeholder="* Ciudad" name='city' value={dataForm.city.val} onChange={handleChange}/>
                        <label className="label-error">{dataForm.city.msg}</label><br/>
                        <textarea type='text' className='inputLogin' placeholder="Tus comentarios" name='comments' value={dataForm.comments.val} onChange={handleChange} />
                        <label className="label-error">{dataForm.comments.msg}</label><br/>
                        <Boton text="Enviar" onClick={onSubmit} />
                    </Card>
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        title='NUESTRA LINEA DE WHATSAPP'
                    >
                        <Row>
                            <Col className="padd-logo" xs={3} style={{display:'flex', alignItems:'center'}}>
                                <FaWhatsapp style={{ color: '#D71C7A' }} size='50px' />
                            </Col>
                            <Col className="padd-cero" xs={9}>
                                <label style={{ fontWeight: 'bold' }}>3174349040</label>
                                <label>Lunes a Viernes: 8:30am - 6:00pm
                                Sábados: 8:30am - 2:30pm</label>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}
