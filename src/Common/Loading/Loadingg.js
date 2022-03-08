import React from 'react'
import { CommonLoading  } from 'react-loadingg';
import './loadingg.css';

export default function Loadingg({isVisible = true, position = 'fixed'}) {
    return (
        <>
        {
            isVisible?(
                <CommonLoading  style={{margin: 'auto', position : position, inset : '0px', zIndex: '3'}} color="#D2127F"/>
            ):null
        }
       </> 
    )
}
