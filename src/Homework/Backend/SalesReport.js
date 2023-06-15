import React, { Component } from 'react';
import axios from "axios";
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.css';
const apiUrl = 'http://localhost:8086/training/ecommerce/BackendController/queryGoodsSalesNew';

class SalesReport extends Component {

    // state = {
    //     startDate:'',
    //     endDate:'',
    //     currentPageNo: 1,        
    //     reportData:[]
    // };


    constructor(props) {
        const date = new Date();
        const today = date.toLocaleDateString();
        console.log("1.constructor 建構函式(Mounting:掛載)");
        super(props);
        // 針對state做初始化設計欄位
        this.state = {
            startDate: '2023-01-01',
            endDate: today,
            currentPageNo: 1,
            // reportData: {},
            goodsReportSalesList: [],
            genericPageable: {},
            activeRow: null
        };
    }

    handleRowToggle = (index) => {
        this.setState((prevState) => ({
            activeRow: prevState.activeRow === index ? null : index
        }));
    };

    componentDidMount() {
        this.onClickSearch();
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log("componentDidUpdate 組件更新(Updating:更新)");
    //     if(prevState.currentPageNo !== this.state.currentPageNo){
    //         this.onClickSearch();
    //     }
    // }

    //變更查詢開始時間
    startDateOnChange = (e) => {
        console.log('changeStartDate')
        this.setState({
            startDate: e.target.value
        });
    };

    //變更查詢結束時間
    endDateOnChange = (e) => {
        console.log('changeEndDate')
        this.setState({
            endDate: e.target.value
        });
    };

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

    //查詢訂單
    onClickSearch = async () => {
        const { currentPageNo, startDate, endDate } = this.state;
        const params = { "currentPageNo": currentPageNo, "pageDataSize": 5, "pagesIconSize": 5, startDate, endDate };
        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log("goodsReportSalesList:", reportData.goodsReportSalesList);
        console.log("genericPageable:", reportData.genericPageable);
        this.setState({
            // reportData: reportData,
            goodsReportSalesList: reportData.goodsReportSalesList,
            genericPageable: reportData.genericPageable
        });
    };

    render() {

        const { goodsReportSalesList, genericPageable, currentPageNo, startDate, endDate } = this.state;
        const firstPage = genericPageable.currentPageNo == 1;
        const lastPage = genericPageable.currentPageNo == genericPageable.endPageNo;
        return (
            <div style={{ marginTop: '15px' }}>
                <Container>
                    <Form >
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>查詢日期起：</Form.Label>
                                <Form.Control required type="date" value={startDate} onChange={this.startDateOnChange} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>查詢日期迄：</Form.Label>
                                <Form.Control required type="date" value={endDate} onChange={this.endDateOnChange} />
                            </Form.Group>
                            <Form.Group as={Col} className="d-flex align-items-end">
                                <Button variant="outline-info" className="w-100" onClick={() => this.changePage(1)}>查詢</Button>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    <Table striped bordered hover style={{ display: goodsReportSalesList.length > 0 ? '' : 'none' }}>
                        <thead>
                            <tr>
                                <th>訂單編號</th>
                                <th>購買日期</th>
                                <th>顧客姓名</th>
                                <th>訂單金額</th>
                                <th>點數折扣</th>
                                <th>付款金額</th>
                                <th>商品清單</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                goodsReportSalesList.map((order, index) => (
                                    <React.Fragment key={index}>
                                        <tr >
                                            <td>{order.infNum}</td>
                                            <td>{order.orderDate}</td>
                                            <td>{order.customerName}</td>
                                            <td>{order.orderTotal}</td>
                                            <td>{order.discount}</td>
                                            <td>{order.discount * order.orderTotal}</td>
                                            <td><span class="material-icons" onClick={() => this.handleRowToggle(index)}>expand_more</span></td>
                                        </tr>
                                        {this.state.activeRow === index && (
                                            <tr>
                                                <td colSpan="7">
                                                    <Table>
                                                        <thead>
                                                            <tr>
                                                                <th>商品編號</th>
                                                                <th>商品名稱</th>
                                                                <th>商品價格</th>
                                                                <th>購買數量</th>
                                                                <th>小計</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.orderList.map((list, subIndex) => (
                                                                <tr key={subIndex}>
                                                                    <td>{list.goodsID}</td>
                                                                    <td>{list.goods.goodsName}</td>
                                                                    <td>{list.goodsBuyPrice}</td>
                                                                    <td>{list.buyQuantity}</td>
                                                                    <td>${list.buyQuantity * list.goodsBuyPrice}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            }
                        </tbody>
                    </Table>
                    {genericPageable.endPageNo > 1 &&
                        <div >
                            <Pagination>
                                <Pagination.First disabled={firstPage} onClick={() => this.changePage(1)}></Pagination.First>
                                <Pagination.Prev disabled={firstPage} onClick={() => this.changePage(currentPageNo - 1)}></Pagination.Prev>
                                {
                                    genericPageable.pageination.map(page => (
                                        <Pagination.Item key={page} active={currentPageNo == page} onClick={() => this.changePage(page)}>{page}</Pagination.Item>
                                    )
                                    )
                                }
                                <Pagination.Next disabled={lastPage} onClick={() => this.changePage(currentPageNo + 1)}></Pagination.Next>
                                <Pagination.Last disabled={lastPage} onClick={() => this.changePage(genericPageable.endPageNo)}></Pagination.Last>
                            </Pagination>

                        </div>
                    }
                </Container>
                {/* <pre>{JSON.stringify(this.state, null, 3)}</pre> */}
            </div>
        );
    }
}

export default SalesReport;