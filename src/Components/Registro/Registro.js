import React,{Component} from 'react'
import './Registro.css'
import LogoHome from '../../Global/Images/LogoInmoda.png';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import ImgAyuda from '../../Global/Images/Ayuda.png';
import 'react-day-picker/lib/style.css';
import {Container,Row,Col,Form,Spinner} from 'react-bootstrap';
import axios from 'axios';
import {setUsuarioLogueado} from '../../Redux/Actions/Modal/Usuario';
import { connect } from 'react-redux';
import { withRouter,useHistory } from 'react-router-dom';
import { ContactoDefault} from '../../variableDeEntorno';
import LineasCirculos from '../LineasCirculos/LineasCirculos';
import ReactGA from "react-ga";

let {Control,Text,Check} = Form;

class Registro extends Component{
    constructor(props){
        super(props)
        this.state = {
            objDepartamentos:[],
            objCiudades: [],
            objDatos : {
                email: {
                    val: '',
                    error: false,
                    msg: ''
                },
                confirmaremail: {
                    val: '',
                    error: false,
                    msg: ''
                },
                pass: {
                    val: '',
                    error: false,
                    msg: ''
                },
                confirmarpass: {
                    val: '',
                    error: false,
                    msg: ''
                },
                nombres: {
                    val: '',
                    error: false,
                    msg: ''
                },
                apellidos: {
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
                nit: {
                    val: '',
                    error: false,
                    msg: ''
                },
                razonSocial: {
                    val: '',
                    error: false,
                    msg: ''
                },
                departamento: {
                    val: '',
                    error: false,
                    msg: ''
                },
                ciudad: {
                    val: '',
                    error: false,
                    msg: ''
                },
                tipoPersona:{
                    val: 'NATURAL',
                    error: false,
                    msg: ''
                },
                emailFacturacion:{
                    val: '',
                    error: false,
                    msg: ''
                },
                TipoFormulario: 0,
                file:{
                    val : {}
                }
            },
            msgRptaError: '',
            blnSpinner: false
        }
    }

    componentDidMount(){
        this.ConsultarDepartamentos();
    }

    ConsultarDepartamentos = ()=>{
        axios.get(process.env.REACT_APP_IP_BACK+'/api/zonas/departamentos/')
        .then( async(strResult)=>{
            if(strResult.data.Success){
                this.setState({
                    objDepartamentos : strResult.data.strMensaje
                })
                this.ConsultarCiudades(strResult.data.strMensaje[1].StrIdZona);
            }
        });
    }

    ConsultarCiudades = (strIdDepartamento, selectCiudad = "")=>{
        axios.get(process.env.REACT_APP_IP_BACK+'/api/zonas/ciudades/'+strIdDepartamento)
        .then( async(strResult)=>{
            if(strResult.data.Success){
                let ciudad = selectCiudad == "" ? strResult.data.strMensaje[0].StrIdCiudad : selectCiudad;
                this.setState({
                    objCiudades : strResult.data.strMensaje,
                    objDatos : {
                        ...this.state.objDatos,
                        ciudad : {
                            val: ciudad,
                            error: false,
                            msg: ''
                        }
                    }
                })
            }
        });
    }

    handleChangeDepartamento = (event)=>{
        this.setState({
            objDatos : {
                ...this.state.objDatos,
                [event.target.name]:{
                    val : event.target.value,
                    error: false,
                    msg: ''
                }
            },
            msgRptaError: ''
        });
        this.ConsultarCiudades(event.target.value);
    }

    LimpiarCampos = ()=>{
        this.setState({
            ...this.state,
            objDatos : {
                email: {
                    val: '',
                    error: false,
                    msg: ''
                },
                confirmaremail: {
                    val: '',
                    error: false,
                    msg: ''
                },
                pass: {
                    val: '',
                    error: false,
                    msg: ''
                },
                confirmarpass: {
                    val: '',
                    error: false,
                    msg: ''
                },
                nombres: {
                    val: '',
                    error: false,
                    msg: ''
                },
                apellidos: {
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
                departamento: {
                    val: '',
                    error: false,
                    msg: ''
                },
                ciudad: {
                    val: '',
                    error: false,
                    msg: ''
                },
                nit: {
                    val: '',
                    error: false,
                    msg: ''
                },
                razonSocial: {
                    val: '',
                    error: false,
                    msg: ''
                },
                tipoPersona:{
                    val: 'NATURAL',
                    error: false,
                    msg: ''
                },
                emailFacturacion:{
                    val: '',
                    error: false,
                    msg: ''
                },
                TipoFormulario: 0
            },
            blnSpinner:false
        })
    }

    CambiarFormulario = ()=>{
        this.setState({
            objDatos:{
                ...this.state.objDatos,
                TipoFormulario: this.state.objDatos.TipoFormulario == 0 ? 1 : 0
            }
        })
    }

    RegistrarUsuario = ()=>{
        this.ValidarForm().then(rpta =>{
            if(!rpta){
                this.setState({blnSpinner: true});
                axios.post(process.env.REACT_APP_IP_BACK+'/api/usuarios/registro/',
                this.state.objDatos)
                .then( async(strResult)=>{
                    if(strResult.data.Success){
                        const {StrNombre, IntTipoTercero, StrIdTercero, intprecio, StrCiudadDescripcion, JsonVendedor} = strResult.data.strMensaje;
                        let UserLogueado = {
                            logueado : true,
                            StrNombre,
                            IntTipoTercero: intprecio,
                            StrIdTercero,
                            StrCiudadDescripcion,
                            JsonVendedor
                        }
                        //Guardamos datos en el redux
                        localStorage.setItem("Usuario",JSON.stringify(UserLogueado));
                        this.props.setUsuarioLogueado(UserLogueado);
                        this.LimpiarCampos();
                        ReactGA.event({
                            category: 'Registro',
                            action: 'Sign up'
                        });
                        window.location.href = '/MiCuenta';
                    }else{
                        this.setState({
                            msgRptaError : strResult.data.strMensaje,
                            blnSpinner : false
                        })
                    }
                });
            }else{
                console.log(rpta);
            }
        })
    }

    hasUpperCase = (str) => {
        return str.toLowerCase() == str;
    }

    ValidarForm = async()=>{
        let error = false;
        const regxs = {
            "lower": /^[a-z0-9 ]+$/,
            "upper": /^[A-Z0-9 ]+$/,
            "upperLower": /^[A-Za-z0-9 ]+$/
        }
        if(this.state.objDatos.pass.val == ''){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    pass : {
                        ...this.state.objDatos.pass,
                        error: true,
                        msg: '*Ingresar contraseña'
                    }
                    
                }
            })
            error = true;
        }if(this.state.objDatos.pass.val.length < 8 || this.hasUpperCase(this.state.objDatos.pass.val) || !(this.state.objDatos.pass.val.match(/[0-9]/g) !== null)){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    pass : {
                        ...this.state.objDatos.pass,
                        error: true,
                        msg: '*Contraseña no válida!'
                    }
                    
                }
            })
            error = true;
        }else if(this.state.objDatos.pass.val != this.state.objDatos.confirmarpass.val){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    confirmarpass : {
                        ...this.state.objDatos.confirmarpass,
                        error: true,
                        msg: '*Password no coincide'
                    }
                    
                }
            })
            error = true;
        }
        if(this.state.objDatos.email.val == ''){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    email : {
                        ...this.state.objDatos.email,
                        error: true,
                        msg: '*Ingresar email'
                    }
                    
                }
            })
            error = true;
        }else if(this.state.objDatos.email.val != this.state.objDatos.confirmaremail.val){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    confirmaremail : {
                        ...this.state.objDatos.confirmaremail,
                        error: true,
                        msg: '*Email no coincide'
                    }
                    
                }
            })
            error = true;
        }/*else if(!(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(this.state.objDatos.email.val))){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    email : {
                        ...this.state.objDatos.email,
                        error: true,
                        msg: '*Email incorrecto'
                    }
                }
            })
            error = true;
        }*/

        if(this.state.objDatos.emailFacturacion.val == ''){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    emailFacturacion : {
                        ...this.state.objDatos.emailFacturacion,
                        error: true,
                        msg: '*Ingresar email de facturación'
                    }
                    
                }
            })
            error = true;
        }/*else if(!(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(this.state.objDatos.email.val))){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    email : {
                        ...this.state.objDatos.email,
                        error: true,
                        msg: '*Email incorrecto'
                    }
                }
            })
            error = true;
        }*/

        if(this.state.objDatos.telefono.val == ''){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    telefono : {
                        ...this.state.objDatos.telefono,
                        error: true,
                        msg: '*Ingresar telefono'
                    }
                }
            })
            error = true;
        }
        if(this.state.objDatos.direccion.val == ''){
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    direccion : {
                        ...this.state.objDatos.direccion,
                        error: true,
                        msg: '*Ingresar direccion'
                    }
                }
            })
            error = true;
        }

        

        if(this.state.objDatos.TipoFormulario == 0){
            /**DATOS PERSONALES */
            if(this.state.objDatos.nombres.val == ''){
                await this.setState({
                    objDatos: {
                        ...this.state.objDatos,
                        nombres : {
                            ...this.state.objDatos.nombres,
                            error: true,
                            msg: '*Ingresar nombres'
                        }
                    }
                })
                error = true;
            }
            if(this.state.objDatos.apellidos.val == ''){
                await this.setState({
                    objDatos: {
                        ...this.state.objDatos,
                        apellidos : {
                            ...this.state.objDatos.apellidos,
                            error: true,
                            msg: '*Ingresar apellidos'
                        }
                    }
                })
                error = true;
            }
            if(this.state.objDatos.documento.val == ''){
                await this.setState({
                    objDatos: {
                        ...this.state.objDatos,
                        documento : {
                            ...this.state.objDatos.documento,
                            error: true,
                            msg: '*Ingresar documento'
                        }
                    }
                })
                error = true;
            }
        }else{
            /**DATOS EMPRESA */
            if(this.state.objDatos.ciudad.val == ''){
                await this.setState({
                    objDatos: {
                        ...this.state.objDatos,
                        ciudad : {
                            ...this.state.objDatos.ciudad,
                            error: true,
                            msg: '*Ingresar ciudad'
                        }
                    }
                })
                error = true;
            }
            if(this.state.objDatos.nit.val == ''){
                await this.setState({
                    objDatos: {
                        ...this.state.objDatos,
                        nit : {
                            ...this.state.objDatos.nit,
                            error: true,
                            msg: '*Ingresar nit'
                        }
                    }
                })
                error = true;
            }
            if(this.state.objDatos.razonSocial.val == ''){
                await this.setState({
                    objDatos: {
                        ...this.state.objDatos,
                        razonSocial : {
                            ...this.state.objDatos.razonSocial,
                            error: true,
                            msg: '*Ingresar Razon Social'
                        }
                    }
                })
                error = true;
            }
        }
        return error;
    }

    handleChange = (event)=>{
        this.setState({
            objDatos : {
                ...this.state.objDatos,
                [event.target.name]:{
                    val : event.target.value,
                    error: false,
                    msg: ''
                }
            },
            msgRptaError: ''
        });
    }

    handleChangeFile = (e) =>{
        const file = e.target.files[0]; // accesing file
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({
                objDatos : {
                    ...this.state.objDatos,
                    file :{
                        val : reader.result
                    }
                }
            })
        };
    }


    render(){
        
        return(
            <div>
                <Row className='ContenedorRegistro'>
                    <Col xs={12} sm={12} lg={12} xl={{order:1}}  className={'Col1'}>
                    <Spinner  className='spinner' animation="border"  style={{display:this.state.blnSpinner ? 'inline-block' : 'none', position: "fixed",top: "50%"}}  />
                        <div  className={'ContenedorFormularioRegistro'}>
                            <Row>
                                <Col xs={12} sm={4} lg={4}>
                                    {
                                        this.state.objDatos.TipoFormulario == 0 ?
                                            (<div className={'lblTitulo'}>Registro Personas</div>)
                                        :
                                            (<div className={'lblTitulo'}>Registro Empresa</div>)
                                    }
                                </Col>
                                <Col xs={12} sm={8} lg={8}>
                                    <Row>
                                        <Col xs={6} style={{textAlign:'center'}}>
                                            {
                                                this.state.objDatos.TipoFormulario == 0 ?
                                                    (<div className={'lblTitulo'}>¿Eres empresa?</div>)
                                                :
                                                    (<div className={'lblTitulo'}>¿Eres persona?</div>)
                                            }
                                        </Col>
                                        <Col xs={6} style={{textAlign:'center'}}>
                                            <div className={'buttonGeneral'} onClick={()=>this.CambiarFormulario()}>
                                                Registrate Aqui
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    
                                </Col>
                            </Row>
                            <hr></hr>
                            <small className={'auxLabel'}>Todos los cambios son obligatorios</small>
                            <div className={'lblTitulo'}>Datos de la cuenta</div>
                            <hr/>
                            <div className={'ContenedorDatosCuenta'}>
                                <Row >
                                    <Col xs={4} xl={3} className={'labelContainer'}>
                                        <span className={'label'}>E-mail:</span>
                                    </Col>
                                    <Col xs={8} xl={5}>
                                        <span className={'label'} style={this.state.objDatos.email.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.email.msg}</span>
                                        <Control type={'email'} name={'email'} style={this.state.objDatos.email.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.email.val} onChange={this.handleChange}/>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col xs={4} xl={3} className={'labelContainer'}>
                                        <span className={'label'}>Confirma tu E-mail:</span>
                                    </Col>
                                    <Col xs={8} xl={5}>
                                        <span className={'label'} style={this.state.objDatos.confirmaremail.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.confirmaremail.msg}</span>
                                        <Control type={'email'} name={'confirmaremail'} style={this.state.objDatos.confirmaremail.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.confirmaremail.val} onChange={this.handleChange}/>
                                    </Col>
                                </Row>
                                <Row xs={2} xl={3}>
                                    <Col xs={4} xl={3} className={'labelContainer'}>
                                        <span className={'label'}>Contraseña:</span>
                                    </Col>
                                    <Col xs={8} xl={5}>
                                        <span className={'label'} style={this.state.objDatos.pass.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.pass.msg}</span>
                                        <Control type={'password'} name={'pass'} style={this.state.objDatos.pass.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.pass.val} onChange={this.handleChange}/>
                                    </Col>
                                    <Col xs={4} xl={{order:3}} className={'helpText'}>
                                    </Col>
                                    <Col xs={8} className={'helpText'}>
                                        <span >Tu contraseña debe ser de al menos 8 carácteres y contener al menos una mayúscula y un número.</span>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col xs={4} xl={3} className={'labelContainer'}>
                                        <span className={'label'}>Confirma tu Contraseña:</span>
                                    </Col>
                                    <Col xs={8} xl={5}>
                                        <span className={'label'} style={this.state.objDatos.confirmarpass.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.confirmarpass.msg}</span>
                                        <Control type={'password'} name={'confirmarpass'} style={this.state.objDatos.confirmarpass.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.confirmarpass.val} onChange={this.handleChange}/>
                                    </Col>
                                </Row>
                            </div>
                            {
                                this.state.objDatos.TipoFormulario == 0 ?
                                    (
                                        <div>
                                        <div className={'lblTitulo'}>Datos personales</div>
                                        <hr/> 
                                        <div className={'ContenedorDatosPersonales'}>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Nombres:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <span className={'label'} style={this.state.objDatos.nombres.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.nombres.msg}</span>
                                                    <Control type={'text'}  name={'nombres'} style={this.state.objDatos.nombres.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.nombres.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Apellidos:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <span className={'label'} style={this.state.objDatos.apellidos.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.apellidos.msg}</span>
                                                    <Control type={'text'}  name={'apellidos'} style={this.state.objDatos.apellidos.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.apellidos.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Tipo de documento:</span>
                                                </Col>
                                                <Col xs={8} xl={4}>
                                                    <Control as={'select'} name={'tipoDoc'} style={this.state.objDatos.tipoDoc.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.tipoDoc.val} onChange={this.handleChange}>
                                                        <option value = 'CC-Cedula de ciudadania'>CC-Cedula de ciudadania</option>
                                                        <option value = 'TE-Tarjeta extranjeria'>TE-Tarjeta extranjeria</option>
                                                        <option value = 'CE-Cedula extranjeria'>CE-Cedula extranjeria</option>
                                                        <option value = 'NI-Numero de identificacion tributaria'>NI-Numero de identificacion tributaria</option>
                                                    </Control>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Nº de Documento:</span>
                                                </Col>
                                                <Col xs={8} xl={3}>
                                                    <span className={'label'} style={this.state.objDatos.documento.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.documento.msg}</span>
                                                    <Control type={'text'}  name={'documento'} style={this.state.objDatos.documento.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.documento.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>E-mail facturación:</span>
                                                </Col>
                                                <Col xs={8} xl={4}>
                                                    <span className={'label'} style={this.state.objDatos.emailFacturacion.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.emailFacturacion.msg}</span>
                                                    <Control type={'email'}  name={'emailFacturacion'} style={this.state.objDatos.emailFacturacion.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.emailFacturacion.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Tipo de contribuyente:</span>
                                                </Col>
                                                <Col xs={8} xl={4}>
                                                    <Control as={'select'} name={'tipoPersona'} value={this.state.objDatos.tipoPersona.val} onChange={this.handleChange}>
                                                        <option value = 'NATURAL'>NATURAL</option>
                                                        <option value = 'JURIDICA'>JURIDICA</option>
                                                    </Control>
                                                </Col>
                                            </Row>
                                            {/*<Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Fecha de nacimiento:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <DayPickerInput inputProps={{className:'form-control'}}/>
                                                </Col>
                                            </Row>*/}
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Telefono de contacto:</span>
                                                </Col>
                                                <Col xs={4} xl={3}>
                                                    <span className={'label'} style={this.state.objDatos.telefono.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.telefono.msg}</span>
                                                    <Control type={'text'}  name={'telefono'} style={this.state.objDatos.telefono.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.telefono.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Departamento: </span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    
                                                    <Control as={'select'} name={'departamento'} value={this.state.objDatos.departamento.val} onChange={this.handleChangeDepartamento}>
                                                    {
                                                        this.state.objDepartamentos.map(val =>(
                                                            <option value = {val.StrIdZona}>{val.StrDescripcion}</option>
                                                        ))
                                                    }
                                                    </Control>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col  xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Ciudad: </span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <Control as={'select'} name={'ciudad'} value={this.state.objDatos.ciudad.val} onChange={this.handleChange}>
                                                    {
                                                        this.state.objCiudades.map(val =>(
                                                            <option value = {val.StrIdCiudad}>{val.StrDescripcion}</option>
                                                        ))
                                                    }
                                                    </Control>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Direccion:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <span className={'label'} style={this.state.objDatos.direccion.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.direccion.msg}</span>
                                                    <Control type={'text'}  name={'direccion'} style={this.state.objDatos.direccion.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.direccion.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Adjuntar archivo:</span>
                                                </Col>
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <input type="file" onChange={this.handleChangeFile} />
                                                </Col>
                                            </Row>                                        
                                        </div>
                                        </div>
                                    )
                                :
                                    (
                                        <div>
                                            <div className={'ContenedorDatosEmpresa'}>
                                            <div className={'lblTitulo'}>Datos empresa</div>
                                            <hr/> 
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Nit:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <span className={'label'} style={this.state.objDatos.nit.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.nit.msg}</span>
                                                    <Control type={'text'} name={'nit'} style={this.state.objDatos.nit.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.nit.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Razon social:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <span className={'label'} style={this.state.objDatos.razonSocial.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.razonSocial.msg}</span>
                                                    <Control type={'text'} name={'razonSocial'} style={this.state.objDatos.razonSocial.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.razonSocial.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>E-mail facturación:</span>
                                                </Col>
                                                <Col xs={8} xl={4}>
                                                    <span className={'label'} style={this.state.objDatos.emailFacturacion.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.emailFacturacion.msg}</span>
                                                    <Control type={'email'}  name={'emailFacturacion'} style={this.state.objDatos.emailFacturacion.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.emailFacturacion.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            {/*<Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Rubro:</span>
                                                </Col>
                                                <Col xs={8} xl={4}>
                                                    <Control as={'select'}>
                                                        <option>Cedula de ciudadania</option>
                                                    </Control>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Cargo:</span>
                                                </Col>
                                                <Col xs={8} xl={3}>
                                                    <Control type={'text'}/>
                                                </Col>
                                            </Row>*/}
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Telefono de contacto:</span>
                                                </Col>
                                                <Col xs={4} xl={3}>
                                                    <span className={'label'} style={this.state.objDatos.telefono.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.telefono.msg}</span>
                                                    <Control type={'text'}  name={'telefono'} style={this.state.objDatos.telefono.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.telefono.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Direccion:</span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                <span className={'label'} style={this.state.objDatos.direccion.error ?{color:'red', display:'inline'} : {color:'red', display:'none'}} >{this.state.objDatos.direccion.msg}</span>
                                                <Control type={'text'}  name={'direccion'} style={this.state.objDatos.direccion.error ?{borderColor:'red'} : {borderColor:'#ced4da'}} value={this.state.objDatos.direccion.val} onChange={this.handleChange}/>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Departamento: </span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    
                                                    <Control as={'select'} name={'departamento'} value={this.state.objDatos.departamento.val} onChange={this.handleChangeDepartamento}>
                                                    {
                                                        this.state.objDepartamentos.map(val =>(
                                                            <option value = {val.StrIdZona}>{val.StrDescripcion}</option>
                                                        ))
                                                    }
                                                    </Control>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col  xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Ciudad: </span>
                                                </Col>
                                                <Col xs={8} xl={5}>
                                                    <Control as={'select'} name={'ciudad'} value={this.state.objDatos.ciudad.val} onChange={this.handleChange}>
                                                    {
                                                        this.state.objCiudades.map(val =>(
                                                            <option value = {val.StrIdCiudad}>{val.StrDescripcion}</option>
                                                        ))
                                                    }
                                                    </Control>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <span className={'label'}>Adjuntar archivo:</span>
                                                </Col>
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                    <input type="file" onChange={this.handleChangeFile} />
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={4} xl={3} className={'labelContainer'}>
                                                </Col>
                                                <Col xs={8} xl={9}>
                                                    <Check 
                                                        type={'checkbox'}
                                                        id={`novedades`}
                                                        label={'Deseo recibir información con las últimas novedades y promociones sobre productos y servicios por E-mail.'}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        </div>    
                                    )
                            }
                            <hr/>
                            <div className={'ContenedorPieFormulario'}>
                                <Row >
                                    <Col xs={12} className={'labelContainer ContenedorCentrado'}>
                                        {
                                            this.state.msgRptaError != ''?
                                            (
                                                <div style={{color: 'red'}}>{this.state.msgRptaError}</div>
                                            ):null
                                        }
                                    </Col>
                                    <Col xs={12} className={'ContenedorCentrado'}>
                                        <div className={'button'} onClick={()=>this.RegistrarUsuario()}>
                                            Enviar Registro
                                        </div>
                                        <span>Al completar este registro, acepta nuestros <a href={'#'}>Términos de servicio.</a></span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} lg={12} xl={5} className={'Col2'}>
                        <div className='CtnImage'>
                            <img src={LogoHome}/>
                        </div>  
                        <LineasCirculos />
                        <div className='CtnAyuda'>  
                        <div className='CtnAyudaImg'>
                            <span></span>
                            <div><img src={ImgAyuda}/></div>
                            <span></span>
                        </div>

                        

                        <div className='CtnAyudaTexto'>
                            <p><a className='BtnAyuda' style={{color:'#777'}} href={'https://api.whatsapp.com/send?phone=57'+ContactoDefault} target={'_blank'}>¿Te ayudamos en tu compra?</a></p>
                        </div>  
                    </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

//actions redux modal
const mapDispatchToProps = {
    setUsuarioLogueado
};
export default withRouter(
    connect((state)=>{
        
    },mapDispatchToProps)(Registro)
);
