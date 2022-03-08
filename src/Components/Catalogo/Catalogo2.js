import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Card, Col, FormControl, Row } from 'react-bootstrap'
import Carousel from '../Carousel/Carousel.js'
import LineaCirculo from '../LineasCirculos/LineaCirculo.js'
import { FaAngleLeft, FaAngleRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Catalogo2.css'
import '../Home/Home2.css'
import Filtros from './Filtros/Filtros.js';
import Productos from './Productos/Productos.js';
import { lineasInfo, ValidarTipoTercero } from '../../helpers.js';
import ModalIM from '../Modal/ModalIM.js';
import axios from 'axios';
import { map, size } from 'lodash';
import Loadingg from '../../Common/Loading/Loadingg.js';
import modalProductoContext from '../../Context/ModalProducto/Context.js';

export default function Catalogo2({ descripcion, idLinea }) {
    const [linea, setLinea] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [referencias, setReferencias] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataModal, setDataModal] = useState(null);
    const [ObjLineas, setObjLineas] = useState([]);
    const [ObjTipos, setObjTipos] = useState([]);
    const [ObjGrupos, setObjGrupos] = useState([]);
    const [ObjMarcas, setObjMarcas] = useState([]);
    const [ObjMateriales, setObjMateriales] = useState([]);
    const [ObjSexos, setObjSexos] = useState([]);
    const [strIdLineaActiva, setStrIdLineaActiva] = useState(-1)
    const [strIdTipoActivo, setStrIdTipoActivo] = useState(-1)
    const [strIdGrupoActivo, setStrIdGrupoActivo] = useState(-1)
    const [paginacion, setPaginacion] = useState({
        total: 0,
        actual: 1
    })
    const [ocultarMenu, setOcultarMenu] = useState(false)
    const [strDataMateriales, setStrDataMateriales] = useState([])
    const [strDataMarcas, setStrDataMarcas] = useState([])
    const [strDataSexos, setStrDataSexos] = useState([])
    const [strDataLineas, setStrDataLineas] = useState([])
    const [blnSpinner, setBlnSpinner] = useState(false)

    const { StatusModal, DataModal, OpenModal, CloseModal } = useContext(modalProductoContext);

    useEffect(() => {
        (async() => {
            ConsultarFiltros();
            let IntTipoTercero = ValidarTipoTercero();
            console.log("Consultar filtros según")
            const lineas = await axios.get(process.env.REACT_APP_IP_BACK + '/api/productos/categoria/lineas/' + idLinea + '/' + IntTipoTercero);
            setStrDataLineas(lineas.data.strDataCategoria);
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (ObjLineas.length == 0) {
                let lineaActual = lineasInfo.filter(linea => linea.code == idLinea)[0];
                setLinea(lineaActual);
                ConsultarProductos(lineaActual);
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                ConsultarProductos(0);
            }
        })()
    }, [ObjLineas, ObjGrupos, ObjTipos, ObjMateriales, ObjMarcas, ObjSexos])

    useEffect(() => {
        (() => {
            //linea !== null && ConsultarProductos(linea, paginacion.actual);
            if (linea !== null) {
                ConsultarProductos(linea, paginacion.actual)
            }
        })()
    }, [paginacion.actual])

    useEffect(() => {
        (() => {
            if (strIdLineaActiva !== -1 || strIdTipoActivo !== -1 || strIdGrupoActivo !== -1) {
                ConsultarFiltros();
            }
        })()
    }, [strIdLineaActiva, strIdTipoActivo, strIdGrupoActivo])

    const ConsultarFiltros = async () => {
        setBlnSpinner(true);
        console.log("peticion 2")
        const materiales = await axios.get(process.env.REACT_APP_IP_BACK + '/api/filtros/material/',
            {
                params: {
                    lineas_ids: strIdLineaActiva == -1 ? 0 : strIdLineaActiva,
                    grupos_ids: strIdGrupoActivo == -1 ? 0 : strIdGrupoActivo,
                    tipos_ids: strIdTipoActivo == -1 ? 0 : strIdTipoActivo,
                    id_clase: idLinea
                }
            });
        setStrDataMateriales(materiales.data.strData);
        console.log("peticion 3")
        const marcas = await axios.get(process.env.REACT_APP_IP_BACK + '/api/filtros/marca/',
            {
                params: {
                    lineas_ids: strIdLineaActiva == -1 ? 0 : strIdLineaActiva,
                    grupos_ids: strIdGrupoActivo == -1 ? 0 : strIdGrupoActivo,
                    tipos_ids: strIdTipoActivo == -1 ? 0 : strIdTipoActivo,
                    id_clase: idLinea
                }
            });
        setStrDataMarcas(marcas.data.strData);
        console.log("peticion 4")
        const sexos = await axios.get(process.env.REACT_APP_IP_BACK + '/api/filtros/sexo/',
            {
                params: {
                    lineas_ids: strIdLineaActiva == -1 ? 0 : strIdLineaActiva,
                    grupos_ids: strIdGrupoActivo == -1 ? 0 : strIdGrupoActivo,
                    tipos_ids: strIdTipoActivo == -1 ? 0 : strIdTipoActivo,
                    id_clase: idLinea
                }
            });
        setStrDataSexos(sexos.data.strData)
        setBlnSpinner(false);
    }

    const condicional = (array, id, value) => {
        if (value) {
            array.push(id);
        } else {
            let index = array.indexOf(id);
            array.splice(index, 1);
        }
        return array;
    }

    const ActualizarFiltrosConsulta = async (id, value, tipo) => {
        switch (tipo) {
            case 'ObjLineas':
                const lineas = [...ObjLineas];
                let array = condicional(lineas, id, value);
                setObjLineas(array);
                break;
            case 'ObjGrupos':
                const grupos = [...ObjGrupos];
                setObjGrupos(condicional(grupos, id, value));
                break;
            case 'ObjTipos':
                const tipos = [...ObjTipos];
                setObjTipos(condicional(tipos, id, value));
                break;
            case 'Materiales':
                const materiales = [...ObjMateriales];
                setObjMateriales(condicional(materiales, id, value));
                break;
            case 'Marcas':
                const marcas = [...ObjMarcas];
                setObjMarcas(condicional(marcas, id, value));
                break;
            case 'Sexos':
                const sexos = [...ObjSexos];
                setObjSexos(condicional(sexos, id, value));
                break;
            default:
                break;
        }
    }
    //1487
    const ConsultarProductos = (lineaActual, num_paginacion = 1) => {
        let user = JSON.parse(localStorage.getItem("Usuario"));
        setLoading(true);
        console.log("peticion 5")
        axios.get(process.env.REACT_APP_IP_BACK + '/api/productos/categoria/',
            {
                params: {
                    lineas_ids: ObjLineas.join("','"),
                    grupos_ids: ObjGrupos.join("','"),
                    tipos_ids: ObjTipos.join("','"),
                    strIdLineaActiva: strIdLineaActiva == -1 ? 0 : strIdLineaActiva,
                    strIdTipoActivo: strIdTipoActivo == -1 ? 0 : strIdTipoActivo,
                    strIdGrupoActivo: strIdGrupoActivo == -1 ? 0 : strIdGrupoActivo,
                    lista_precio: ValidarTipoTercero(),
                    num_paginacion,
                    id_clase: lineaActual == 0 ? linea.code : lineaActual.code,
                    materiales_ids: ObjMateriales.join("','"),
                    marcas_ids: ObjMarcas.join("','"),
                    sexos_ids: ObjSexos.join("','"),
                    filtro_texto: ''
                }
            })
            .then(async (strResult) => {
                if (strResult.data.success) {
                    if (num_paginacion == 1) setPaginacion({ ...paginacion, total: parseInt(strResult.data.strNumProductos / 30) });
                    setReferencias(strResult.data.strProductos);
                    setLoading(false);
                } else {
                    alert(strResult.data.strMesaje);
                    alert("catalogo");
                }
            });
    }

    const openModalDetalle = (referencia) => {
        OpenModal(referencia);
    }


    return (
        <div className="contenedor-main">
            <Loadingg isVisible={loading} />
            <ModalIM
                show={StatusModal}
                close={CloseModal}
                data={DataModal}
            />
            <Row>
                <Col className={'padd-cero contenedor-filter'} xs={0} lg={3} style={ocultarMenu ? { display: 'none' } : { display: 'flex' }}>
                    <Filtros
                        ActualizarFiltrosConsulta={ActualizarFiltrosConsulta}
                        idLinea={idLinea}
                        ObjGrupos={ObjGrupos}
                        setObjGrupos={setObjGrupos}
                        ObjLineas={ObjLineas}
                        setObjLineas={setObjLineas}
                        ObjTipos={ObjTipos}
                        setObjTipos={setObjTipos}
                        strIdLineaActiva={strIdLineaActiva}
                        setStrIdLineaActiva={setStrIdLineaActiva}
                        strIdGrupoActivo={strIdGrupoActivo}
                        setStrIdGrupoActivo={setStrIdGrupoActivo}
                        strIdTipoActivo={strIdTipoActivo}
                        setStrIdTipoActivo={setStrIdTipoActivo}
                        strDataMateriales={strDataMateriales}
                        strDataMarcas={strDataMarcas}
                        strDataSexos={strDataSexos}
                        strDataLineas={strDataLineas}
                        setStrDataLineas={setStrDataLineas}
                        ConsultarFiltros={ConsultarFiltros}
                    />
                    <div className='ctnIcon' onClick={() => setOcultarMenu(!ocultarMenu)}>
                        <FaChevronLeft style={{ fontSize: 'x-large' }} />
                    </div>
                </Col>
                <FaChevronRight
                    style={!ocultarMenu ? { display: 'none' } : { display: 'flex' }}
                    className='filter-hide'
                    onClick={() => setOcultarMenu(!ocultarMenu)}
                />
                <Col className='padd-cero' id="main-container" xs={12} lg={ocultarMenu ? 12 : 9}>
                    {
                        linea && (
                            <>
                                <Banner linea={linea} />
                                <TituloLinea linea={linea} />
                            </>
                        )
                    }
                    <ListProductos
                        showModal={StatusModal}
                        openModalDetalle={openModalDetalle}
                        productos={referencias}
                        loading={loading}
                    />
                    {
                        paginacion.total !== 0 && (
                            <Paginacion
                                paginacion={paginacion}
                                setPaginacion={setPaginacion}
                            />
                        )
                    }

                </Col>
            </Row>
        </div>
    )
}

