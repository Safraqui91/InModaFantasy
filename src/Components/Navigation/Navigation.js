import React, { Component, useEffect } from 'react';
import LogoWhatsapp from '../../Global/Images/Whatsapp.png';
import LogoInstagram from '../../Global/Images/Instagram.png';
import IconPersona from '../../Global/Images/IconPersona.png';
import Carrito from '../../Global/Images/Carrito.png';
import { FaBars } from "react-icons/fa";
import './Navigation.css';

import { Container, Form, Row, Col } from 'react-bootstrap';
//Redux
import AbrirModal from '../../Redux/Actions/Modal/AbrirModal';
import { getCarrito, addCarrito } from '../../Redux/Actions/Modal/Carrito';
import { getUsuarioLogueado, setUsuarioLogueado } from '../../Redux/Actions/Modal/Usuario';
import { connect } from 'react-redux';
import { withRouter, useRouteMatch } from 'react-router-dom';
import axios from 'axios';
import { ContactoDefault } from '../../variableDeEntorno';
import ReactGA from 'react-ga';
class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blnMenuNavigation: 1,
            blnNavigationIngreso: 1,
            objDatos: {
                email: {
                    val: '',
                    error: false,
                    msg: ''
                },
                pass: {
                    val: '',
                    error: false,
                    msg: ''
                }
            },
            msgRptaError: '',
            filtroTextoGeneral: '',
            lineasActivas: '',
            objCategorias : {},
            objSubCategoriasLineas : {},
            blnMenuSecundario : false,
            codigosLineas: [64,65,66,63,'02',17,68]
        }
    }

    componentDidMount() {
        this.ConsultarCategoriaLineas();
        //Evento navegacion menu
        console.log(localStorage.getItem("Usuario"));
        this.props.setUsuarioLogueado(JSON.parse(localStorage.getItem("Usuario")));
        this.props.addCarrito(JSON.parse(localStorage.getItem("Carrito")));
        document.querySelector('.CtnNavigation .CtnDosNavigation .CtnDosMenu_bar .btn-menu > span').addEventListener('click', () => {
            this.NavigationMenu();
        })
    }
    //Navegacion
    NavigationMenu = async () => {
        if (this.state.blnMenuNavigation == 1) {
            await this.setState({ blnMenuNavigation: 0 });
            document.querySelector('.CtnNavigation .CtnDosNavigation .CtnDosNav ').style.left = '0%';
        } else {
            await this.setState({ blnMenuNavigation: 1 });
            document.querySelector('.CtnNavigation .CtnDosNavigation .CtnDosNav').style.left = '-100%';
        }

        if (this.state.blnNavigationIngreso == 0) {
            await this.setState({ blnNavigationIngreso: 1 });
            document.querySelectorAll('.CtnClienteFormulario')[0].style.top = '-200px';
        }


    }

    //Navegacion ingresar
    NavigationIngreso = async (strType) => {
        if (this.state.blnNavigationIngreso == 1) {
            await this.setState({ blnNavigationIngreso: 0 });
            if (strType == 'Cell') {
                document.querySelectorAll('.CtnClienteFormulario')[0].style.top = '100%';
            } else {
                document.querySelectorAll('.CtnClienteFormulario')[1].style.top = '100%';
            }
        } else {
            await this.setState({ blnNavigationIngreso: 1 });
            if (strType == 'Cell') {
                document.querySelectorAll('.CtnClienteFormulario')[0].style.top = '-200px';
            } else {
                document.querySelectorAll('.CtnClienteFormulario')[1].style.top = '-200px';
            }
        }
        if (this.state.blnMenuNavigation == 0) {
            await this.setState({ blnMenuNavigation: 1 });
            document.querySelector('.CtnNavigation .CtnDosNavigation .CtnDosNav').style.left = '-100%';
        }
    }

    Registrar = () => {
        window.location.href = '/Registro';
    }

    handleChange = (event) => {
        this.setState({
            objDatos: {
                ...this.state.objDatos,
                [event.target.name]: {
                    val: event.target.value,
                    error: false,
                    msg: ''
                }
            },
            msgRptaError: ''
        });
    }

    ValidarFormLogin = async () => {
        let error = false;
        if (this.state.objDatos.pass.val == '') {
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    pass: {
                        ...this.state.objDatos.pass,
                        error: true,
                        msg: '*Ingresar contraseña'
                    }

                }
            })
            error = true;
        }
        if (this.state.objDatos.email.val == '') {
            await this.setState({
                objDatos: {
                    ...this.state.objDatos,
                    email: {
                        ...this.state.objDatos.email,
                        error: true,
                        msg: '*Ingresar usuario'
                    }

                }
            })
            error = true;
        }
        return error;
    }

    LimpiarCampos = () => {
        this.setState({
            objDatos: {
                email: {
                    val: '',
                    error: false,
                    msg: ''
                },
                pass: {
                    val: '',
                    error: false,
                    msg: ''
                }
            }
        })
    }

    Login = () => {
        this.ValidarFormLogin().then(rpta => {
            if (!rpta) {
                axios.post(process.env.REACT_APP_IP_BACK + '/api/usuarios/iniciosesion/',
                    this.state.objDatos)
                    .then(async (strResult) => {
                        console.log(strResult);
                        if (strResult.data.Success) {
                            const { StrNombre, IntTipoTercero, StrIdTercero, intprecio, StrCiudadDescripcion, JsonVendedor } = strResult.data.strMensaje;
                            let UserLogueado = {
                                logueado: true,
                                StrNombre,
                                IntTipoTercero: intprecio,
                                StrIdTercero,
                                StrCiudadDescripcion,
                                JsonVendedor
                            }
                            //Guardamos datos en el redux
                            localStorage.setItem("Usuario", JSON.stringify(UserLogueado));
                            this.props.setUsuarioLogueado(UserLogueado);

                            this.LimpiarCampos();
                            this.NavigationIngreso(1);
                            ReactGA.event({
                                category: 'Ingreso',
                                action: 'Login'
                            });
                            window.location.href = '/MiCuenta';
                        } else {
                            //Controlar error
                            this.setState({
                                msgRptaError: strResult.data.strMensaje
                            })
                        }
                    });
            }
        })
    }

    onMouseEnterMenu =async (url, descripcion)=>{
        let codigo = await this.GetCodigoCategoriaUrl(url);
        this.setState({
            objSubCategoriasLineas : this.state.objCategorias[codigo],
            lineasActivas: {descripcion,url}, 
            blnMenuSecundario: true
        })
        //this.setState({ lineasActivas: {descripcion,url}, blnMenuSecundario: true});
    }

    //Obtener Codigo del tipo de categoria para la busqueda
    GetCodigoCategoriaUrl=async(linea)=>{
        try{
            switch(linea){
                case 'ModaYAccesorios':
                    return '101';
                break;
                case 'Belleza':
                    return '971'
                break;
                case 'Hogar':
                    return '991'
                break;
                case 'FerreteriaYvehiculos':
                    return '901'
                break;
                case 'Papeleria':
                    return '1021'
                break;
                case 'Bisuteria':
                    return '981'
                break;
                case 'Mascotas':
                    return '1001'
                break;
                case 'InsumosMedicos':
                    return '1011'
                break;
                case 'OtrasCategorias':
                    return '68'
                break;
                default:
                    await this.setState({strCodigoCategoria:null});
            }
        }catch(e){
            console.log(e);
        }
    }

    ValidarTipoTercero = ()=>{
        let user = JSON.parse(localStorage.getItem("Usuario"));
        let IntTipoTercero = 3; //Si el usuario no esta logueado se muestra precio 3
        if(user !== null){
            IntTipoTercero = user.IntTipoTercero;
        }
        if(IntTipoTercero == 0){
            IntTipoTercero = 3;
        }
        return IntTipoTercero;
    }

    ConsultarCategoriaLineas = async()=>{
        let IntTipoTercero = this.ValidarTipoTercero();
        this.state.codigosLineas.map(async cod =>{
            await axios.get(process.env.REACT_APP_IP_BACK+'/api/productos/categoria/lineas/'+cod+'/'+IntTipoTercero)
            .then(async (strResult)=>{
                await this.setState({
                    objCategorias : {
                        ...this.state.objCategorias,
                        [cod]: strResult.data.strDataCategoria
                    }
                });
            });
        });
    }

    render() {
        let user = JSON.parse(localStorage.getItem("Usuario"));
        user = user == null ? ContactoDefault : user.JsonVendedor.strCelular;
        return (
            <div className='CtnNavigation'>
                <div className='CtnUnoNavigation'>
                    <Container fluid>
                        <Row>
                            <Col xs={12} md={6}>
                                <div className='CtnUnoBuscador'>
                                    <Form.Control type="text" placeholder="¿Qué estas buscando?"
                                        value={this.state.filtroTextoGeneral}
                                        onChange={(e) => { this.setState({ filtroTextoGeneral: e.target.value }) }}
                                        onKeyPress={(e) => {
                                            if (e.key == 'Enter') {
                                                ReactGA.event({
                                                    category: 'Filtros',
                                                    action: 'Filtro global: ' + this.state.filtroTextoGeneral
                                                });
                                                window.location.href = '/?' + this.state.filtroTextoGeneral;
                                            }
                                        }} />
                                </div>
                            </Col>

                            <Col xs={12} md={6}>
                                <div className='CtnUnoBienvenida'>
                                    {(this.props.UserLogueado.logueado ? <label>{this.props.UserLogueado.StrNombre}</label> : null)}
                                    <div className='CtnUnoImg'>
                                        <a href={'https://api.whatsapp.com/send?phone=57' + user} onClick={() => {
                                            ReactGA.event({
                                                category: 'Redes Sociales',
                                                action: 'Whatsapp'
                                            });
                                        }} target={'_blank'}>
                                            <img src={LogoWhatsapp} />
                                        </a>
                                    </div>
                                    <div className='CtnUnoImg'>
                                        <a href={'https://www.instagram.com/inmodafantasy/'} onClick={() => {
                                            ReactGA.event({
                                                category: 'Redes Sociales',
                                                action: 'Instagram'
                                            });
                                        }} target={'_blank'}>
                                            <img src={LogoInstagram} />
                                        </a>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className='CtnDosNavigation'>
                    <div class="CtnDosMenu_bar">
                        <a class="btn-menu">
                            <span className='CtnNvIcon' style={{ display: this.props.Url == '' ? 'none' : 'inline-block' }}>
                                <FaBars />
                            </span>
                            <span className='CtnCliente'>
                                <div className='CtnClienteImg'>
                                    <img src={IconPersona} />
                                </div>
                                <div className='CtnClienteIngreso'>
                                    {(!this.props.UserLogueado.logueado ? <span onClick={() => { this.NavigationIngreso('Cell') }}>Ingresar</span> : <span>
                                        <a style={{ textDecoration: 'none', color: '#000' }} href={'./MiCuenta'}>
                                            MI CUENTA
                                                </a></span>)}
                                </div>
                                <div className='CtnClienteCarrito' onClick={() => { this.props.AbrirModal('Bolsa') }}>
                                    <span>{this.props.carritodata}</span><img src={Carrito} />
                                </div>
                            </span>
                            <div className='CtnClienteFormulario'>
                                <Row>
                                    <Col xs={3} className={'centrarVertical'}>
                                        <label>Usuario: </label>
                                    </Col>
                                    <Col xs={9}>
                                        <span className={'labelerror'} style={this.state.objDatos.email.error ? { display: 'inline' } : { display: 'none' }} >{this.state.objDatos.email.msg}</span>
                                        <input type='text' className='InputLogin' name='email' value={this.state.objDatos.email.val} onChange={this.handleChange} />
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col className={'centrarVertical'} xs={4}>
                                        <label>Contraseña: </label>
                                    </Col>
                                    <Col xs={8}>
                                        <span className={'labelerror'} style={this.state.objDatos.pass.error ? { display: 'inline' } : { display: 'none' }}>{this.state.objDatos.pass.msg}</span>
                                        <input type={'password'} className='InputLogin' name='pass' value={this.state.objDatos.pass.val} onChange={this.handleChange} />
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col className={'centrarVertical centrarHorizontal'} xs={12}>
                                        <span className={'labelerror'} style={this.state.msgRptaError != '' ? { display: 'inline' } : { display: 'inline' }}>{this.state.msgRptaError}</span>
                                    </Col>
                                </Row>
                                <div className={'buttonGeneral'} onClick={() => this.Login()}>
                                    Entrar
                                        </div>
                                <div className={'buttonGeneral'} onClick={() => this.Registrar()}>
                                    Registro
                                        </div>
                                <hr />
                            </div>

                            <div className='clearfix'></div>
                        </a>
                    </div>
                    <nav className='CtnDosNav' onMouseLeave={() => this.setState({ blnMenuSecundario: false })}>
                        <ul>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('ModaYAccesorios', 'MODA Y ACCESORIOS')}>
                                <a href="./ModaYAccesorios" className={this.props.Url == 'ModaYAccesorios' ? 'active' : ''}>MODA Y ACCESORIOS</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('Belleza', 'BELLEZA')} >
                                <a href="./Belleza" className={this.props.Url == 'Belleza' ? 'active' : ''}>BELLEZA</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('Hogar','HOGAR Y FERRETERÍA')} >
                                <a href="./Hogar" className={this.props.Url == 'Hogar' ? 'active' : ''}>HOGAR</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('FerreteriaYvehiculos','FERRETERIA Y VEHÍCULOS')} >
                                <a href="./FerreteriaYvehiculos" className={this.props.Url == 'FerreteriaYvehiculos' ? 'active' : ''}>FERRETERIA Y VEHÍCULOS</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('Papeleria','PAPELERIA')} >
                                <a href="./Papeleria" className={this.props.Url == 'Papeleria' ? 'active' : ''}>PAPELERIA</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('Bisuteria','BISUTERIA')} >
                                <a href="./Bisuteria" className={this.props.Url == 'Bisuteria' ? 'active' : ''}>BISUTERIA</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('Mascotas','MASCOTAS')} >
                                <a href="./Mascotas" className={this.props.Url == 'Mascotas' ? 'active' : ''}>MASCOTAS</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('InsumosMedicos','INSUMOS MÉDICOS')} >
                                <a href="./InsumosMedicos" className={this.props.Url == 'InsumosMedicos' ? 'active' : ''}>INSUMOS MÉDICOS</a>
                            </li>
                            <li style={{ display: this.props.Url == '' ? 'none' : 'block' }} onMouseEnter={() => this.onMouseEnterMenu('OtrasCategorias','OTRAS CATEGORIAS')} >
                                <a href="./OtrasCategorias" className={this.props.Url == 'OtrasCategorias' ? 'active' : ''}>OTRAS CATEGORIAS</a>
                            </li>

                            <li className='MenuIngreso'>
                                <span className='CtnCliente'>
                                    <div className='CtnClienteImg'>
                                        <img src={IconPersona} />
                                    </div>
                                    <div className='CtnClienteIngreso'>
                                        <span>
                                            {(!this.props.UserLogueado.logueado ? <span onClick={() => { this.NavigationIngreso('Pag') }}>Ingresar</span> : <span>
                                                <a style={{ textDecoration: 'none', color: '#000' }} href={'./MiCuenta'}>
                                                    MI CUENTA
                                                </a></span>)}
                                        </span>
                                    </div>
                                    <div className='CtnClienteCarrito' onClick={() => { this.props.AbrirModal('Bolsa') }}>
                                        <span>{this.props.carritodata}</span>
                                        <div>
                                            <img src={Carrito} />
                                        </div>
                                    </div>
                                </span>
                                <div className='CtnClienteFormulario'>
                                    <Row>
                                        <Col xs={3} className={'centrarVertical'}>
                                            <label>Usuario: </label>
                                        </Col>
                                        <Col xs={9}>
                                            <span className={'labelerror'} style={this.state.objDatos.email.error ? { display: 'inline' } : { display: 'none' }} >{this.state.objDatos.email.msg}</span>
                                            <input type='text' className='InputLogin' name='email' value={this.state.objDatos.email.val} onChange={this.handleChange} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col className={'centrarVertical'} xs={4}>
                                            <label>Contraseña: </label>
                                        </Col>
                                        <Col xs={8}>
                                            <span className={'labelerror'} style={this.state.objDatos.pass.error ? { display: 'inline' } : { display: 'none' }}>{this.state.objDatos.pass.msg}</span>
                                            <input type={'password'} className='InputLogin' name='pass' value={this.state.objDatos.pass.val} onChange={this.handleChange} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col className={'centrarVertical centrarHorizontal'} xs={12}>
                                            <span className={'labelerror'} style={this.state.msgRptaError != '' ? { display: 'inline' } : { display: 'none' }}>{this.state.msgRptaError}</span>
                                        </Col>
                                    </Row>
                                    <div className={'buttonGeneral'} onClick={() => this.Login()}>
                                        Entrar
                                        </div>
                                    <div className={'buttonGeneral'} onClick={() => this.Registrar()}>
                                        Registro
                                        </div>
                                    <hr />
                                </div>
                            </li>
                        </ul>
                    </nav>
                    {
                        this.state.blnMenuSecundario ? (
                            <div className='CtnDosNav' onMouseEnter={() => this.setState({ blnMenuSecundario: true })} onMouseLeave={() => this.setState({ lineasActivas: {}, blnMenuSecundario: false })} style={{ position: 'relative', height: '50%', top: '20', width: '100%', borderTop: '1px solid #a0a0a07a' }}>
                                <Row>
                                {
                                    this.state.objSubCategoriasLineas !== undefined ?(
                                        this.state.objSubCategoriasLineas.map(categoria =>{
                                            return (
                                                <Col sm={4}><a href={"./"+this.state.lineasActivas.url} className='SubCategorias'>{categoria.StrDescripcion}</a></Col>
                                            )
                                        })
                                    ):null
                                }
                                </Row>
                            </div>

                        ) : null
                    }
                </div>
            </div>
        )
    }
}

//actions redux modal
const mapDispatchToProps = {
    AbrirModal,
    getCarrito,
    addCarrito,
    setUsuarioLogueado,
    getUsuarioLogueado
};
export default withRouter(
    connect((state) => {
        return ({
            carritodata: state.Carrito == null ? 0 : state.Carrito.length,
            UserLogueado: state.Usuario == null ? ({
                logueado: false,
                StrNombre: '',
                IntTipoTercero: ''
            }) : state.Usuario
        })
    }, mapDispatchToProps)(Navigation)
);
