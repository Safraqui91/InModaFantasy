const defaultState = [];
function reducer(state = defaultState, { type, data}) {
    let carritoData = [];
    switch (type) {
        case 'ADD_PRODUCTO_CARRITO': {
            carritoData=data;
            return carritoData;
   		}
   		case 'GET_ELEMENT_CARRITO':{
            carritoData = [
                ...state
            ]
     		return carritoData;
        }
      default:
          return state;
    }
}

export default reducer;