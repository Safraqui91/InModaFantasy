import React, { useState, useEffect } from 'react'
import '../MiCuenta.css'
import 'react-day-picker/lib/style.css';
import { Container, Row, Col, Form, Table } from 'react-bootstrap'
import axios from 'axios';
import DetalleFactura from './DetalleFactura';


const Facturas = () => {
    const [TipoFormulario, setTipoFormulario] = useState(1)
    const [detalleFactura, setDetalleFactura] = useState(0)
    const [arrFacturas, setArrFacturas] = useState([])
    const [arrDetalleFact, setArrDetalleFact] = useState([])
    const [strIdTercero, setStrIdTercero] = useState("")

    useEffect(() => {
        (() => {
            //setStrIdTercero(JSON.parse(localStorage.getItem("Usuario")).StrIdTercero);
            let strDataJsonTercero = JSON.parse(localStorage.getItem("Usuario")).StrIdTercero;
            axios.get(process.env.REACT_APP_IP_BACK + '/api/facturas/' + strDataJsonTercero)
                .then(async (strResult) => {
                    if (strResult.data.strFacturas !== undefined) {
                        const arrFacturas = strResult.data.strFacturas;
                        setArrFacturas(arrFacturas);
                    }
                });
        })()
    }, [])


    const ListarDetalle = (id) => {
        //CONSULTAR DETALLE DE LA FACTURA
        axios.get(process.env.REACT_APP_IP_BACK + '/api/facturas/detalle/' + id)
            .then(async (strResult) => {
                const arrDetalleFact = strResult.data.strDetalle;
                setArrDetalleFact(arrDetalleFact);
            });
        return (
            <Row>
                <Col xs={4} xl={4}>
                    <div className='CtnImg'>
                        <img src={process.env.REACT_APP_IP_BACK + `/api/imagenes/AA0178`} style={{ height: '80px' }} />
                    </div>
                </Col>
                <Col xs={4} xl={8}>
                    <div className='CtnDetProducto'>
                        <label>Nombre del producto</label><br />
                        <label>Referencia</label><br />
                        <label>Estilos:</label><br />

                        <label>$182.255</label><br />
                    </div>
                </Col>
            </Row>
        )

    }

    const Collapsible = (id) => {
        detalleFactura == id ? setDetalleFactura(0) : setDetalleFactura(id);
    }

    const ValidarEstado = (estado) => {
        switch (estado) {
            case 1:
                return 'UNO'
            case 2:
                return 'DOS'
            case 3:
                return 'TRES'
            case 4:
                return 'CUATRO'
            case 5:
                return 'CINCO'
            case 6:
                return 'Facturado'
            default:
                return 'SIN ESTADO'
        }
    }

    const ListarFactura = () => {
        //CONSTULTAR FACTURAS DEL TERCERO
        return (
            <>
                {
                    true ? (//arrDetalleFact.length != 0
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>#pedido</th>
                                    <th>#factura</th>
                                    <th>Total</th>
                                    <th>Cartera</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    arrFacturas.map((item,index) => (
                                        <>
                                            <tr style={{ background: '#D9D9D9', cursor: 'pointer' }}>
                                                <td>
                                                    <span className={'label'} style={{ color: '#111111' }}>{new Date(item.DatFecha).toLocaleDateString()}</span>
                                                </td>
                                                <td>
                                                    <span className={'label'} style={{ color: '#111111' }}>{ValidarEstado(item.StrEstado)}</span>
                                                </td>
                                                <td>
                                                    <span className={'label'} style={{ color: '#111111' }}>{item.IntDocRef}</span>
                                                </td>
                                                <td>
                                                    <span className={'label'} style={{ color: '#111111' }}>{item.IntDocumento}</span>
                                                </td>
                                                <td>
                                                    <span className={'label'} style={{ color: '#111111' }}>${new Intl.NumberFormat().format(item.IntTotal)}</span>
                                                </td>
                                                <td>
                                                    <span className={'label'} style={{ color: '#111111' }}>${new Intl.NumberFormat().format(item.IntCartera)}</span>
                                                </td>
                                                <td>
                                                    <a className={'buttonGeneral'} style={{ fontSize: 'x-small', margin: '0px' }} href={"#" + index} onClick={() => Collapsible(item.IntDocumento)}>
                                                        {detalleFactura == item.IntDocumento ? 'Ocultar Detalle' : 'Ver Detalle'}
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr id={index} style={detalleFactura == item.IntDocumento ? { display: '' } : { display: 'none' }}>
                                                <td colSpan="5">
                                                    {
                                                        detalleFactura == item.IntDocumento &&
                                                        (
                                                            <DetalleFactura idFactura={item.IntDocumento} tipoPedido={item.intTipoPedido} />
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        </>
                                    ))
                                }
                            </tbody>
                        </Table>

                    ) : (
                        <Row style={{ background: '#D9D9D9', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>No encontramos historial de tus compras.</Row>
                    )
                }
            </>);
    }

    const list = () => {
        return (
            arrFacturas.map(item => (
                <div>
                    <Row style={{ background: '#D9D9D9', cursor: 'pointer' }} onClick={() => Collapsible(item.IntDocumento)}>
                        <Col sm={2}>
                            <Row>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Fecha</span>
                            </Row>
                            <Row>
                                <span className={'label'} style={{ color: '#111111' }}>{new Date(item.DatFecha).toLocaleDateString()}</span>
                            </Row>

                        </Col>
                        <Col sm={2}>
                            <Row>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Estado</span>
                            </Row>
                            <Row>
                                <span className={'label'} style={{ color: '#111111' }}>{ValidarEstado(item.StrEstado)}</span>
                            </Row>
                        </Col>
                        <Col sm={2}>
                            <Row>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>#pedido</span>
                            </Row>
                            <Row>
                                <span className={'label'} style={{ color: '#111111' }}>{item.IntDocRef}</span>
                            </Row>
                        </Col>
                        <Col sm={2}>
                            <Row>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>#factura</span>
                            </Row>
                            <Row>
                                <span className={'label'} style={{ color: '#111111' }}>{item.IntDocumento}</span>
                            </Row>
                        </Col>
                        <Col sm={2}>
                            <Row>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Total</span>
                            </Row>
                            <Row>
                                <span className={'label'} style={{ color: '#111111' }}>${new Intl.NumberFormat().format(item.IntTotal)}</span>
                            </Row>
                        </Col>
                        <Col sm={2}>
                            <Row>
                                <span className={'label'} style={{ fontWeight: 'bold', color: '#616160' }}>Cartera</span>
                            </Row>
                            <Row>
                                <span className={'label'} style={{ color: '#111111' }}>${new Intl.NumberFormat().format(item.IntCartera)}</span>
                            </Row>
                        </Col>
                        <Col sm={2} style={{ cursor: 'pointer', background: 'white', display: 'flex', justifyContent: 'center' }}>
                            {
                                /*item.intTipoPedido == 1 ? (
                                    <Row>
                                        <span className={'label'} style={{ fontWeight: 'bold', color: '#E2097E' }}><a href={process.env.REACT_APP_IP_BACK + `/api/facturas/descarga/${item.IntDocumento}/${strIdTercero}`} target="_blank">Descargar Factura</a></span>
                                    </Row>
                                ) : null*/
                                <Row style={{ height: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                    <div className={'buttonGeneral'} style={{ fontSize: 'x-small', margin: '0px' }}>
                                        {detalleFactura == item.IntDocumento ? 'Ocultar Detalle' : 'Ver Detalle'}
                                    </div>
                                </Row>
                            }
                        </Col>
                    </Row>
                    <Row style={detalleFactura == item.IntDocumento ? { display: 'inline' } : { display: 'none' }}>
                        {
                            detalleFactura == item.IntDocumento &&
                            (
                                <div>
                                    <DetalleFactura idFactura={item.IntDocumento} tipoPedido={item.intTipoPedido} />
                                </div>
                            )
                        }
                    </Row>
                </div>
            ))
        )
    }


    return (
        <div>
            {ListarFactura()}
        </div>
    );
}

export default Facturas;