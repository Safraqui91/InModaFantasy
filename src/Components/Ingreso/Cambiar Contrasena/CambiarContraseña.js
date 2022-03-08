import Axios from 'axios'
import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Boton from '../../Global/Boton/Boton'
import Card from '../../Global/Card/Card'

export default function CambiarContraseña() {
    const initialState = {
        pass : {
            error : false,
            msg : '',
            val : ''
        },
        confirmPass : {
            error : false,
            msg : '',
            val : ''
        }
    }
    const [dataForm, setDataForm] = useState(initialState)
    const [token, setToken] = useState(null)
    const [error, setError] = useState('')
    const pathName = useLocation().search;
    useEffect(() => {
       (()=>{
           setToken(pathName.split('=')[1]);
       })()
    }, [pathName])

    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const Actualizar = ()=>{
        if(!validarForm()){
            return
        }
        const options = {
            headers: {'authorization': token}
        };
        Axios.put(process.env.REACT_APP_IP_BACK + '/api/usuarios/cambiarclave/',dataForm, options)
        .then(async (res) => {
            if (res.data.Success) {
                notify("Contraseña actualizada con éxito");
                setTimeout(function(){ window.location.href = '/Ingreso'; }, 2001);
            } else {
                //setDataForm(initialState)
                if(res.data.message == "Unauthorized"){
                    setError("Token vencido, por favor solicite la recuperación de la clave nuevamente");
                }else{
                    setError(res.data.strMensaje);
                }
                
            }
        }).catch((e)=>{
            console.log(e)
        });
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

    const validarForm = ()=>{
        let isValid = true;
        setError("");
        let data = {...dataForm};
        if(isEmpty(data.pass.val)){
            data = {
                ...data,
                pass : {
                    ...data.pass,
                    error : true,
                    msg : '*Ingresar una contraseña'
                }
            }
            isValid = false;
        }
        if(isEmpty(data.confirmPass.val)){
            data = {
                ...data,
                confirmPass : {
                    ...data.confirmPass,
                    error : true,
                    msg : '*Confirme la contraseña'
                }
            }
            isValid = false;
        }
        if(dataForm.pass.val !== dataForm.confirmPass.val){
            data = {
                ...data,
                confirmPass : {
                    ...data.confirmPass,
                    error : true,
                    msg : '*Las contraseñas deben coincidir'
                }
            }
            isValid = false;
        }
        if(data.pass.val.length < 8){
            data = {
                ...data,
                pass : {
                    ...data.pass,
                    error : true,
                    msg : '*Ingresar una contraseña válida'
                }
            }
            isValid = false;
        }
        setDataForm(data);
        return isValid;
    }

    return (
        <div className="contenedor-view">
            <ToastContainer />
            <Row className="row-view" style={{justifyContent:'center'}}>
                <Col xs={7}>
                    <Card
                        title='CAMBIAR CONTRASEÑA'
                    >
                        <label>Ingresa tu nueva contraseña</label><br/>
                        <label>Nueva contraseña:</label>
                        <input type='password' className='inputLogin' name='pass' value={dataForm.pass.val} onChange={onChange}></input>
                        <label className="label-error">{dataForm.pass.msg}</label>
                        <label>Confirmar contraseña:</label>
                        <input type='password' className='inputLogin' name='confirmPass' value={dataForm.confirmPass.val} onChange={onChange}></input>
                        <label className="label-error">{dataForm.confirmPass.msg}</label>
                        <Boton text="Actualizar" onClick={Actualizar}/>
                        <label className="label-error">{error}</label>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
