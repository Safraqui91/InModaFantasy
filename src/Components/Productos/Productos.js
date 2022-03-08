import React, {Component} from 'react';
import ImgAllkiss from '../../Global/Images/CA930.jpeg';
import {Dropdown,Spinner, Row, Col, Container, Form} from 'react-bootstrap';
import { FaAngleDown,FaAngleLeft,FaAngleRight } from "react-icons/fa";
import helpers from '../../helpers.js';
import './Productos.css';
import { Fade, Stagger  } from 'react-animation-components';
import AbrirModal from '../../Redux/Actions/Modal/AbrirModal';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import ReactGA from 'react-ga';
let {Control} = Form;


class CardProductos extends Component{
    constructor(props){
        super(props);
        this.state={
          strNumPaginacionActiva:1,
          strNumPaginacionDesactivada:2,
          strOrdenText:'Recomendados'
        }
    }

    //Componente para trabajar con los props
    componentDidUpdate(){

    }
      //Consultar producto
    

    //Abrir modal
    AbrirModal=async(Url,strProducto,strData, agotado)=>{
      if(agotado == 1){
        let strDataProducto=await strData.filter(word => word.StrIdProducto == strProducto);
        //Abrir modal con data del producto seleccionado
        this.props.AbrirModal(Url,JSON.stringify(strDataProducto));
      }
    }
    //Flecha izquierda (Paginación)
    FlechaIzquierda=async(intNumPaginacion)=>{
      try{
        if(this.state.strNumPaginacionActiva==1){
          return;
        }
        await this.setState({
                      strNumPaginacionActiva:this.state.strNumPaginacionActiva-1,
                      strNumPaginacionDesactivada:this.state.strNumPaginacionDesactivada-1
                    });
        if((this.state.strNumPaginacionActiva-1)!=intNumPaginacion){
            document.querySelector('.CtnBusquedaProductos > div:nth-child(2) > span:nth-child(3)').style.display='inline-block';
        }
        //Consultar productos por paginacion 
        this.props.ConsultarProductos('ConsultaInicial',this.state.strNumPaginacionActiva);
      }catch(Error){
        console.log(Error);
      }
    }
    //Flecha Derecha (Paginación)
    FlechaDerecha=async(intNumPaginacion)=>{
      try{
        if(this.state.strNumPaginacionActiva==intNumPaginacion){
          return;
        }
        if(this.state.strNumPaginacionDesactivada==intNumPaginacion){
            document.querySelector('.CtnBusquedaProductos > div:nth-child(2) > span:nth-child(3)').style.display='none';
        }
        await this.setState({
            strNumPaginacionActiva:this.state.strNumPaginacionActiva+1,
            strNumPaginacionDesactivada:this.state.strNumPaginacionDesactivada+1
          });
        

        //Consultar productos por paginacion
        this.props.ConsultarProductos('ConsultaInicial',this.state.strNumPaginacionActiva);
      }catch(Error){
        console.log(Error);
      }
    }
    //Ordenar productos portipo
    //Metodo para ordenar productos
    OrdenarProductos=async(strTipoOrden)=>{
      switch(strTipoOrden){
        case 'Nombre':
        //Ordenamiento por descripción
        helpers.sortJSON(this.props.strDataProductos,'StrDescripcion', 'asc');
        //await this.setState({strDataProductos:strJsonOrdenado});

        break;

        case 'MenorPrecio':
        //Ordenamiento asc
        helpers.sortJSON(this.props.strDataProductos,'IntPrecio1', 'asc');
        //await this.setState({strDataProductos:strJsonOrdenado});

        break;

        case 'MayorPrecio':
        //Ordenamiento desc
        helpers.sortJSON(this.props.strDataProductos,'IntPrecio1', 'desc');
        //await this.setState({strDataProductos:strJsonOrdenado});
        break;
      }
      /*this.props.ProductosOrdenados(strJsonOrdenado);*/
    }
    TipoOrdenProductos=(strTipoOrden, strText)=>{
      this.setState({
        strOrdenText : strText
      })
      this.OrdenarProductos(strTipoOrden);
    }

