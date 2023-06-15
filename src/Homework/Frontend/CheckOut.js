import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Accordion } from 'react-bootstrap';
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


const CheckOut = () => {

    const clearShoppingCarUrl = 'http://localhost:8086/training/MemberController/clearCartGoodsNew';
    const searchShoppingCarUrl = 'http://localhost:8086/training/MemberController/queryCartGoodsNew';
    const checkOutUrl = 'http://localhost:8086/training/FrontendController/checkoutGoods';
    const memberPointUrl = 'http://localhost:8086/training/MemberController/memberPoints';

    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [shoppingCarList, setShoppingCarList] = useState([]);
    const [memberPoint, setMemberPoint] = useState([]);
    const [cusInf, setCusInf] = useState({
        cusName: '',
        homeNumber: '',
        mobileNumber: '',
        orderAddr: '',
        points: 0
    });

    const [creditCardInf, setCreditCardInf] = useState({
        cardFirst: '',
        cardSecond: '',
        cardThird: '',
        cardLast: '',
        cardPeriodMon: '',
        cardPeriodYear: '',
        securityCode: ''
    });

    const cardFirstRef = useRef();
    const cardSecondRef = useRef();
    const cardThirdRef = useRef();
    const cardLastRef = useRef();
    const periodMon = [];
    for (let i = 1; i < 13; i++) {
        periodMon.push(i);
    }
    const date = new Date();
    const periodYear = [];
    for (let i = 0; i < 13; i++) {
        periodYear.push(parseInt(date.getFullYear()) + i);
    }


    useEffect(
        () => {
            searchShoppingCar();
            memberPoints();
        }, []
    )

    const inputChange = (e) => {
        const name = e.target.name;
        setCusInf((inf) => ({
            ...inf,
            [name]: e.target.value,
        }));
    };

    //查詢會員點數
    const memberPoints = async () => {
        const memberPointsData = await axios.get(memberPointUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setMemberPoint(memberPointsData.memberPoint);
    };


    //查詢購物車內商品
    const searchShoppingCar = async () => {
        const shoppingCarData = await axios.get(searchShoppingCarUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setShoppingCarList(shoppingCarData);
    };

    //清空購物車
    const clearShoppingCar = async () => {
        const clearShoppingCar = await axios.delete(clearShoppingCarUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
    };

    //繼續購物
    const shoppingCar = () => {
        navigate("/shoppingCar");
    }

    const checkOutSubmit = async (e) => {
        e.preventDefault();
        setValidated(true);
        const form = e.currentTarget;
        console.log('checkout')
        if (form.checkValidity() === true) {
            const checkOutData = await axios.post(checkOutUrl, cusInf, { withCredentials: true }, { timeout: 3000 })
                .then(rs => rs.data)
                .catch(error => { console.log(error); });
            clearShoppingCar();
            navigate("/CheckOutShow", { state: checkOutData });
        }

    };

    //卡號輸入自動跳志下一格
    const cardInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        setCreditCardInf((inf) => ({
            ...inf,
            [name]: value,
        }));
        if (value.length === 4) {
            switch (name) {
                case 'cardFirst':
                    setTimeout(() => {
                        cardSecondRef.current.value = '';
                        cardSecondRef.current.focus();
                    }, 0);
                    break;
                case 'cardSecond':
                    setTimeout(() => {
                        cardThirdRef.current.value = '';
                        cardThirdRef.current.focus();
                    }, 0);
                    break;
                case 'cardThird':
                    setTimeout(() => {
                        cardLastRef.current.value = '';
                        cardLastRef.current.focus();
                    }, 0);
                    break;
            }
        }
    };

    //日期選擇
    const periodInput = (e) => {
        const name = e.target.name;
        setCreditCardInf((inf) => ({
            ...inf,
            [name]: e.target.value,
        }));
    };

    //安全碼
    const securityCode = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        setCreditCardInf((inf) => ({
            ...inf,
            [name]: value,
        }));
    };

    //計算購買總價
    const buyTotal = shoppingCarList.reduce((total, goods) => total + (goods.buyQuantity * goods.goodsPrice), 0);

    const [activeAccordion, setActiveAccordion] = useState('');

    const handleAccordionToggle = (accordionKey) => {
        setActiveAccordion(accordionKey === activeAccordion ? '' : accordionKey);
    };

    return (
        <div style={{ marginTop: '15px' }}>
            <Container >

                <Accordion activeKey={activeAccordion} onSelect={handleAccordionToggle}>
                    <Card>
                        
                            <Accordion.Toggle as={Card.Header} eventKey="shoppingCart"  >
                                <Container>
                                    <Row>
                                        <Col>
                                            <h5>購物車</h5>
                                        </Col>
                                    </Row>
                                </Container>
                            </Accordion.Toggle>
                        
                        <Accordion.Collapse eventKey="shoppingCart">
                            <Card.Body>
                                <Table style={{ display: shoppingCarList.length > 0 ? '' : 'none' }}>
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
                                            shoppingCarList.map(goods => (
                                                <tr key={goods.goodsID}>
                                                    <td><Image src={`http://localhost:8086/training/goodsImg/${goods.goodsImageName}`} width="50px" /></td>
                                                    <td>{goods.goodsName}</td>
                                                    <td>{goods.goodsPrice}</td>
                                                    <td>{goods.buyQuantity}</td>
                                                    <td>${goods.buyQuantity * goods.goodsPrice}</td>
                                                </tr>
                                            ))
                                        }
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td align="right">小計</td>
                                            <td>${buyTotal}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td align="right">點數折扣</td>
                                            <td>-{cusInf.points}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td align="right">總計</td>
                                            <td>${(buyTotal-cusInf.points) > 0 ? buyTotal-cusInf.points : 0}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <Form noValidate validated={validated} onSubmit={checkOutSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label>姓名</Form.Label>
                            <Form.Control required type="text" name="cusName" placeholder="請輸入姓名" value={cusInf.cusName} onChange={inputChange} />
                            <Form.Control.Feedback type="invalid">請輸入姓名</Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label>聯絡電話</Form.Label>
                            <Form.Control required type="text" name="homeNumber" placeholder="請輸入聯絡電話" value={cusInf.homeNumber} onChange={inputChange} />
                            <Form.Control.Feedback type="invalid">請輸入聯絡電話</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label>手機號碼</Form.Label>
                            <Form.Control required type="text" name="mobileNumber" placeholder="請輸入手機號碼" value={cusInf.mobileNumber} onChange={inputChange} />
                            <Form.Control.Feedback type="invalid">請輸入手機號碼</Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label>地址</Form.Label>
                            <Form.Control required type="text" name="orderAddr" placeholder="請輸入地址" value={cusInf.orderAddr} onChange={inputChange} />
                            <Form.Control.Feedback type="invalid">請輸入地址</Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} sm={3}>
                            <Form.Label>點數折扣(您的點數:{memberPoint})</Form.Label>
                            <Form.Control required type="number" name="points" placeholder="請輸入點數" max={memberPoint>buyTotal ? buyTotal : memberPoint} value={cusInf.points} onChange={inputChange} />
                            <Form.Control.Feedback type="invalid">請輸入正確點數</Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    卡號
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Control required type="number" ref={cardFirstRef} name="cardFirst" placeholder="請輸入卡號" value={creditCardInf.cardFirst} onChange={cardInput} maxLength={4} />
                            <Form.Control.Feedback type="invalid">請輸入4位數的卡號</Form.Control.Feedback>

                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Control required type="number" ref={cardSecondRef} name="cardSecond" placeholder="請輸入卡號" value={creditCardInf.cardSecond} onChange={cardInput} maxLength={4} />
                            <Form.Control.Feedback type="invalid">{creditCardInf.cardSecond.length != 4 && validated && '請輸入4位數的卡號'}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} >

                            <Form.Control required type="number" ref={cardThirdRef} name="cardThird" placeholder="請輸入卡號" value={creditCardInf.cardThird} onChange={cardInput} maxLength={4} />
                            <Form.Control.Feedback type="invalid">{creditCardInf.cardThird.length != 4 && validated && '請輸入4位數的卡號'}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} >

                            <Form.Control required type="number" ref={cardLastRef} name="cardLast" placeholder="請輸入卡號" value={creditCardInf.cardLast} onChange={cardInput} maxLength={4} />
                            <Form.Control.Feedback type="invalid">{creditCardInf.cardLast.length != 4 && validated && '請輸入4位數的卡號'}</Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Label>有效月</Form.Label>
                            <Form.Control required as="select" name="cardPeriodMon" onChange={periodInput}>
                                <option value={''}>請選擇</option>
                                {
                                    periodMon.map(mon => (
                                        <option key={mon} value={mon}>
                                            {mon}
                                        </option>
                                    ))
                                }
                                /
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">請選擇有效月</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label>有效年</Form.Label>
                            <Form.Control required as="select" name="cardPeriodYear" onChange={periodInput}>
                                <option value={''}>請選擇</option>
                                {
                                    periodYear.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))
                                }
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">請選擇有效年</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label>安全碼</Form.Label>
                            <Form.Control required type="number" name="securityCode" placeholder="請輸入安全碼" value={creditCardInf.securityCode} onChange={securityCode} maxLength={3} />
                            <Form.Control.Feedback type="invalid">請輸入安全碼</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} className="d-flex align-items-end">
                            <Button variant="outline-info" className="w-100" type="submit">結帳</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>

            </Container>

            {/* <pre>{JSON.stringify(creditCardInf, null, 3)}</pre> */}
            {/* <pre>{JSON.stringify(cusInf, null, 3)}</pre> */}
        </div >
    )
}

export default CheckOut;
