import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
import { BsPlusCircle, BsDashCircle, BsTrash3 } from 'react-icons/bs';

import 'bootstrap/dist/css/bootstrap.css';

const apiUrl = 'http://localhost:8086/training/ecommerce/BackendController/queryGoodsSales';


const ShoppingCar = () => {

    const customCol = { padding: ' 0 5px ', marginTop: '15px' };

    const searchShoppingCarUrl = 'http://localhost:8086/training/MemberController/queryCartGoodsNew';
    const updateShoppingCarUrl = 'http://localhost:8086/training/MemberController/updateCartGoodsNew';
    const deleteShoppingCarUrl = 'http://localhost:8086/training/MemberController/deleteCartGoodsNew';

    const navigate = useNavigate();

    const [shoppingCarList, setShoppingCarList] = useState([]);
    const [goodsInf, setGoodsInf] = useState([]);

    useEffect(
        () => {
            searchShoppingCar();
        }, []
    )

    //查詢購物車內商品
    const searchShoppingCar = async () => {
        const shoppingCarData = await axios.get(searchShoppingCarUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setShoppingCarList(shoppingCarData);
    };


    const updateShoppingCar = async (goodsID, buyQuantityNew) => {
        const goodsInfNew = shoppingCarList.find((goods) => goods.goodsID == goodsID);
        goodsInfNew.buyQuantity = buyQuantityNew;
        const shoppingCarData = await axios.post(updateShoppingCarUrl, goodsInfNew, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        console.log(shoppingCarData);
        if (shoppingCarData.length > 0) { setShoppingCarList(shoppingCarData) };
    }


    const deleteShoppingCar = async (goodsID) => {

        const goodsInfNew = shoppingCarList.find((goods) => goods.goodsID == goodsID);
        console.log(goodsInfNew);
        const shoppingCarData = await axios.post(deleteShoppingCarUrl, goodsInfNew, { withCredentials: true, timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        if (shoppingCarData.length > 0) {
            setShoppingCarList(shoppingCarData)
        } else {
            setShoppingCarList([])
        };
    };

    //繼續購物
    const goShopping = () => {
        navigate("/main");
    }

    //結帳
    const checkOut = () => {
        navigate("/checkOut");
    }

    //計算購買總價
    const buyTotal = shoppingCarList.reduce((total, goods) => total + (goods.buyQuantity * goods.goodsPrice), 0);

    return (
        <div style={{ marginTop: '15px' }}>
            <Container >
                <Row>
                    <Col sm={4}>
                        <Row className="justify-content-center" style={customCol}>
                            <Image src="http://localhost:8086/training/goodsImg/coffee.jpg" width="200px" />
                        </Row>
                        <Row style={customCol}>
                            <Col>
                                <Button variant="outline-info" className="w-100" onClick={goShopping}>繼續購物</Button>
                                <Button variant="outline-info" className="w-100" onClick={checkOut} style={{ marginTop: '15px', display: shoppingCarList.length > 0 ? '' : 'none' }}>結帳</Button>
                            </Col>
                        </Row>

                    </Col>
                    <Col sm={8}>
                        <Table style={{ display: shoppingCarList.length > 0 ? '' : 'none' }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>商品名稱</th>
                                    <th>商品價格</th>
                                    <th>購買數量</th>
                                    <th>小計</th>
                                    <th>刪除</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    shoppingCarList.map(goods => (
                                        <tr>
                                            <td><Image src={`http://localhost:8086/training/goodsImg/${goods.goodsImageName}`} width="50px" /></td>
                                            <td>{goods.goodsName}</td>
                                            <td>{goods.goodsPrice}</td>
                                            <td>
                                                <span className="material-icons" onClick={() => updateShoppingCar(goods.goodsID, goods.buyQuantity + 1)}>
                                                    add_circle_outline
                                                </span>
                                                <span >{goods.buyQuantity}</span>
                                                {goods.buyQuantity - 1 > 0 &&
                                                    <span className="material-icons" onClick={() => updateShoppingCar(goods.goodsID, goods.buyQuantity - 1)}>
                                                        remove_circle_outline
                                                    </span>
                                                }
                                            </td>
                                            <td>${goods.buyQuantity * goods.goodsPrice}</td>
                                            <td><span class="material-icons" onClick={() => deleteShoppingCar(goods.goodsID)}>delete</span></td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>總計</td>
                                    <td>${buyTotal}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                        {!shoppingCarList.length > 0 && '尚未添加商品至購物車'}
                    </Col>
                </Row>
            </Container>

            {/* <pre>{JSON.stringify(shoppingCarList, null, 3)}</pre>
            <pre>{JSON.stringify(goodsInf, null, 3)}</pre> */}
        </div >
    )
}

export default ShoppingCar;
