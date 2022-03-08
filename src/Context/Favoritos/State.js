import React, { useReducer } from 'react'
import FavoritosReducer from './Reducer'
import FavoritosContext from './Context'

export default function FavoritosState(props) {
    const initialState = {
        favoritos : JSON.parse(localStorage.getItem("Favoritos")) === null ? [] : JSON.parse(localStorage.getItem("Favoritos"))
    }

    const [state, dispatch] = useReducer(FavoritosReducer, initialState)

    const getFavoritos = ()=>{

    }

    const addFavorito = (producto)=>{
        dispatch({
            type : 'ADD_FAVORITO',
            payload : producto
        })
    }

    const deleteFavorito = (idProducto)=>{
        dispatch({
            type: 'DEL_FAVORITO',
            payload : {idProducto}
        })
    }
    
    return (
        <FavoritosContext.Provider value={{
            favoritos : state.favoritos,
            getFavoritos,
            deleteFavorito,
            addFavorito
        }}>
            {props.children}
        </FavoritosContext.Provider>
    )
}
