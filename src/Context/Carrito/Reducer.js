import { ADD_CARRITO, DEL_CARRITO, EDIT_CANTIDAD, DEL_PRODUCTO_CARRITO, EDIT_OBSERVACION } from "../types";

export default (state, action) =>{
    const {type, payload} = action;
    let stateCopyCarrito = [...state.carrito];
    switch (type) {
        case ADD_CARRITO:
            let stateCopy = [...state.carrito];
            if(stateCopy.find(val => val.StrIdProducto == payload.StrIdProducto)){
                let updateCarrito = stateCopy.map(val => 
                    (val.StrIdProducto == payload.StrIdProducto )? 
                        {
                            ...val, 
                            IntCantidad : parseInt(val.IntCantidad) + parseInt(payload.IntCantidad),
                            IntValorTotal : (parseInt(val.IntCantidad) + parseInt(payload.IntCantidad)) * payload.IntPrecio,
                            IntValorTotalDescuento : (parseInt(val.IntCantidad) + parseInt(payload.IntCantidad)) * payload.IntPrecio2
                        }
                    : val
                )
                stateCopy = updateCarrito;
            }else{
                payload.IntValorTotal = payload.IntCantidad * payload.IntPrecio;
                payload.IntValorTotalDescuento = payload.IntCantidad * payload.IntPrecio2;
                stateCopy.push(payload);
            }
            localStorage.setItem("Carrito",JSON.stringify(stateCopy));
            return{
                ...state,
                carrito : stateCopy
            }
        case DEL_CARRITO:
            localStorage.removeItem("Carrito");
            return{
                carrito : []
            }
        case DEL_PRODUCTO_CARRITO :
            const stateCopyCar = [...state.carrito];
            const newStateCar = stateCopyCar.filter(val => val.StrIdProducto !== payload.idProducto);
            localStorage.setItem("Carrito",JSON.stringify(newStateCar));
            return{
                ...state,
                carrito : newStateCar
            }
        case EDIT_CANTIDAD:
            if(stateCopyCarrito.find(val => val.StrIdProducto == payload.StrIdProducto)){
                let updateCarrito = stateCopyCarrito.map(val => 
                    (val.StrIdProducto == payload.StrIdProducto )? 
                        {
                            ...val, 
                            IntCantidad : payload.IntAccion !== -1 && payload.IntAccion !== 1 ? parseInt(payload.IntAccion) : parseInt(val.IntCantidad) + parseInt(payload.IntAccion),
                            IntValorTotal : payload.IntAccion !== -1 && payload.IntAccion !== 1 ? parseInt(payload.IntAccion) * val.IntPrecio : (parseInt(val.IntCantidad) + parseInt(payload.IntAccion)) * val.IntPrecio,
                            IntValorTotalDescuento : payload.IntAccion !== -1 && payload.IntAccion !== 1 ? parseInt(payload.IntAccion) * val.IntPrecio2 : (parseInt(val.IntCantidad) + parseInt(payload.IntAccion)) * val.IntPrecio2
                        }
                    : val
                )
                stateCopyCarrito = updateCarrito;
            }
            localStorage.setItem("Carrito",JSON.stringify(stateCopyCarrito));
            return{
                ...state,
                carrito : stateCopyCarrito
            }
        case EDIT_OBSERVACION:
            if(stateCopyCarrito.find(val => val.StrIdProducto == payload.StrIdProducto)){
                let updateCarrito = stateCopyCarrito.map(val => 
                    (val.StrIdProducto == payload.StrIdProducto )? 
                        {
                            ...val, 
                            StrObervaciones : payload.strObservacion
                        }
                    : val
                )
                stateCopyCarrito = updateCarrito;
            }
            localStorage.setItem("Carrito",JSON.stringify(stateCopyCarrito));
            return{
                ...state,
                carrito : stateCopyCarrito
            }
        default:
            return state;
    }
}