import React from 'react'
import Boton from '../Boton/Boton'
import './Card.css'

export default function Card({ title, children, type }) {
    return (
        <div className='contenedor-card'>
            <div className='title-card'>{title}</div>
            <div className="contenedor-form-card">
                { children }
            </div>
        </div>
    )
}
