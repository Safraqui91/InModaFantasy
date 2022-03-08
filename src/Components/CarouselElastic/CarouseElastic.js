import React, { useEffect, useState } from 'react';
import Carousel, { consts } from 'react-elastic-carousel';
import iconPunto from '../../Global/Images/icons/P.png';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Axios from 'axios';
import { map } from 'lodash';
import { useContext } from 'react';
import modalProductoContext from '../../Context/ModalProducto/Context';
import ModalIM from '../Modal/ModalIM.js';
import ImgLogoInmoda from '../../Global/Images/LogoInmodaF.png';
import './CarouselElastic.css';
import Loadingg from "../../Common/Loading/Loadingg.js";

export default function CarouseElastic({ tipoTercero = 0, idLinea = '17', isModal = false, setShowModal = undefined, producto }) {
    const [items, setItems] = useState([])
    const [count, setCount] = useState(0)
    const [view, setView] = useState('')
    const [loading, setLoading] = useState(false)
    const [dimension, setDimension] = useState('')
    const { OpenModal } = useContext(modalProductoContext);
    //hacer que cuando llegue al ultimo vuelva a comenzar el ciclo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    useEffect(() => {
        (async () => {
            setLoading(true);
            if (producto !== undefined) {
                if (Array.isArray(producto)) {
                    setItems(producto)
                } else {
                    if (producto.strImages === undefined) {
                        //alert("pailas")
                    } else {
                        let imgs = producto.strImages[0] === undefined ? [producto.StrIdProducto] : producto.strImages;
                        setItems(imgs);
                    }

                }
                setDimension(producto.StrParam3);
            }
            setTimeout(() => {
                setLoading(false);
            }, 500);
        })()
    }, [])

    useEffect(() => {
        (() => {
            if (producto !== undefined) {
                if (Array.isArray(producto)) {
                    setItems(producto)
                } else {
                    if (producto.strImages === undefined) {
                        //alert("pailas")
                    } else {
                        let imgs = producto.strImages[0] === undefined ? [producto.StrIdProducto] : producto.strImages;
                        setItems(imgs);
                        grupoFotos(imgs);
                    }
                }
                setDimension(producto.StrParam3);
            }
        })()
    }, [producto])

    const grupoFotos = (imgs) => {
        let grupo = [];
        let aux = [];
        let cont = 1;
        for (let index = 0; index < imgs.length; index++) {
            const val = imgs[index];
            if (cont >= 1 && cont <= 4) {
                aux.push(val);
                cont++;
            }
            if (cont == 5) {
                cont = 1;
                aux.length !== 0 && grupo.push(aux);
                aux = [];
            }
            if (index + 1 == imgs.length) {
                aux.length !== 0 && grupo.push(aux);
            }
        }
        console.log(grupo);
        setItems(grupo);
    }

    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 4, itemsToScroll: 2, pagination: false },
        { width: 850, itemsToShow: 3 },
        { width: 1150, itemsToShow: 4, itemsToScroll: 2 },
        { width: 1450, itemsToShow: 5 },
        { width: 1750, itemsToShow: 6 },
    ]
    const renderArrow = ({ type, onClick, isEdge }) => {
        const pointer = type === consts.PREV ? (<FaChevronLeft />) : <FaChevronRight />
        return (
            <div onClick={onClick} disabled={isEdge} style={items.length !== 1 ? { display: 'flex', alignItems: 'center', cursor: 'pointer' } : { display: 'none' }}>
                {pointer}
            </div>
        )
    }
    const Modal = (item) => {
        OpenModal(item);
        if (setShowModal !== undefined) {
            setShowModal();
        }
    }

    const TituloFoto = (orden) => {
        let titulo = "";
        switch (orden) {
            case 1:
                titulo = "Producto";
                break;
            case 2:
                titulo = "Presentación";
                break;
            case 3:
                titulo = "Detalle";
                break;
            default:
                orden = orden < 0 ? orden * -1 : orden;
                titulo = parseInt(orden);
                titulo = "Estilo " + ((orden) - 4);
                break;
        }
        return titulo;
    }

    return (
        <>
            {
                loading ? (
                    <Loadingg isVisible={loading} position='absolute' />
                ) : (
                    <Carousel
                        itemsToShow={4}
                        renderArrow={renderArrow}
                        enableAutoPlay={!isModal}
                        autoPlaySpeed={3000}
                        renderPagination={({ pages, activePage, onClick }) => { return (<></>) }}
                        breakPoints={breakPoints}
                        className={isModal ? 'ContinerImagesModal' : ''}
                    >
                        {
                            map(items, (item, index) => {
                                let url = item.StrArchivo === undefined ? item.StrRuta : item;
                                console.log(url)
                                let dim = dimension !== undefined ? dimension.split(/[*|x|X]/) : '';
                                return (
                                    <>
                                        {
                                            isModal && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 2
                                                }}>
                                                    <div style={(item.length == 2 || item.length == 1) ? { background: 'transparent', width: '25%' } : { background: 'white', width: '25%' }}>
                                                        <img src={ImgLogoInmoda} style={{
                                                            width: '100%',
                                                            zIndex: 5
                                                        }} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div key={index} style={{ position: 'relative' }}>
                                            {
                                                isModal && (
                                                    <>
                                                        {item.IntOrden < 0 && <div className='agotado' style={{ width: '100%' }}>AGOTADO</div>}
                                                        {/*<div className='contenedor-dimensiones'>
                                            <div className='line'/>
                                            <div className='MedidaL'><span>{'9'}</span></div>
                                            <div className='line'/>
                                            </div>
                                            <div className='contenedor-dimensionesV'>
                                            <div className='lineV'/>
                                            <div className='MedidaV'><span>{'0'}</span></div>
                                            <div className='lineV'/>
                                            </div>*/}
                                                        {
                                                            /*index == (items.length - 1) && (
                                                                <>
                                                                    <div style={{ position: 'absolute', right: '10px' }}>
                                                                        <div>
                                                                            <div className="line"></div>
                                                                            <div style={{ display: 'inline-block' }}>{dim[0]}</div>
                                                                            <div className="line"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ position: 'absolute', transform: 'rotate(270deg)', right: '15px', transformOrigin: 'right' }}>
                                                                        <div>
                                                                            <div className="line"></div>
                                                                            <div style={{ display: 'inline-block', transform: 'rotate(90deg)' }}>{dim[1]}</div>
                                                                            <div className="line"></div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )*/
                                                        }

                                                        {/*<div className="line"></div>
                                        <div style={{ display: 'inline-block' }}>OR</div>
                                        <div className="line"></div>

                                        <div className="rotate">
                                            <div className="line"></div>
                                            <div style={{ display: 'inline-block' }}>OR</div>
                                            <div className="line"></div>
                                        </div>*/}
                                                    </>
                                                )
                                            }
                                            {
                                                isModal ?
                                                    (
                                                        <>
                                                            {map(item, (val, index) => (
                                                                <label style={{ width: '50%', cursor: 'pointer', position:'relative' }} className={index == 0 ? 'margin1' : (index == 1 ? 'margin2' : (index == 2 ? 'margin3' : ''))}>
                                                                    <img
                                                                        src={process.env.REACT_APP_IP_BACK + `/api/imagenes/?src=` + val.StrArchivo + `&strIdProducto=` + val.StrIdCodigo}
                                                                        style={{ width: '100%' }}
                                                                    />
                                                                    {
                                                                        val.IntOrden < 0 && (
                                                                            <div style={{
                                                                                position: 'absolute', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', fontSize: 'xx-large',
                                                                                fontWeight: 'bold', color: '#e41685', background: '#ffffff85', zIndex: 1, top:'0'
                                                                            }}>AGOTADO</div>
                                                                        )
                                                                    }
                                                                    <label style={{
                                                                        display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                                                        fontWeight: 'bold', color: '#7d7d7d', fontFamily: 'Open Sans',
                                                                        position: 'relative', zIndex: '2'
                                                                    }}>{TituloFoto(val.IntOrden)}</label>
                                                                </label>
                                                            ))}
                                                        </>
                                                    )
                                                    :
                                                    <img
                                                        src={process.env.REACT_APP_IP_BACK + `/api/imagenes/?src=` + url + `&strIdProducto=` + item.StrIdCodigo}
                                                        style={{ width: '100%', cursor: 'pointer' }}
                                                        onClick={() => Modal(item)}
                                                    />
                                            }

                                        </div>
                                    </>
                                )
                            })
                        }
                    </Carousel>
                )
            }


        </>
    )
}
