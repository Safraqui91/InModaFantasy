const objHelpers={};
objHelpers.ValidarTipoTercero = ()=>{
    let user = JSON.parse(localStorage.getItem("Usuario")); 
    let IntTipoTercero = 3; //Si el usuario no esta logueado se muestra precio 3
    if(user !== null){
        IntTipoTercero = user.IntTipoTercero;
    }
    if(IntTipoTercero == 0){
        IntTipoTercero = 3;
    }
    return IntTipoTercero;
}
objHelpers.ValidarToken = ()=>{
    let user = JSON.parse(localStorage.getItem("Usuario")); 
    console.log(user);
    if(user !== null){
        //validar tiempo del token
        let token = user.Token;
        return true;
    }
    return false;
}
//Metodo formateo de números
objHelpers.FormateoNumber=(num)=>{
    try{
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }catch(Error){
        console.log(Error);
    }
}
//Ordenamiento json
objHelpers.sortJSON=(data, key, orden) =>{
    return data.sort(function (a, b) {
        var x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}
//Dividir numeros resultado exacto
objHelpers.roundNumber=(intNumber,intCociente)=>{
        let intNumberRound=0;
        if(Number.isInteger(intNumber/intCociente)){
            intNumberRound=intNumber/intCociente;
        }else{
            intNumberRound=Math.floor((intNumber/intCociente))+1;
        }

        return intNumberRound;
}
//Validar solo números
objHelpers.SoloNumeros=(e)=>{
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
    e.preventDefault();
    return false;
   }
   return true;
}
//ValidarCorreo
objHelpers.isValidEmail = (mail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
}
//Info lineas Por Defecto
objHelpers.lineasInfo = [
    {
        linea: 'ModaYAccesorios',
        code: '101',
        color: 'green',
        hover: 'HoverGreen',
        img: 'ModaYAccesorios',
        descripcion: 'MODA Y ACCESORIOS'
    },
    {
        linea: 'Belleza',
        code: '971',
        color: 'pink',
        hover: 'HoverPink',
        img: 'Belleza',
        descripcion: 'BELLEZA'
    },
    {
        linea: 'Hogar',
        code: '991',
        color: 'orange',
        hover: 'HoverOrange',
        img: 'Hogar',
        descripcion: 'HOGAR Y FERRETERÍA'
    },
    {
        linea: 'Papeleria',
        code: '1021',
        color: 'green',
        hover: 'HoverGreen',
        img: 'Papeleria',
        descripcion: 'PAPELERÍA'
    },
    {
        linea: 'Bisuteria',
        code: '981',
        color: 'pink',
        hover: 'HoverPink',
        img: 'Bisuteria',
        descripcion: 'BISUTERÍA'
    },
    {
        linea: 'Mascotas',
        code: '1001',
        color: 'orange',
        hover: 'HoverOrange',
        img: 'Mascotas',
        descripcion: 'MASCOTAS'
    },
    {
        linea: 'InsumosMedicos',
        code: '1011',
        color: 'blue',
        hover: 'HoverBlue',
        img: 'InsumosMedicos',
        descripcion: 'INSUMOS MÉDICOS'
    }
]
module.exports = objHelpers;