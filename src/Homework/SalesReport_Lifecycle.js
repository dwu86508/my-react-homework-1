import React, { Component } from 'react';
import axios from "axios";

const apiUrl = 'http://localhost:8090/ecommerce/BackendController/queryGoodsSales';

// constructor(Mounting:掛載)透過建構函式初始state欄位
// componentDidMount(Mounting:掛載)初始載入call後端API取得資料後渲染畫面
// componentDidUpdate 組件更新(Updating:更新)點擊分頁查詢call後端API取得資料後渲染畫面
class SalesReport_Lifecycle extends Component {

    constructor(props){
        console.log("constructor 建構函式(Mounting:掛載)");
        super(props);
        this.state = {
            startDate: '2023-01-01',
            endDate: '2023-05-31',
            goodsReportSalesList: [],
            pageable: { currentPageNo: 1, pageDataSize: 5, pagesIconSize: 5 },
            genericPageable: {}
        };
    }

    componentDidMount(){
        console.log("componentDidMount 組件掛載(Mounting:掛載)");
        this.queryGoodsSales();
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log("componentDidUpdate 組件更新(Updating:更新)");
    //     if(prevState.pageable.currentPageNo !== this.state.pageable.currentPageNo){
    //         this.queryGoodsSales();
    //     }
    // }

    onChangeStartDate = (event) => {
        this.setState({
            startDate: event.target.value
        });
    };

    onChangeEndDate = (event) => {
        this.setState({
            endDate: event.target.value
        });
    };

    changeCurrentPageNo = (newPageNo) => {        
        // 只須更新currentPageNo，交由componentDidUpdate執行效果effects
        this.setState(state => ({
            pageable: {...state.pageable, currentPageNo: newPageNo}
        }),
        () =>{
           
            console.log('changePage');
            this.queryGoodsSales();
        });
    };

    queryGoodsSales = async () => {
        const { startDate, endDate, pageable } = this.state;        
        const params = { ...pageable, startDate, endDate };
        // const params =  { "currentPageNo": 1, "pageDataSize": 5, "pagesIconSize": 5, "startDate": "2023-01-01", "endDate": "2023-05-01" }
        console.log(params);

        const reportData = await axios.get(apiUrl, { params })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log(reportData.goodsReportSalesList);
        console.log(reportData.genericPageable);
        
        this.setState({
            goodsReportSalesList: reportData.goodsReportSalesList,
            genericPageable: reportData.genericPageable
        });
    };

    render() {
        console.log("render 渲染函式(Mounting:掛載、Updating:更新)");
        const { startDate, endDate, goodsReportSalesList, genericPageable } = this.state;
        const firstPage = genericPageable.currentPageNo == 1;
        const lastPage = genericPageable.currentPageNo == genericPageable.endPageNo;
        return (
            <div>
                <label>查詢日期起：</label> <input type='date' value={startDate} onChange={this.onChangeStartDate} />
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' value={endDate} onChange={this.onChangeEndDate} />
                <label style={{ marginLeft: '20px' }} />
                <button onClick={() => this.changeCurrentPageNo(1)}>查詢</button>
                <hr />
                {/* <pre>{JSON.stringify(this.state, null, 3)}</pre> */}

                <table border={'2'} style={{ display: goodsReportSalesList.length > 0 ? '' : 'none'}}>
                    <thead>
                        <tr>
                            <th>訂單編號</th>
                            <th>購買日期</th>
                            <th>顧客姓名</th>
                            <th>商品編號</th>
                            <th>商品名稱</th>
                            <th>商品價格</th>
                            <th>購買數量</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goodsReportSalesList.map(g =>
                            <tr key={g.orderID}>
                                <td>{g.orderID}</td>
                                <td>{g.orderDate}</td>
                                <td>{g.customerName}</td>
                                <td>{g.goodsID}</td>
                                <td>{g.goodsName}</td>
                                <td>{g.goodsBuyPrice}</td>
                                <td>{g.buyQuantity}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <hr/>
                {goodsReportSalesList.length > 0 &&
                <div>
                    <button disabled={firstPage} onClick={() => this.changeCurrentPageNo(1)}>{'<<'}</button>
                    <button disabled={firstPage} onClick={() => this.changeCurrentPageNo(genericPageable.currentPageNo - 1)}>{'<'}</button>
                    {genericPageable.pagination.map( p =>
                        <button key={p} onClick={() => this.changeCurrentPageNo(p)}>
                            {p == genericPageable.currentPageNo ? <b><u>{p}</u></b> : p}
                        </button>
                    )}
                    <button disabled={lastPage} onClick={() => this.changeCurrentPageNo(genericPageable.currentPageNo + 1)} >{'>'}</button>
                    <button disabled={lastPage} onClick={() => this.changeCurrentPageNo(genericPageable.endPageNo)}>{'>>'}</button>
                </div>
                }
                <br/><br/>
            </div>
        );
    }
}

export default SalesReport_Lifecycle;