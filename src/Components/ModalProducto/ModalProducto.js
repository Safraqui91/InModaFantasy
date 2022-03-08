import React, {Component, Fragment} from 'react';
import ImgProducto from '../../Global/Images/CA930.jpeg';
import ImgLogoInmoda from '../../Global/Images/LogoInmoda.png';
import LogoAllKiss from '../../Global/Images/AllKiss.png';
import LogoLindas from '../../Global/Images/Lindas.png';
import LogoEileen from '../../Global/Images/Eileen.png';
import LogoLegend from '../../Global/Images/Legend.png';
import LogoIm from '../../Global/Images/Im.png';
import LogoFarmaPets from '../../Global/Images/FarmaPets.png';
import LogoFrancy from '../../Global/Images/Francy.png';
import ImgCarrito from '../../Global/Images/Carrito.png';
import { FaChevronDown } from "react-icons/fa";
import helpers from '../../helpers.js';
import {Button,Row,Col,Container,Carousel,InputGroup,FormControl,Alert} from 'react-bootstrap';
import './ModalProducto.css';
import axios from 'axios';


class ModalProducto extends Component{
    constructor(props){
        super(props);
        this.state={
          intIndexCarousel:0
        }
    }
    componentDidMount(){
      //Consultar guiones con su descripcion y su ruta para la imagen...
    }

    //Creacion Caroulsel Itm
    CarouselItem=(strDataImagenes, strDimension, strRuta)=>{
        let JsonImagenesPorPaquetes=[];
        JsonImagenesPorPaquetes[0] = [];
        strDataImagenes.map((JsonImg, intIndex)=>{
          let paquete = parseInt((intIndex + 1)/5);
          if(JsonImagenesPorPaquetes[paquete] == undefined){
            JsonImagenesPorPaquetes[paquete] = [];
          }
          JsonImagenesPorPaquetes[paquete].push(JsonImg);
        })
        //Ocultar next carousel si no contiene mas de 2 caorusel.itm
        setTimeout(function(){ 
          try {
            if(JsonImagenesPorPaquetes.length == 1){
              document.querySelector('.ContenedorModal .carousel-control-prev').style.display='none';
              document.querySelector('.ContenedorModal .carousel-control-next').style.display='none';
            }else{
                document.querySelector('.ContenedorModal .carousel-control-prev').style.display='inline-block !important';
                document.querySelector('.ContenedorModal .carousel-control-next').style.display='inline-block !important';
            }
          } catch (error) {
            
          }
        }, 500);
        
        
       return JsonImagenesPorPaquetes.map((Img,intIndex)=>{
        //Comportar img deacuerdo a cantidad de imagenes
        console.log(JsonImagenesPorPaquetes);
         return (
          <Carousel.Item data-index={intIndex}>
            <Row>
                  {
                    this.ImgCarousel(Img,intIndex, strDimension, strRuta)
                  }
            </Row>
          </Carousel.Item>
          )
         })
    }

    TituloFoto = (orden)=>{
      let titulo = "";
      switch (orden) {
        case '1':
          titulo = "Producto";
          break;
        case '2':
          titulo = "Presentación";
          break;
        case '3':
          titulo = "Detalle";
        break;
        case '4':
          titulo = "";
        break;
        default:
          titulo = parseInt(orden);
          titulo = "Estilo "+(orden-4);
          break;
      }
      return titulo;
    }

