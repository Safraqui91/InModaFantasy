import React, {Component} from 'react';
import ModalBolsa from '../ModalBolsa/ModalBolsaOld';
import ModalProducto from '../ModalProducto/ModalProducto.js';
import {Modal} from 'react-bootstrap';
import './Modal.css';


//Redux
import CerrarModal from '../../Redux/Actions/Modal/CerrarModal';
import {addCarrito} from '../../Redux/Actions/Modal/Carrito';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Modals extends Component{
    constructor(props){
        super(props);    
    }
    render(){

        if(this.props.strDataTipoModal==null){
          return null;
        }
        {/*Validamos el tipo de vista del modal. Consulta Producto o Bolsa*/}   
        if(this.props.strDataTipoModal=='Bolsa'){
            return(
                 <div className='CtnModal'>
                  <Modal 
                     show={this.props.showModal}
                     onHide={this.props.CerrarModal} 
                     size="xl"
                     centered
                  >
                  <Modal.Body>
                    <ModalBolsa
                      CerrarModal={this.props.CerrarModal} 
                    />
                  </Modal.Body>
                  </Modal>
                </div>

              );
        }else{
            return(
                 <div className='CtnModal' style={{background:'black'}}>
                  <Modal 
                     show={this.props.showModal}
                     onHide={this.props.CerrarModal} 
                     size="xl"
                     centered
                  >
                  <Modal.Body 
                  >
                    <ModalProducto
                      strDataProducto={this.props.strDataProducto}
                      strDataTipoModal={this.props.strDataTipoModal}
                      CerrarModal={this.props.CerrarModal} 
                      addCarrito={(data)=> this.props.addCarrito(data)}
                    />
                  </Modal.Body>
                  </Modal>
                </div>

              );      
          }
    }
}



//data props state
const mapStateToProps = state => {return({
    showModal:state.AbrirModal.showModal,
    strDataTipoModal:state.AbrirModal.strDataTipoModal,
    strDataProducto:state.AbrirModal.strDataProducto
})};
//actions redux modal
const mapDispatchToProps = {
    CerrarModal,
    addCarrito
};
export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(Modals)
);