import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import CarouseElastic from '../Components/CarouselElastic/CarouseElastic'
import carritoContext from '../Context/Carrito/Context';
import { ValidarTipoTercero } from '../helpers';

export default function ProductosRelacionados({setShowModal = undefined}) {
    const [productosRelacionados, setProductosRelacionados] = useState([])
    const { carrito } = useContext(carritoContext)

    useEffect(() => {
        (() => {
            let productos = carrito.map(val => { return val.StrIdProducto });
            console.log(ValidarTipoTercero())
            axios.get(process.env.REACT_APP_IP_BACK + '/api/productos/relacionados/', {
                params: {
                    lista_precio: ValidarTipoTercero(),
                    productos: productos.join("','")
                }
            })
                .then(async (strResult) => {
                    if (strResult.data.success) {
                        setProductosRelacionados(strResult.data.strProductos);
                    } else {
                        console.log(strResult);
                    }
                }).catch(e => {
                    alert(e);
                    alert("productos relacionados");
                })
        })()
    }, [carrito])
    return (
        <>
            {
                productosRelacionados.length !== 0 ? (
                    <div style={{ width: '100%', paddingInline: '15px' }}>
                        <label className="labelMBDark">QUIENES LLEVARON ESTOS PRODUCTOS TAMBIEN COMPRARON:</label>
                        <CarouseElastic
                            producto={productosRelacionados}
                            setShowModal={setShowModal !== undefined ? ()=>setShowModal() : setShowModal}
                        />
                    </div>
                ) : (null)
            }
        </>
    )
}
