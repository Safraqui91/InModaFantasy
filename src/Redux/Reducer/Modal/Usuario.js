const defaultState = {
    logueado : false,
    StrNombre : '',
    IntTipoTercero: ''
};
function reducer(state = defaultState, { type, data}) {
    let usuario = {}
    switch (type) {
        case 'SET_USUARIO': {
            usuario = {
                ...state
            }
            usuario = data;
            return usuario;
   		}
   		case 'GET_USUARIO':{
            usuario = {
                ...state
            }
     		return usuario;
        }
        case 'DEL_USUARIO':{
            usuario = {
                logueado : false,
                StrNombre : '',
                IntTipoTercero: ''
            }
     		return usuario;
        }
      default:
          return state;
    }
}

export default reducer;