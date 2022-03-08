import React, {Component} from 'react';
import {Container,Form,Row,Col} from 'react-bootstrap';
import Carousel from '../Carousel/Carousel.js';
import DescripcionMarcas from '../DescripcionMarcas/DescripcionMarcas.js';
import MenuProductosMarca from '../MenuProductosMarca/MenuProductosMarca.js';
import Productos from '../Productos/Productos.js';
import './Catalogo.css';
/*import helpers from '../../helpers.js';*/
import axios from 'axios';
//Redux
/*import AbrirModal from '../../Redux/Actions/Modal/AbrirModal';
import { connect } from 'react-redux';
import { withRouter, useRouteMatch, useLocation  } from 'react-router-dom';*/
import {URL_API} from '../../variableDeEntorno';
class Catalogo extends Component{
    constructor(props){
        super(props);
        this.state={
            strDataProductos:[],
            strNumProductos:0,
            strCodigoCategoria:null,
            blnSpinner:false,
            strDataCategoria:[],
            strIdLineaActiva:0,
            strIdTipoActivo:0,
            strIdGrupoActivo:0,
            ObjLineas : [], 
            ObjTipos: [],
            ObjGrupos: [],
            strDataMarcas : [],
            strDataMateriales: [],
            strDataSexos: [],
            strDataMarcasSelect : [],
            strDataMaterialesSelect: [],
            strDataSexosSelect: [],
            strFiltroTexto: ''
        }     
    }
    async componentDidMount(){
        //Obtener Tipo de Categoria URL
        await this.GetCodigoCategoriaUrl();
        //Consulta las lineas perteneciente a la categoria
        await this.ConsultarProductos('ConsultaLineasCategoria',null);
        //Obtener productos consulta inicial datos iniciales
        await this.ConsultarFiltros();
        try {
            let strIdLinea=document.querySelector('.CtnAcordeonCategorias .card-body > ul > li[class="active"]').dataset.codigolinea;
            this.setState({strIdLineaActiva:strIdLinea});
        } catch (error) {
            
        }
        await this.ConsultarProductos('ConsultaInicial','1');

    }
    //Actualizar estado linea a seleccionar
    ActualizarEstado=async(strIdLineaActiva, strIdGrupoActivo, strIdTipoActivo)=>{
        this.setState({
            strIdLineaActiva, 
            strIdTipoActivo, 
            strIdGrupoActivo,
            ObjLineas : strIdLineaActiva == 0 ? [] : this.state.ObjLineas,
            ObjGrupos : strIdGrupoActivo == 0 ? [] : this.state.ObjGrupos,
            ObjTipos : strIdTipoActivo == 0 ? [] : this.state.ObjTipos
        });
    }
    ActualizarFiltrosConsulta = async (id, value, tipo)=>{
        let lineas = this.state[tipo];
        console.log(lineas);
        if(value){
            lineas.push(id);
        }else{
            let index = lineas.indexOf(id);
            lineas.splice(index, 1);
        }
        await this.setState({
            [tipo] : lineas
        })
        console.log("ActualizarFiltrosConsulta")
        console.log(this.state);
        console.log("ActualizarFiltrosConsulta")
    }
    ActualizarFiltroPorCategoria = (id, tipo)=>{
        this.setState({
            [tipo] : id == "" ? [] : [id]
        })
        console.log("ActualizarFiltroPorCategoria")
        console.log(this.state);
        console.log("ActualizarFiltroPorCategoria")
    }
    ConsultarFiltros = async ()=>{
        this.setState({
            blnSpinner:true
        });
        await axios.get(URL_API+'/api/filtros/material/',
        {
            params:{
                lineas_ids : this.state.ObjLineas.join("','"),
                id_linea : this.state.strIdLineaActiva,
                id_clase : this.state.strCodigoCategoria
            }
        })
        .then(async (strResult)=>{
            this.setState({
                strDataMateriales: strResult.data.strData
            })
        });
        await axios.get(URL_API+'/api/filtros/marca/',
        {
            params:{
                lineas_ids : this.state.ObjLineas.join("','"),
                id_linea : this.state.strIdLineaActiva,
                id_clase : this.state.strCodigoCategoria
            }
        })
        .then(async (strResult)=>{
            this.setState({
                strDataMarcas: strResult.data.strData
            })
        });
        await axios.get(URL_API+'/api/filtros/sexo/',
        {
            params:{
                lineas_ids : this.state.ObjLineas.join("','"),
                id_linea : this.state.strIdLineaActiva,
                id_clase : this.state.strCodigoCategoria
            }
        })
        .then(async (strResult)=>{
            this.setState({
                strDataSexos: strResult.data.strData
            })
        });
        this.setState({
            blnSpinner:false
        });
    }
    FiltroTexto = (e, consultar)=>{
        this.setState({ strFiltroTexto:e.target.value});
        if(consultar){
            this.ConsultarProductos('ConsultaInicial','1')
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
    //Consultar productos segun su categoria
    ConsultarProductos=async(strTipoConsulta,strNumPaginacion)=>{
        let IntTipoTercero = this.ValidarTipoTercero();
        await this.setState({
            blnSpinner:true
        });
        try{
            switch(strTipoConsulta){
               case 'ConsultaInicial':
                    await axios.get(URL_API+'/api/productos/categoria/',
                    {
                        params:{
                            lineas_ids : this.state.ObjLineas.join("','"),
                            lista_precio : IntTipoTercero,
                            num_paginacion : strNumPaginacion,
                            id_linea : this.state.strIdLineaActiva,
                            id_clase : this.state.strCodigoCategoria,
                            materiales_ids: this.state.strDataMaterialesSelect.join("','"),
                            marcas_ids : this.state.strDataMarcasSelect.join("','"),
                            sexos_ids : this.state.strDataSexosSelect.join("','"),
                            filtro_texto : this.state.strFiltroTexto
                        }
                    })
                    .then(async (strResult)=>{
                        if(strResult.data.success){
                            await this.setState({
                                strDataProductos:strResult.data.strProductos,
                                strNumProductos: strResult.data.strNumProductos === undefined ? this.state.strNumProductos : strResult.data.strNumProductos,
                                blnSpinner:false
                            });
                        }else{
                            alert(strResult.data.strMesaje);
                            alert("catalogo");
                        }
                    });

                break;
                case 'ConsultaPaginacion':
                    await axios.get(URL_API+'/api/productos/categoria/',
                    {
                        params:{
                            lineas_ids : this.state.ObjLineas.join("','"),
                            lista_precio : IntTipoTercero,
                            num_paginacion : strNumPaginacion,
                            id_linea : this.state.strIdLineaActiva,
                            id_clase : this.state.strCodigoCategoria
                        }
                    })
                    .then(async (strResult)=>{
                        await this.setState({
                                            strDataProductos:strResult.data.strProductos,
                                            blnSpinner:false
                                            });
                    });
                break;

                case 'ConsultaLineasCategoria':
                    this.setState({
                        strDataCategoria : []
                    })
                    await axios.get(URL_API+'/api/productos/categoria/lineas/'+this.state.strCodigoCategoria+'/'+IntTipoTercero)
                    .then(async (strResult)=>{
                        await this.setState({
                            strDataCategoria:strResult.data.strDataCategoria,
                            blnSpinner:false
                        });
                    });
                break;
            }
          
        }catch(Error){
            await this.setState({
                blnSpinner:false
            });
            console.log(Error);
        }
    }
    ConsultarCategoriaLineas = async()=>{
        let IntTipoTercero = this.ValidarTipoTercero();
        await this.setState({
            blnSpinner:true,
            strDataCategoria : []
        });
        await axios.get(URL_API+'/api/productos/categoria/lineas/'+this.state.strCodigoCategoria+'/'+IntTipoTercero)
        .then(async (strResult)=>{
            await this.setState({
                strDataCategoria:strResult.data.strDataCategoria,
                blnSpinner:false
            });
        });
    }
    ConsultarCategoriaGrupo = async()=>{
        let IntTipoTercero = this.ValidarTipoTercero();
        await this.setState({
            blnSpinner:true,
            strDataCategoria : []
        });
        await axios.get(URL_API+'/api/productos/categoria/grupos/'+this.state.strCodigoCategoria+'/'+this.state.strIdLineaActiva+'/'+IntTipoTercero)
        .then(async (strResult)=>{
            await this.setState({
                strDataCategoria:strResult.data.strDataCategoria,
                blnSpinner:false
            });
        });
    }
    ConsultarCategoriaTipos = async()=>{
        let IntTipoTercero = this.ValidarTipoTercero();
        await this.setState({
            blnSpinner:true,
            strDataCategoria : []
        });
        await axios.get(URL_API+'/api/productos/categoria/tipos/'+this.state.strCodigoCategoria+'/'+this.state.strIdLineaActiva+'/'+this.state.strIdGrupoActivo+'/'+IntTipoTercero)
        .then(async (strResult)=>{
            await this.setState({
                strDataCategoria:strResult.data.strDataCategoria,
                blnSpinner:false
            });
        });
    }
    BackCategoria = ()=>{
        if(this.state.strIdGrupoActivo != 0){
            this.ActualizarEstado(this.state.strIdLineaActiva, 0, 0);
            this.ConsultarCategoriaGrupo();
        }else{
            if(this.state.strIdLineaActiva != 0){
                this.ConsultarProductos('ConsultaLineasCategoria',null);
            }
        }
        console.log("BackCategoria")
        console.log(this.state);
        console.log("BackCategoria")
    }
    //Metodo para ordenar productos
    ProductosOrdenados=async(strJsonOrdenado)=>{
        await this.setState({strDataProductos:strJsonOrdenado});
    }

    //Obtener Codigo del tipo de categoria para la busqueda
    GetCodigoCategoriaUrl=async()=>{
        try{
            switch(this.props.Url){
                case 'ModaYAccesorios':
                    await this.setState({strCodigoCategoria:'101'});
                break;
                case 'Belleza':
                    await this.setState({strCodigoCategoria:'971'});
                break;
                case 'Hogar':
                    await this.setState({strCodigoCategoria:'991'});
                break;
                case 'FerreteriaYvehiculos':
                    await this.setState({strCodigoCategoria:'001'});
                break;
                case 'Papeleria':
                    await this.setState({strCodigoCategoria:'1021'});
                break;
                case 'Bisuteria':
                    await this.setState({strCodigoCategoria:'981'});
                break;
                case 'Mascotas':
                   await this.setState({strCodigoCategoria:'1001'});
                break;
                case 'InsumosMedicos':
                   await this.setState({strCodigoCategoria:'1011'});
                break;
                case 'OtrasCategorias':
                   await this.setState({strCodigoCategoria:'68'});
                break;
                default:
                  await this.setState({strCodigoCategoria:null});
            }
        }catch(e){
            console.log(e);
        }
    }
    render(){
        return(
            <div className='CtnCatalogo'>
            <Container fluid>
                        <Row>
                            <Col  xs={12} md={12} xl={5} className='CtnContent' style={{overflowY:'scroll'}}>
                                
                                <Carousel
                                        Url={this.props.Url}
                                    />
                                      <DescripcionMarcas
                                    Url={this.props.Url}
                                />
                                
                             </Col>
                             <Col xs={12} md={12} xl={2} className='CtnContent' >
                                 <MenuProductosMarca
                                  strDataLineas={this.state.strDataCategoria}
                                  ActualizarEstado={(strIdLineaActiva, strIdTipoActivo, strIdGrupoActivo)=>{this.ActualizarEstado(strIdLineaActiva, strIdTipoActivo, strIdGrupoActivo)}}
                                  ConsultarProductos={(strTipoConsulta,strNumPaginacion)=>
                                  {this.ConsultarProductos(strTipoConsulta,strNumPaginacion)}}
                                  ActualizarFiltrosConsulta={(id, value, tipo)=>this.ActualizarFiltrosConsulta(id, value, tipo)}
                                  ActualizarFiltroPorCategoria={(id, tipo)=>this.ActualizarFiltroPorCategoria(id, tipo)}
                                  strDataMarcas={this.state.strDataMarcas}
                                  strDataMateriales={this.state.strDataMateriales}
                                  strDataSexos={this.state.strDataSexos}
                                  strIdLineaActiva={this.state.strIdLineaActiva}
                                  strIdTipoActivo={this.state.strIdTipoActivo}
                                  strIdGrupoActivo={this.state.strIdGrupoActivo}
                                  strCodigoCategoria={this.state.strCodigoCategoria}
                                  ConsultarCategoriaTipos={()=>this.ConsultarCategoriaTipos()}
                                  ConsultarCategoriaGrupo={()=>this.ConsultarCategoriaGrupo()}
                                  ConsultarCategoriaLineas={()=>this.ConsultarCategoriaLineas()}
                                  BackCategoria={()=>this.BackCategoria()}
                                  ConsultarFiltros={()=>this.ConsultarFiltros()}
                                 />
                                  </Col>
                             <Col xs={12} md={12} xl={5} className='CtnContent' >
                                <Productos
                                    Url={this.props.Url}
                                    /*AbrirModal={(strUrl,strDataProducto)=>{this.props.AbrirModal(strUrl,strDataProducto)}}*/
                                    strDataProductos={this.state.strDataProductos}
                                    strNumProductos={this.state.strNumProductos}
                                    ConsultarProductos={(strTipoConsulta,strNumPaginacion)=>
                                        {this.ConsultarProductos(strTipoConsulta,strNumPaginacion)}}
                                    blnSpinner={this.state.blnSpinner}
                                    /*ProductosOrdenados={(strJsonOrdenado)=>{this.ProductosOrdenados(strJsonOrdenado)}}*/
                                    FiltroTexto={(e, consultar)=>this.FiltroTexto(e, consultar)}
                                    strFiltroTexto={this.state.strFiltroTexto}
                                />
                            </Col>
                        </Row>
            </Container>
            </div>
        )
    }
}

//actions redux modal
/*const mapDispatchToProps = {
    AbrirModal
};

export default withRouter(
    connect(null,mapDispatchToProps)(Catalogo)
);*/
export default Catalogo;
