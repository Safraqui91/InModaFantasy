import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import './Favoritos.css'
import { FaHeart } from 'react-icons/fa'
import { FaEdit, FaTrashAlt, FaRegHeart, FaShoppingBag } from 'react-icons/fa'
import ProductosRelacionados from '../../Common/ProductosRelacionados'
//CONTEXT
import favoritosContext from '../../Context/Favoritos/Context'
import carritoContext from '../../Context/Carrito/Context';
import objHelpers from '../../helpers'
import { toast, ToastContainer } from 'react-toastify'

export default function Favoritos() {
    const {favoritos, deleteFavorito} = useContext(favoritosContext)
    const {carrito, addCarrito, deleteProducto} = useContext(carritoContext)

    const notify = (msg) => toast(msg, { autoClose: 2000 });

    const EliminarProducto = (idProducto)=>{
        notify("Producto eliminado");
        deleteFavorito(idProducto)
    }

    return (
        <div className="contenedor-main">
            <ToastContainer />
            <div className="contenedorTitleFavoritos">
                <div className="titleFavoritos">
                    <h3><FaHeart color='white' /> TU LISTA DE DESEOS</h3>
                </div>
            </div>
            <div className="contenedorData">
                <Table responsive>
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>REFERENCIA</th>
                            <th>NOMBRE DEL PRODUCTO</th>
                            <th>PRECIO</th>
                            <th>CANTIDAD</th>
                            <th>OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DetalleBolsa favoritos={favoritos} EliminarProducto={EliminarProducto} addCarrito={addCarrito} notify={notify}/>
                    </tbody>
                </Table>
                <hr />
                <ProductosRelacionados />
            </div>
        </div>
    )
}

const DetalleBolsa = ({favoritos, EliminarProducto, addCarrito, notify}) => {
    const initialState = {
        id : null,
        msg : ''
    }
    const [error, setError] = useState(initialState)

    const [favoritosCopy, setFavoritosCopy] = useState(favoritos)

    useEffect(() => {
        setFavoritosCopy(favoritos);
    }, [favoritos])

    const AgregarCarrito = (dataProducto)=>{
        if(dataProducto.IntCantidad == 0){
            setError({
                id : dataProducto.StrIdProducto,
                msg : 'Ingresar la cantidad'
            })
            return 
        }
        const newData = {
            IntCantidad : parseInt(dataProducto.IntCantidad),
            IntPrecio : dataProducto.IntPrecio,
            IntPrecio2 : dataProducto.IntPrecio2,
            StrDescripcion : dataProducto.StrDescripcion,
            StrUnidadMedida : dataProducto.StrUnidadMedida,
            strImages : dataProducto.strImages,
            StrIdProducto : dataProducto.StrIdProducto,
            StrParam3 : dataProducto.StrParam3,
            StrRuta : dataProducto.StrRuta,
            StrEstilos : []
        }
        addCarrito(newData);
        notify("Producto agregado al carrito")
    }

    const onChange = (e, idProducto)=>{
        setError(initialState)
        setFavoritosCopy(favoritosCopy.map(val => val.StrIdProducto == idProducto ? {...val, IntCantidad : parseInt(e.target.value)} : val));
    }

    return (
        <>
            {
                favoritosCopy.map((val) => (
                    <tr>
                        <td>
                            <img src={process.env.REACT_APP_IP_BACK + `/api/imagenes/?src=`+val.StrRuta+`&strIdProducto=`+val.StrIdCodigo} className='imageFavoritos' />
                        </td>
                        <td>
                            {val.StrIdProducto}
                        </td>
                        <td>
                            {val.StrDescripcion} 
                        </td>
                        <td>$ {objHelpers.FormateoNumber(val.IntPrecio)}</td>
                        <td>
                            <div style={{display : 'flex', flexDirection : 'column', alignItems: 'center'}}>
                                <input type='number' className="cantidad" value={val.IntCantidad} onChange={(e)=>onChange(e, val.StrIdProducto)}/>
                                <label className="label-error">{error.id == val.StrIdProducto ? error.msg : ''}</label>
                            </div>
                        </td>
                        <td >
                            <div className='accionesFavoritos'>
                                {/*<FaEdit color="#CF117F" />*/}
                                <FaTrashAlt color="#CF117F" onClick={()=>EliminarProducto(val.StrIdProducto)}/>
                                <FaShoppingBag color="#CF117F" onClick={()=>AgregarCarrito(val)}/>
                            </div>
                        </td>
                    </tr>
                ))
            }
        </>
    )
}
