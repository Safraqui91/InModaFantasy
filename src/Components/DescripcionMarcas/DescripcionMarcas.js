import React, {Component} from 'react';
import './DescripcionMarcas.css';
import ImgAllkiss from '../../Global/Images/AllKiss.png';
import ImgFarmaPets from '../../Global/Images/FarmaPets.png';
import { Row,Col} from 'react-bootstrap';
import ImgEileen from '../../Global/Images/Eileen.png';
import ImgLindas from '../../Global/Images/Lindas.png';
import ImgLegend from '../../Global/Images/Legend.png';
import ImgIm from '../../Global/Images/Im.png';
import ImgFrancy from '../../Global/Images/Francy.png';
import ImgAyuda from '../../Global/Images/Ayuda.png';
import { FaTshirt } from 'react-icons/fa';
import ReactGA from "react-ga";

class DescripcionMarcas extends Component{
    constructor(props){
        super(props);
        this.state = {
          objMarcas : {
            ModaYAccesorios : {
              descripcion1: 'MODA Y ACCESORIOS',
              descripcion2: `Nuestra línea de accesorios de moda, fiesta, y fantasía fina. En la que encuentras categorías
              muy variadas como accesorios para el cuerpo,
              accesorios de cabello, accesorios de playa,
              textiles y marroquinería. Todos estos productos
              novedosos y de uso frecuente que cualquier
              mujer no le podría faltar en su colección de
              accesorios.`,
              image: 'ModaYAccesorios',
              class: 'CtnLineaModaYAccesorios',
            },
            Belleza : {
              descripcion1: `BELLEZA`,
              descripcion2: `Tenemos gran variedad de productos diseñados
              para destacar tu belleza. Cosméticos de dama
              que resaltantan la belleza natural de la mujer.
              Línea de cosméticos infantil llenos de
              creatividad, color y diversión. Además de
              productos para barbería y peluquería.`,
              image: 'Belleza',
              class: 'CtnLineaBelleza',
            },
            Hogar : {
              descripcion1: 'HOGAR',
              descripcion2: `En esta línea podrás encontrar productos de uso
              diario en el hogar, útiles y asequibles. Tales
              como; variedad de utensilios de cocina,
              decoración y aseo.`,
              image: 'Hogar',
              class: 'CtnLineaHogar',
            },
            FerreteriaYvehiculos : {
              descripcion1: 'FERRETERIA Y VEHICULOS',
              descripcion2: `En esta línea encuentra, herramientas manuales,
              herramientas eléctricas, adhesivos, pegantes y
              accesorios con los mejores precios, útiles y
              asequibles.`,
              image: 'FerreteriaYvehiculos',
              class: 'CtnLineaFerreteriaYvehiculos',
            },
            Papeleria : {
              descripcion1: 'PAPELERIA',
              descripcion2: `Una línea para redescubrir tu pasión por la
              organización, escribir y pintar, recortar, medir y
              empacar, productos que puedes usar ya sea en
              la oficina, en la escuela o en casa.`,
              image: 'Papeleria',
              class: 'CtnLineaPapeleria',
            },
            Bisuteria : {
              descripcion1: 'BISUTERIA',
              descripcion2: `Deja volar tu imaginación y enamórate de la gran
              variedad de insumos que te ofrecemos en esta
              línea, para que puedas elaborar tus accesorios y
              terminar los productos con tu toque especial.
              Dijes, herrajes, bolsas, apliques, borlas,
              cordones y cueros, cintas, flores y moños,
              cartones, cadenas, chaquiras, piedras y perlas,
              guaya.`,
              image: 'Bisuteria',
              class: 'CtnLineaBisuteria',
            },
            Mascotas : {
              descripcion1: 'MASCOTAS',
              descripcion2: `Nuestra línea de mascotas, pensada en la
              felicidad y el bienestar animal. En la que puedes
              encontrar; juguetes, cepillos, peines, rascadores,
              utensilios de aseo, medicina, comederos,
              bebederos, guacales y morrales.`,
              image: 'Mascotas',
              class: 'CtnLineaMascotas',
            },
            InsumosMedicos : {
              descripcion1: 'INSUMOS MÉDICOS',
              descripcion2: `Línea especial de protección personal , en la cual
              encuentras productos como tapabocas, caretas,
              termometros, guantes, entre otros.`,
              image: 'InsumosMedicos',
              class: 'CtnLineaInsumosMedicos',
            },
            OtrasCategorias : {
              descripcion1: 'OTRAS CATEGORIAS',
              descripcion2: `Siempre estamos en constante innovación, para
              poder sorprenderte, en esta categoría
              encuentras variedad de productos, como
              accesorios para celular, pines, tatuajes y sticker,
              alcancías, juegos de mesa.`,
              image: 'OtrasCategorias',
              class: 'CtnLineaOtrasCategorias',
            }
          }
        }
    }

    render(){
        //Tipo de navegación
        let objMarcaSeleccionada = this.state.objMarcas[this.props.Url];
        let user = JSON.parse(localStorage.getItem("Usuario"));
        user = user == null ?proccess.env.REACT_APP_NUMBER_DEFAULT:user.JsonVendedor.strCelular;
        return(
          <div className='CtnDescripcionMarcas'>
             <div className={objMarcaSeleccionada.class}>
                <div style={{padding:'5px', height:'100%', width:'100%'}}>
                  <div style={{top:'0px'}}>
                    <div className={'CtnLineaBanner'} >
                      <div className={'CtnImageBanner '+objMarcaSeleccionada.image}/>
                    </div>
                    <div >
                      <h4 className='Titulo'>
                        {objMarcaSeleccionada.descripcion1}
                      </h4>
                    </div>
                    <div className='Descripcion'>
                      <p>
                        {objMarcaSeleccionada.descripcion2}
                      </p>
                    </div>
                  </div>
                  <div className='CtnAyudaMarca'>
                    <div className='CtnAyudaImg'>
                        <div></div>
                        <div>
                            <img src={ImgAyuda}/>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className='CtnAyudaTexto'>
                      <p><a className='BtnAyuda' href={'https://api.whatsapp.com/send?phone=57'+user} onClick={()=>{
                              ReactGA.event({
                                category: 'Ayuda Web',
                                action: 'Marca Descripcion'
                            });
                        }} target={'_blank'}>
                        ¿Te ayudamos en tu compra?</a></p>
                    </div>
                  </div>
                </div>
                  
            </div>
            </div>
          );
        /*switch(this.props.Url){
          case 'AllKiss':

          break;

          case 'FarmaPets':

          break;


          case 'Eileen':
          
          break;

          case 'Lindas':
            
          break;

          case 'Legend':
           
          break;
          case 'Im':
           
          break;
          case 'Francy':
            
          break;
          
          default:


          return null;
        

        }*/

    }
}

export default DescripcionMarcas;