import React,{Component, Fragment} from 'react'
import '../MiCuenta.css'
import {Row,Col,Form} from 'react-bootstrap'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let {Control,Check} = Form;

class InfoTributaria extends Component{
    constructor(props){
        super(props)
        this.state = {
            loadInfo : false,
            objDataInformacionTributaria: {
                regimenVentas: '0',
                regimenFiscal: '0',
                resp05: 0,
                resp07: 0,
                resp09: 0,
                resp35: 0,
                intGranContribuyente: 0,
                intAutoRetenedor: 0,
                intRetenedorIca:0,
                intManejaBasesReteIva: 0,
                manejaBasesReteFte: 0,
                intContratoEstabilidad: 0,
                btnAction : 0
            }
        }
    }

    componentDidMount = ()=>{
        let strDataJsonTercero=JSON.parse(localStorage.getItem("Usuario"));
        axios.get(process.env.REACT_APP_IP_BACK+'/api/terceros/tercero/'+strDataJsonTercero.StrIdTercero)
        .then( async(strResult)=>{
            console.log(strResult.data.strMensaje);

            if(strResult.data.Success){
                const {StrTipoId, IntTipoPersona,
                    IntRegimen, IntRegimenFiscal, IntResp05, IntResp07, IntResp09, IntResp35, IntGranContribuyente, IntAutoRetenedor, IntRetenedorIca, IntNoManejaBasesReteIva, 
                    IntNoManejaBases, IntContratoEstabilidad} = strResult.data.strMensaje;
                
                let tipoDoc= '';
                if(StrTipoId == 'NI'){
                    tipoDoc = 'NI-Numero de identificacion tributaria'
                }else if(StrTipoId == 'CC'){
                    tipoDoc = 'CC-Cedula de ciudadania';
                }else if(StrTipoId == 'TE'){
                    tipoDoc = 'TE-Tarjeta extranjeria'
                }else if(StrTipoId == 'CE'){
                    tipoDoc = 'CE-Cedula extranjeria'
                }
                if(IntTipoPersona == 2){
                    this.setState({
                        objDataInformacionTributaria : {
                            regimenVentas: IntRegimen,
                            regimenFiscal: IntRegimenFiscal,
                            resp05: IntResp05,
                            resp07: IntResp07,
                            resp09: IntResp09,
                            resp35: IntResp35,
                            intGranContribuyente: IntGranContribuyente,
                            intAutoRetenedor: IntAutoRetenedor,
                            intRetenedorIca:IntRetenedorIca,
                            intManejaBasesReteIva: IntNoManejaBasesReteIva,
                            manejaBasesReteFte: IntNoManejaBases,
                            intContratoEstabilidad: IntContratoEstabilidad
                        },
                        loadInfo : true
                    });
                }
            }
        });  
    }

    handleChangeInfoTributaria = (event)=>{
        this.setState({
            objDataInformacionTributaria : {
                ...this.state.objDataInformacionTributaria,
                [event.target.name]: event.target.checked == undefined ? event.target.value : (event.target.checked == true ? 1:0)
            },
            msgRptaError: ''
        });
    }

    ActualizarTerceroTributariaHgi = ()=>{
        let data = {...this.state.objDataInformacionTributaria};
        let strDataJsonTercero=JSON.parse(localStorage.getItem("Usuario"));
        data.documento = strDataJsonTercero.StrIdTercero;
        axios.post(process.env.REACT_APP_IP_BACK+'/api/terceros/terceroTributaria/',
        data)
        .then( async(strResult)=>{
            if(strResult.data.Success){
                this.notify(strResult.data.strMensaje);
            }else{
                alert(strResult.data.strMensaje);
            }
        });
    }

    notify = (msg) => toast(msg,{autoClose: 2000});

