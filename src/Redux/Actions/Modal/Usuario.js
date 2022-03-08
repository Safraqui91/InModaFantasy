export const setUsuarioLogueado = (data)=>{
    return{
        type:'SET_USUARIO',
        data
    }
}
export const getUsuarioLogueado = (id)=>{
    return{
        type:'GET_USUARIO'
    }
}
export const delUsuarioLogueado = ()=>{
    return{
        type:'DEL_USUARIO'
    }
}