    //Img Carousel
    ImgCarousel=(Img,intIndexCarousel,strDimension, strRuta)=>{
      strDimension = strDimension.replace("*","X");
      let separadores = /\s*(?:X|x|$)\s*/;
      let arrayDimension = strDimension.split(separadores);
      var regex = /(\d+)/g;
      if(Img.length == 0){
        return(
          <Col xs={12}>
            <img
                  className={"w-100 h-100"}
                  src={process.env.REACT_APP_IP_BACK+`/api/imagenes/sinimagen`}
                  alt="First slide"
                  lazy='loading'
                  data-indexcarousel={1}
                  data-intorden={1}
                />
          </Col>
        )
      }
      let count = 1;
      return Img.map((Json)=>{
        let ruta = Json.StrArchivo.replace(/\//g,'*');
        let img = (
          <Col xs={Img.length == 1 ? 12 : 6}>
            {
                Json.IntOrden < 0?(
                  <div style={{position:'absolute', height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', fontSize:'xx-large',
                  fontWeight:'bold', color:'#e41685',    background: '#ffffff85', zIndex:'200'}}>AGOTADO</div>
                ):null
            }
            <div style={{position:'absolute', height:'100%', width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', textAlign:'center', fontSize:'x-large',
                  fontWeight:'bold', color:'#7d7d7d', fontFamily: 'Open Sans'}}>{this.TituloFoto(Json.StrDescripcion)}</div>
             <img
                  className={"w-100 h-100"}
                  src={process.env.REACT_APP_IP_BACK+`/api/imagenes/${ruta}`}
                  alt="First slide"
                  lazy='loading'
                  data-indexcarousel={intIndexCarousel}
                  data-intorden={Json.IntOrden}
                />
              
             {
                count == 2 && (arrayDimension.length == 2 || arrayDimension.length == 3) ?(
                  <Fragment>
                    <div className='contenedor-dimensiones'>
                    <div className='line'/>
                    <div className='MedidaL'><span>{arrayDimension[0].match(regex)}</span></div>
                    <div className='line'/>
                    </div>
                    <div className='contenedor-dimensionesV'>
                    <div className='lineV'/>
                    <div className='MedidaV'><span>{arrayDimension[1].match(regex)}</span></div>
                    <div className='lineV'/>
                    </div>
                  </Fragment>
                ):null
              }
          </Col>
        )
        count++;
        return img;
      })  
    }
    //Controlar dropdown
    DropdownShow=()=>{
      if(document.querySelector('.dropdownEstilo-content').style.display=='none' || document.querySelector('.dropdownEstilo-content').style.display==''){
        document.querySelector('.dropdownEstilo-content').style.display='block';
      }else{
         document.querySelector('.dropdownEstilo-content').style.display='none';
      }
    }
    //Mostrar estilo segun seleccion del dropdown de estilos
    ImgEstilo=(e)=>{
        let intIndexCarouselImg=0;
        //Buscamos en que indice de carousel se encuentra y se obtiene para posteriormente buscarlo y activarlo
        document.querySelectorAll('.ContenedorModal .carousel-item img').forEach((Img)=>{
              Img.classList.remove('BorderActive');
            if(e.target.dataset.intorden==Img.dataset.intorden){
              intIndexCarouselImg=Img.dataset.indexcarousel;
              Img.classList.add('BorderActive');
            }
        });
        //Buscamos el indice que se encuentra la imagen para activar el carousel-item
        document.querySelectorAll('.ContenedorModal .carousel-item').forEach(async(CarouselItem)=>{
          if(CarouselItem.dataset.index==intIndexCarouselImg){
            this.SelectCarousel(parseInt(intIndexCarouselImg));
          }
        });
    } 

    //Agregar estilos
    EstilosProducto=(strDataImg)=>{
      let JsonImagenesValida=[];
      //Los estilos empiezan de la imagen 5
      JsonImagenesValida.push(strDataImg.filter(Img=>parseInt(Img.StrDescripcion)>=5));
      //Si no tiene estilo ocultar estilos
       setTimeout(function(){ 
         if(JsonImagenesValida[0].length==0){
            document.querySelector('#CmpEstilo').style.display='none';
            document.querySelector('#IntCantidadTotal').readOnly=false;
          }else{
            document.querySelector('#CmpEstilo').style.display='inline-block';
            document.querySelector('#IntCantidadTotal').readOnly=true;
          }   
       }, 100);
      
       return JsonImagenesValida[0].map((Json,intIndex)=>{
         if(Json.IntOrden > 0){
            return (
              <li>
                <label>{(intIndex+1)}</label>
                <label data-intorden={Json.IntOrden} onClick={this.ImgEstilo}>Ver</label>
                <span>
                  <InputGroup>
                      <InputGroup.Prepend>
                        <Button variant="outline-secondary" onClick={this.AumentarEstilo}><span className='Mas'>+</span></Button>
                      </InputGroup.Prepend>
                      <FormControl data-intorden={Json.IntOrden} aria-describedby="basic-addon1" placeholder='0' readonly="readonly" maxlength="4"/>
                      <InputGroup.Prepend>
                        <Button variant="outline-secondary" onClick={this.DisminuirEstilo}><span className='Menos' >-</span></Button>
                      </InputGroup.Prepend>
                    </InputGroup>
                </span>
            </li>
            );
         }
       });
    }
    //Index carousel seleccion
    SelectCarousel=(selectedIndex, e)=>{
      this.setState({intIndexCarousel:selectedIndex})
    }
    //Tipo de logo modal
    TipoLogoModalcategoria=(strTipoCategoria)=>{
      switch(strTipoCategoria){
                case 'AllKiss':
                   return  <img src={LogoAllKiss}/>;
                break;
                case 'Lindas':
                    return  <img src={LogoLindas}/>;
                break;
                case 'Eileen':
                    return  <img src={LogoEileen}/>;
                break;
                case 'Legend':
                    return  <img src={LogoLegend}/>;
                break;
                case 'Im':
                    return  <img src={LogoIm}/>;
                break;
                case 'FarmaPets':
                    return  <img src={LogoFarmaPets}/>;
                break;
                case 'Francy':
                   return  <img src={LogoFrancy}/>;
                break;
                default:
                  return null
      }
    }
    //Aumentar Estilo
    AumentarEstilo=(e)=>{
      if(e.target.tagName=='SPAN'){
         if(e.target.parentNode.parentNode.nextSibling.value.trim()==''){
            e.target.parentNode.parentNode.nextSibling.value=0;
          }
         if(!(e.target.parentNode.parentNode.nextSibling.value.length<=4)){
          return;
        }
        let Input=(e.target.parentNode.parentNode.nextSibling.value);
        e.target.parentNode.parentNode.nextSibling.value=`${((parseInt(Input))+1)}`; 
      }else{
        if(e.target.parentNode.nextSibling.value.trim()==''){
            e.target.parentNode.nextSibling.value=0;
        }
        if(!(e.target.parentNode.nextSibling.value.length<=4)){
          return;
        }
        let Input=(e.target.parentNode.nextSibling.value);
        e.target.parentNode.nextSibling.value=`${((parseInt(Input))+1)}`;
      }
      //CalcularTotal
      this.TotalCantidad();
    }
    //Disminuir Estilo
    DisminuirEstilo=(e)=>{
      if(e.target.tagName=='SPAN'){
        if(e.target.parentNode.parentNode.previousSibling.value.trim()==''){
            e.target.parentNode.previousSibling.value=0;
        }
        if((e.target.parentNode.parentNode.previousSibling.value==0)){
          return;
        }
        let Input=(e.target.parentNode.parentNode.previousSibling.value);
        e.target.parentNode.parentNode.previousSibling.value=`${((parseInt(Input))-1)}`;
      }else{
        if(e.target.parentNode.previousSibling.value.trim()==''){
            e.target.parentNode.previousSibling.value=0;
        }
        if((e.target.parentNode.previousSibling.value==0)){
          return;
        }
        let Input=(e.target.parentNode.previousSibling.value);
        e.target.parentNode.previousSibling.value=`${((parseInt(Input))-1)}`;
      }
      //CalcularTotal
      this.TotalCantidad();
    }


    //Validar campo input
    ValidarCampo=async(e,strTipoInput)=>{
     var blnEstado=helpers.SoloNumeros(e);
    }
    //CalcularTotalCantidad
    TotalCantidad=()=>{
        //Recorriendo los estilos para determinar el total
        let intTotal=0;
        document.querySelectorAll('.dropdownEstilo-content ul li input').forEach((e)=>{
          if(e.value.trim()!=''){
            intTotal=intTotal+parseInt(e.value);
          }
        });
        document.querySelector('#IntCantidadTotal').value=intTotal;
    }
   //Agregar producto carrito
   AgregarProductoCarrito=(strDataJson)=>{
    //Validar campo
    
    if(document.querySelector('#IntCantidadTotal').value.trim()==0 || document.querySelector('#IntCantidadTotal').value.trim()==''){
      document.querySelector('.TextDanger').style.display='inline-block';
      return;
    }else{
      document.querySelector('.TextDanger').style.display='none';
    }

    //Estilos si tiene
    let JsonEstilos=new Array();
    if(document.querySelector("#CmpEstilo").style.display=='inline-block'){
      //Recorremos los estilos y creamos el json de estilos para posteriormente ser agregados
      document.querySelectorAll('.dropdownEstilo-content ul li input').forEach((input,intIndex)=>{
        if(input.value.trim()!='' && input.value.trim()!='0'){
          JsonEstilos.push({
            strEstilo:(intIndex+1),
            strCantidad:parseInt(input.value.trim()),
            strNumFoto:input.dataset.intorden
          });
        }
      })
    }
     //localStorage.removeItem('Carrito');
  
     let ruta = strDataJson.StrIdProducto;
     if(strDataJson.strImages.length == 0){
       ruta = strDataJson.StrIdProducto;
     }else{
       ruta = strDataJson.strImages[0].StrArchivo.replace(/\//g,'*');
     }
     //Estrutura de la data para el carrito
     let JsonEstructura={
          strReferencia:strDataJson.StrIdProducto,
          strDescripcion:strDataJson.StrDescripcion,
          strEstilos:JsonEstilos,
          strCantidadTotal:parseInt(document.querySelector('#IntCantidadTotal').value.trim()),
          strPrecioUnidad:strDataJson.IntPrecio,
          strPrecioTotal:strDataJson.IntPrecio*parseInt(document.querySelector('#IntCantidadTotal').value.trim()),
          strObservacion:document.querySelector('#txtObservacion').value.trim(),
          strImage:ruta
        };

    //Validamos si existe el localstore para el carrito
    if(localStorage.getItem("Carrito")==null){
        //Si no existe el localstore se crea uno nuevo con la informacion JsonEstructura
        let Json=new Array();
        Json.push(JsonEstructura);
        localStorage.setItem("Carrito",JSON.stringify(Json));
    }else{
        //Si ya esta creado el localstore del producto es adicionar nueva información
        let strDataJsonProducto=JSON.parse(localStorage.getItem("Carrito"));

        //Recorriendo la informacion,para determinar concidencias para actualizar informacion
        let ban = 0;
        strDataJsonProducto.map((JsonLocalStora)=>{
          //Validando nuevo producto con existente para actualizar
          if(JsonLocalStora.strReferencia==JsonEstructura.strReferencia){
            ban = 1;
            //Actualizamos la cantidad total
            JsonLocalStora.strCantidadTotal=parseInt(JsonLocalStora.strCantidadTotal)+parseInt(JsonEstructura.strCantidadTotal);
            //Actualizamos la cantidad por estilos si los tiene
            JsonEstructura.strEstilos.map((JsonEstructuraEstilo)=>{
              let blnEstilo=true;
              //Recorremos el estilo del producto nuevo agregar si esta actualizamos si no lo ingresamos
              JsonLocalStora.strEstilos.map((JsonLocalStoraEstilos)=>{
                if(JsonLocalStoraEstilos.strEstilo==JsonEstructuraEstilo.strEstilo){
                  JsonLocalStoraEstilos.strCantidad=parseInt(JsonLocalStoraEstilos.strCantidad)+parseInt(JsonEstructuraEstilo.strCantidad);
                  blnEstilo=false;
                }
              });
              //Si un estilo no esta en el existente se agrega a strEstilos
              if(blnEstilo){
                JsonLocalStora.strEstilos.push(JsonEstructuraEstilo); 
              }
            })
          }
        })
       if(ban == 0){
          let strDataJsonProducto=JSON.parse(localStorage.getItem("Carrito"));
          strDataJsonProducto.push(JsonEstructura);
          localStorage.setItem("Carrito",JSON.stringify(strDataJsonProducto));
       }else{
          localStorage.setItem("Carrito",JSON.stringify(strDataJsonProducto));
       }
    }
    this.props.addCarrito(JSON.parse(localStorage.getItem("Carrito")));
    //CerrarModal
    this.props.CerrarModal()
   }
    render(){
        //Data producto
        let strJsonDataProducto=JSON.parse(this.props.strDataProducto)[0];
        //console.log(strJsonDataProducto);
        return(
                <Container fluid className='ContenedorModal'>
                    <Row>
                    <div style={{position:'absolute', right:'0', top:'0', padding:'10px', fontFamily:'unset', color:'#626263', cursor:'pointer', fontWeight:'bold'}} onClick={()=>this.props.CerrarModal()}>
                        X
                    </div>
                    <Col  xs={12} sm={12} lg={12}  xl={7} className='Col1'>
                        <div className='CtnImgCatalogo'>
                        { /*this.state.intIndexCarousel == 0*/true ? (<div className='CtnImgMarcaAgua'>
                            <div className='CtnMarcaAguaOverley'></div>
                            <div className='CtnMarcaAguaImg'>
                                <img src={ImgLogoInmoda}/>
                            </div>
                        </div>):null}
                        <Carousel  activeIndex={this.state.intIndexCarousel}  interval={10000} onSelect={this.SelectCarousel} className='CtnBannerModalMarcas'>
                        {this.CarouselItem(strJsonDataProducto.strImages, strJsonDataProducto.StrParam3, strJsonDataProducto.StrRuta)}
                        </Carousel>
                        </div>
                    </Col>
                    <Col  xs={12} sm={12} lg={12} xl={5}  className='Col2'>
                      <div className='CtnCol2'>
                        <div className='CtnDescripcion'>
                            <div className='CtnImgDescripcionProducto'>
                                <div className='CtnImgDescripcionUno'>
                                  {this.TipoLogoModalcategoria(this.props.strDataTipoModal)}
                                </div>

                                {/*<div className='CtnImgDescripcionDos'>
                                    <img src={ImgLogoInmoda}/>
                                  </div>*/}
                            </div>
                            <div className='CtnDescripcionProducto'>
                                <label><strong>{strJsonDataProducto.StrDescripcion.toUpperCase()}</strong></label> 
                                <small>Referencia: {strJsonDataProducto.StrIdProducto.toUpperCase()}</small>

                                <p>

                                    <label>DESCRIPCIÓN: <label>{strJsonDataProducto.StrDescripcion}</label></label>
                                    <label></label>
                                    
                                    <div>
                                         
                                         <label>TAMAÑO:</label><br/>
                                         <label id='CmpEstilo'>ESTILO
                                            <div class="dropdownEstilo">
                                              <button onClick={()=>{this.DropdownShow()}}> <FaChevronDown/> </button>
                                              <div class="dropdownEstilo-content">
                                                <ul>
                                                {this.EstilosProducto(strJsonDataProducto.strImages)}
                                                </ul>
                                              </div>
                                            </div>
                                          </label><br/>
                                         <label>CANTIDAD:</label><br/>
                                         <label>VALOR:</label><br/>
                                         <label>UNIDAD MEDIDA:</label><br/>
                                         <label>CANTIDAD MEDIDA:</label>
                                    </div>

                                    <div>
                                        
                                        <label>{strJsonDataProducto.StrParam3}</label><br/>
                                        <label>
                                        </label><br/>
                                        <input type='text' style={{border:'1px #ced4da solid'}} maxlength="4" onKeyPress={(e)=>{this.ValidarCampo(e,'InputTotal')}} id='IntCantidadTotal' className='form-control'/>
                                        <br/>
                                       <label>${helpers.FormateoNumber(strJsonDataProducto.IntPrecio)}</label>
                                        <label>{strJsonDataProducto.StrUnidadMedida}</label><br/>
                                        <label>{strJsonDataProducto.IntCantidadMedida}</label>
                                    </div>
                                    <Alert variant="danger" className='TextDanger'>
                                            <p>
                                              Ingrese una cantidad del producto porfavor.
                                            </p>
                                        </Alert>
                                    <hr/>
                                    <div>
                                        <label>
                                          OBSERVACIONES:
                                        </label>
                                        <textarea className='form-control' id='txtObservacion' maxlength='300'></textarea>
                                    </div>
                                    <hr/>  
                                    <div> 
                                        <div>
                                             <img src={ImgCarrito}/>
                                        </div>
                                        <button onClick={()=>{this.AgregarProductoCarrito(strJsonDataProducto)}}>AGREGAR</button>
                                        
                                    </div>
                                </p>
                                </div>
                            </div>
                       </div>  
                    </Col>
                    </Row>
                    
                </Container>

        )
    }
}

export default ModalProducto;