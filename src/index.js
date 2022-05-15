import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
function Page(){
    return(
        <div  className="conc">
            <Header />
            <Main />
            <Footer />
        </div>
        
    )
}
ReactDOM.render(<Page />, document.getElementById('root'))