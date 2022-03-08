export const type = 'AbrirModal';

const AbrirModal = (strData,strDataProducto) => ({
    type,
    payload: strData,
    strDataProducto
});

export default AbrirModal;
