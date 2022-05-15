import React from 'react';
import { FaTwitterSquare , FaFacebookSquare,FaInstagramSquare,FaGithubSquare } from 'react-icons/fa';
 export default function Footer(){
    return( 
     <footer>
       <div className="footer">
       <FaTwitterSquare className="f-icon" />
       <FaFacebookSquare className="f-icon"/>
       <FaInstagramSquare className="f-icon" />
       <FaGithubSquare className="f-icon"/>
       </div>
     </footer>
    )
 }