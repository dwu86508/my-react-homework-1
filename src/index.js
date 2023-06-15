import React from 'react';
import ReactDOM from 'react-dom'
import GoodsList from './Homework/Backend/GoodsList';
import CreateGoods from './Homework/Backend/CreateGoods';
import SalesReport from './Homework/Backend/SalesReport';
import UpdateGoods from './Homework/Backend/UpdateGoods'
import MemberLogin from './Homework/Frontend/MemberLogin';
import Main from './Homework/Frontend/Main'
import RouterDom from './Homework/RouterDom';

// import SalesReport_Lifecycle from './Homework/SalesReport_Lifecycle';
// ReactDOM.render(<GoodsList/>,document.getElementById('root'));
// ReactDOM.render(<CreateGoods/>,document.getElementById('root'));
// ReactDOM.render(<UpdateGoods/>,document.getElementById('root'));
// ReactDOM.render(<SalesReport/>,document.getElementById('root'));
// ReactDOM.render(<SalesReport_Lifecycle/>,document.getElementById('root'));
// ReactDOM.render(<MemberLogin/>,document.getElementById('root'));
// ReactDOM.render(<Main/>,document.getElementById('root'));
ReactDOM.render(<RouterDom/>,document.getElementById('root'));