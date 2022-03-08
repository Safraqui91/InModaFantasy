import React, { useReducer } from 'react'
import CarritoReducer from './Reducer'
import CarritoContext from './Context'

export default function FavoritosState(props) {
    const initialState = {
        carrito : JSON.parse(localStorage.getItem("Carrito")) === null ? [] : JSON.parse(localStorage.getItem("Carrito"))
    }

    const [state, dispatch] = useReducer(CarritoReducer, initialState)

    const addCarrito = (producto)=>{
        dispatch({
            type : 'ADD_CARRITO',
            payload : producto
        })
    }

    const deleteCarrito = ()=>{
        dispatch({
            type: 'DEL_CARRITO',
            payload : {}
        })
    }

    const deleteProducto = (idProducto)=>{
        dispatch({
            type: 'DEL_PRODUCTO_CARRITO',
            payload : {idProducto}
        })
    }

    const editCantidad = (StrIdProducto, IntAccion)=>{
        dispatch({
            type: 'EDIT_CANTIDAD',
            payload : {StrIdProducto, IntAccion}
        })
    }

    const editObservacion = (StrIdProducto, strObservacion)=>{
        dispatch({
            type : 'EDIT_OBSERVACION',
            payload : {StrIdProducto, strObservacion}
        })
    }
    
    return (
        <CarritoContext.Provider value={{
            carrito : state.carrito,
            addCarrito,
            deleteCarrito,
            deleteProducto,
            editCantidad,
            editObservacion
        }}>
            {props.children}
        </CarritoContext.Provider>
    )
}
