export const addCarrito = (data)=>{
    return{
        type:'ADD_PRODUCTO_CARRITO',
        data
    }
}
export const delCarrito = (id)=>{
    return{
        type:'DEL_ELEMENT_CARRITO'
    }
}
export const setCarrito = (id,data)=>{
    return{
        type:'SET_ELEMENT_CARRITO',
        id,
        data
    }
}
export const getCarrito = ()=>{
    return{
        type:'GET_ELEMENT_CARRITO',
    }
}
