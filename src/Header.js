import React from 'react';
import image1 from './images/image_1.jpg';
import { FaEnvelope, FaLinkedin} from 'react-icons/fa';


 export default function Header(){
    return( 
     <header>
       <img src={image1} className="logo" alt="logo"/>
         <div className="h-con">
            <h1 className="title-name">Subbu Subhash</h1>
            <h3 className="sub-title">Frontend Developer</h3>
            <h5 className="web-site">subbusubhash.website</h5>
            <div className="btns">
               <button className="btn1">
               <FaEnvelope size="1.10em"/> Email
               </button>
               <button className="btn2">
               <FaLinkedin size="1.10em"/> LinkedIn
               </button>
            </div>  
         </div>
     </header>
    )
 }