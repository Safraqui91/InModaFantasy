import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Carousel.css';

export default function Banner({ Url = {linea : 'Home'} }) {
  const [lineas, setLineas] = useState({
    AllKiss: {
      src: '../../Global/Images/img/Banners/BannerAllKiss/1.png'
    },
    Lindas: {
      src: '../../Global/Images/Banners/BannerLindas'
    },
    Eileen: {
      src: '../../Global/Images/Banners/BannerEileen'
    },
    Legend: {
      src: '../../Global/Images/Banners/BannerLegend'
    },
    Im: {
      src: '../../Global/Images/Banners/BannerIm'
    },
    FarmaPets: {
      src: '../../Global/Images/Banners/BannerMascotas'
    },
    Francy: {
      src: '../../Global/Images/Banners/BannerFrancy'
    }
  })
  useEffect(() => {
    //setLoading(false);
  }, [])

  return (
    <div>
      {
        Url && (
          <Carousel className='CtnBannerDescripcionMarca'>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('../../Global/Images/img/Banners/Banner' + Url.linea + '/1.jpg')}
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('../../Global/Images/img/Banners/Banner' + Url.linea + '/2.jpg')}
                alt="Second slide"
              />

            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('../../Global/Images/img/Banners/Banner' + Url.linea + '/3.jpg')}
                alt="Third slide"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={require('../../Global/Images/img/Banners/Banner' + Url.linea + '/4.jpg')}
                alt="Fourth slide"
              />
            </Carousel.Item>
          </Carousel>
        )
      }
    </div>
  )
}