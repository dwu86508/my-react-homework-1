import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import FormControl from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

import 'bootstrap/dist/css/bootstrap.css';

const apiUrl = 'http://localhost:8086/training/ecommerce/BackendController/queryGoodsSales';


const Main = () => {

    const customCol = { padding:' 0 5px ' , marginTop: '15px' } ;

    const goodsSearchUrl = 'http://localhost:8086/training/FrontendController/queryGoodsData';
    const addCartGoodsUrl = 'http://localhost:8086/training/MemberController/addCartGoodsNew';
    const clearShoppingCarUrl = 'http://localhost:8086/training/MemberController/clearCartGoodsNew';
    const searchShoppingCarUrl = 'http://localhost:8086/training/MemberController/queryCartGoodsNew';
    const memberInfUrl = 'http://localhost:8086/training/MemberController/checkLogin';

    const navigate = useNavigate();

    const [searchInf, setSearchInf] = useState({
        currentPageNo: 1,
        pageDataSize: 6,
        pagesIconSize: 5,
        searchKeyword: ''
    });

    const [memberInf, setMemberInf] = useState({});

    const [goodsList, setGoodsList] = useState({});
    const [genericPageable, setGenericPageable] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [sysMsg, setSysMsg] = useState('');
    const [shoppingCarList, setShoppingCarList] = useState([]);

    const handleClose = () => setModalShow(false);

    useEffect(
        () => {
            goodsSearch();
            searchShoppingCar();
            memberInfs();
        }, [searchInf.currentPageNo]
    )

    const changeSearchKeyWord = (e) => {
        setSearchInf(inf => ({
            ...inf, searchKeyword: e.target.value
        }));
    };

    //換頁
    const changePage = (page) => {
        console.log(page);
        setSearchInf(inf => ({
            ...inf, currentPageNo: page
        }))
    }

    //查詢會員資料
    const memberInfs = async () => {
        const memberInfData = await axios.get(memberInfUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setMemberInf(memberInfData);
    };

    //搜尋商品
    const goodsSearch = async () => {
        const params = searchInf;
        const goodsSearchData = await axios.get(goodsSearchUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setGoodsList(goodsSearchData.goodsList);
        setGenericPageable(goodsSearchData.genericPageable);
    };

    //查詢購物車內商品
    const searchShoppingCar = async () => {
        const shoppingCarData = await axios.get(searchShoppingCarUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setShoppingCarList(shoppingCarData);
    };

    //商品加入購物車
    const addGoods = async (goodsID) => {
        const goodsInf = goodsList.find((goods) => goods.goodsID == goodsID);
        const addCartGoods = await axios.post(addCartGoodsUrl, goodsInf, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        console.log(addCartGoods);
        setModalShow(true);
        searchShoppingCar();
        setSysMsg('商品新增成功');
    };

    //清空購物車
    const clearShoppingCar = async () => {
        const clearShoppingCar = await axios.delete(clearShoppingCarUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        console.log(clearShoppingCar);
        setModalShow(true);
        setShoppingCarList([]);
        setSysMsg('購物車已清空');
    };

    //購物車
    const shoppingCar = () => {
        navigate("/shoppingCar");
    }

    //點數紀錄
    const pointsLog = () => {
        navigate("/memberPoints");
    }

    const goodsListShow = [];
    for (let i = 0; i < goodsList.length; i += 3) {
        goodsListShow.push(goodsList.slice(i, i + 3));
    }

    //計算購物車內商品數量
    const shoppingCarSize = shoppingCarList.reduce((total, goods) => total + goods.buyQuantity, 0);

    const firstPage = genericPageable.currentPageNo == 1;
    const lastPage = genericPageable.currentPageNo == genericPageable.endPageNo;
    return (
        <div style={{ marginTop: '15px' }}>
            <Container>
                <Row>
                    <Col sm={4}>
                        <Row className="justify-content-center" >
                            <Image src="http://localhost:8086/training/goodsImg/coffee.jpg" width="200px" />
                        </Row>                        
                        <Row >
                            <Col xs={12} sm={8} style={customCol}>
                                <Form.Control type="text" placeholder="Search" name="searchKeyWord" onChange={changeSearchKeyWord} />
                            </Col>
                            <Col xs={12} sm={4} style={customCol}>
                                <Button variant="outline-info" className="w-100" onClick={goodsSearch}>查詢</Button>
                            </Col>
                        </Row>
                        <Row className="justify-content-center" style={{ marginTop: '15px' }}>
                            <p>{memberInf.memberName} 您好 </p>
                        </Row>
                        <Row>
                            <Col style={customCol}>
                                <Button variant="outline-info" className="w-100" onClick={pointsLog}>點數紀錄</Button>
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={6} style={customCol}>
                                <Button variant="outline-info" className="w-100" onClick={shoppingCar}>購物車{shoppingCarSize > 0 && `(${shoppingCarSize})`}</Button>
                            </Col>
                            <Col xs={6} style={customCol}>
                                <Button variant="outline-info" className="w-100" onClick={clearShoppingCar}>清空購物車</Button>
                            </Col>
                        </Row>

                    </Col>
                    <Col sm={8}>
                        {goodsListShow.map((group, index) => (
                            <CardDeck key={index} style={{ marginBottom: '5px', position: 'relative' }}>
                                {group.map(goods => (
                                    <Card key={goods.goodsID}>
                                        <Card.Img variant="top" src={`http://localhost:8086/training/goodsImg/${goods.goodsImageName}`} />
                                        <Card.Body>
                                            <Card.Title>{goods.goodsName}</Card.Title>
                                            <Card.Text>{goods.goodsDescription}</Card.Text>
                                            <Card.Text>{goods.goodsPrice}/個</Card.Text>
                                            <Card.Text>庫存{goods.goodsQuantity}</Card.Text>
                                            <br/>
                                            <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
                                                <Button onClick={() => addGoods(goods.goodsID)} >加入購物車</Button>
                                            </div>
                                            
                                            
                                        </Card.Body>
                                    </Card>
                                ))}
                            </CardDeck>
                        ))}
                        {genericPageable.endPageNo > 1 &&
                            <div >
                                <Pagination>
                                    <Pagination.First disabled={firstPage} onClick={() => changePage(1)}></Pagination.First>
                                    <Pagination.Prev disabled={firstPage} onClick={() => changePage(searchInf.currentPageNo - 1)}></Pagination.Prev>
                                    {
                                        genericPageable.pageination.map(page => (
                                            <Pagination.Item key={page} active={searchInf.currentPageNo == page} onClick={() => changePage(page)}>{page}</Pagination.Item>
                                        )
                                        )
                                    }
                                    <Pagination.Next disabled={lastPage} onClick={() => changePage(searchInf.currentPageNo + 1)}></Pagination.Next>
                                    <Pagination.Last disabled={lastPage} onClick={() => changePage(genericPageable.endPageNo)}></Pagination.Last>
                                </Pagination>

                            </div>
                        }
                    </Col>
                </Row>

                <Modal show={modalShow} onHide={handleClose} backdrop="static" keyboard={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>系統訊息</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {sysMsg}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>確認</Button>
                    </Modal.Footer>
                </Modal>
            </Container>

        </div>
    )
}

export default Main;
