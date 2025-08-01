import server_ip from '../config';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RowLayoffMade from '../layouts/LayoffMilitaryMade';

export default function Presence() {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');
        const allowedRoles = ['Admin', 'Brigada', 'Sgte'];
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate("/");
        }
    }, [navigate]);

    return <LayoffPresenceContent />;
}

function LayoffPresenceContent() {
    const [militaries, setMilitaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [militariesLayoff, setMilitariesLayoff] = useState([]);

    useEffect(() => {
        const subunit_id = localStorage.getItem('user_subunit');

        // Primeiro busca os militares em Layoff, depois filtra os demais
        const fetchData = async () => {
            try {
                const { data: inLayoff } = await axios.post(`${server_ip}/api/layoff/presence`, { subunit_id });
                setMilitariesLayoff(inLayoff);

                const { data: notInLayoff } = await axios.post(`${server_ip}/api/layoff/militaries`, { subunit_id });

                const layoffIds = new Set(inLayoff.map(m => m.id));
                const filtered = notInLayoff.filter(m => !layoffIds.has(m.id));
                setMilitaries(filtered);

            } catch (error) {
                console.error("Erro ao buscar militares:", error);
            }
        };

        fetchData();
    }, []);

    const filteredMilitaries = militaries.filter(military =>
        military.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className='d-grid gap-1 mb-3'>
            <Container fluid>
                <Card className='card card-header-military font-x-large'>
                    <Card.Body className='text-center'>
                        <Row>
                            <Col md={6}>
                                <Form>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pesquisar militar pelo nome..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form>
                            </Col>

                            <Col md={4}></Col>

                            <Col md={2}>
                                <Link className='btn btn-success layoff-btn' to={"/layoff/list"}>
                                    <h6>Militares de Férias/Dispensa</h6>
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            <Container fluid>
                <Row>
                    <Col md={6}>
                        <Card className='card-header-military card'>
                            <Card.Body>
                                <Container fluid>
                                    <Row>
                                        <Col xs={8}>Militar</Col>
                                        <Col xs={4} className='text-center'>Ações</Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className='card-header-military card'>
                            <Card.Body>
                                <Container fluid>
                                    <Row>
                                        <Col xs={8}>Militar</Col>
                                        <Col xs={4} className='text-center'>Ações</Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Mostrar militares disponíveis */}
                <Row>
                    {filteredMilitaries.map((row, key) => (
                        <RowLayoffMade key={key} name={row.military} id={row.id} />
                    ))}
                </Row>
            </Container>
        </Container>
    );
}
