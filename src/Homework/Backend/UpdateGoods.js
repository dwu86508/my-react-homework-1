import React, { Component } from 'react';
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.css';
const queryAllGoodsUrl = 'http://localhost:8086/training/ecommerce/BackendController/queryAllGoods';
const goodsSelectUrl = 'http://localhost:8086/training/ecommerce/BackendController/queryGoodsByID';
const updateGoodsUrl = 'http://localhost:8086/training/ecommerce/BackendController/updateGoods';

class UpdateGoods extends Component {

    constructor(props) {
        console.log("1.constructor 建構函式(Mounting:掛載)");
        super(props);
        // 針對state做初始化設計欄位
        this.state = {
            updateSuccess: false,
            goods: {
                goodsID: '',
                goodsName: '',
                goodsPrice: '',
                goodsDescription: '',
                goodsQuantity: '',
                imageName: '',
                goodsStatus: '1'
            },
            currentPageNo: 1,
            // reportData: {},
            goodsList: [],
            validated: false,
            modalShow: false
        };
    }

    componentDidMount() {
        this.queryAllGoods();
    }

    goodsSelect = async (e) => {
        console.log("goodsSelect");
        const goodsID = e.target.value;
        const params = { goodsID };
        const reportData = await axios.get(goodsSelectUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

            this.setState(prevState => ({
                goods: {
                  ...prevState.goods,
                  goodsID: '',
                  goodsName: '',
                  goodsPrice: '',
                  goodsDescription: '',
                  goodsQuantity: '',
                  imageName: '',
                  goodsStatus: '1'
                }
              }), () => {
                // 在回呼函式中執行需要在狀態更新後進行的操作
                // 例如執行更新新值的邏輯
                this.setState({
                  goods: reportData
                });
              });
    }

    inputChange = (e) => {
        const name = e.target.name;
        this.setState(state => ({
            goods: { ...state.goods, [name]: e.target.value }
        }));
    }

    // 瀏灠檔案上傳欄位
    onChangeFile = (e) => {
        const changFile = e.target.files;
        const changFileName = changFile.length === 0 ? '' : changFile[0].name;
        this.setState(state => ({
            goods: { ...state.goods, imageName: changFileName }
        }));
    }

    //進入頁面時載入所有商品
    queryAllGoods = async () => {
        const reportData = await axios.get(queryAllGoodsUrl)
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({
            // reportData: reportData,
            goodsList: reportData
        });
    }

    //訊息視窗關閉
    handleClose = () => {
        this.setState({            
            validated: false,
            modalShow: false
        });
    }

    //送出修改表單
    updateGoodsSubmit = async (e) => {
        e.preventDefault();
        this.setState({ validated: true });
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            const uploadFile = form.uploadFile.files[0];
            const { goods } = this.state;
            const formData = new FormData();
            formData.append('goodsID' , goods.goodsID);
            formData.append('goodsName' , goods.goodsName);
            formData.append('description' , goods.goodsDescription);
            formData.append('price' , goods.goodsPrice);
            formData.append('quantity' , goods.goodsQuantity);
            formData.append('status' , goods.goodsStatus);
            { uploadFile != null && formData.append('file', uploadFile) }
            const reportData = await axios.post(updateGoodsUrl, formData)
                .then(rs => rs.data)
                .catch(error => { console.log(error); });

            this.setState({
                goods: reportData,
                modalShow: true
            });
        }
    }

    render() {

        const { goods, goodsList, validated, modalShow } = this.state;
        return (
            <div style={{ marginTop: '15px' }}>
                <Container>
                    <Form noValidate validated={validated} onSubmit={this.updateGoodsSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>商品名稱</Form.Label>
                                <Form.Control required as="select" name="status" onChange={this.goodsSelect}>
                                    <option value={''}>-------請選擇-------</option>
                                    {
                                        goodsList.map(goods => (
                                            <option key={goods.goodsID} value={goods.goodsID}>
                                                {goods.goodsID} - {goods.goodsName}
                                            </option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品描述</Form.Label>
                                <Form.Control as="textarea" name="goodsDescription" placeholder="請輸入商品描述" value={goods.goodsDescription} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品描述</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品價格</Form.Label>
                                <Form.Control required type="number" name="goodsPrice" placeholder="請輸入商品價格" value={goods.goodsPrice} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品價格</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品庫存</Form.Label>
                                <Form.Control required type="number" name="goodsQuantity" placeholder="請輸入商品庫存" value={goods.goodsQuantity} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品庫存</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row style={{ display: goods.goodsID == '' ? 'none' : '' }}>
                            <Form.Group as={Col} >
                                <Form.Label>商品圖片</Form.Label>
                                <Col>
                                    <Image src={`http://localhost:8086/training/goodsImg/${goods.goodsImageName}`} width="200px" />
                                </Col>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>更新圖片</Form.Label>
                                <Form.File id="formcheck-api-custom" custom>
                                    <Form.File.Input name="uploadFile" onChange={this.onChangeFile} />
                                    <Form.File.Label data-browse="選擇圖片">
                                        {goods.imageName ? goods.imageName : '選擇要上傳的檔案...'}
                                    </Form.File.Label>
                                    <Form.Control.Feedback type="valid">已選擇檔案!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">未選擇檔案!</Form.Control.Feedback>
                                </Form.File>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group id="formGridRadio">
                                <Form.Check inline required name='goodsStatus' type="radio" label="上架"
                                    value={'1'} onChange={this.inputChange} checked={goods.goodsStatus == 1} />
                                <Form.Check inline required name='goodsStatus' type="radio" label="下架"
                                    value={'0'} onChange={this.inputChange} checked={goods.goodsStatus == 0} />
                            </Form.Group>
                        </Form.Row>
                        <Button variant="outline-info" type="submit">修改</Button>                        
                    </Form>
                </Container>
                <Modal show={modalShow} onHide={this.handleClose} backdrop="static" keyboard={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>系統訊息</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        商品編號{goods.goodsID}修改成功!!!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>確認</Button>
                    </Modal.Footer>
                </Modal>              
                
                {/* <pre>{JSON.stringify(goods, null, 3)}</pre> */}
            </div>
        );
    }
}

export default UpdateGoods;