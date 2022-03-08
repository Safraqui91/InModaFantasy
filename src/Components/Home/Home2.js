import Carousel from "../Carousel/Carousel.js";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import "./Home2.css";
import iconPunto from "../../Global/Images/icons/P.png";
import iconTransporte from "../../Global/Images/icons/T.png";
import iconVerificado from "../../Global/Images/icons/V.png";
import iconInsignia from "../../Global/Images/icons/I.png";
import iconGrupo from "../../Global/Images/icons/G.png";
import LineaCirculo from "../LineasCirculos/LineaCirculo.js";
import main from "../../Global/Images/main/img1.png";
import CarouseElastic from "../CarouselElastic/CarouseElastic.js";
import { lineasInfo, ValidarTipoTercero } from "../../helpers.js";
import Axios from "axios";
import Loadingg from "../../Common/Loading/Loadingg.js";
import { map, size } from "lodash";
import Productos from "../Catalogo/Productos/Productos.js";
import ModalIM from "../Modal/ModalIM.js";
import modalProductoContext from "../../Context/ModalProducto/Context.js";

export default function Home2({ filtroTextoGeneral }) {
  const [tipoTercero, setTipoTercero] = useState(3);
  const [loading, setLoading] = useState(false);
  const [referencias, setReferencias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [productosCarousel, setProductosCarousel] = useState([]);
  const { StatusModal, DataModal, OpenModal, CloseModal } =
    useContext(modalProductoContext);
  useEffect(() => {
    (() => {
      if (filtroTextoGeneral !== "") {
        ConsultarProductos();
      } else {
        ConsultarProductosLineas();
      }
      setTipoTercero(ValidarTipoTercero());
    })();
  }, []);

  const ConsultarProductosLineas = async () => {
    let a = [];
    for (let index = 0; index < lineasInfo.length; index++) {
      const val = lineasInfo[index];
      const referencias = await ConsultarProductos(val.code);
      if (referencias.length !== 0) {
        a.push({ lineaInfo: val, referencias });
      }
    }
    setLoading(false);
    setProductosCarousel(a);
  };

  const ConsultarProductos = async (id_clase = "") => {
    setLoading(true);
    const strResult = await Axios.get(
      process.env.REACT_APP_IP_BACK + "/api/productos/categoria/",
      {
        params: {
          lineas_ids: "",
          grupos_ids: "",
          tipos_ids: "",
          strIdLineaActiva: "",
          strIdTipoActivo: "",
          strIdGrupoActivo: "",
          lista_precio: ValidarTipoTercero(),
          num_paginacion: 1,
          id_clase,
          materiales_ids: "",
          marcas_ids: "",
          sexos_ids: "",
          filtro_texto: filtroTextoGeneral,
        },
      }
    );
    if (strResult.data.success) {
      if (id_clase !== "") {
        return strResult.data.strProductos;
      }
      setReferencias(strResult.data.strProductos);
      setLoading(false);
    } else {
      alert(strResult.data.strMesaje);
      alert("Home2");
    }
  };

  const openModalDetalle = (referencia) => {
    OpenModal(referencia);
  };

  return (
    <div className="contenedor-view contenedor-home">
      <Loadingg isVisible={loading} />
      <ModalIM show={StatusModal} close={CloseModal} data={DataModal} />
      {filtroTextoGeneral ? (
        <Container fluid className="container">
          <Row>
            <Col xs={12}>
              <ListProductosFilter
                showModal={showModal}
                openModalDetalle={openModalDetalle}
                productos={referencias}
                loading={loading}
              />
            </Col>
          </Row>
        </Container>
      ) : (
        <>
          <Row>
            <Col
              xs={12}
              className="CtnContent"
              style={{ overflowY: "scroll", padding: "0px" }}
            >
              <Carousel />
            </Col>
          </Row>
          <Informacion />
          <Row className="contenedor-distribuidor">
            <Col className="columna-distribuidor">
              <h6>
                Registrate con nosotros para que seas distribuidor de nuestros
                productos
              </h6>
            </Col>
          </Row>
          <Row>
            <a href={"https://api.whatsapp.com/send?phone=57" + process.env.REACT_APP_NUMBER_DEFAULT} target={"_blank"}>
              <Col xs={12} className="centerRow">
                <img src={main} />
              </Col>
            </a>
          </Row>
          <Row>
            <Col className="columna-distribuidor border-bottom-title">
              <label className="title-recomendados">RECOMENDADOS PARA TI</label>
            </Col>
          </Row>
          {productosCarousel.length !== 0 && (
            <TitleLineas
              tipoTercero={tipoTercero}
              productosLineas={productosCarousel}
            />
          )}

          <Row>
            <Col
              className="columna-distribuidor border-bottom-title"
              style={{ marginBottom: "100px" }}
            ></Col>
          </Row>
        </>
      )}
    </div>
  );
}

const ListProductosFilter = ({
  showModal,
  openModalDetalle,
  productos,
  loading,
}) => {
  return (
    <Row>
      {!loading && size(productos) == 0 ? (
        <div style={{ padding: "10px", textAlign: "center", width: "100%" }}>
          <p>
            No hemos encontrado ningún resultado para tus filtros de búsqueda
          </p>
        </div>
      ) : (
        map(productos, (producto, index) => (
          <Col xs={12} sm={6} lg={3}>
            <Productos
              producto={producto}
              showModal={showModal}
              openModalDetalle={openModalDetalle}
            />
          </Col>
        ))
      )}
    </Row>
  );
};

const Informacion = () => {
  return (
    <Row className="contenedor-informacion">
      <Col xs={12} lg={2} className="columna-informacion">
        <img src={iconPunto} style={{ width: "85px" }} />
        <label>Estamos presentes en mas de X ciudades</label>
      </Col>
      <Col xs={12} lg={2} className="columna-informacion">
        <img src={iconInsignia} style={{ width: "85px" }} />
        <label>Más de 30 años en el mercado</label>
      </Col>
      <Col xs={12} lg={2} className="columna-informacion">
        <img src={iconTransporte} style={{ width: "85px" }} />
        <label>Envios en menos de 72 horas</label>
      </Col>
      <Col xs={12} lg={2} className="columna-informacion">
        <img src={iconVerificado} style={{ width: "85px" }} />
        <label>Productos de calidad</label>
      </Col>
      <Col xs={12} lg={2} className="columna-informacion">
        <img src={iconGrupo} style={{ width: "85px" }} />
        <label>Mas de X clientes a nivel nacional</label>
      </Col>
    </Row>
  );
};

const TitleLineas = ({ tipoTercero, productosLineas }) => (
  <div className="contenedor-title-linea">
    {map(productosLineas, (val, index) => (
      <Row
        className={val.lineaInfo.linea + "-background" + " ContenedorLineas"}
        key={index}
      >
        <LineaCirculo val={val.lineaInfo} type="main" hoverColor={false} />
        <ListProductos
          tipoTercero={tipoTercero}
          idLinea={val.lineaInfo.code}
          referencias={val.referencias}
        />
      </Row>
    ))}
  </div>
);
const ListProductos = ({ tipoTercero, idLinea, referencias }) => (
  <div
    style={{
      background: "white",
      display: "flex",
      flexDirection: "row",
      width: "100%",
      overflowX: "scroll",
    }}
  >
    <CarouseElastic
      tipoTercero={tipoTercero}
      idLinea={idLinea}
      producto={referencias}
    />
  </div>
);
