import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Route,  Switch, useRouteMatch} from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
/*Componentes*/
import Navigation from './Components/Navigation/Navigation.js';
import Home from './Components/Home/Home.js';
import Catalogo2 from './Components/Catalogo/Catalogo2.js';
import Modal from './Components/Modal/Modal.js';
import Registro from './Components/Registro/Registro'
import MiCuenta from './Components/MiCuenta/MiCuenta';


import { Provider } from 'react-redux';
import store from './Redux/store';
import ReactGA from 'react-ga';
import Navigation2 from './Components/Navigation/Navigation2.js';
import Footer from './Components/Footer/index.js';
import Ingreso from './Components/Ingreso/Ingreso.js';
import Contactanos from './Components/Contactanos/Contactanos.js';
import RecordadContraseña from './Components/Ingreso/Recordar Contrasena/RecordadContraseña.js';
import CambiarContraseña from './Components/Ingreso/Cambiar Contrasena/CambiarContraseña.js';
import BotonFlotante from './Components/BotonesFlotantes/BotonFlotante.js';
import Home2 from './Components/Home/Home2.js';
import Favoritos from './Components/Favoritos/Favoritos.js';

//CONTEXT
import FavoritosState from './Context/Favoritos/State';
import CarritoState from './Context/Carrito/State';
import UsuarioState from './Context/Usuario/State';
import ModalProductoState from './Context/ModalProducto/State';

/*Aplicacion  pagina web*/
function App() {
  const [url, setUrl] = useState(window.location.href.split('/')[3]);
  const [filtroTextoGeneral, setFiltroTextoGeneral] = useState(url.split('?')[1] == undefined ? '' : url.split('?')[1]);
  useEffect(() => {
    ReactGA.initialize('UA-189585410-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  const CatalogoView = (urlView, idLinea) => {
    setUrl(urlView);
    return (
      <Catalogo2 Url={urlView} idLinea={idLinea} />
    )
  }

  const HomeView = () => {
    return (
      <Home2
        filtroTextoGeneral={filtroTextoGeneral}
      />
    )
  }


  return (
    <FavoritosState>
      <CarritoState>
        <UsuarioState>
          <ModalProductoState>
            <Router >
              <Navigation2
                Url={url}
              />
              <BotonFlotante />
              {/*<Navigation
                    Url={url}
                  />*/}
              {/*<Modal/>*/}
              <div>
                <Switch>
                  <Route exact path='/' component={() => HomeView()} />
                  <Route exact path='/ModaYAccesorios' component={() => CatalogoView('ModaYAccesorios', '101')} />
                  <Route exact path='/Belleza' component={() => CatalogoView('Belleza', '971')} />
                  <Route exact path='/Hogar' component={() => CatalogoView('Hogar', '991')} />
                  {/*<Route exact path='/FerreteriaYvehiculos' component={() => CatalogoView('FerreteriaYvehiculos', '901')} />*/}
                  <Route exact path='/Papeleria' component={() => CatalogoView('Papeleria', '1021')} />
                  <Route exact path='/Bisuteria' component={() => CatalogoView('Bisuteria', '981')} />
                  <Route exact path='/Mascotas' component={() => CatalogoView('Mascotas', '1001')} />
                  <Route exact path='/InsumosMedicos' component={() => CatalogoView('InsumosMedicos', '1011')} />
                  {/*<Route exact path='/OtrasCategorias' component={() => CatalogoView('OtrasCategorias', '1398')} />*/}
                  <Route exact path='/Registro' component={() => <Registro />} />
                  <Route exact path='/MiCuenta' component={() => <MiCuenta />} />
                  <Route exact path='/Ingreso' component={() => <Ingreso />} />
                  <Route exact path='/Contactanos' component={() => <Contactanos />} />
                  <Route exact path='/RecordarContrasena' component={() => <RecordadContraseña />} />
                  <Route exact path='/CambiarContrasena' component={() => <CambiarContraseña />} />
                  <Route exact path='/Favoritos' component={() => <Favoritos />} />
                </Switch>
              </div>

              <Footer />
            </Router>
          </ModalProductoState>
        </UsuarioState>
      </CarritoState>
    </FavoritosState>
  );
}

export default App;
