import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Accordion, Card, Col, FormControl, Row } from 'react-bootstrap';
import { FaAngleDown, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ValidarTipoTercero } from '../../../helpers';
import '../Catalogo.css'
import './Filtros.css'

export default function Filtros({
    idLinea : idClase, 
    ActualizarFiltrosConsulta, 
    ObjGrupos, setObjGrupos, 
    ObjLineas, setObjLineas, 
    ObjTipos, setObjTipos, 
    strIdLineaActiva, 
    setStrIdLineaActiva, 
    strIdGrupoActivo, 
    setStrIdGrupoActivo, 
    strIdTipoActivo, 
    setStrIdTipoActivo,
    strDataMateriales,
    strDataMarcas,
    strDataSexos, 
    strDataLineas,
    setStrDataLineas,
    ConsultarFiltros}) {

    /*const [strDataMateriales, setStrDataMateriales] = useState([])
    const [strDataMarcas, setStrDataMarcas] = useState([])
    const [strDataSexos, setStrDataSexos] = useState([])
    const [strDataLineas, setStrDataLineas] = useState([])*/
    const [strCodigoCategoria, setStrCodigoCategoria] = useState(idClase)
    const [strLineaActiva, setStrLineaActiva] = useState('')
    const [strGrupoActivo, setStrGrupoActivo] = useState('')
    const [strTipoActivo, setStrTipoActivo] = useState('')
    const [blnSpinner, setBlnSpinner] = useState(false)

    useEffect(() => {
        //let IntTipoTercero = ValidarTipoTercero();
        (() => {
            /*ConsultarFiltros();
            axios.get(process.env.REACT_APP_IP_BACK + '/api/productos/categoria/lineas/' + strCodigoCategoria + '/' + IntTipoTercero)
                .then(async (strResult) => {
                    setStrDataLineas(strResult.data.strDataCategoria)
                });*/
        })()
    }, [])

    /*useEffect(() => {
       (()=>{
            ConsultarFiltros();
       })()
    }, [strIdLineaActiva, strIdTipoActivo, strIdGrupoActivo])
    const ConsultarFiltros = async() => {
        setBlnSpinner(true);
        const materiales = await axios.get(process.env.REACT_APP_IP_BACK + '/api/filtros/material/',
            {
                params: {
                    lineas_ids: strIdLineaActiva,
                    grupos_ids : strIdGrupoActivo,
                    tipos_ids : strIdTipoActivo,
                    id_clase: idClase
                }
            });
        setStrDataMateriales(materiales.data.strData);
        const marcas = await axios.get(process.env.REACT_APP_IP_BACK + '/api/filtros/marca/',
            {
                params: {
                    lineas_ids: strIdLineaActiva,
                    grupos_ids : strIdGrupoActivo,
                    tipos_ids : strIdTipoActivo,
                    id_clase: idClase
                }
            });
        setStrDataMarcas(marcas.data.strData)
        const sexos = await axios.get(process.env.REACT_APP_IP_BACK + '/api/filtros/sexo/',
            {
                params: {
                    lineas_ids: strIdLineaActiva,
                    grupos_ids : strIdGrupoActivo,
                    tipos_ids : strIdTipoActivo,
                    id_clase: idClase
                }
            });
        setStrDataSexos(sexos.data.strData)
        setBlnSpinner(false);
    }*/

    const handleInputChange = (event, linea, id, tipo, TipoCategoria)=>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        switch (tipo) {
            case 'Categorias':
                ActualizarFiltrosConsulta(id, value, 'Obj'+TipoCategoria);
                /*this.props.ConsultarFiltros();
                this.props.ConsultarProductos('ConsultaInicial','1');*/
                break;
            case 'Materiales':
                ActualizarFiltrosConsulta(id, value, 'Materiales');
                //this.props.ConsultarProductos('ConsultaInicial','1')
                break;
            case 'Marcas':
                ActualizarFiltrosConsulta(id, value, 'Marcas');
                //this.props.ConsultarProductos('ConsultaInicial','1')
            break;
            case 'Sexos':
                ActualizarFiltrosConsulta(id, value, 'Sexos');
                //this.props.ConsultarProductos('ConsultaInicial','1')
            break;
        
            default:
                break;
        }
    }


    const ValidarTipoTercero = ()=>{
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

    const ActualizarEstado= (idLinea, idGrupo, idTipo)=>{
        setStrIdTipoActivo(idTipo);
        //alert(strIdLineaActiva + " " +idLinea);
        setObjTipos(strIdGrupoActivo == 0 ? [] : ObjTipos);
    }

    const ConsultarCategoriaLineas = async()=>{
        let IntTipoTercero = ValidarTipoTercero();
        await axios.get(process.env.REACT_APP_IP_BACK+'/api/productos/categoria/lineas/'+strCodigoCategoria+'/'+IntTipoTercero)
        .then(async (strResult)=>{
            setStrDataLineas(strResult.data.strDataCategoria);
        });
    }
    const ConsultarCategoriaGrupo = async(idLinea)=>{
        let IntTipoTercero = ValidarTipoTercero();
        /*await this.setState({
            blnSpinner:true,
            strDataCategoria : []
        });*/
        setStrIdLineaActiva(idLinea);
        setObjLineas(strIdLineaActiva == 0 ? [] : ObjLineas);
        await axios.get(process.env.REACT_APP_IP_BACK+'/api/productos/categoria/grupos/'+strCodigoCategoria+'/'+idLinea+'/'+IntTipoTercero)
        .then(async (strResult)=>{
            console.log(strResult.data);
            /*await this.setState({
                strDataCategoria:strResult.data.strDataCategoria,
                blnSpinner:false
            });*/
            setStrDataLineas(strResult.data.strDataCategoria);
        });
    }
    const ConsultarCategoriaTipos = async(idGrupo)=>{
        let IntTipoTercero = ValidarTipoTercero();
        /*await this.setState({
            blnSpinner:true,
            strDataCategoria : []
        });*/
        setStrIdGrupoActivo(idGrupo);
        setObjGrupos(strIdGrupoActivo == 0 ? [] : ObjGrupos);
        await axios.get(process.env.REACT_APP_IP_BACK+'/api/productos/categoria/tipos/'+strCodigoCategoria+'/'+strIdLineaActiva+'/'+idGrupo+'/'+IntTipoTercero)
        .then(async (strResult)=>{
            /*await this.setState({
                strDataCategoria:strResult.data.strDataCategoria,
                blnSpinner:false
            });*/
            setStrDataLineas(strResult.data.strDataCategoria);
        });
    }

    const NextCategoria = (id, tipo, descripcion)=>{
        switch (tipo) {
            case 'Lineas':
                ActualizarEstado(id, 0, 0);
                //this.props.ActualizarFiltroPorCategoria(id, 'ObjLineas');
                //this.setState({strLineaActiva: descripcion});
                setStrLineaActiva(descripcion);
                ConsultarCategoriaGrupo(id);
                break;
            case 'Grupos':
                ActualizarEstado(strIdLineaActiva, id, 0);
                //this.props.ActualizarFiltroPorCategoria(id, 'ObjGrupos');
                //this.setState({strGrupoActivo: descripcion});
                setStrGrupoActivo(descripcion);
                ConsultarCategoriaTipos(id);
                break;
            case 'Tipos':
                ActualizarEstado(strIdLineaActiva, strGrupoActivo, id);
                //this.props.ActualizarFiltroPorCategoria(id, 'ObjTipos');
                //this.setState({strTipoActivo: descripcion});
                setStrTipoActivo(descripcion);
                ConsultarCategoriaTipos(id);
                break;
            break;
            default:
                break;
        }
    }

    const BackCategoria = ()=>{
        //grupo activo -> grupo
        //linea activa -> linea
        if(strIdGrupoActivo !== 0){
            ActualizarEstado(strIdLineaActiva, 0, 0);
            ConsultarCategoriaGrupo(strIdLineaActiva);
            setStrGrupoActivo('');
            setStrIdGrupoActivo(0);
        }else if(strIdLineaActiva !== 0){
            ActualizarEstado(0, 0, 0);
            ConsultarCategoriaLineas();
            setStrLineaActiva('');
            setStrIdLineaActiva(0);
        }
    }

    return (
        <div style={{ padding: '20px', width: '100%', overflowY: 'scroll' }}>
            {/*<div>
                <FormControl
                    placeholder='Buscar'
                    className='form-control-input'
                />
            </div>*/}
            <div className="contenedorFiltro">
                <div>
                    <h3 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Filtros</h3>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="0" style={{ cursor: 'pointer' }}>
                            <Row style={{ height: 'auto' }}>
                                <Col xs={9}>
                                    <strong>Categorias</strong>
                                </Col>
                                <Col xs={1}>
                                    <span><FaAngleDown /></span>
                                </Col>
                            </Row>

                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <ul>
                                    <li>Resultados ({strDataLineas.length})</li>
                                    {
                                        strLineaActiva !== '' && (
                                            <li>
                                                <Row style={{ height: 'auto' }}>
                                                    <Col xs={1}>
                                                        <span onClick={() => BackCategoria()}><FaAngleLeft /></span>
                                                    </Col>
                                                    <Col xs={8}>
                                                        {
                                                            strGrupoActivo !== "" ? strGrupoActivo : strLineaActiva
                                                        }
                                                    </Col>
                                                </Row>
                                            </li>
                                        )
                                    }
                                    {strDataLineas.map((strData, intIndex) => {
                                        intIndex++;
                                        return (
                                            <li
                                                data-codigolinea={strData.StrIdCategoria}
                                                className='lista'
                                                style={{
                                                    position: 'relative',
                                                    animationName: 'example',
                                                    animationDuration: '2s',
                                                    cursor: 'pointer'
                                                }}
                                                key={intIndex}
                                            >
                                                <div style={{ height: 'auto', display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                                                    <div style={{}}>
                                                        <label style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'  }}>
                                                            <input type="checkbox" className='check' onChange={(e) => handleInputChange(e, strData.StrDescripcion, strData.StrIdCategoria, 'Categorias', strData.StrTipoCategoria)} />
                                                            {strData.StrDescripcion[0].toUpperCase() + strData.StrDescripcion.slice(1).toLowerCase()}
                                                        </label>
                                                    </div>
                                                    <div>
                                                        {
                                                            strData.StrTipoCategoria != "Tipos" ? (
                                                                <span className="next" onClick={() => { NextCategoria(strData.StrIdCategoria, strData.StrTipoCategoria, strData.StrDescripcion) }}><FaAngleRight /></span>
                                                            ) : null
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

                    {
                        strDataMateriales.length !== 0 && (
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="-1">
                                    <Row style={{ height: 'auto' }}>
                                        <Col xs={9}>
                                            <strong>Material</strong>
                                        </Col>
                                        <Col xs={1}>
                                            <span><FaAngleDown /></span>
                                        </Col>
                                    </Row>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="-1" >
                                    <Card.Body>
                                        <ul>
                                            <li>Resultados ({strDataMateriales.length})</li>
                                            {strDataMateriales.map((strData, intIndex) => {
                                                return (
                                                    <li
                                                        data-codigolinea={strData.StrIdPParametro}
                                                        className='lista'
                                                        key={intIndex}
                                                    >
                                                        <label style={{ width: '100%' }}>
                                                            <Row style={{ height: 'auto' }}>
                                                                <Col xs={4}>
                                                                    <input type="checkbox" className='separador' onChange={(e) => handleInputChange(e, strData.StrDescripcion, strData.StrIdPParametro, 'Materiales')} />
                                                                </Col>
                                                                <Col xs={8}>
                                                                    {strData.StrDescripcion[0].toUpperCase() + strData.StrDescripcion.slice(1).toLowerCase()}
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
                        )
                    }
                    {
                        strDataMarcas.length !== 0 && (
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="-2">
                                    <Row style={{ height: 'auto' }}>
                                        <Col xs={9}>
                                            <strong>Marca</strong>
                                        </Col>
                                        <Col xs={1}>
                                            <span><FaAngleDown /></span>
                                        </Col>
                                    </Row>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="-2">
                                    <Card.Body>
                                        <ul>
                                            <li>Resultados ({strDataMarcas.length})</li>
                                            {strDataMarcas.map((strData, intIndex) => {
                                                return (
                                                    <li
                                                        data-codigolinea={strData.StrIdPParametro}
                                                        className='lista'
                                                        key={intIndex}
                                                    >
                                                        <label style={{ width: '100%' }}>
                                                            <Row style={{ height: 'auto' }}>
                                                                <Col xs={4}>
                                                                    <input type="checkbox" className='separador' onChange={(e) => handleInputChange(e, strData.StrDescripcion, strData.StrIdPParametro, 'Marcas')} />
                                                                </Col>
                                                                <Col xs={8}>
                                                                    {strData.StrDescripcion[0].toUpperCase() + strData.StrDescripcion.slice(1).toLowerCase()}
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
                        )
                    }
                    {
                        strDataSexos.length !== 0 && (
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Card.Header} className='CtnCategorias' variant="link" eventKey="-3">
                                    <Row style={{ height: 'auto' }}>
                                        <Col xs={9}>
                                            <strong>{strCodigoCategoria == 17 ? 'Especie' : 'Género'}<small></small></strong>
                                        </Col>
                                        <Col xs={1}>
                                            <span><FaAngleDown /></span>
                                        </Col>
                                    </Row>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="-3">
                                    <Card.Body>
                                        <ul>
                                            <li>Resultados ({strDataSexos.length})</li>
                                            {strDataSexos.map((strData, intIndex) => {
                                                return (
                                                    <li
                                                        data-codigolinea={strData.StrIdPParametro1}
                                                        className='lista'
                                                        key={intIndex}
                                                    >
                                                        <label style={{ width: '100%' }}>
                                                            <Row style={{ height: 'auto' }}>
                                                                <Col xs={4}>
                                                                    <input type="checkbox" className='separador' onChange={(e) => handleInputChange(e, strData.StrDescripcion, strData.StrIdPParametro1, 'Sexos')} />
                                                                </Col>
                                                                <Col xs={8}>
                                                                    {strData.StrDescripcion[0].toUpperCase() + strData.StrDescripcion.slice(1).toLowerCase()}
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
                        )
                    }

                </div>
                <div>
                    <p className="Filtros-p">
                        ¿Ya conoces nuestras políticas de compras para ventas al por mayor?<br />
                        <Link className="Filtros-a" to="/#">Conoce más</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
