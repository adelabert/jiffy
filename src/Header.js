// import React from 'react';
import clearIcon from './images/close-icon.svg';

const Header = ({clearSearch, hasResults}) => (

    <header className="header grid"> 
    {hasResults ? (<button><img src={clearIcon}  onClick={clearSearch} /></button>): <h1 className="title">COOOOOL</h1>}
        
    </header>
);

export default Header;