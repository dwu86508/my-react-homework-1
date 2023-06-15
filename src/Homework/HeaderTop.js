import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route, useNavigate } from 'react-router-dom';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';


import 'bootstrap/dist/css/bootstrap.css';

const logOutUrl = 'http://localhost:8086/training/MemberController/logout';
const clearShoppingCarUrl = 'http://localhost:8086/training/MemberController/clearCartGoodsNew';


const HeaderTop = ({ loginData }) => {

    const { setMemberInf } = loginData;

    const navigate = useNavigate();

    const logOut = async () => {
        const logOutData =  await axios.get(logOutUrl, { withCredentials: true }, { timeout: 3000 })
                .then(rs => rs.data)
                .catch(error => { console.log(error); });
        console.log(logOutData);
        setMemberInf(logOutData);
        clearShoppingCar();
        navigate("/");
    }

    //清空購物車
    const clearShoppingCar = async () => {
        const clearShoppingCar = await axios.delete(clearShoppingCarUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
    };

    return (
        <div>
            <Navbar bg="dark" variant={"dark"} expand="lg">
                <Navbar.Brand href="#home">DWU</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="mr-auto">
                        {/* to 路徑對應 Route path */}
                        <Nav.Link as={Link} to="/main">首頁</Nav.Link>
                        <Nav.Link as={Link} to="/goodsList">商品列表</Nav.Link>
                        <Nav.Link as={Link} to="/createGoods">新增商品</Nav.Link>
                        <Nav.Link as={Link} to="/updateGoods">商品維護</Nav.Link>
                        <Nav.Link as={Link} to="/salesReport">銷售報表</Nav.Link>
                    </Nav>                    
                </Navbar.Collapse>
                <Button variant="outline-danger" onClick={logOut}>登出</Button>
            </Navbar>
        </div>
    )
}

export default HeaderTop
