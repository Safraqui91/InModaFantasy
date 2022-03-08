import React, { useContext, useEffect, useState } from "react";
import { Dropdown, DropdownButton, Modal } from "react-bootstrap";
import ImgLogoInmoda from "../../Global/Images/LogoInmoda.png";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import helpers from "../../helpers.js";
import { Row, Col, Container } from "react-bootstrap";
import "./ModalIm.css";
import ButtonIM from "./Button/Button.js";
import CarouseElastic from "../CarouselElastic/CarouseElastic";
import favoritosContext from "../../Context/Favoritos/Context";
import carritoContext from "../../Context/Carrito/Context";
import { toast, ToastContainer } from "react-toastify";
import UsuarioContext from "../../Context/Usuario/Context";
import Axios from "axios";

export default function ModalIM({ show, close, data }) {
  const { favoritos, addFavorito, deleteFavorito } =
    useContext(favoritosContext);
  const { carrito, addCarrito, deleteProducto } = useContext(carritoContext);
  const [dataProducto, setDataProducto] = useState(null);
  const [error, setError] = useState("");
  const notify = (msg) => toast(msg, { autoClose: 2000 });
  const { usuario, accionDescuento, cambioPrecio } = useContext(UsuarioContext);
  const [ban, setBan] = useState(false);
  useEffect(() => {
    (() => {
      let dataTransform = {
        ...data,
        IntCantidad: 1,
        StrObervaciones: "",
      };
      setDataProducto(dataTransform);
    })();
  }, [data]);

  useEffect(() => {
    (() => {
      if (ban) {
        ValidacionCompras();
        setBan(false);
      }
    })();
  }, [carrito]);

  if (data == null) {
    return <></>;
  }

  const AgregarCarrito = () => {
    if (dataProducto.IntCantidad == 0) {
      setError("Ingrese la cantidad");
      return;
    }
    const newData = {
      IntCantidad: parseInt(dataProducto.IntCantidad),
      IntPrecio: dataProducto.IntPrecio,
      IntPrecio2: dataProducto.IntPrecio2,
      StrDescripcion: dataProducto.StrDescripcion,
      StrUnidadMedida: dataProducto.StrUnidadMedida,
      strImages: dataProducto.strImages,
      StrIdProducto: dataProducto.StrIdProducto,
      StrObervaciones: dataProducto.StrObervaciones,
      StrParam3: dataProducto.StrParam3,
      StrRuta: dataProducto.StrRuta,
      StrEstilos: [],
    };
    dataProducto.StrObervaciones = "";
    addCarrito(newData);
    setDataProducto({
      ...dataProducto,
      IntCantidad: 1,
    });

    notify("Producto agregado al carrito");
    setBan(true);
  };

  const ValidacionCompras = () => {
    Axios.get(
      process.env.REACT_APP_IP_BACK + "/api/usuarios/validacionCompras/",
      {
        params: {
          strIdTercero: usuario.StrIdTercero
        },
      }
    )
      .then(async (strResult) => {
        if (strResult.data.Success) {
          if (strResult.data.strMensaje == 1) {
            let IntValorTotal = 0;
            carrito.map((val) => (IntValorTotal += val.IntValorTotal));
            IntValorTotal >= 500000 && accionDescuento(true);
          }
          else if (strResult.data.strMensaje == 2) {
            cambioPrecio(2);
          }
        } else {
          console.log(strResult);
        }
      })
      .catch((e) => {});
  };


  const ActualizarListaPrecios = () => {
    Axios.put(
      process.env.REACT_APP_IP_BACK + "/api/usuarios/actualizarPrecio/",
      {
        intListaPrecio: "02",
        strIdTercero: "42893257", //usuario.StrIdTercero
      }
    )
      .then((strResult) => {
        if (strResult.data.Success) {
        }
      })
      .catch((e) => {});
  };

  const AgregarFavoritos = () => {
    if (
      favoritos.find((val) => val.StrIdProducto == dataProducto.StrIdProducto)
    ) {
      deleteFavorito(dataProducto.StrIdProducto);
      notify("Producto eliminado de la lista de deseos");
    } else {
      const newData = {
        IntCantidad: parseInt(dataProducto.IntCantidad),
        IntPrecio: dataProducto.IntPrecio,
        IntPrecio2: dataProducto.IntPrecio2,
        StrDescripcion: dataProducto.StrDescripcion,
        StrUnidadMedida: dataProducto.StrUnidadMedida,
        strImages: dataProducto.strImages,
        StrIdProducto: dataProducto.StrIdProducto,
        StrParam3: dataProducto.StrParam3,
        StrRuta: dataProducto.StrRuta,
      };
      addFavorito(newData);
      notify("Producto agregado a la lista de deseos");
    }
  };

  const onChange = (e) => {
    setError("");
    setDataProducto({
      ...dataProducto,
      [e.target.name]: e.target.value,
    });
    //TERMINAR FUNCIONALIDAD PARA LA CANITDAD Y SEGUIR CON LA CANTIDAD DEL MODULO DE FAVORITOS ......
  };

  return (
    <Modal show={show} onHide={() => close()} size="lg" centered>
      <Container fluid>
        <ToastContainer />
        <Row>
          <div onClick={() => close()} className="close">
            X
          </div>
          <Col xs={12} sm={12} lg={12} xl={7} className="ContinerImages">
            <CarouseElastic isModal={true} producto={data} />
            {/*<img lazy='loading' src={process.env.REACT_APP_IP_BACK + `/api/imagenes/2020`} loading='lazy' />*/}
            {/*} <div className='CtnImgCatalogo'>
                            {true ? (<div className='CtnImgMarcaAgua'>
                                <div className='CtnMarcaAguaOverley'></div>
                                <div className='CtnMarcaAguaImg'>
                                    <img src={ImgLogoInmoda} />
                                </div>
                            </div>) : null}
                            <Carousel activeIndex={0} interval={10000} className='CtnBannerModalMarcas'>
                               
                            </Carousel>
                        </div>*/}
          </Col>
          <Col xs={12} sm={12} lg={12} xl={5}>
            {dataProducto ? (
              <div className="Contenedor-detalle">
                <div className="Contenedor-logo">
                  <img src={ImgLogoInmoda} style={{ width: "200px" }} />
                </div>
                <div
                  className="rowInfo"
                  style={{
                    marginBottom: "10px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h6 className="descripcion">{data.StrDescripcion}</h6>
                  <label>REFERENCIA : {data.StrIdProducto}</label>
                </div>
                <div className="rowInfo">
                  <label>DESCRIPCION:</label>
                  <p>{data.StrDescripcion}</p>
                </div>
                <div className="rowInfo">
                  <label>TAMAÑO:</label>
                  <p>{data.StrParam3}</p>
                </div>
                {/*<div className="rowInfo">
                                    <label >ESTILO:</label>
                                    <DropdownButton id="dropdown-basic-button">
                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                    </DropdownButton>
                                </div>*/}
                <div className="rowInfo">
                  <label>CANTIDAD:</label>
                  <div className="columnInfo">
                    <input
                      type="number"
                      className="cantidad"
                      value={dataProducto.IntCantidad}
                      name="IntCantidad"
                      onChange={onChange}
                    />
                    <label className="label-error">{error}</label>
                  </div>
                </div>
                <div className="rowInfo">
                  <label>VALOR:</label>
                  <p>$ {data.IntPrecio}</p>
                </div>
                <div className="rowInfo">
                  <label>UNIDAD DE MEDIDA:</label>
                  <p>{data.StrUnidadMedida}</p>
                </div>
                <div className="colInfo">
                  <label>OBSERVACIONES:</label>
                  <textarea
                    className="textArea"
                    name="StrObervaciones"
                    value={dataProducto.StrObervaciones}
                    onChange={onChange}
                  ></textarea>
                </div>
                <div className="rowInfoSpace">
                  <ButtonAddFav
                    onClick={AgregarFavoritos}
                    favoritos={favoritos}
                    producto={data}
                  />
                  <ButtonIM
                    title={
                      carrito.find(
                        (val) => val.StrIdProducto == data.StrIdProducto
                      )
                        ? "AGREGAR"
                        : "AGREGAR"
                    }
                    onClick={AgregarCarrito}
                  />
                </div>
                <ComplementaCompra />
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

const ComplementaCompra = () => {
  return (
    <>
      <div className="containerLink">
        <lable>Complementa tu compra con:</lable>
      </div>
      <div className="containerLinkBold">
        <a>Adhesivos y pegantes</a>
      </div>
    </>
  );
};

const ButtonAddFav = ({ onClick, favoritos, producto }) => {
  return (
    <div onClick={onClick} className="conteinerFav">
      {favoritos.find((val) => val.StrIdProducto == producto.StrIdProducto) ? (
        <>
          <FaHeart color="#D71C7A" />
          <div className="btnFav">Eliminar de la lista de deseos</div>
        </>
      ) : (
        <>
          <FaRegHeart color="#D71C7A" />
          <div className="btnFav">Añadir a la lista de deseos</div>
        </>
      )}
    </div>
  );
};
