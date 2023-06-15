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

const MemberPoints = () => {

    const customCol = { padding: ' 0 5px ', marginTop: '15px' };

    const memberPointsLogUrl = 'http://localhost:8086/training/MemberController/memberPointsLog';    

    const navigate = useNavigate();

    const [ memberPointsLog, setMemberPointsLog] = useState([]);

    useEffect(
        () => {
            searchMemberPointsLog();
        }, []
    )

    //查詢點數異動紀錄
    const searchMemberPointsLog = async () => {
        const memberPointsLog = await axios.get(memberPointsLogUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setMemberPointsLog(memberPointsLog);
        console.log(memberPointsLog)
    };

    //繼續購物
    const goShopping = () => {
        navigate("/main");
    }

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
                            </Col>
                        </Row>

                    </Col>
                    <Col sm={8}>
                        <Table style={{ display: memberPointsLog.length > 0 ? '' : 'none' }}>
                            <thead>
                                <tr>
                                    <th>編號</th>
                                    <th>異動日期</th>
                                    <th>訂單編號</th>
                                    <th>異動點數</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    memberPointsLog.map(pointsLog => (
                                        <tr key={pointsLog.plNum}>                                            
                                            <td>{pointsLog.plNum}</td>
                                            <td>{pointsLog.dateTime}</td>
                                            <td>{pointsLog.infNum}</td>
                                            <td>{pointsLog.point_record > 0 ? `+${pointsLog.point_record}` : pointsLog.point_record}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        {!memberPointsLog.length > 0 && '查無紀錄'}
                    </Col>
                </Row>
            </Container>

            {/* <pre>{JSON.stringify(shoppingCarList, null, 3)}</pre>
            <pre>{JSON.stringify(goodsInf, null, 3)}</pre> */}
        </div >
    )
}

export default MemberPoints;
