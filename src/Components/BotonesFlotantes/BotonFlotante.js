import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { FaWhatsapp, FaRegEnvelope, FaPhone } from 'react-icons/fa';
import './BotonFlotante.css'

export default function BotonFlotante() {
    const [ContactoDefault, setContactoDefault] = useState('');
    const [EmailDefault, setEmailDefault] = useState('');
    useEffect(() => {
        setContactoDefault(process.env.REACT_APP_NUMBER_DEFAULT)
        setEmailDefault(process.env.REACT_APP_MAIL_DEFAULT)
    }, [])
    return (
        <div className="containerButtons">
            <div className="containerLabel">
                <label>¿Te ayudamos con tu compra?</label>
            </div>
            <div className="btnFloat">
                <a href={'https://api.whatsapp.com/send?phone=57' + ContactoDefault} target={'_blank'}>
                    <FaWhatsapp size={25} color='#515556' />
                </a>
            </div>
            <div className="btnFloat">
                <a href={'mailto: '+EmailDefault}>
                    <FaRegEnvelope size={25} color='#515556' />
                </a>
            </div>
            <div className="btnFloat">
                <a href={"tel:+57" + ContactoDefault}><FaPhone size={25} color='#515556' /></a>
            </div>
        </div>
    )
}
