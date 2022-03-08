import React, {Component, Fragment} from 'react';
import LogoHome from '../../Global/Images/LogoInmoda.png';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {Col, Row, Form} from 'react-bootstrap'
import { FaChevronRight, FaRegArrowAltCircleRight, FaAngleDown,FaAngleLeft,FaAngleRight  } from "react-icons/fa";
import './MenuProductosMarca.css';
let {Control,Check} = Form;


class MenuProductosMarca extends Component{
    constructor(props){
        super(props);
        this.state={
            blnEstadoMenu:0,
            strLineaActiva:'',
            strTipoActivo: '',
            strGrupoActivo: ''
        }
        
    }
    Menu=async()=>{
        if(this.state.blnEstadoMenu==0){
            await this.setState({blnEstadoMenu:1});
            document.querySelector('.CtnMenuProductosMarca').style.left='0px';
        }else{
            await this.setState({blnEstadoMenu:0});
            document.querySelector('.CtnMenuProductosMarca').style.left='-300px';
        }
    }
    BuscarProductosPorLinea=(linea, id)=>{
        
        /*this.props.ActualizarEstado(id);*/
        
        this.setState({strLineaActiva:linea});
    }

    handleInputChange = (event, linea, id, tipo, TipoCategoria)=>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        switch (tipo) {
            case 'Categorias':
                this.props.ActualizarFiltrosConsulta(id, value, 'Obj'+TipoCategoria);
                this.props.ConsultarFiltros();
                this.props.ConsultarProductos('ConsultaInicial','1');
                break;
            case 'Materiales':
                this.props.ActualizarFiltrosConsulta(id, value, 'strDataMaterialesSelect');
                this.props.ConsultarProductos('ConsultaInicial','1')
                break;
            case 'Marcas':
                this.props.ActualizarFiltrosConsulta(id, value, 'strDataMarcasSelect');
                this.props.ConsultarProductos('ConsultaInicial','1')
            break;
            case 'Sexos':
                this.props.ActualizarFiltrosConsulta(id, value, 'strDataSexosSelect');
                this.props.ConsultarProductos('ConsultaInicial','1')
            break;
        
            default:
                break;
        }
    }

    NextCategoria = (id, tipo, descripcion)=>{
        switch (tipo) {
            case 'Lineas':
                this.props.ActualizarEstado(id, 0, 0);
                this.props.ActualizarFiltroPorCategoria(id, 'ObjLineas');
                this.setState({strLineaActiva: descripcion});
                this.props.ConsultarCategoriaGrupo();
                break;
            case 'Grupos':
                this.props.ActualizarEstado(this.props.strIdLineaActiva, id, 0);
                this.props.ActualizarFiltroPorCategoria(id, 'ObjGrupos');
                this.setState({strGrupoActivo: descripcion});
                this.props.ConsultarCategoriaTipos();
                break;
            case 'Tipos':
                this.props.ActualizarEstado(this.props.strIdLineaActiva, this.state.strGrupoActivo, id);
                this.props.ActualizarFiltroPorCategoria(id, 'ObjTipos');
                this.setState({strTipoActivo: descripcion});
                this.props.ConsultarCategoriaTipos();
                break;
            break;
            default:
                break;
        }
    }

    BackCategoria = ()=>{
        //grupo activo -> grupo
        //linea activa -> linea
        if(this.state.strGrupoActivo != ''){
            this.props.ActualizarEstado(this.props.strIdLineaActiva, 0, 0);
            this.setState({strGrupoActivo: ''});
            this.props.ActualizarFiltroPorCategoria('', 'ObjGrupos');
            this.props.ConsultarCategoriaGrupo();
        }else{
            if(this.state.strLineaActiva != ''){
                this.props.ActualizarEstado(0, 0, 0);
                this.setState({strLineaActiva: ''});
                this.props.ActualizarFiltroPorCategoria('', 'ObjLineas');
                this.props.ConsultarCategoriaLineas();
            }
        }
    }

    render(){
        return(
            <div className='CtnMenuProductosMarca'>
                <span  onClick={this.Menu}><FaChevronRight className='IconFlecha'/></span>
                <a href="./" className='CtnImgMenuEmpresa'>
                    <img src={LogoHome}/>
                </a>
                <div className='CtnMenu'>
                 <div className='CtnAcordeonCategorias'>
                     {
                        this.props.strDataMateriales.length !== 0?(
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="-1">
                                    <strong>Material <small></small></strong>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="-1" >
                                    <Card.Body>
                                            <ul>
                                                <li>Resultados ({this.props.strDataMateriales.length})</li>
                                                {this.props.strDataMateriales.map((strData,intIndex)=>{
                                                            return(
                                                                <li 
                                                                    data-codigolinea={strData.StrIdPParametro}
                                                                    className='lista'
                                                                >
                                                                    <label style={{width:'100%'}}>
                                                                        <Row style={{height:'auto'}}>
                                                                            <Col xs={4}>
                                                                                <input type="checkbox" className='separador' onChange={(e)=>this.handleInputChange(e,strData.StrDescripcion, strData.StrIdPParametro, 'Materiales')} />
                                                                            </Col>
                                                                            <Col xs={8}>
                                                                                {strData.StrDescripcion[0].toUpperCase()+strData.StrDescripcion.slice(1).toLowerCase()}
                                                                            </Col>
                                                                        </Row>
                                                                    </label>
                                                                    
                                                                </li>
                                                            );
                                                    
                                                        
                                                    })

                                                }
                                            </ul>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Accordion>
                        ):null
                     }
                     {
                         this.props.strDataMarcas.length !== 0?(
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="-2">
                                    <strong>Marca <small></small></strong>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="-2">
                                    <Card.Body>
                                            <ul>
                                                <li>Resultados ({this.props.strDataMarcas.length})</li>
                                                {this.props.strDataMarcas.map((strData,intIndex)=>{
                                                            return(
                                                                <li 
                                                                    data-codigolinea={strData.StrIdPParametro}
                                                                    className='lista'
                                                                >
                                                                    <label style={{width:'100%'}}>
                                                                        <Row style={{height:'auto'}}>
                                                                            <Col xs={4}>
                                                                                <input type="checkbox" className='separador' onChange={(e)=>this.handleInputChange(e,strData.StrDescripcion, strData.StrIdPParametro, 'Marcas')}/>
                                                                            </Col>
                                                                            <Col xs={8}>
                                                                                {strData.StrDescripcion[0].toUpperCase()+strData.StrDescripcion.slice(1).toLowerCase()}
                                                                            </Col>
                                                                        </Row>
                                                                    </label>
                                                                    
                                                                </li>
                                                            );
                                                    
                                                        
                                                    })

                                                }
                                            </ul>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Accordion>
                         ):null
                     }
                     {
                         this.props.strDataSexos.length !== 0?(
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="-3">
                                    <strong>{this.props.strCodigoCategoria == 17 ? 'Especie' : 'Sexo'}<small></small></strong>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="-3">
                                    <Card.Body>
                                            <ul>
                                                <li>Resultados ({this.props.strDataSexos.length})</li>
                                                {this.props.strDataSexos.map((strData,intIndex)=>{
                                                            return(
                                                                <li  
                                                                    data-codigolinea={strData.StrIdPParametro1}
                                                                    className='lista'
                                                                >
                                                                    <label style={{width:'100%'}}>
                                                                        <Row style={{height:'auto'}}>
                                                                            <Col xs={4}>
                                                                                <input type="checkbox" className='separador' onChange={(e)=>this.handleInputChange(e,strData.StrDescripcion, strData.StrIdPParametro1, 'Sexos')}/>
                                                                            </Col>
                                                                            <Col xs={8}>
                                                                                {strData.StrDescripcion[0].toUpperCase()+strData.StrDescripcion.slice(1).toLowerCase()}
                                                                            </Col>
                                                                        </Row>
                                                                    </label>
                                                                    
                                                                </li>
                                                            );
                                                    
                                                        
                                                    })

                                                }
                                            </ul>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Accordion>
                         ):null
                     }
                    <Accordion defaultActiveKey="0">
                        <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="0">
                            <Row style={{height:'auto'}}>
                                <Col lg={9}>
                                    <strong>Categorias <small>{/*this.state.strLineaActiva*/}</small></strong>
                                </Col>
                                <Col lg={1}>
                                    <span><FaAngleDown/></span>
                                </Col>
                            </Row>
                            
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <ul>
                                    <li>Resultados ({this.props.strDataLineas.length})</li>
                                    {
                                        this.state.strLineaActiva !== ''?(
                                            <li>
                                                <Row style={{height:'auto'}}>
                                                    <Col xs={1}>
                                                        <span onClick={()=>this.BackCategoria()}><FaAngleLeft/></span>
                                                    </Col>
                                                    <Col xs={8}>
                                                    {
                                                        this.state.strGrupoActivo !== ""?this.state.strGrupoActivo:this.state.strLineaActiva
                                                    }
                                                    </Col>
                                                </Row>
                                            </li>
                                        ):null
                                    }
                                    {this.props.strDataLineas.map((strData,intIndex)=>{
                                        intIndex++;
                                        return(
                                            <li 
                                                data-codigolinea={strData.StrIdCategoria}
                                                className='lista'
                                                style={{position: 'relative',
                                                    animationName: 'example',
                                                    animationDuration: '2s'}}
                                            >
                                                {/*<Row style={{height:'auto'}}>
                                                    <Col xs={8} style={{background: 'yellow'}}>
                                                        <label style={{width:'100%', background: 'black'}}>
                                                            <input type="checkbox" className='separador' onChange={(e)=>this.handleInputChange(e,strData.StrDescripcion, strData.StrIdCategoria, 'Categorias', strData.StrTipoCategoria)}/>
                                                            {strData.StrDescripcion[0].toUpperCase()+strData.StrDescripcion.slice(1).toLowerCase()}
                                                        </label>
                                                    </Col>
                                                    <Col xs={1} style={{background: 'green'}}>
                                                        {
                                                            strData.StrTipoCategoria != "Tipos"?(
                                                                <span className="next" onClick={()=>{this.NextCategoria(strData.StrIdCategoria, strData.StrTipoCategoria, strData.StrDescripcion)}}><FaAngleRight/></span>
                                                            ):null
                                                        }
                                                    </Col>
                                                    </Row>*/}
                                                <div style={{height:'auto', display:'flex', width:'100%'}}>
                                                    <div style={{width:'70%'}}>
                                                        <label style={{width:'100%', height:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                            <input type="checkbox" className='separador' onChange={(e)=>this.handleInputChange(e,strData.StrDescripcion, strData.StrIdCategoria, 'Categorias', strData.StrTipoCategoria)}/>
                                                            {strData.StrDescripcion[0].toUpperCase()+strData.StrDescripcion.slice(1).toLowerCase()}
                                                        </label>
                                                    </div>
                                                    <div style={{width:'30%'}}>
                                                        {
                                                            strData.StrTipoCategoria != "Tipos"?(
                                                                <span className="next" onClick={()=>{this.NextCategoria(strData.StrIdCategoria, strData.StrTipoCategoria, strData.StrDescripcion)}}><FaAngleRight/></span>
                                                            ):null
                                                        }
                                                    </div>
                                                </div>
                                        </li>
                                        ); 
                                    })}
                                </ul>
                            </Card.Body>
                        </Accordion.Collapse>
                      
                    </Accordion>

                <div className='TextoMarca'>
                    <p>
                        Te presentamos todo nuestro 
                        catálogo completo donde podrás 
                        encontrar todas nuestras referencias actualizadas, escoge las que mejor se
                         adapten a tus necesidades.
                    </p>
                </div>
                </div>
                </div>
            </div>
        )
    }
}

export default MenuProductosMarca;