    //Filtro texto
    render(){

        if(!this.props.strDataProductos){
          return null;
        }
        //Determinar paginacion ultimo numero
        let intNumPaginacion=0;
        if(Number.isInteger(this.props.strNumProductos/30)){
            intNumPaginacion=this.props.strNumProductos/30;
        }else{
             intNumPaginacion=Math.floor((this.props.strNumProductos/30))+1;
        }
        //Css 
        let CssCtnProductos='CtnCardProductos'+this.props.Url+' CtnCardProductos';
        return(
          <div className='contenedor'>
            <Spinner  className='spinner' animation="border"  style={{display:this.props.blnSpinner ? 'inline-block' : 'none', position: "fixed",top: "50%"}}  />
            <div className={this.props.FiltroHome?'CtnCardProductos filtroHome':'CtnCardProductos'}>
                <Row style={{height:'min-content', alignItems:'center', textAlign:'center'}}>
                  <Col xs={12} sm={12} sm={{order:2}} md={4} md={{order:1}} lg={6} lg={{order:1}} xl={4}>
                    <div className='CtnBusquedaProductos'>
                      <div>
                          <label>Ordenar Por:</label>
                          <div>
                              <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                      {this.state.strOrdenText} <FaAngleDown className="IconOrdenar"/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item onClick={()=>{this.TipoOrdenProductos('Nombre', 'Nombre')}}>Nombre</Dropdown.Item>
                                      <Dropdown.Item  onClick={()=>{this.TipoOrdenProductos('MenorPrecio', 'Menor Precio')}}>Menor precio</Dropdown.Item>
                                      <Dropdown.Item  onClick={()=>{this.TipoOrdenProductos('MayorPrecio', 'Mayor Precio')}}>Mayor precio</Dropdown.Item>
                                    </Dropdown.Menu>
                              </Dropdown>
                          </div>
                      </div>
                    </div>
                  </Col>
                  {
                    this.props.FiltroHome ? (
                      null
                    ):(
                      <Col xs={12} sm={12} sm={{order:1}} md={4} md={{order:2}} lg={2} lg={{order:2}} xl={3}>
                        <div className='CtnUnoBuscador'>
                          <Control type={'text'} name={'SNombre'} placeholder="¿Qué estas buscando?" value={this.props.strFiltroTexto} 
                            onChange={(e)=>this.props.FiltroTexto(e, false)}
                            onKeyPress={(e)=>{
                              if(e.key == 'Enter'){
                                ReactGA.event({
                                  category: 'Filtros',
                                  action: 'Filtro linea: '+this.props.strFiltroTexto
                                });
                                this.props.FiltroTexto(e, true);
                              }
                          }}
                          />
                        </div>
                      </Col>
                    )
                  }
                  
                  <Col xs={12} sm={12} sm={{order:3}} md={4} md={{order:3}} lg={5} lg={{order:3}} xl={5}>
                    <div className='CtnBusquedaProductos'>
                      <div></div>
                      {
                        this.props.strDataProductos.length != 0 ? (
                          <div style={{textAlign:'center'}}>Páginas 
                            <span onClick={()=>{this.FlechaIzquierda(intNumPaginacion)}}><FaAngleLeft/></span>
                                  <span className='active'>{this.state.strNumPaginacionActiva}</span><span style={{display:intNumPaginacion==1 ? 'none':'inline-block'}} >{this.state.strNumPaginacionDesactivada}</span><span>...</span>
                                  <span>{intNumPaginacion}</span>
                            <span onClick={()=>{this.FlechaDerecha(intNumPaginacion)}}><FaAngleRight/> </span>
                          </div>
  
                        ):null
                      }
                    </div>
                  </Col>
                </Row>
              
                <div className='CtnProductos'>
                {
                  this.props.strDataProductos.length == 0 && !this.props.blnSpinner ? (
                    <div style={{padding:'10px', textAlign: 'center'}}>
                        <p>No hemos encontrado ningún resultado para tus filtros de búsqueda</p>  
                    </div>
                  ):(
                    this.props.strDataProductos.map((Json)=>{
                      let ruta = '';
                      if(Json.strImages.length == 0){
                        ruta = Json.StrIdProducto;
                      }else{
                        try {
                          ruta = Json.strImages[1].StrArchivo.replace(/\//g,'*'); 
                        } catch (error) {
                          ruta = Json.StrIdProducto;
                        }
                      }
                      return(
                            <div className='CardProducto' onClick={()=>{this.AbrirModal(this.props.Url,Json.StrIdProducto,this.props.strDataProductos, Json.IntHabilitarProd)}}>
                              <div className='CtnImgCardProducto'>
                              {Json.IntHabilitarProd == 0 ?(<div className='agotado'>AGOTADO</div>):null}
                                {(!Json.strImages.length==0?<img lazy='loading' src={process.env.REACT_APP_IP_BACK+`/api/imagenes/${ruta}`} loading='lazy'/>:<img lazy='loading' src={require(`./NoDisponible.jpg`)} loading='lazy'/>)}
                                
                                <div calssName='container-overlaycard'>
                                    <div className='overlaycard'></div>
                                    <div>
                                      Vista Rápida    
                                    </div>
                                </div>
                                
                              
                              </div>
                              <div className='CtnDescripcionCard'>
                                  <label>{Json.StrDescripcion.split(' ')[0]}</label>
                                  <label>${helpers.FormateoNumber(Json.IntPrecio)}</label>
                              </div>
                          </div>);
                    })
                  )
                  
                }
              </div>
            </div>
          </div>
        )
    }
}
const mapDispatchToProps = {
  AbrirModal
};

export default withRouter(
  connect(null,mapDispatchToProps)(CardProductos)
);