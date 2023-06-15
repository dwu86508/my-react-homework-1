import React, { Component } from 'react';
import axios from "axios";
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.css';
const apiUrl = 'http://localhost:8086/training/ecommerce/BackendController/createGoods';

class CreateGoods extends Component {

    constructor(props) {
        console.log("1.constructor 建構函式(Mounting:掛載)");
        super(props);
        // 針對state做初始化設計欄位
        this.state = {
            goods: {
                goodsName: '',
                price: '',
                description: '',
                quantity: '',
                status: '1',
                imageName: ''
            },
            currentPageNo: 1,
            // reportData: {},
            goodsList: {},
            validated: false,
            modalShow: false

        };
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

    //訊息視窗關閉
    handleClose = () => {
        this.setState({
            goods: {
                goodsName: '',
                price: '',
                description: '',
                quantity: '',
                status: '1',
                imageName: ''
            },
            validated: false,
            modalShow: false
        });
    }

    createGoodsSubmit = async (e) => {
        e.preventDefault();
        this.setState({ validated: true });
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            const uploadFile = form.uploadFile.files[0];
            const { goods } = this.state;
            const formData = new FormData();
            Object.keys(goods).map(key => {
                const value = goods[key];
                formData.append(key, value);
            });
            formData.append('file', uploadFile);

            const reportData = await axios.post(apiUrl, formData)
                .then(rs => rs.data)
                .catch(error => { console.log(error); });

            this.setState({
                // reportData: reportData,
                goodsList: reportData,
                modalShow: true
            });
        }
    }



    render() {

        const { goods, goodsList, validated, modalShow } = this.state;
        return (
            <div style={{ marginTop: '15px' }}>
                <Container>
                    <Form noValidate validated={validated} onSubmit={this.createGoodsSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品名稱</Form.Label>
                                <Form.Control required type="text" name="goodsName" placeholder="請輸入商品名稱" value={goods.goodsName} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品名稱</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品描述</Form.Label>
                                <Form.Control as="textarea" name="description" placeholder="請輸入商品描述" value={goods.description} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品描述</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品價格</Form.Label>
                                <Form.Control required type="number" name="price" placeholder="請輸入商品價格" value={goods.price} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品價格</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品庫存</Form.Label>
                                <Form.Control required type="number" name="quantity" placeholder="請輸入商品庫存" value={goods.quantity} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">請輸入商品庫存</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品圖片</Form.Label>
                                <Form.File id="formcheck-api-custom" custom>
                                    <Form.File.Input required name="uploadFile" onChange={this.onChangeFile} />
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
                                <Form.Check inline required name='status' type="radio" label="上架"
                                    value={'1'} onChange={this.inputChange} checked={goods.status == 1} />
                                <Form.Check inline required name='status' type="radio" label="下架"
                                    value={'0'} onChange={this.inputChange} checked={goods.status == 0} />
                            </Form.Group>
                        </Form.Row>
                        <Button variant="outline-info" type="submit">新增</Button>
                    </Form>
                </Container>
                <Modal show={modalShow} onHide={this.handleClose} backdrop="static" keyboard={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>系統訊息</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        商品編號{goodsList.goodsID}新增成功!!!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary"  onClick={this.handleClose}>確認</Button>
                    </Modal.Footer>
                </Modal>
                {/* <pre>{JSON.stringify(goods, null, 3)}</pre> */}
            </div>
        );
    }
}

export default CreateGoods;