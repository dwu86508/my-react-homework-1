import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import MemberLogin from './Frontend/MemberLogin';
import CreateGoods from './Backend/CreateGoods';
import UpdateGoods from './Backend/UpdateGoods';
import Main from './Frontend/Main';
import GoodsList from './Backend/GoodsList';
import SalesReport from './Backend/SalesReport';
import ProductList from './Frontend/ProductList';
import ShoppingCar from './Frontend/ShoppingCar';
import HeaderTop from './HeaderTop';

import 'bootstrap/dist/css/bootstrap.css';
import CheckOut from './Frontend/CheckOut';
import CheckOutShow from './Frontend/ChekcOutShow';
import MemberPoints from './Frontend/MemberPoints';

const Home = () => {
    const checkLoginUrl = 'http://localhost:8086/training/MemberController/checkLogin';

    const [memberInf, setMemberInf] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        loginCheck();
    }, []);

    const loginCheck = async () => {
        console.log('loginCheck');
        const longinData = await axios.get(checkLoginUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setMemberInf(longinData);

    };

    const loginData = { setMemberInf };

    return (
        <div>
            <Container>
                {memberInf.isLogin && <HeaderTop loginData={loginData}/>}
            </Container>
            <Routes>
                <Route path="/" element={<MemberLogin loginData={loginData} />}></Route>
                <Route path="/main" element={memberInf.isLogin ? <Main /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/shoppingCar" element={memberInf.isLogin ? <ShoppingCar /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/memberPoints" element={memberInf.isLogin ? <MemberPoints /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/goodsList" element={memberInf.isLogin ? <GoodsList /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/createGoods" element={memberInf.isLogin ? <CreateGoods /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/updateGoods" element={memberInf.isLogin ? <UpdateGoods /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/salesReport" element={memberInf.isLogin ? <SalesReport /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/checkOut" element={memberInf.isLogin ? <CheckOut /> : <MemberLogin loginData={loginData} />}></Route>
                <Route path="/checkOutShow" element={memberInf.isLogin ? <CheckOutShow /> : <MemberLogin loginData={loginData} />}></Route>
            </Routes>

        </div>
    );
};

export default Home;

