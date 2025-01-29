import server_ip from '../config';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from 'axios'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'
import React, { useState } from "react";


function RowMilitar(props) {
    const [subunitOptions, setSubunitOptions] = useState([]);

    // Função para buscar subunidades
    async function fetchSubunitData() {
        const { data } = await axios.get(`${server_ip}/api/subunits/`);
        const results = data.map((value) => ({
            key: value.name,
            value: value.id,
        }));
        setSubunitOptions([
            { key: 'Selecione uma opção', value: '' },
            ...results
        ]);
    }

    // Military subunit change function.
    const changeSubunit = async (id, name) => {
        try {
            const { data } = await axios.get(`${server_ip}/api/subunits/`);

            const subunitOptions = data.reduce((options, subunit) => {
                options[subunit.id] = subunit.name;
                return options;
            }, {});

            const { value: subunitId } = await Swal.fire({
                title: `Alterar Subunidade de ${name}`,
                input: 'select',
                inputOptions: subunitOptions,
                inputPlaceholder: 'Selecione uma subunidade',
                showCancelButton: true,
                confirmButtonColor: '#198754',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Alterar',
                cancelButtonText: 'Cancelar',
            });

            if (!subunitId) return;

            const response = await axios.put(`${server_ip}/api/militaries/${id}/change-subunit`, {
                subunit_id: subunitId,
            });

            Swal.fire({
                icon: 'success',
                text: 'Subunidade alterada com sucesso!',
                confirmButtonColor: '#198754',
            }).then(() => window.location.reload());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Erro ao alterar a subunidade. Tente novamente.',
                confirmButtonColor: '#198754',
            });
        }
    };


    // Military delete function.
    const deleteMilitary = async (id, name) => {
        const isConfirm = await Swal.fire({
            title: 'Excluir militar',
            text: `Você tem certeza que deseja excluir o ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
        }).then((result) => result.isConfirmed);

        if (!isConfirm) return;

        try {
            const { data } = await axios.delete(`${server_ip}/api/militaries/${id}`);
            Swal.fire({
                icon: 'success',
                text: data.message,
                confirmButtonColor: '#198754',
            }).then(() => window.location.reload());
        } catch ({ response: { data } }) {
            Swal.fire({
                text: data.message,
                icon: 'error',
                confirmButtonColor: '#198754',
            });
        }
    };


    return (
        <Col md={6} lg={4} sm={12} xs={12}>
            <Card>
                <Card.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={8} md={8}>{props.name}</Col>
                            <Col xs={4} md={4}>
                                <Row className='justify-content-center'>

                                    <Link to={`/militaries/edit/${props.id}`} className='col btn btn-outline-success'>
                                        Editar
                                    </Link>

                                    <Button className='col btn-outline-danger' onClick={() => deleteMilitary(props.id, props.name)}>
                                        Excluir
                                    </Button>

                                    <Button className='col btn-transfer' onClick={() => changeSubunit(props.id, props.name)}>
                                        Alterar Subunidade
                                    </Button>

                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default RowMilitar;

