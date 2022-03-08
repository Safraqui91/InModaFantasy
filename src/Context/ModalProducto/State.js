import React, { useReducer } from 'react'
import ModalProductoReducer from './Reducer'
import ModalProductoContext from './Context'

export default function ModalProductoState(props){
    const initialState = {
        open : false,
        data : null
    }
    const [state, dispatch] = useReducer(ModalProductoReducer, initialState)

    const OpenModal = (producto)=>{
        dispatch({
            type: 'OPEN_MODAL',
            payload : producto
        })
    }

    const CloseModal = ()=>{
        dispatch({
            type: 'CLOSE_MODAL'
        })
    }

    return (
        <ModalProductoContext.Provider value={{
           StatusModal : state.open,
           DataModal : state.data,
           OpenModal,
           CloseModal
        }}>
            {props.children}
        </ModalProductoContext.Provider>
    )
}