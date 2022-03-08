import React from "react";
import { Button } from "react-bootstrap";
import "./Button.css";
import Carrito from "../../../Global/Images/Carrito.png";

export default function ButtonIM({ title, icon = true, onClick, disable = true }) {
  return (
    <Button className={disable ? "button-im" : "button-im-desactivado"} onClick={disable ? onClick : null}>
      {title}{" "}
      {icon && <img src={Carrito} style={{ width: "18px", color: "black" }} />}
    </Button>
  );
}