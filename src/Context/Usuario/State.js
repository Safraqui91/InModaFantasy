import React, { useReducer } from 'react'
import UsuarioReducer from './Reducer'
import UsuarioContext from './Context'

export default function UsuarioState(props) {
    const initialState = {
        usuario : JSON.parse(localStorage.getItem("Usuario")) === null ? [] : JSON.parse(localStorage.getItem("Usuario"))
    }

    const [state, dispatch] = useReducer(UsuarioReducer, initialState)

    const loginUser = (usuario)=>{
        dispatch({
            type : 'LOGIN_USUARIO',
            payload : {usuario}
        })
    }

    const accionDescuento = (estado) =>{
        dispatch({
            type : 'DESCUENTO_USUARIO',
            payload : {estado}
        })
    }

    const cambioPrecio = (listaPrecio) =>{
        dispatch({
            type: 'CAMBIO_PRECIO',
            payload: {listaPrecio}
        })
    }

    return (
        <UsuarioContext.Provider value={{
            usuario : state.usuario,
            loginUser,
            accionDescuento,
            cambioPrecio
        }}>
            {props.children}
        </UsuarioContext.Provider>
    )
}
