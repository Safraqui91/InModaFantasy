import { Col, Container, Modal, Row } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import ImgLogoInmoda from "../../Global/Images/LogoInmoda.png";
import "./ModalBolsa.css";
import ButtonIM from "../Modal/Button/Button";
import CarouseElastic from "../CarouselElastic/CarouseElastic";
import { FaEdit, FaTrashAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import ProductosRelacionados from "../../Common/ProductosRelacionados";
import carritoContext from "../../Context/Carrito/Context";
import usuarioContext from "../../Context/Usuario/Context";
import favoritosContext from "../../Context/Favoritos/Context";
import objHelpers from "../../helpers";
import { toast, ToastContainer } from "react-toastify";
import { size } from "lodash";
import ReactGA from "react-ga";
import Axios from "axios";
import ListCheck from "./ListCheck";

export default function ModalBolsa({ show, setShow }) {
  const [statusPedidoResumen, setStatusPedidoResumen] = useState(true);
  const {
    carrito,
    deleteProducto,
    addCarrito,
    editCantidad,
    deleteCarrito,
    editObservacion,
  } = useContext(carritoContext);
  const { usuario, accionDescuento, cambioPrecio } = useContext(usuarioContext);
  const { favoritos, addFavorito, deleteFavorito } =
    useContext(favoritosContext);
  const [valorTotal, setValorTotal] = useState(0);
  const [valorTotalDescuento, setValorTotalDescuento] = useState(0);
  const notify = (msg) => toast(msg, { autoClose: 2000 });
  const [arrDependencias, setArrDependencias] = useState([]);
  const [selectedDependencias, setSelectedDependencias] = useState([]);
  const [ban, setBan] = useState(false);
  const [disableBtnEnvia, setDisableBtnEnvia] = useState(false);

  useEffect(() => {
    let total = 0;
    carrito.map((val) => (total += val.IntValorTotal));
    setValorTotal(objHelpers.FormateoNumber(total));
    total < 300000 ? setDisableBtnEnvia(false) : setDisableBtnEnvia(true);
  }, [carrito]);

  useEffect(() => {
    let totalDescuento = 0;
    carrito.map((val) => (totalDescuento += val.IntValorTotalDescuento));
    setValorTotalDescuento(objHelpers.FormateoNumber(totalDescuento));
  }, [carrito]);

  useEffect(() => {
    if (show) {
      setStatusPedidoResumen(true);
      let user = JSON.parse(localStorage.getItem("Usuario"));
      user != null && ConsultarDependencias();
    }
  }, [show]);

  const CerrarModal = () => {
    setShow(false);
  };

  const ConsultarDependencias = async () => {
    if (usuario !== "") {
      await Axios.get(
        process.env.REACT_APP_IP_BACK +
          "/api/dependencias/" +
          usuario.StrIdTercero
      ).then(async (strResult) => {
        if(strResult.data.Success){
          //alert("bien");
          setArrDependencias(strResult.data.strMensaje);
          console.log("---------------------")
          console.log(strResult.data.strMensaje);
        }
        else {
          alert(strResult.data.strMensaje);
        }
      }).catch(e =>{
        alert(e);
      });
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
      <Container fluid>
        <ToastContainer />
        <Row>
          <div className="">
            <img src={ImgLogoInmoda} style={{ width: "150px" }} />
            <div onClick={() => setShow(false)} className="close">
              X
            </div>
          </div>
          <Row>
            <Col xs={12} lg={8}>
              <label className="labelMBDark">
                ORDEN DE PEDIDO:
                <label className="labelMBLight">
                  ({Object.keys(carrito).length} productos)
                </label>
              </label>
              <ListProductosBolsa
                carrito={carrito}
                deleteProducto={deleteProducto}
                accionDescuento={accionDescuento}
                addFavorito={addFavorito}
                favoritos={favoritos}
                deleteFavorito={deleteFavorito}
                notify={notify}
                addCarrito={addCarrito}
                editCantidad={editCantidad}
                editObservacion={editObservacion}
                cambioPrecio={cambioPrecio}
              />
            </Col>
            <Col xs={12} lg={4}>
              <div className="containerEstadoPedido">
                <div
                  className={
                    statusPedidoResumen
                      ? "containerLinkBoldBolsa-active text-align-start"
                      : "containerLinkBoldBolsa text-align-start"
                  }
                >
                  <a>RESUMEN DE TU PEDIDO:</a>
                  <br />
                  <label> SUB-TOTAL ${valorTotal}</label>
                  <br />
                  {usuario.BlDescuento == true && (
                    <label className="subtotal-Descuento">
                      CON DESCUENTO $
                      {objHelpers.FormateoNumber(valorTotalDescuento)}
                    </label>
                  )}
                </div>
                <div
                  className={
                    !statusPedidoResumen
                      ? "containerLinkBoldBolsa-active text-align-start"
                      : "containerLinkBoldBolsa text-align-start"
                  }
                >
                  <a>PEDIDO FINALIZADO</a>
                </div>
                <div className="conteinerFiguras">
                  <span
                    className={statusPedidoResumen ? "dot-active" : "dot"}
                  />
                  <div className="line" />
                  <span
                    className={!statusPedidoResumen ? "dot-active" : "dot"}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <hr />
          <Sucursales
            usuario={usuario}
            arrDependencias={arrDependencias}
            selectedDependencias={selectedDependencias}
            setSelectedDependencias={setSelectedDependencias}
          />
          <Acciones
            setStatusPedidoResumen={setStatusPedidoResumen}
            statusPedidoResumen={statusPedidoResumen}
            setShow={setShow}
            notify={notify}
            carrito={carrito}
            usuario={usuario}
            disableBtnEnvia = {disableBtnEnvia}
            valorTotal={valorTotal}
            valorTotalDescuento={valorTotalDescuento}
            deleteCarrito={deleteCarrito}
            selectedDependencias={selectedDependencias}
            setSelectedDependencias={setSelectedDependencias}
          />
          <ProductosRelacionados setShowModal={CerrarModal} />
        </Row>
      </Container>
    </Modal>
  );
}

const Sucursales = ({
  setSelectedDependencias,
  selectedDependencias,
  arrDependencias,
}) => {
  return (
    <Row className="justify-content-md-end">
      <Col xs={12} lg={4}>
        {/*<ListCheck
          dependencias={arrDependencias}
          selected={selectedDependencias}
          setSelected={(val) => setSelectedDependencias(val)}
        />*/}
      </Col>
    </Row>
  );
};

const Acciones = ({
  setStatusPedidoResumen,
  statusPedidoResumen,
  setShow,
  notify,
  carrito,
  usuario,
  valorTotal,
  disableBtnEnvia,
  valorTotalDescuento,
  deleteCarrito,
  selectedDependencias,
  setSelectedDependencias,
}) => {
  const finalizarPedido = () => {
    if (usuario != "") {
      const data = {
        documento: {
          strIdCliente: usuario.StrIdTercero,
          strNombCliente: usuario.StrNombre,
          strCiudadCliente: usuario.StrCiudadDescripcion,
          intValorTotal: usuario.BlDescuento == true ? (valorTotalDescuento.replace(/,/gi, "")) : (valorTotal.replace(/,/gi, "")),
          strObservacion: "",
          strDependencias: selectedDependencias,
          intlistaPrecio: usuario.IntTipoTercero,
          jsonVendedor: usuario.JsonVendedor,
          blDescuento: usuario.BlDescuento,
          
        },
        detalle: carrito,
      };
      Axios.post(process.env.REACT_APP_IP_BACK + "/api/pedidos/", data)
        .then(async (strResult) => {
          if (strResult.data.Success) {
            setStatusPedidoResumen(!statusPedidoResumen);
            deleteCarrito();
            setSelectedDependencias([]);
            notify("Pedido finalizado con éxito");
            ReactGA.event({
              category: "Modal Bolsa",
              action: "Pedido finalizado con exito",
            });
          } else {
            console.log(strResult.data.strMensaje);
            alert(
              "Hubo un error en el envio del pedido, por favor contactarse con uno de nuestros asesores"
            );
          }
        })
        .catch((e) => {
          alert(e);
        });
    } else {
      //Redireccionar al login
      window.location.href = "/Ingreso";
    }
  };

  return (
    <div className="grupoAccionesRow">
      <ButtonIM
        title="SEGUIR COMPRANDO"
        icon={false}
        onClick={() => (window.location.href = "/")}
      />
      <div className="grupoAccionesCol">
        <ButtonIM
          title="VER MIS PEDIDOS"
          icon={false}
          onClick={() => (window.location.href = "/miCuenta")}
        />
        {statusPedidoResumen ? (
          size(carrito) ? (
            <ButtonIM 
            title="FINALIZAR PEDIDO"
            disable = {disableBtnEnvia}
            onClick={finalizarPedido} />
          ) : null
        ) : null}
      </div>
    </div>
  );
};

const ListProductosBolsa = ({
  carrito,
  deleteProducto,
  accionDescuento,
  addFavorito,
  deleteFavorito,
  favoritos,
  notify,
  addCarrito,
  editCantidad,
  editObservacion,
  cambioPrecio
}) => {
  const [carritoCopy, setCarritoCopy] = useState(carrito);

  useEffect(() => {
    (() => {
      setCarritoCopy(carrito);
      ValidacionCompras();
    })();
  }, [carrito]);

  const AgregarFavoritos = (dataProducto) => {
    if (
      favoritos.find((val) => val.StrIdProducto == dataProducto.StrIdProducto)
    ) {
      deleteFavorito(dataProducto.StrIdProducto);
      notify("Productos eliminado de la lista de deseos");
    } else {
      addFavorito(dataProducto);
      notify("Producto agregado a la lista de deseos");
    }
  };

  const onChange = (e, idProducto) => {
    if (e.target.value !== "") {
      editCantidad(idProducto, e.target.value);
    } else {
      editCantidad(idProducto, 0);
    }
  };

  const onChangeCantidad = (tipo, idProducto, cantidad) => {
    if (cantidad > 0 || (cantidad == 0 && tipo == 1)) {
      editCantidad(idProducto, tipo);
    }
  };

  const handleChange = (e, idProducto) => {
    editObservacion(idProducto, e.target.value);
  };

  const ValidacionCompras = () => {
    Axios.get(
      process.env.REACT_APP_IP_BACK + "/api/usuarios/validacionCompras/",
      {
        params: {
          strIdTercero: usuario.StrIdTercero,
        },
      }
    )
      .then(async (strResult) => {
        if (strResult.data.Success) {
          if (strResult.data.strMensaje == 1) {
            let IntValorTotal = 0;
            carrito.map((val) => (IntValorTotal += val.IntValorTotal));
            IntValorTotal < 500000
              ? accionDescuento(false)
              : accionDescuento(true);
            
          } else if (strResult.data.strMensaje == 2) {
            cambioPrecio(2);
          }
        } else {
          console.log(strResult);
        }
      })
      .catch((e) => {});
  };
  const { usuario } = useContext(usuarioContext);
  return (
    <div className="scroll">
      {carritoCopy.map((val) => (
        <Row className="rowListProductos">
          <Col xs={8}>
            <Row className="containerProducto">
              <Col xs={12} xl={6}>
                <img
                  src={
                    process.env.REACT_APP_IP_BACK +
                    "/api/imagenes?src=" +
                    val.StrRuta +
                    `&strIdProducto=` +
                    val.StrIdProducto
                  }
                  style={{ width: "100%" }}
                />
              </Col>
              <Col xs={12} xl={6} className="containerInfoProducto">
                <label>{val.StrDescripcion}</label>
                <label>{val.StrIdProducto}</label>

                <div>
                  <label>VR. UNITARIO:</label>
                  <br />
                  <div className="mostrarPrecios">
                    {usuario.BlDescuento == true && (
                      <label className="mostrarDescuento">
                        ${objHelpers.FormateoNumber(val.IntPrecio2)}
                      </label>
                    )}
                    {usuario.BlDescuento == true ? (
                      <label className="mostrarDescuentoTachar">
                        ${objHelpers.FormateoNumber(val.IntPrecio)}
                      </label>
                    ) : (
                      <label>${objHelpers.FormateoNumber(val.IntPrecio)}</label>
                    )}
                  </div>
                </div>
                <div>
                  <label>VR. TOTAL:</label>
                  <br />
                  <div className="mostrarPrecios">
                    {usuario.BlDescuento == true && (
                      <label className="mostrarDescuento">
                        ${objHelpers.FormateoNumber(val.IntValorTotalDescuento)}
                      </label>
                    )}
                    {usuario.BlDescuento == true ? (
                      <label className="mostrarDescuentoTachar">
                        ${objHelpers.FormateoNumber(val.IntValorTotal)}
                      </label>
                    ) : (
                      <label>
                        ${objHelpers.FormateoNumber(val.IntValorTotal)}
                      </label>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <div className="grupoAccionesRow">
              <div>
                {/*<FaEdit color="#CF117F" style={{ cursor: 'pointer' }} />*/}
                <FaTrashAlt
                  color="#CF117F"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteProducto(val.StrIdProducto);
                    notify("Producto eliminado del carrito");
                  }}
                />
              </div>
              <div>
                {favoritos.find(
                  (fav) => fav.StrIdProducto == val.StrIdProducto
                ) ? (
                  <>
                    <FaHeart
                      color="#D71C7A"
                      style={{ cursor: "pointer" }}
                      onClick={() => AgregarFavoritos(val)}
                    />
                  </>
                ) : (
                  <>
                    <FaRegHeart
                      color="#D71C7A"
                      style={{ cursor: "pointer" }}
                      onClick={() => AgregarFavoritos(val)}
                    />
                  </>
                )}
              </div>
            </div>
          </Col>
          <Col xs={4}>
            <div className="colInfo">
              <label>OBSERVACIONES:</label>
              <textarea
                className="textAreaBolsa"
                name="StrObervaciones"
                value={val.StrObervaciones}
                onChange={(e) => handleChange(e, val.StrIdProducto)}
              ></textarea>
            </div>
            <div className="containerCantidad">
              <button
                onClick={() =>
                  onChangeCantidad(-1, val.StrIdProducto, val.IntCantidad)
                }
              >
                -
              </button>
              <input
                type="text"
                placeholder="0"
                value={val.IntCantidad}
                onChange={(e) => onChange(e, val.StrIdProducto)}
              />
              <button
                onClick={() =>
                  onChangeCantidad(1, val.StrIdProducto, val.IntCantidad)
                }
              >
                +
              </button>
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
};
