import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.css';

const MemberLogin = ({ loginData }) => {
    const memberLoginUrl = 'http://localhost:8086/training/MemberController/login';
    const navigate = useNavigate();

    const [loginInf, setLoginInf] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [sysMsg, setSysMsg] = useState('');

    const { setMemberInf } = loginData;

    const handleClose = () => setModalShow(false);

    const inputChange = (e) => {
        const name = e.target.name;
        setLoginInf((inf) => ({
            ...inf,
            [name]: e.target.value,
        }));
    };

    const memberLogin = async () => {
        const loginData = await axios.post(memberLoginUrl, loginInf, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });
        setLoginInf(loginData);
        if (loginData.isLogin) {
            setMemberInf(loginData);
            navigate("/main");
        } else {
            setSysMsg(loginData.loginMessage);
            setModalShow(true);
        }

        // window.location = "/main";

    };

    return (
        <div>
            <Container>
                <Form style={{ width: '50%', margin: '0 auto', marginTop: '15px' }}>
                    <p align="center" >會員登入</p>
                    <Form.Group as={Col} >
                        <Form.Label>帳號：</Form.Label>
                        <Form.Control required type="text" name="memberID" onChange={inputChange} />
                    </Form.Group>
                    <Form.Group as={Col} >
                        <Form.Label>密碼：</Form.Label>
                        <Form.Control required type="password" name="memberPWD" onChange={inputChange} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridEmail" className="d-flex align-items-end">
                        <Button variant="outline-info" className="w-100" onClick={memberLogin}>登入</Button>
                    </Form.Group>

                </Form>
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
    );
};

export default MemberLogin;
