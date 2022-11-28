import React from 'react';
import { BiLogIn } from 'react-icons/bi';
import  Login  from './Login';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import {FaGhost} from 'react-icons/fa'

export default function Land(){
    return( 
     <div>
        <div className="title">
          <h1>Col<span>Lab</span></h1>
        </div>
        <div className="container">
            <div className="card">
                <div className="face face1">
                    <div className="content">
                    <div className="btn">
                    <BiLogIn />
                    </div>
                    <h3>Log-in</h3>
                    </div>
                </div>
              </div>
                <div className="card">
                <div className="face face1">
                    <div className="content">
                    <div className="btn">
                    <BsFillPersonPlusFill />
                    </div>
                    <h3>Sign-Up</h3>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="face face1">
                    <div className="content">
                    <div className="btn">
                    <FaGhost/>
                    </div>
                    <h3>Guest</h3>
                    </div>
                </div>
            </div>
            </div>
    </div>
    )
 }

 