const Paginacion = ({ paginacion, setPaginacion }) => {

    const siguiente = () => {
        setPaginacion({
            ...paginacion,
            actual: paginacion.actual + 1
        })
    }

    const anterior = () => {
        if (paginacion.actual !== 1) {
            setPaginacion({
                ...paginacion,
                actual: paginacion.actual - 1
            })
        }
    }

    return (
        <div className="contenedor-pagination">
            <label>Páginas</label>
            {paginacion.actual !== 1 && (<a href="#main-container" style={{color: 'black'}} onClick={() => anterior()}><FaAngleLeft className="cursor-pointer" /></a>)}
            <span className='active'>{paginacion.actual}</span><span style={{ display: 1 == 1 ? 'none' : 'inline-block' }} >{paginacion.actual}</span><span>...</span>
            <span>{paginacion.total}</span>
            {paginacion.actual !== paginacion.total && (<a href="#main-container" style={{color: 'black'}} onClick={() => siguiente()}><FaAngleRight className="cursor-pointer" /> </a>)}
        </div>
    )
}

const ListProductos = ({ showModal, openModalDetalle, productos, loading }) => {
    return (
        <Row>
            {
                (!loading && size(productos) == 0) ? (
                    <div style={{ padding: '10px', textAlign: 'center', width: '100%' }}>
                        <p>No hemos encontrado ningún resultado para tus filtros de búsqueda</p>
                    </div>
                ) :
                    map((productos), (producto, index) => (
                        <Col xs={12} sm={6} lg={3} key={index}>
                            <Productos
                                producto={producto}
                                showModal={showModal}
                                openModalDetalle={openModalDetalle}
                            />
                        </Col>
                    ))
            }
        </Row>
    )
}

const TituloLinea = ({ linea }) => {
    return (
        <Row className={'ContenedorLineas'}>
            <LineaCirculo val={linea} type="detail" hoverColor={false} />
        </Row>
    )
}

const Banner = ({ linea }) => {
    return (
        <Row>
            <Col xs={12} className='CtnContent' style={{ /*overflowY: 'scroll', */padding: '0px',/* height : '300px',*/background: 'white' }}>
                <Carousel Url={linea} />
            </Col>
        </Row>
    )
}