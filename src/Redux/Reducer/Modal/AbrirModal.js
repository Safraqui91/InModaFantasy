import { type as AbrirModal } from '../../Actions/Modal/AbrirModal';
import { type as CerrarModal } from '../../Actions/Modal/CerrarModal';
import ReactGA from 'react-ga';

const defaultState = {
	showModal:false,
  strDataTipoModal:null,
  strDataProducto:[]
};

function reducer(state = defaultState, { type, payload,strDataProducto}) {
    switch (type) {
        case AbrirModal: {
			ReactGA.modalview('/'+payload);
         	return {
  				strDataTipoModal:payload,
          strDataProducto,
          showModal:true
  			  };
   		 }
   		 case CerrarModal:{
     		 	return {
  				strDataTipoModal:null,
  				showModal:false,
          strDataProducto:[]
     		 	};
   		 }
      default:
          return state;
    }
}

export default reducer;