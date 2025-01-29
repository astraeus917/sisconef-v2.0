import server_ip from '../config';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
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

    return (
        <LayoffPresenceContent />
    );
}


function LayoffPresenceContent() {
    const [militaries, setMilitaries] = useState([])
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchMilitariesNotInLayoff()
    }, [])


    const fetchMilitariesNotInLayoff = async () => {
        await axios.post(`${server_ip}/api/layoff/militaries`, {
            subunit_id:
                localStorage.getItem('user_subunit')
        }).then(({ data }) => {
            setMilitaries(data);
        })
    }


    const filteredMilitaries = militaries.filter(military => 
        military.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <Container fluid className='d-grid gap-1 mb-3'>
            <Container fluid>
                <Card className='card card-header-military font-x-large'>
                    <Card.Body className='text-center'>
                        <Row>
                            <Col md={6} lg={6} sm={6} xs={6} className="">
                                <Form>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pesquisar militar pelo nome..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form>
                            </Col>

                            <Col md={4} lg={4} sm={2} xs={2}></Col>
                        
                            <Col md={2} lg={2} sm={4} xs={4}>
                                <Link className='btn btn-success layoff-btn' to={"/layoff/list"}><h6>Militares de Férias/Dispensa</h6></Link>
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            <Container fluid>
                <Row>
                    <Col md={6} lg={6} sm={6} xs={6}>
                        <Card className='card-header-military card'>
                            <Card.Body>
                                <Container fluid>
                                    <Row>
                                        <Col xs={8} md={8}>Militar</Col>
                                        <Col xs={4} md={4} className='text-center'>Ações</Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={6} sm={6} xs={6}>
                        <Card className='card-header-military card'>
                            <Card.Body>
                                <Container fluid>
                                    <Row>
                                        <Col xs={8} md={8}>Militar</Col>
                                        <Col xs={4} md={4} className='text-center'>Ações</Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* show total military list in frontend. */}
                <Row>
                    {
                        filteredMilitaries.length > 0 && (
                            filteredMilitaries.map((row, key) => (
                                <RowLayoffMade key={key} name={row.military} id={row.id}></RowLayoffMade>
                            ))
                        )
                    }
                </Row>
            </Container>
        </Container>
    )
}