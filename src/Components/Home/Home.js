import React, {Component} from 'react';
import FondoPrincipalHome from '../../Global/Images/FondoPrincipalHome.png';
import LogoHome from '../../Global/Images/LogoInmoda.png';
import LogoModaYAccesorios from '../../Global/Images/img/Modayaccesorios.png';
import LogoBelleza from '../../Global/Images/img/Belleza.png';
import LogoHogar from '../../Global/Images/img/Hogar.png';
import LogoFerreteria from '../../Global/Images/img/Ferreteria.png';
import LogoPapeleria from '../../Global/Images/img/Papeleria.png';
import LogoBisuteria from '../../Global/Images/img/Bisuteria.png';
import LogoMascotas from '../../Global/Images/img/Mascotas.png';
import LogoInsumosMedicos from '../../Global/Images/img/Insumos_medicos.png';
import LogoOtrasCategorias from '../../Global/Images/img/OtrasCategorias.png';
import ImgAyuda from '../../Global/Images/Ayuda.png';
import './Home.css';
import { Alert,Card,OverlayTrigger,Tooltip,Button,Container,Row,Col} from 'react-bootstrap';
import axios from 'axios';
import {URL_API, ContactoDefault} from '../../variableDeEntorno';
import helpers from '../../helpers.js';
import Productos from '../Productos/Productos.js';
import LineasCirculos from '../LineasCirculos/LineasCirculos';
import ReactGA from "react-ga";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            strFiltroTexto: '',
            blnSpinner:false,
            strDataProductos : null,
            strNumProductos : '',
            filtroHome : false,
            lineas : [
                {
                    linea : 'AllKiss',
                    color : 'green',
                    hover : 'HoverGreen',
                    img : 'ModaYAccesorios',
                    descripcion : 'MODA Y ACCESORIOS'
                },
                {
                    linea : 'Lindas',
                    color : 'pink',
                    hover : 'HoverPink',
                    img : 'Belleza',
                    descripcion : 'BELLEZA'
                },
                {
                    linea : 'Eileen',
                    color : 'orange',
                    hover : 'HoverOrange',
                    img : 'Hogar',
                    descripcion : 'HOGAR'
                },
                {
                    linea : 'AllKiss',
                    color : 'blue',
                    hover : 'HoverBlue',
                    img : 'Ferreteria',
                    descripcion : 'FERRETERIA'
                },
                {
                    linea : 'AllKiss',
                    color : 'green',
                    hover : 'HoverGreen',
                    img : 'Papeleria',
                    descripcion : 'PAPELERIA'
                },
                {
                    linea : 'AllKiss',
                    color : 'pink',
                    hover : 'HoverPink',
                    img : 'Bisuteria',
                    descripcion : 'BISUTERIA'
                },
                {
                    linea : 'Farmapets',
                    color : 'orange',
                    hover : 'HoverOrange',
                    img : 'Mascotas',
                    descripcion : 'MASCOTAS'
                },
                {
                    linea : 'AllKiss',
                    color : 'blue',
                    hover : 'HoverBlue',
                    img : 'InsumosMedicos',
                    descripcion : 'INSUMOS MEDICOS'
                },
                {
                    linea : 'AllKiss',
                    color : 'green',
                    hover : 'HoverGreen',
                    img : 'OtrasCategorias',
                    descripcion : 'OTRAS CATEGORIAS'
                }

            ]
        }
    }
    Navegation=(strUrl)=>{
        window.location=`./${strUrl}`;
    }
    componentDidMount(){
        if(this.props.filtroTextoGeneral !== ""){
            this.ConsultarProductos();
        }
    }

    ConsultarProductos = async(strNumPaginacion = '1')=>{
        let user = JSON.parse(localStorage.getItem("Usuario"));
        let IntTipoTercero = 3; //Si el usuario no esta logueado se muestra precio 3
        if(user !== null){
            IntTipoTercero = user.IntTipoTercero;
        }
        if(IntTipoTercero == 0){
            IntTipoTercero = 1;
        }
        await this.setState({
            blnSpinner:true
        });
        await axios.get(URL_API+'/api/productos/categoria/',
        {
            params:{
                lineas_ids : '',
                lista_precio : IntTipoTercero,
                num_paginacion : strNumPaginacion,
                id_linea : '',
                id_clase : '',
                materiales_ids: '',
                marcas_ids : '',
                sexos_ids : '',
                filtro_texto : this.state.strFiltroTexto == '' ? this.props.filtroTextoGeneral : this.state.strFiltroTexto
            }
        })
        .then(async (strResult)=>{
            this.setState({
                blnSpinner:false,
                filtroHome:true,
                strDataProductos: strResult.data.strProductos,
                strNumProductos: strResult.data.strNumProductos === undefined ? this.state.strNumProductos : strResult.data.strNumProductos
            })
        });
    }

    FiltroTexto = (e, consultar)=>{
        this.setState({ strFiltroTexto:e.target.value});
        if(consultar){
            this.ConsultarProductos();
        }
    }

    ListarProductosFiltro = ()=>{
        if(!this.state.strDataProductos){
            return(
                <Col  xs={12} sm={12} lg={12} xl={{order:2}} className='Col1'>
                    <div className='CtnImage'>
                        <img src={LogoHome}/>
                    </div> 
                </Col>
                 
            )
        }
        if(this.state.strDataProductos.length !== null){
            return(<Col xs={12} md={12} xl={5} xl={{order:2}} className='CtnContent' style={{paddingLeft:'0px', paddingRight: '0px'}}>
                <Productos
                    FiltroHome={this.state.filtroHome}
                    Url=''
                    AbrirModal={(strUrl,strDataProducto)=>{alert("abrir modal")}}
                    strDataProductos={this.state.strDataProductos}
                    strNumProductos={this.state.strNumProductos}
                    ConsultarProductos={(strTipoConsulta,strNumPaginacion)=>
                        {this.ConsultarProductos(strNumPaginacion)}}
                    blnSpinner={this.state.blnSpinner}
                    FiltroTexto={(e, consultar)=>this.FiltroTexto(e, consultar)}
                    strFiltroTexto={this.state.strFiltroTexto}
                />
            </Col>);
        }else{
            this.setState({
                filtroHome : false
            });
            return(
                <Col  xs={12} md={12} xl={5} xl={{order:2}} className='CtnContent'>
                    <div className='CtnImage'>
                        <img src={LogoHome}/>
                    </div> 
                </Col>
                 
            )
        }
    }

    render(){
        let user = JSON.parse(localStorage.getItem("Usuario"));
        user = user == null ?ContactoDefault:user.JsonVendedor.strCelular;
        return(
              <Row fluid className='ContenedorHome'>
                <this.ListarProductosFiltro />
                <Col xs={12} sm={12} lg={12} xl={5} xs={{order:1}} xl={{order:1}} className={this.state.filtroHome?'Col2 hide':'Col2'}>
                    <LineasCirculos />
                    <div className='CtnLg'>
                        <div className='CtnTexto'>
                            <h1>CATÁLOGO</h1>
                            <h1>MULTILÍNEAS</h1>
                            <p>
                                <strong>IN MODA FANTASY </strong>somos una empresa seria,
                                organizada, con más 30 años de experiencia en el
                                mercado, importadores directos, con siete marcas
                                constituidas y un catalogo con mas de 20
                                categorías de productos de belleza, accesorios,
                                mascotas, utensilios para el hogar y material de
                                ensamble, especializados en ventas al por mayor. 
                            </p>
                        </div>
                    </div>
                    <div className='CtnAyuda'>  
                            <div className='CtnAyudaImg'>
                                <span></span>
                                <div><img src={ImgAyuda}/></div>
                                <span></span>
                            </div>

                            <div className='CtnAyudaTexto'>
                                <p><a className='BtnAyuda' href={'https://api.whatsapp.com/send?phone=57'+user} onClick={()=>{
                                    ReactGA.event({
                                        category: 'Ayuda Web',
                                        action: 'Home'
                                    });
                                }} target={'_blank'}>¿Te ayudamos en tu compra?</a></p>
                            </div>  
                        </div>
                </Col>
              </Row>
        )
    }
}

export default Home;