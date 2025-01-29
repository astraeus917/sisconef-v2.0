import server_ip from '../config';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import RowLayoffList from '../layouts/LayoffMilitaryList';


export default function List() {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('user_role');
        const allowedRoles = ['Admin', 'Brigada', 'Sgte'];
        if (!userRole || !allowedRoles.includes(userRole)) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <LayoffListContent />
    );
}

function LayoffListContent() {
    const [militariesLayoff, setMilitariesLayoff] = useState([])


    useEffect(() => {
        fetchMilitariesInLayoff()
    }, [])


    // Search for military personnel registered in the Layoff.
    const fetchMilitariesInLayoff = async () => {
        await axios.post(`${server_ip}/api/layoff/presence`, {
            subunit_id:
                localStorage.getItem('user_subunit')
        }).then(({ data }) => {
            setMilitariesLayoff(data);
        })
    }


    return (
        <Container fluid className='d-grid gap-1 mb-3'>
            <Container fluid>
                <Card className='card card-header-military font-x-large'>
                    <Card.Body className='text-center'>
                        <Row>
                            <Col md={10} xs={12} className="">
                                Militares que possuem férias ou alguma dispensa longa cadastrada.
                            </Col>

                            <Col md={2} lg={2} sm={6} xs={6}>
                                <Link className='btn btn-success layoff-btn' to={"/layoff/presence"}><h6>Cadastrar Férias/Dispensa</h6></Link>
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            <Container fluid>
                <Row>
                    <Col md={12} lg={12} sm={12} xs={12}>
                        <Card className='card-header-military card'>
                            <Card.Body>
                                <Container fluid>
                                    <Row>
                                        <Col xs={3} md={3}>Militar</Col>
                                        <Col xs={2} md={2}>Destino</Col>
                                        <Col xs={2} md={2}>Data de início</Col>
                                        <Col xs={2} md={2}>Data de fim</Col>
                                        <Col xs={3} md={3} className='text-center'>Ações</Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* show total military list in frontend. */}
                <Row>
                    {
                        militariesLayoff.length > 0 && (
                            militariesLayoff.map((row, key) => (
                                <RowLayoffList key={key} name={row.military} id={row.id} layoff_id={row.layoff_id} destination={row.destination} date_start={row.date_start} date_end={row.date_end}></RowLayoffList>
                            ))
                        )
                    }
                </Row>

            </Container>
        </Container>
    )
}