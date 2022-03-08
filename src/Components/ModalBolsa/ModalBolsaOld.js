import React, {Component} from 'react';
import {Container,Row,Col, Form} from 'react-bootstrap';
import ImgProducto from '../../Global/Images/CA930.jpeg';
import ImgLogoInmoda from '../../Global/Images/LogoInmoda.png';
import ImgCarrito from '../../Global/Images/Carrito.png';
import helpers from '../../helpers.js';
import './ModalBolsaOld.css';

import {addCarrito, getCarrito} from '../../Redux/Actions/Modal/Carrito';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {URL_API} from '../../variableDeEntorno';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListCheck from './ListCheck';
import ReactGA from 'react-ga';
let {Control,Check} = Form;


class ModalBolsa extends Component{
    constructor(props){
        super(props);
        this.state = {
            arrDependencias:[],
            strObservacion: '',
            selectedDependencias:[]
        }
    }

    componentDidMount(){
        this.ConsultarDependencias();
    }

    ConsultarDependencias = async ()=>{
        let strDataJsonTercero=JSON.parse(localStorage.getItem("Usuario"));
        if(strDataJsonTercero !== null){
            await axios.get(URL_API+'/api/dependencias/'+strDataJsonTercero.StrIdTercero)
            .then( async(strResult)=>{
                this.setState({
                    arrDependencias : strResult.data.strMensaje
                })
            });
            console.log(this.state.arrDependencias);
        }
    }
    
    EliminarProductoBolsa=(IdProducto)=>{
        let strDataJsonProducto=JSON.parse(localStorage.getItem("Carrito"));
        let newData = strDataJsonProducto.filter(val=>val.strReferencia != IdProducto);
        localStorage.setItem("Carrito",JSON.stringify(newData));
        this.props.addCarrito(JSON.parse(localStorage.getItem("Carrito")));
    }

    AccionCantidad=(act, IdProducto)=>{
        let strDataJsonProducto=JSON.parse(localStorage.getItem("Carrito"));
        let newData = strDataJsonProducto.map(val=>{
            if(val.strReferencia == IdProducto){
                if(act == -1){
                    val.strCantidadTotal = parseInt(val.strCantidadTotal) - 1;
                }else{
                    val.strCantidadTotal = parseInt(val.strCantidadTotal) + 1;
                }
                val.strPrecioTotal = val.strPrecioUnidad * val.strCantidadTotal;
            }   
            return val;
        });
        
        localStorage.setItem("Carrito",JSON.stringify(newData));
        this.props.addCarrito(JSON.parse(localStorage.getItem("Carrito")));
    }

    //Recorrer bolsa
    DetalleBolsa=(JsonLocalStora)=>{
        if(JsonLocalStora != null){
            return JsonLocalStora.map((JsonData)=>{
                return(    
                    <div className='CtnItemPedido'>
                        <div className='CtnImg'>
                            <img style={{border:'2px #eee solid', borderRadius:'6px'}} src={URL_API+`/api/imagenes/${JsonData.strImage}`}/>
                        </div>
                        <div className='CtnDetProducto'>
                            <label>{JsonData.strDescripcion}</label><br/>
                            <label>{JsonData.strReferencia}</label><br/>
                            <label>Estilos: {JsonData.strEstilos.map((Estilos)=>{return <span>{Estilos.strEstilo} </span>})}</label><br/>
    
                            <label>${helpers.FormateoNumber(JsonData.strPrecioTotal)}</label><br/>
    
                            <div>
                                <button className='btn-terminar' onClick={()=>this.EliminarProductoBolsa(JsonData.strReferencia)}>Eliminar</button>
                                {/*<button>Guardar para después</button>*/}
                            </div>
                        </div>
                        <div className='CtnButtons'>
                            <div>
                               <button onClick={()=>this.AccionCantidad(-1,JsonData.strReferencia)}>-</button>
                                <input type='text' placeholder='0' value={JsonData.strCantidadTotal}/>
                                <button onClick={()=>this.AccionCantidad(1,JsonData.strReferencia)}>+</button>
                            </div>
                        </div>
                    </div>
                );
            });
        }else{
            return(
                <div>
                   Vacio
                </div>
            )
        }
        
    }    

    TotalPrecioCarrito = ()=>{
        let total = 0;
        this.props.JsonBolsaRedux.map(val => total+=val.strPrecioTotal);
        return helpers.FormateoNumber(total);
    }

