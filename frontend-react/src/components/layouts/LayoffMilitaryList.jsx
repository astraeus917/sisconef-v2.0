import server_ip from '../config';
import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';


function RowLayoffList(props) {
    const [destinationId, setDestinationId] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
        fetchDestinations();
    }, []);


    const fetchDestinations = async () => {
        try {
            const { data } = await axios.get(`${server_ip}/api/destinations`);
            const destination = data.find(value => value.destination === 'PRONTO');
            setDestinationId(destination ? destination.id : null);
        } catch (error) {
            console.error("Erro ao buscar destinos:", error);
            Swal.fire({
                text: "Erro ao buscar destinos. Tente novamente mais tarde.",
                icon: "error",
                confirmButtonColor: '#dc3545',
            });
        }
    };


    const deleteLayoff = async (name) => {
        const layoffId = props.layoff_id;


        const isConfirm = await Swal.fire({
            title: 'Excluir Férias/Dispensa',
            text: "Você tem certeza que deseja excluir esse registro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            return result.isConfirmed;
        });

        if (!isConfirm) {
            return;
        }


        await axios.delete(`${server_ip}/api/layoffs/${layoffId}`).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message,
                confirmButtonColor: '#198754',
            }).then((result) => window.location.reload());
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error",
                confirmButtonColor: '#198754',
            })
        })
    }


    // Condition to disable buttons, prevents the user from using the buttons before the necessary requests are made.
    // To avoid a large number of requests to the database.
    const isButtonDisabled = isUpdated || destinationId === null;


    return (
        <Col md={12}>
            <Card>
                <Card.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={3}>{props.name}</Col>
                            <Col xs={2}>{props.destination}</Col>
                            <Col xs={2}>{props.date_start}</Col>
                            <Col xs={2}>{props.date_end}</Col>
                            <Col xs={3}>
                                <Row className='justify-content-center'>
                                    <Button 
                                        className='col btn-outline-danger' 
                                        onClick={async () => {
                                            await deleteLayoff();
                                            await new Promise(resolve => setTimeout(resolve, 2000));
                                        }}
                                        disabled={isButtonDisabled}
                                    >
                                        Excluir
                                    </Button>

                                    <Link 
                                        to={`/layoff/edit/${props.layoff_id}`}
                                        className={`col btn btn-outline-success ${isButtonDisabled ? 'disabled' : ''}`}
                                        onClick={(e) => {
                                            if (isButtonDisabled) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Editar
                                    </Link>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default RowLayoffList;