    render(){
        return(
            <Fragment>
                <ToastContainer />
                {
                     this.state.loadInfo ? 
                     (
                         <div>
                             <Row >
                                 <Col xs={4} xl={5} className={'labelContainer'}>
                                     <span className={'label'}>Régimen Ventas</span>
                                 </Col>
                                 <Col xs={8} xl={7}>
                                     <Control as={'select'} name={'regimenVentas'} value={this.state.objDataInformacionTributaria.regimenVentas} onChange={this.handleChangeInfoTributaria}>
                                         <option value = '0'>Ninguno</option>
                                         <option value = '1'>No responsable de IVA</option>
                                         <option value = '2'>Impuesto sobre las ventas - IVA</option>
                                         <option value = '3'>00 - Regimen Especial</option>
                                         <option value = '4'>Obligación a facturar por ingresos bienes y/o servicios excluidos</option>
                                         <option value = '5'>Régimen Simple de Tributación - SIMPLE</option>
                                         <option value = '6'>No responsable de Consumo restaurantes y bares </option>
                                         <option value = '7'>Agente retención impoconsumo de bienes inmuebles</option>
                                     </Control>
                                 </Col>
                             </Row>
                             <Row >
                                 <Col xs={4} xl={5} className={'labelContainer'}>
                                     <span className={'label'}>Régimen Fiscal</span>
                                 </Col>
                                 <Col xs={8} xl={7}>
                                     <Control as={'select'} name={'regimenFiscal'} value={this.state.objDataInformacionTributaria.regimenFiscal} onChange={this.handleChangeInfoTributaria}>
                                         <option value = '0'>Ninguno</option>
                                         <option value = '1'>No responsable de IVA</option>
                                         <option value = '2'>Impuesto sobre las ventas - IVA</option>
                                     </Control>
                                 </Col>
                             </Row>
                             <Row >
                                 <Col xs={4} xl={5}>
                                     <Check type="checkbox" name={'resp05'} label="Impto. renta" checked={this.state.objDataInformacionTributaria.resp05 == 1 ? true : false}  onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                                 <Col xs={8} xl={7}>
                                     <Check type="checkbox" name={'resp07'} label="Retencion en la fuente" checked={this.state.objDataInformacionTributaria.resp07  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                             </Row>
                             <Row >
                                 <Col xs={4} xl={5}>
                                     <Check type="checkbox" name={'resp09'} label="Retencion en la fuente en el iva" checked={this.state.objDataInformacionTributaria.resp09  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                                 <Col xs={8} xl={7}>
                                     <Check type="checkbox" name={'intGranContribuyente'} label="Gran contribuyente" checked={this.state.objDataInformacionTributaria.intGranContribuyente  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                             </Row>
                             <Row >
                                 <Col xs={4} xl={5}>
                                     <Check type="checkbox" name={'intAutoRetenedor'} label="Auto retenedor" checked={this.state.objDataInformacionTributaria.intAutoRetenedor  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                                 <Col xs={8} xl={7}>
                                     <Check type="checkbox" name={'intRetenedorIca'} label="Retencion Ica" checked={this.state.objDataInformacionTributaria.intRetenedorIca  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                             </Row>
                             <Row >
                                 <Col xs={4} xl={5}>
                                     <Check type="checkbox" name={'intManejaBasesReteIva'} label="No maneja bases RteIva" checked={this.state.objDataInformacionTributaria.intManejaBasesReteIva  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                                 <Col xs={8} xl={7}>
                                     <Check type="checkbox" name={'manejaBasesReteFte'} label="No maneja bases RteIva" checked={this.state.objDataInformacionTributaria.manejaBasesReteFte  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                             </Row>
                             <Row >
                                 <Col xs={4} xl={5}>
                                     <Check type="checkbox" name={'intContratoEstabilidad'} label="Contrato estabilidad jurídica" checked={this.state.objDataInformacionTributaria.intContratoEstabilidad  == 1 ? true : false} onChange={this.handleChangeInfoTributaria}/>
                                 </Col>
                             </Row>
         
                             <Row style={{paddingTop:'20px'}} className={'centerRow'}>
                                 <div className={'buttonGeneral centerRow'} onClick={()=>this.ActualizarTerceroTributariaHgi()} style={{width:'100px'}}>
                                     Actualizar
                                 </div>
                             </Row>
                         </div>
                     ):
                     (
                         <div></div>
                     )
                }
            </Fragment>
           
        )
    }
}

export default InfoTributaria;