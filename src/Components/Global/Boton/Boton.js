import React from 'react'
import './Boton.css'

export default function Boton({text, onClick}) {
    return (
       <div className="contenedor-boton" onClick={onClick}>
           <label>{text}</label>
       </div>
    )
}
