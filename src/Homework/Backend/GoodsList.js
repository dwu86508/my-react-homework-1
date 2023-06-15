import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css';
const apiUrl = 'http://localhost:8086/training/ecommerce/BackendController/queryGoodsData';

class GoodsList extends Component {

    constructor(props) {
        console.log("1.constructor 建構函式(Mounting:掛載)");
        super(props);
        // 針對state做初始化設計欄位
        this.state = {
            filter: {
                goodsID: '',
                goodsName: '',
                startPrice: '',
                endPrice: '',
                priceSort: '',
                quantity: '',
                status: 2
            },
            currentPageNo: 1,
            // reportData: {},
            goodsList: [],
            genericPageable: {}
        };
    }

    componentDidMount() {
        this.onClickSearch();
    }

    inputChange = (e) => {
        const name = e.target.name;
        this.setState(state => ({
            filter: { ...state.filter, [name]: e.target.value }
        }));
        console.log(this.state.filter.goodsID);
        console.log(this.state.filter.goodsName);
    }

    //換頁
    changePage = (page) => {
        this.setState(state =>
            ({ currentPageNo: page }),
            () => {
                console.log(page);
                console.log('changePage');
                this.onClickSearch();
            }
        );
    }

    //查詢商品
    onClickSearch = async () => {
        const { currentPageNo, filter } = this.state;
        const params = { ...filter, currentPageNo, "pageDataSize": 5, "pagesIconSize": 5 };
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log("goodsList:", reportData.goodsList);
        console.log("genericPageable:", reportData.genericPageable);
        this.setState({
            // reportData: reportData,
            goodsList: reportData.goodsList,
            genericPageable: reportData.genericPageable
        });
    };

    render() {

        const { goodsList, genericPageable, currentPageNo, filter } = this.state;
        const firstPage = genericPageable.currentPageNo == 1;
        const lastPage = genericPageable.currentPageNo == genericPageable.endPageNo;
        return (
            <div style={{ marginTop: '15px' }}>
                <Container>
                    <Form noValidate >
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品編號</Form.Label>
                                <Form.Control type="number" name="goodsID" placeholder="請輸入商品編號" value={filter.goodsID} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>商品名稱</Form.Label>
                                <Form.Control type="text" name="goodsName" placeholder="請輸入商品名稱" value={filter.goodsName} onChange={this.inputChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品最低價格</Form.Label>
                                <Form.Control name="startPrice" type="number" placeholder="請輸入篩選最低金額" value={filter.startPrice} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>商品最高價格</Form.Label>
                                <Form.Control name="endPrice" type="number" placeholder="請輸入篩選最高金額" value={filter.endPrice} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>價格排序</Form.Label>
                                <Form.Control as="select" name="priceSort" onChange={this.inputChange}>
                                    <option value={''}>請選擇</option>
                                    <option value={'ASC'}>低到高</option>
                                    <option value={'DESC'}>高到低</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>商品低於庫存量</Form.Label>
                                <Form.Control name="quantity" type="number" placeholder="請輸入篩選最低金額" value={filter.quantity} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>商品狀態</Form.Label>
                                <Form.Control as="select" name="status" onChange={this.inputChange}>
                                    <option value={'2'}>全部</option>
                                    <option value={'1'}>上架</option>
                                    <option value={'0'}>下架</option>
                                </Form.Control>
                            </Form.Group >
                            <Form.Group as={Col}  className="d-flex align-items-end">                                
                                <Button variant="outline-info" className="w-100" onClick={() => this.changePage(1)}>查詢</Button>
                            </Form.Group >
                        </Form.Row>
                    </Form>
                    {/* <pre>{JSON.stringify(filter, null, 3)}</pre> */}

                    <Table striped bordered hover style={{ display: goodsList.length > 0 ? '' : 'none' }}>
                        <thead>
                            <tr>
                                <th>商品編號</th>
                                <th>商品名稱</th>
                                <th>商品價格</th>
                                <th>現有庫存</th>
                                <th>商品狀態</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                goodsList.map(goods => (
                                    <tr key={goods.goodsID}>
                                        <td>{goods.goodsID}</td>
                                        <td>{goods.goodsName}</td>
                                        <td>{goods.goodsPrice}</td>
                                        <td>{goods.goodsQuantity}</td>
                                        <td>{goods.goodsStatus == 0 ? '下架' : '上架'}</td>
                                    </tr>
                                )

                                )
                            }
                        </tbody>
                    </Table>
                    { genericPageable.endPageNo > 1 &&
                        <div >
                            <Pagination>
                                <Pagination.First disabled={firstPage} onClick={() => this.changePage(1)}></Pagination.First>
                                <Pagination.Prev disabled={firstPage} onClick={() => this.changePage(currentPageNo - 1)}></Pagination.Prev>
                                {
                                    genericPageable.pageination.map(page => (
                                        
                                        <Pagination.Item key={page} active={currentPageNo == page} onClick={ () => this.changePage(page) }>{page}</Pagination.Item>
                                    )
                                    )
                                }
                                <Pagination.Next disabled={lastPage} onClick={() => this.changePage(currentPageNo + 1)}></Pagination.Next>
                                <Pagination.Last disabled={lastPage} onClick={() => this.changePage(genericPageable.endPageNo)}></Pagination.Last>
                            </Pagination>

                        </div>
                    }
                </Container>
            </div>
        );
    }
}

export default GoodsList;