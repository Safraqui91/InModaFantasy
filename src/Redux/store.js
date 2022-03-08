import { createStore, combineReducers } from 'redux';
import AbrirModal from './Reducer/Modal/AbrirModal';
import Carrito from './Reducer/Modal/Carrito';
import Usuario from './Reducer/Modal/Usuario';

const reducer = combineReducers({
    AbrirModal,
    Carrito,
    Usuario
});

const store = createStore(reducer);

export default store;
