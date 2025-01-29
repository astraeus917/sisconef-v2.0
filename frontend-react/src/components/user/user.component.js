import server_ip from '../config';
import React, { useEffect, useState } from "react";
import { Navbar, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'react-bootstrap';

export default function EditUser() {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');
        const allowedRoles = ['Admin', 'Brigada', 'Sgte', 'Visitor'];
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <UserContent navigate={navigate} />
    );
}

function UserContent({ navigate }) {
    const [username, setUsername] = useState("");
    const [subunit, setSubunit] = useState("");
    const [role, setRole] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const userId = localStorage.getItem('user_id');

        if (!userId) {
            Swal.fire({
                text: "User ID not found in localStorage.",
                icon: "error",
                confirmButtonColor: '#198754',
            });
            return;
        }

        try {
            const response = await axios.get(`${server_ip}/api/users/${userId}`);
            const { username, subunit_name, role } = response.data.user;
            setUsername(username);
            setSubunit(subunit_name);
            setRole(role);
        } catch (error) {
            const message = error.response?.data?.message || "Error fetching user data.";
            Swal.fire({
                text: message,
                icon: "error",
                confirmButtonColor: '#198754',
            });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');
    
        // Validates the entered passwords.
        if (!newPassword || !confirmPassword) {
            Swal.fire({
                text: "Por favor, preencha todos os campos.",
                icon: "warning",
                confirmButtonColor: '#198754',
            });
            return;
        }
    
        if (newPassword !== confirmPassword) {
            Swal.fire({
                text: "As senhas não coincidem.",
                icon: "warning",
                confirmButtonColor: '#198754',
            });
            return;
        }

        try {
            await axios.put(`${server_ip}/api/users/${userId}/change-password`, { password: newPassword });
            Swal.fire({
                text: "Senha alterada com sucesso!",
                icon: "success",
                confirmButtonColor: '#198754',
            });

            setNewPassword("");
            setConfirmPassword("");
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Erro ao alterar a senha.";
            Swal.fire({
                text: message,
                icon: "error",
                confirmButtonColor: '#198754',
            });
        }
    };

    return (
        <div className="container">
            <Navbar bg="success" expand="lg" className="mb-4 rounded text-white">
                <div className='col-1'>
                    <Navbar.Text className="ml-auto">
                        <img
                            src={`${server_ip}/storage/logo.png`}
                            alt="User Profile"
                            height={80}
                            className="rounded-circle"
                        />
                    </Navbar.Text>
                </div>

                <div className='col-3'>
                    <p>Usuário:</p>
                    <h4>{username}</h4>
                </div>

                <div className='col-3'>
                    <p>Cargo:</p>
                    <h4>{role}</h4>
                </div>

                <div className='col-5'>
                    <p>Subunidade:</p>
                    <h4>{subunit}</h4>
                </div>
            </Navbar>

            {/* Password change code. */}
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">

                            <h4 className="card-warName mt-2">Alterar senha</h4>
                            <hr />

                            <Form onSubmit={handleChangePassword}>
                                <Row>
                                    <Col xs={12} className="mb-3">
                                        <Form.Group controlId="password">
                                            <Form.Label>Nova senha</Form.Label>
                                            <Form.Control type="password" onChange={(event) => {
                                                setNewPassword(event.target.value)
                                            }} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} className="mb-3">
                                        <Form.Group controlId="newpassword">
                                            <Form.Label>Confirme a senha</Form.Label>
                                            <Form.Control type="password" onChange={(event) => {
                                                setConfirmPassword(event.target.value)
                                            }} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="justify-content-center">
                                    <Button variant="success" className="mt-3 text-center col-4" type="submit">
                                        Alterar senha
                                    </Button>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}