    terminarPedido = ()=>{
        let info = JSON.parse(localStorage.getItem("Usuario"));
        if(info == null){
            ReactGA.event({
                category: 'Modal Bolsa',
                action: 'Pedido finalizado sin inicio de sesion'
            });
            window.location.href = '/registro';
        }else{
            let carrito = JSON.parse(localStorage.getItem("Carrito"));
            const data ={
                documento : {
                    strIdCliente: info.StrIdTercero, 
                    strNombCliente: info.StrNombre, 
                    strCiudadCliente: info.StrCiudadDescripcion, 
                    intValorTotal: this.TotalPrecioCarrito().replace(/,/gi,""), 
                    strObservacion: this.state.strObservacion,
                    strDependencias : this.state.selectedDependencias,
                    intlistaPrecio: info.IntTipoTercero,
                    jsonVendedor : info.JsonVendedor
                },
                detalle : carrito
            }
            axios.post(URL_API+'/api/pedidos/',data)
            .then( async(strResult)=>{
               if(strResult.data.Success){
                    this.notify(strResult.data.strMensaje);
                    localStorage.setItem("Carrito",JSON.stringify([]));
                    this.props.addCarrito(JSON.parse(localStorage.getItem("Carrito")));
                    ReactGA.event({
                        category: 'Modal Bolsa',
                        action: 'Pedido finalizado con exito'
                    });
               }else{
                    alert("Hubo un error en el envio del pedido, por favor contactarse con uno de nuestros asesores");
               }
            })
        }
    }

    handleChangeDependencia = (e)=>{
        let index = e.target.selectedIndex;
        let id = e.target.value;
        let nombre = e.target.options[index].text;
        this.setState({
            dependencia :{
                id,
                nombre: id == ""?"":nombre
            }
        });
    }

    notify = (msg) => toast(msg,{autoClose: 1000, onClose: () => this.props.CerrarModal()});

    render(){
        return(
            <Container fluid className='ContenedorBolsa'>
                <ToastContainer />
                    <Row>
                        <div style={{position:'absolute', right:'0', top:'0', padding:'10px', fontFamily:'unset', color:'#626263', cursor:'pointer', fontWeight:'bold'}}  onClick={()=>this.props.CerrarModal()}>
                            X
                        </div>
                        <Col  xs={12} sm={12} lg={12}  xl={6} className='Col1'>
                            <label>PEDIDO <span>({this.props.JsonBolsaRedux.length} productos)</span></label>
                            <div className='CtnDetallePedido'>
                                {this.DetalleBolsa(this.props.JsonBolsaRedux)}
                            </div>
                        </Col>
                        <Col  xs={12} sm={12} lg={12}  xl={6} className='Col2'>
                                <div className='CtnBolsa'>
                                    <div className='CtnImgBolsa'>
                                        <div>
                                            <img src={ImgLogoInmoda}/>
                                        </div>
                                    </div>

                                    <div className='CtnResumen'>
                                        <label>RESUMEN DE TU PEDIDO</label>
                                        <div>
                                            <label>SUB-TOTAL PRODUCTOS</label>
                                            <label>${this.TotalPrecioCarrito()}</label>
                                        </div>
                                       
                                        <div>
                                        <span className={'label'}>Observaciones</span>
                                        <Control type={'text'} name={'SNombre'} value={this.state.strObservacion} readOnly={this.props.JsonBolsaRedux.length === 0 ?true:false} onChange={(e)=>this.setState({strObservacion: e.target.value})}/>
                                        <br/>
                                        <ListCheck dependencias={this.state.arrDependencias} selected={this.state.selectedDependencias} setSelected={(val)=>this.setState({selectedDependencias:val})}/>
                                            {
                                               /* this.state.arrDependencias.length !== 0?
                                                (
                                                    this.state.arrDependencias.map(val =>(
                                                        <label>
                                                            <Control type={'checkbox'}/>
                                                            {val.StrNombre}
                                                        </label>
                                                    ))
                                                ):(null)*/
                                            }
                                            <br/>
                                            <button onClick={()=>window.location.href = '/'}>SEGUIR COMPRANDO</button>
                                            <div>
                                                <div className='CtnImgCarrito'>
                                                    <img src={ImgCarrito}/>
                                                </div>  
                                                <button onClick={()=>this.terminarPedido()} className='btn-terminar' disabled={this.props.JsonBolsaRedux.length === 0 ?true:false}>TERMINAR PEDIDO</button>
                                            </div>
                                        </div>
                                    </div>

                                    <hr/>
                                    <div className='CtnPedidoProceso'>
                                        <label>PEDIDO EN PROCESO</label>
                                        <p>
                                            En este momento tu pedido esta siendo verificado por nuestras
                                            asesoras en el inventario y en el menor tiempo posble te estaremos
                                            enviando la factura con el pedido final existente. 
                                        </p>
                                    </div>
                                    <hr/>



                                </div>
                        </Col>
                    </Row>  
            </Container>
        )       
    }
}

//data props state
const mapStateToProps = state => ({
    showModal:state.AbrirModal.showModal,
    strDataTipoModal:state.AbrirModal.strDataTipoModal,
    strDataProducto:state.AbrirModal.strDataProducto,
    JsonBolsaRedux: state.Carrito == null ? [] : state.Carrito
});
//actions redux modal
const mapDispatchToProps = {
    addCarrito,
    getCarrito
};
export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(ModalBolsa)
);