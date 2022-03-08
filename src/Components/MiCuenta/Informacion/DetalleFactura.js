import React, { Component } from 'react'
import '../MiCuenta.css'
import 'react-day-picker/lib/style.css';
import { Container, Row, Col, Form } from 'react-bootstrap'
import axios from 'axios';
export default class DetalleFactura extends Component {
    constructor(props) {
        super(props)
        this.state = {
            TipoFormulario: 1,
            arrFacturas: [],
            arrDetalleFact: []
        }
    }

    componentDidMount() {

        axios.get(process.env.REACT_APP_IP_BACK + '/api/facturas/detalle/' + this.props.idFactura + '/' + this.props.tipoPedido + '')
            .then(async (strResult) => {
                console.log(strResult.data.strDetalle);
                const arrDetalleFact = strResult.data.strDetalle;
                this.setState({
                    arrDetalleFact
                });
            });
    }

    ListarDetalle = () => {
        //Organizar la cosulta para que traiga la imagen y mostrarla !!!!!!!! pendiente...
        return this.state.arrDetalleFact.map(item =>
        (
            /*<div>
                <Row>
                    <Col xs={4} xl={4}>
                    <div className='CtnImg'>
                        <img src={process.env.REACT_APP_IP_BACK + `/api/imagenes/?src=` + item.StrArchivo + `&strIdProducto=` + item.StrProducto}/>
                    </div>
                    </Col>
                    <Col xs={4} xl={8}>
                    <div className='CtnInfoDetalle'>
                        <label>{item.StrDescripcion}</label>
                        <label>Referencia: {item.StrProducto}</label>
                        <label>${item.IntValorTotal}</label>
                        <label>{item.IntCantidad} {item.StrUnidad}</label>
                    </div>
                    </Col>
                </Row>
                <hr/>
            </div>*/
            <tr>
                <td>
                    <div className='CtnImg'>
                        <img src={process.env.REACT_APP_IP_BACK + `/api/imagenes/?src=` + item.StrArchivo + `&strIdProducto=` + item.StrProducto} />
                    </div>
                </td>
                <td>
                    <div className=''>
                        <label>{item.StrDescripcion}</label>
                        <label>Referencia: {item.StrProducto}</label>
                        <label>${item.IntValorTotal}</label>
                        <label>{item.IntCantidad} {item.StrUnidad}</label>
                    </div>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <>
                {this.ListarDetalle()}
            </>
        );
    }
}