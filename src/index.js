import React from 'react';
import ReactDOM from 'react-dom';
import Land from './Land';
import Login from './Login';
import Signup from './Signup';
function Page(){
    return(
        <div  className="conc">
           <Land />
        </div>
        
    )
}
ReactDOM.render(<Page />, document.getElementById('root'))