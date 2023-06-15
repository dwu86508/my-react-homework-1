import React, {Component} from 'react';
import { BrowserRouter , Link , Routes , Route } from 'react-router-dom';
import Home from './Home';

const RouterDom = () => {
  return (
    <BrowserRouter>
        <Home/>
    </BrowserRouter>
  );
};

export default RouterDom
