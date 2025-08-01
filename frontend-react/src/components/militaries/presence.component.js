import server_ip from '../config';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Authentication from '../auth/auth.component';
import RowMilitar from '../layouts/RowMilitar';
import RowMilitarMade from '../layouts/RowMilitarMade';


export default function Presence() {
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState({})
    const [width, setWidth] = useState(window.innerWidth);

    const [militaries, setMilitaries] = useState([])
    const [profissionalStaff, setProfissionalStaff] = useState([])
    const [variableStaff, setVariableStaff] = useState([])
    const [sargents, setSargents] = useState([])
    const [officials, setOfficials] = useState([])

    const [destinations, setDestinations] = useState([])
    const [destination, setDestination] = useState('PRONTO')

    const [layoffs, setLayoffs] = useState([])

    // Militaries with presence.
    const [militariesPresenceMade, setMilitariesPresenceMade] = useState([])
    const [variableStaffPresenceMade, setVariableStaffPresenceMade] = useState([])
    const [profissionalStaffPresenceMade, setProfissionalStaffPresenceMade] = useState([])
    const [sargentsPresenceMade, setSargentsPresenceMade] = useState([])
    const [officialsPresenceMade, setOfficialsPresenceMade] = useState([])

    // Registers a key in localStorage to identify that the current user has completed the absence printouts.
    const userKey = `${navigator.platform}_${localStorage.getItem('user_id') || 'defaultUser'}`;
    const today = moment().format('YYYY-MM-DD');

    useEffect(() => {
        fetchLayoffs();
        checkDeadline();
        fetchMilitaries();
        fetchMilitariesPresenceMade();
    }, [])


    useEffect(() => {
        // Check that there are no localStorage records that the user has already submitted.
        const storedData = localStorage.getItem(`formStatus_${userKey}`);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.date === today) {
                setIsButtonDisabled(true);
            }
        }
        fetchVariableStaff();
        fetchProfissionalStaff();
        fetchSargents();
        fetchOfficials();
        fetchDestinations();
    }, [militaries]);


    function checkDeadline() {
        if (localStorage.getItem('user_role') != 'Admin') {
            let date = new Date();
            let currentHour = date.getHours();

            if (currentHour > 17) {
                Swal.fire({
                    icon: "error",
                    text: 'O tempo limite de tiragem de faltas foi excedido',
                    confirmButtonColor: '#198754',
                }).then((result) => navigate('/militaries/list'))
            }
        }
    }


    const fetchLayoffs = async () => {
        await axios.post(`${server_ip}/api/layoff/presence`, {
            subunit_id:
                localStorage.getItem('user_subunit')
        }).then(({ data }) => {
            setLayoffs(data);

            data.forEach((value) => {
                var item = {
                    id: value.id,
                    destination: value.destination,
                };
                if(presenceMilitaries.findIndex(i => i.id === item.id) === -1){
                    presenceMilitaries.push({
                        id: value.id,
                        destination: value.destination,
                    });
                }
            });
        })
        console.log(layoffs);        
    }


    const fetchDestinations = async () => {
        var array = [];
        await axios.get(`${server_ip}/api/destinations`).then(({ data }) => {
            {
                data.forEach((value) => {
                    array.push({
                        key: value.destination,
                        value: value.id,
                    });
                });
            }
        })
        setDestinations(array);
    }

    // const fetchDestinations = async () => {
    //     var array = [];
    //     await axios.get(`${server_ip}/api/destinations`).then(({ data }) => {
    //         // Filter the destinations by removing the one named 'FÉRIAS'.
    //         const filteredData = data.filter((value) => value.destination !== 'FÉRIAS');
    //         // Maps the remaining destinations to the desired format.
    //         filteredData.forEach((value) => {
    //             array.push({
    //                 key: value.destination,
    //                 value: value.id,
    //             });
    //         });
    //     })
    //     setDestinations(array);
    // }


    const fetchMilitaries = async () => {
        await axios.post(`${server_ip}/api/presence/militaries`, {
            subunit_id:
                localStorage.getItem('user_subunit')
        }).then(({ data }) => {
            setMilitaries(data);
        })
    }


    const fetchMilitariesPresenceMade = async () => {
        await axios.post(`${server_ip}/api/presence-made/militaries`, {
            subunit_id:
                localStorage.getItem('user_subunit')
        }).then(({ data }) => {
            setMilitariesPresenceMade(data);
        })
    }


    function fetchVariableStaff() {
        var result = militaries.filter(function (obj) {
            return obj.rankName === 'Sd EV'
        });
        var presence = militariesPresenceMade.filter(function (obj) {
            return obj.rankName === 'Sd EV'
        });
        setVariableStaff(result);
        setVariableStaffPresenceMade(presence);
    }


    function fetchProfissionalStaff() {
        var result = militaries.filter(function (obj) {
            return obj.rankName === 'Cb' || obj.rankName === 'Sd EP' || obj.rankName === 'Sd EP Reint'  || obj.rankName === 'Sd Adido'
        });
        var presence = militariesPresenceMade.filter(function (obj) {
            return obj.rankName === 'Cb' || obj.rankName === 'Sd EP' || obj.rankName === 'Sd EP Reint' || obj.rankName === 'Sd Adido'
        });
        setProfissionalStaff(result);
        setProfissionalStaffPresenceMade(presence);
    }


    function fetchSargents() {
        var rankSargents = ['ST', '1º Sgt', '2º Sgt', '3º Sgt', '3º Sgt Reint']
        var result = militaries.filter(function (obj) {
            return undefined !== rankSargents.find((el) => el === obj.rankName);
        });
        var presence = militariesPresenceMade.filter(function (obj) {
            return undefined !== rankSargents.find((el) => el === obj.rankName);
        });
        setSargents(result);
        setSargentsPresenceMade(presence);
    }


    function fetchOfficials() {
        var rankOfficials = ['Cel', 'TC', 'Maj', 'Cap', 'Cap PTTC', '1º Ten', '2º Ten', '2º Ten Reint', 'Asp Of'];
        var result = militaries.filter(function (obj) {
            return undefined !== rankOfficials.find((el) => el === obj.rankName);
        });
        var presence = militariesPresenceMade.filter(function (obj) {
            return undefined !== rankOfficials.find((el) => el === obj.rankName);
        })
        setOfficials(result);
        setOfficialsPresenceMade(presence);
    }


    const changeIdPresence = (id) => {
        changePresenceMilitaries(id);
    }


    const [presenceMilitaries, setPresenceMilitaries] = useState([])

    const changePresenceMilitaries = (id) => {
        var array = presenceMilitaries;
        var item = { id: id, destination: destination };
        if (array.findIndex(i => i.id === item.id) === -1) {
            array.push(item);
        } else {
            array.splice(array.findIndex(i => i.id === item.id), 1);
        }
        setPresenceMilitaries(array);
        console.log(presenceMilitaries);
    };


    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const insertPresences = async (e) => {
        e.preventDefault();

        if (presenceMilitaries.length == militaries.length){

        // if (presenceMilitaries.length >= 1) {

            const formData = new FormData()

            formData.append('presences', JSON.stringify(presenceMilitaries));

            setIsButtonDisabled(true); // disable button and send.

            try {
                const { data } = await axios.post(`${server_ip}/api/presences/insert`, formData);

                Swal.fire({
                    icon: "success",
                    text: data.message,
                    confirmButtonColor: '#198754',
                }).then((result) => {
                    fetchMilitaries();
                     // update after 10s.
                    setTimeout(() => {
                        setIsButtonDisabled(false); // enable after 10s.
                    }, 10000);
                    
                    // Armazena no localStorage que o formulário foi finalizado hoje
                    localStorage.setItem(
                        `formStatus_${userKey}`,
                        JSON.stringify({ date: today })
                    );
                }).then((result) => window.location.reload());
            } catch (error) {
                const response = error.response;
                if (response?.status === 422) {
                    setValidationError(response.data.errors);
                } else {
                    Swal.fire({
                        text: response?.data?.message || 'Ocorreu um erro inesperado.',
                        icon: "error",
                        confirmButtonColor: '#198754',
                    });
                }
                setIsButtonDisabled(false); // Reabilita o botão em caso de erro
            }
        } else {
            Swal.fire({
                text: 'Erro! Defina o destino de todos os militares e tente novamente!',
                icon: "error",
                confirmButtonColor: '#198754',
            });
        }
    };


    return (
        <Authentication>
            {(Logout, userRole) => (
                <Container fluid className='d-grid gap-2'>
                    <Form onSubmit={insertPresences}>
                        <Card className='card card-header-military font-x-large'>
                            <Card.Body className='text-center'>
                                <Row>
                                    <Col md={6} xs={12} className="">
                                        Mapa da força do dia {moment(new Date()).format("DD/MM/YYYY")}
                                    </Col>

                                    <Col md={6} xs={12} className="">
                                        <Form.Group controlId="Destination">
                                            <Row>
                                                <Col md={4} xs={12}>
                                                    <Form.Label className="text-right">Selecione o Destino</Form.Label>
                                                </Col>
                                                
                                                <Col md={8} xs={12}>
                                                    <Form.Select className='text-center btn btn-success font-x-large' value={destination} onChange={(event) => {
                                                        setDestination(event.target.value)
                                                    }}>
                                                        {destinations
                                                        .map((option) => {
                                                            return (
                                                                <option key={option.key} value={option.key}>
                                                                    {option.key}
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Tabs lg={12} defaultActiveKey="Of" id="justify-tab-example" className="mb-3" justify>
                            <Tab eventKey="Of" title="Of">
                                <Container fluid>
                                    <Row>
                                        <Col md={6} lg={4} sm={12} xs={12}>
                                            <Card className='card-header-military card'>
                                                <Card.Body>
                                                    <Container fluid>
                                                        <Row>
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
                                                        </Row>
                                                    </Container>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        : null}
                                    </Row>

                                    <Row>
                                        {
                                            officials.length > 0 && (
                                                officials.map((row, key) => (
                                                    <RowMilitar key={key} name={row.military} id={row.id} changeIdPresence={changeIdPresence}
                                                        destinations={destinations} destination={destination} layoffDestination={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : layoffs[layoffs.findIndex(i => i.id === row.id)].destination} 
                                                        checked={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : true}></RowMilitar>
                                                ))
                                            )
                                        }
                                    </Row>

                                    <Row> {/* Oficiais com faltas tirada. */}
                                        {
                                            officialsPresenceMade.length > 0 && (
                                                officialsPresenceMade.map((row, key) => (
                                                    <RowMilitarMade key={key} name={row.military} id={row.presenceId} destination={row.destination} variantButton={'success'} destinations={destinations}></RowMilitarMade>
                                                ))
                                            )
                                        }
                                    </Row>
                                </Container>
                            </Tab>

                            <Tab eventKey="Sgt" title="ST/Sgt">
                                <Container fluid>
                                    <Row>
                                        <Col md={6} lg={4} sm={12} xs={12}>
                                            <Card className='card-header-military card'>
                                                <Card.Body>
                                                    <Container fluid>
                                                        <Row>
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
                                                        </Row>
                                                    </Container>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        : null}
                                    </Row>

                                    <Row>
                                        {
                                            sargents.length > 0 && (
                                                sargents.map((row, key) => (
                                                    <RowMilitar key={key} name={row.military} id={row.id} changeIdPresence={changeIdPresence}
                                                        destinations={destinations} destination={destination} layoffDestination={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : layoffs[layoffs.findIndex(i => i.id === row.id)].destination}
                                                        checked={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : true}></RowMilitar>))
                                            )
                                        }
                                    </Row>

                                    <Row> {/* Sargentos com faltas tirada. */}
                                        {
                                            sargentsPresenceMade.length > 0 && (
                                                sargentsPresenceMade.map((row, key) => (
                                                    <RowMilitarMade key={key} name={row.military} id={row.presenceId} destination={row.destination} variantButton={'success'} destinations={destinations}></RowMilitarMade>
                                                ))
                                            )
                                        }
                                    </Row>
                                </Container>
                            </Tab>

                            <Tab eventKey="EP" title="EP">
                                <Container fluid>
                                    <Row>
                                        <Col md={6} lg={4} sm={12} xs={12}>
                                            <Card className='card-header-military card'>
                                                <Card.Body>
                                                    <Container fluid>
                                                        <Row>
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                                <Col xs={6} md={7}>Militar</Col>
                                                                <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                                <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                                <Col xs={6} md={7}>Militar</Col>
                                                                <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                                <Col xs={3} md={3} className='text-center'>Destino</Col>
                                                            </Row>
                                                        </Container>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            : null}
                                    </Row>

                                    <Row>
                                        {
                                            profissionalStaff.length > 0 && (
                                                profissionalStaff.map((row, key) => (
                                                    <RowMilitar key={key} name={row.military} id={row.id} changeIdPresence={changeIdPresence}
                                                        destinations={destinations} destination={destination} layoffDestination={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : layoffs[layoffs.findIndex(i => i.id === row.id)].destination} 
                                                        checked={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : true}></RowMilitar>
                                                ))
                                            )
                                        }
                                    </Row>

                                    <Row> {/* EPs com faltas tirada. */}
                                        {
                                            profissionalStaffPresenceMade.length > 0 && (
                                                profissionalStaffPresenceMade.map((row, key) => (
                                                    <RowMilitarMade key={key} name={row.military} id={row.presenceId} destination={row.destination} variantButton={'success'} destinations={destinations}></RowMilitarMade>
                                                ))
                                            )
                                        }
                                    </Row>
                                </Container>
                            </Tab>

                            <Tab eventKey="EV" title="EV">
                                <Container fluid>
                                    <Row>
                                        <Col md={6} lg={4} sm={12} xs={12}>
                                            <Card className='card-header-military card'>
                                                <Card.Body>
                                                    <Container fluid>
                                                        <Row>
                                                            <Col xs={6} md={7}>Militar</Col>
                                                            <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                            <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                                <Col xs={6} md={7}>Militar</Col>
                                                                <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                                <Col xs={3} md={3} className='text-center'>Destino</Col>
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
                                                                <Col xs={6} md={7}>Militar</Col>
                                                                <Col xs={3} md={2} className='text-center'>Pronto</Col>
                                                                <Col xs={3} md={3} className='text-center'>Destino</Col>
                                                            </Row>
                                                        </Container>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            : null}
                                    </Row>

                                    <Row>
                                        {
                                            variableStaff.length > 0 && (
                                                variableStaff.map((row, key) => (
                                                    <RowMilitar key={key} name={row.military} id={row.id} changeIdPresence={changeIdPresence}
                                                        destinations={destinations} destination={destination} layoffDestination={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : layoffs[layoffs.findIndex(i => i.id === row.id)].destination} 
                                                        checked={(layoffs.findIndex(i => i.id === row.id) === -1) ? false : true}></RowMilitar>
                                                ))
                                            )
                                        }
                                    </Row>

                                    <Row> {/* EVs com faltas tirada. */}
                                        {
                                            variableStaffPresenceMade.length > 0 && (
                                                variableStaffPresenceMade.map((row, key) => (
                                                    <RowMilitarMade key={key} name={row.military} id={row.presenceId} destination={row.destination} variantButton={'success'} destinations={destinations}></RowMilitarMade>
                                                ))
                                            )
                                        }
                                    </Row>
                                </Container>
                            </Tab>
                        </Tabs>

                        <Row className='justify-content-center'>
                            <Button
                                className='mt-3 col-10 col-lg-4'
                                variant="success"
                                type="submit"
                                disabled={isButtonDisabled} // disable button.
                            >
                                {isButtonDisabled ? 'Tiragem de faltas finalizada...' : 'FINALIZAR PREENCHIMENTO'}
                            </Button>
                        </Row>
                    </Form>
                </Container>
            )}
        </Authentication>
    )
}
