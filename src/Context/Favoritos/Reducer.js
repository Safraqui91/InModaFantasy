import { GET_FAVORITOS, ADD_FAVORITO, DEL_FAVORITO } from "../types";

export default (state, action) =>{
    const {type, payload} = action;

    switch (type) {
        case ADD_FAVORITO:
            const stateCopy = [...state.favoritos];
            stateCopy.push(payload);
            localStorage.setItem("Favoritos",JSON.stringify(stateCopy));
            return{
                ...state,
                favoritos : stateCopy
            }
        case DEL_FAVORITO:
            const stateCopyFav = [...state.favoritos];
            const newState = stateCopyFav.filter(val => val.StrIdProducto !== payload.idProducto);
            localStorage.setItem("Favoritos",JSON.stringify(newState));
            return{
                ...state,
                favoritos : newState
            }
        default:
            return state;
    }
}