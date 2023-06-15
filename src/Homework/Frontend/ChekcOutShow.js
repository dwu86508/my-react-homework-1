import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import 'bootstrap/dist/css/bootstrap.css';

const CheckOutShow = () => {

    const navigate = useNavigate();    
    const location = useLocation();
    const checkOutData = location.state;
    const checkOutCusInf = checkOutData.orderCustomer;
    const checkOutOrderInf = checkOutData.ordersInf;
    const checkOutOrderList = checkOutData.ordersList;
    console.log(checkOutOrderList);
    //計算購買總價
    const buyTotal = checkOutOrderList.reduce((total, goods) => total + (goods.goodsQuantity * goods.goodsPrice), 0);

    //繼續購物
    const goShopping = () => {
        navigate("/main");
    }


    return (
        <div style={{ marginTop: '15px' }}>
            <Container >
                訂單編號:{checkOutOrderInf.infNum}<br />
                姓名:{checkOutCusInf.cusName}<br />
                聯絡電話:{checkOutCusInf.homeNumber}<br />
                手機號碼:{checkOutCusInf.mobileNumber}<br />
                配送地址:{checkOutCusInf.orderAddr}<br />
                <Button variant="outline-info" className="w-100" onClick={goShopping}>繼續購物</Button>
                <Table style={{ display: checkOutOrderList.length > 0 ? '' : 'none' }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>商品名稱</th>
                            <th>商品價格</th>
                            <th>購買數量</th>
                            <th>小計</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            checkOutOrderList.map(goods => (
                                <tr key={goods.goods.goodsID}>
                                    <td><Image src={`http://localhost:8086/training/goodsImg/${goods.goods.goodsImageName}`} width="50px" /></td>
                                    <td>{goods.goods.goodsName}</td>
                                    <td>{goods.goodsBuyPrice}</td>
                                    <td>{goods.buyQuantity}</td>
                                    <td>${goods.buyQuantity * goods.goodsBuyPrice}</td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align="right">小計</td>
                            <td>${checkOutOrderInf.orderTotal}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align="right">點數折扣</td>
                            <td>-{checkOutOrderInf.discount}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align="right">總計</td>
                            <td>${checkOutOrderInf.orderTotal-checkOutOrderInf.discount}</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>

            {/* <pre>{JSON.stringify(cusInf, null, 3)}</pre> */}
        </div >
    )
}

export default CheckOutShow;
