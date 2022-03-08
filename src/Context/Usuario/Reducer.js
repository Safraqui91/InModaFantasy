import { LOGIN_USUARIO, DESCUENTO_USUARIO, CAMBIO_PRECIO} from "../types";

export default (state, action) =>{
    const {type, payload} = action;
    let stateCopy = {
        ...state.usuario
    }

    switch (type) {
        case LOGIN_USUARIO:
            localStorage.setItem("Usuario",JSON.stringify(payload.usuario));
            return{
                ...state,
                usuario : payload.usuario
            }

        case DESCUENTO_USUARIO:
            stateCopy.BlDescuento = payload.estado;
            localStorage.setItem("Usuario",JSON.stringify(stateCopy));
            return{
                ...state,
                usuario : stateCopy
            }
        
          
        case CAMBIO_PRECIO:
            stateCopy.IntTipoTercero = payload.listaPrecio;
            localStorage.setItem("Usuario",JSON.stringify(stateCopy));
            return{
                ...state,
                usuario : stateCopy
            }
        default:
            return state;
    }
}