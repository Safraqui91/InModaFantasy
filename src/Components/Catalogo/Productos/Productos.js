import React, { useContext, useEffect, useState } from "react";
import objHelpers from "../../../helpers";
import "./Productos.css";
import { FaRegBookmark } from "react-icons/fa";
import carritoContext from "../../../Context/Carrito/Context";
import Axios from "axios";
import UsuarioContext from "../../../Context/Usuario/Context";

export default function Productos({ showModal, openModalDetalle, producto }) {
  const { carrito } = useContext(carritoContext);
  const { usuario } = useContext(UsuarioContext);
  let img =
    producto.strImages[0] === undefined
      ? "/" + producto.StrIdProducto
      : producto.strImages[0].StrArchivo;

  return (
    <div
      className="CardProducto"
      onClick={() => {
        openModalDetalle(
          producto
        ); /*this.AbrirModal(this.props.Url, Json.StrIdProducto, this.props.strDataProductos, Json.IntHabilitarProd) */
      }}
    >
      <div className="CtnImgCardProducto">
        {producto.IntHabilitarProd == 0 ? (
          <div className="agotado">AGOTADO</div>
        ) : null}
        {/*(!Json.strImages.length !== undefined ? <img lazy='loading' src={process.env.REACT_APP_IP_BACK + `/api/imagenes/2020`} loading='lazy' /> : <img lazy='loading' src={require(`./NoDisponible.jpg`)} loading='lazy' />)*/}
        <img
          lazy="loading"
          src={
            process.env.REACT_APP_IP_BACK +
            `/api/imagenes/?src=` +
            img +
            `&strIdProducto=` +
            producto.StrIdProducto
          }
          loading="lazy"
        />
        <div className="container-overlaycard">
          <div className="overlaycard"></div>
          <div>Vista Rápida</div>
        </div>
      </div>
      <div className="Contenido-Info">
        <div className="Contenido-Descripcion">
          <label>{producto.StrDescripcion}</label>
          <div className="mostrarEnColumnas">
            {usuario.BlDescuento == true ? (
              <>
              <label className="Contenido-DescripcionDescuento">
                ${objHelpers.FormateoNumber(producto.IntPrecio2)}
              </label>
              <label className="Contenido-DescripcionTachar">
              ${objHelpers.FormateoNumber(producto.IntPrecio)}
            </label>
            </>
            ): (
              <label>${objHelpers.FormateoNumber(producto.IntPrecio)}</label>
            )}
          </div>
        </div>
        <div>
          {carrito.find(
            (val) => val.StrIdProducto == producto.StrIdProducto
          ) ? (
            <FaRegBookmark color={"#D71C7A"} size={20} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
