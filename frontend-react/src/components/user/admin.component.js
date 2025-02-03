import server_ip from '../config';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Form, Button } from 'react-bootstrap';


export default function Report() {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');
        const allowedRoles = ['Admin', 'Brigada', 'Sgte', 'Visitor'];
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <AdminContent navigate={navigate} />
    );
}


function AdminContent({ navigate }) {
    const [users, setUsers] = useState([])
    const [subunits, setSubunits] = useState([])
    const [destinations, setDestinations] = useState([])
    const [workplaces, setWorkplaces] = useState([])

    async function fetchSubunitData() {
        try {
            const { data } = await axios.get(`${server_ip}/api/subunits/`);
            const results = data.map(value => ({
                key: value.name,
                value: value.id,
            }));
            setSubunits(results);
        } catch (error) {
            console.error("Erro ao buscar dados das subunidades:", error);
        }
    }

    useEffect(() => {
        fetchUsers();
        fetchSubunitData();
        fetchDestinations();
        fetchWorkplaces();
    }, [])

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${server_ip}/api/users`);
            const users = data.map(user => ({
                id: user.id,
                username: user.username,
                role: user.role,
                subunitName: user.subunit ? user.subunit.name : "Sem Subunidade",
            }));
            setUsers(users);
        } catch (error) {
            console.error("Erro ao buscar os usuários:", error);
        }
    };

    const fetchDestinations = async () => {
        try {
            const { data } = await axios.get(`${server_ip}/api/destinations`);
            const results = data.map(value => ({
                key: value.destination,
                value: value.id,
            }));
            setDestinations(results);
        } catch (error) {
            console.error("Erro ao buscar dados dos destinos:", error);
        }
    }

    const fetchWorkplaces = async () => {
        try {
            const { data } = await axios.get(`${server_ip}/api/workplaces`);
            const results = data.map(value => ({
                key: value.workplace,
                value: value.id,
            }));
            setWorkplaces(results);
        } catch (error) {
            console.error("Erro ao buscar dados dos workplaces:", error);
        }
    }

    return (
        <Container fluid className='d-grid gap-1 mb-3'>
            <Container fluid>
                <Row className='d-flex justify-content-center'>
                    <Col md={10} lg={10} sm={10} xs={10}>
                        <Accordion>
                            <AccordionItem eventKey="0">

                                <AccordionHeader><h4>Usuários</h4></AccordionHeader>
                                <AccordionBody>
                                    <Row className='justify-content-center text-center'>
                                        <Col xs={4} md={4}>
                                            <strong>Nome de Usuário</strong>
                                        </Col>
                                        <Col xs={1} md={1}>
                                            <strong>Subunidade</strong>
                                        </Col>
                                        <Col xs={3} md={3}>
                                            <strong>Cargo</strong>
                                        </Col>
                                        <Col xs={4} md={4}>
                                            <strong>Ações</strong>
                                        </Col>
                                        <hr></hr>
                                    </Row>

                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <div key={index}>
                                                <Row className='justify-content-center text-center'>
                                                    <Col xs={4} md={4}>
                                                        <p>{user.username}</p>
                                                    </Col>
                                                    <Col xs={1} md={1}>
                                                        <p>{user.subunitName}</p>
                                                    </Col>
                                                    <Col xs={3} md={3}>
                                                        <p>{user.role}</p>
                                                    </Col>

                                                    <Col xs={4} md={4}>
                                                        <Link to={`/user/edit/${user.id}`} className='col btn btn-outline-success'>
                                                            Editar
                                                        </Link>
                                                        <Button className='col ms-2 btn-outline-danger'>
                                                            Excluir
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Carregando usuários...</p>
                                    )}
                                </AccordionBody>

                            </AccordionItem>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

