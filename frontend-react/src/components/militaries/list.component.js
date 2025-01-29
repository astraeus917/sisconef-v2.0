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
import RowMilitarList from '../layouts/RowMilitarList';


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
        <MilitaryListContent />
    );
}


function MilitaryListContent() {
    const userRole = localStorage.getItem('user_role');
    const [totalMilitaries, setTotalMilitaries] = useState([])
    const [militaries, setMilitaries] = useState([])
    const [width, setWidth] = useState(window.innerWidth);
    const [subunit, setSubunit] = useState("")
    const [subunitOptions, setSubunitOptions] = useState([]);


    async function fetchSubunitData() {
        // Fetch data.
        const { data } = await axios.get(`${server_ip}/api/subunits/`);
        const results = []
        // Store results in the results array.
        data.forEach((value) => {
            results.push({
                key: value.name,
                value: value.id,
            });
        });
        // Update the options state.
        setSubunitOptions([
            { key: 'Todas', value: '' },
            ...results
        ])
    }


    useEffect(() => {
        fetchMilitaries()
        fetchSubunitData()
    }, [])


    const fetchMilitaries = async () => {
        if (userRole === 'Admin') {
            await axios.post(`${server_ip}/api/militaries/list`, { subunit_id: 0 }).then(({ data }) => {
                setMilitaries(data);
                setTotalMilitaries(data);
            })
        } else {
            await axios.post(`${server_ip}/api/militaries/list`, { subunit_id: localStorage.getItem('user_subunit') }).then(({ data }) => {
                setMilitaries(data);
                setTotalMilitaries(data);
            })
        }
    }


    function changeMilitariesSubunit(e) {
        if (e.target.value != "") {
            var result = totalMilitaries.filter(function (obj) {
                return obj.subunit_id == e.target.value
            });
            setMilitaries(result);
        } else {
            setMilitaries(totalMilitaries);
        }

        console.log(result);
    }


    return (
        <Container fluid className='d-grid gap-1 mb-3'>
            <Container fluid>
                <Row className='justify-content-center'>
                    <Col lg={3} sm={6} xs={12} className="mb-3">
                        <Form.Group controlId="Subunit">
                            <Form.Label>Filtrar por Subunidade</Form.Label>
                            <Form.Select onChange={changeMilitariesSubunit}>
                                {subunitOptions.map((option) => {
                                    return (
                                        <option key={option.value} value={option.value}>
                                            {option.key}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className='justify-content-end'>
                    <Col md={3} lg={2} sm={6} xs={6}>
                        <Row>
                            <Link className='btn btn-success' to={"/militaries/create"}>Cadastrar Militar</Link>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <Container fluid>
                <Row>
                    <Col md={6} lg={4} sm={12} xs={12}>
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

                    {width > 550 ?
                        <Col md={6} lg={4} sm={12} xs={12}>
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
                        : null}

                    {width > 550 ?
                        <Col md={6} lg={4} sm={12} xs={12}>
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
                        : null}
                </Row>

                <Row>
                    {
                        militaries.length > 0 && (
                            militaries.map((row, key) => (
                                <RowMilitarList key={key} name={row.military} id={row.id}></RowMilitarList>
                            ))
                        )
                    }
                </Row>
            </Container>
        </Container>
    )
}
