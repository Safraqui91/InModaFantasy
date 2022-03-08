import { OPEN_MODAL, CLOSE_MODAL} from "../types";

export default (state, action)=>{
    const {type, payload} = action;
    switch (type) {
        case OPEN_MODAL:
            return{
                ...state,
                open: true,
                data : payload
            }
            
        case CLOSE_MODAL:
            return {
                ...state,
                open : false,
                data : null
            }
    
        default:
            return state;
    }
}