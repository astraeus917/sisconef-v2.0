import server_ip from '../config';
import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditUser() {
  const navigate = useNavigate();

  useEffect(() => { // Verifique se o usuário tem permissão de administrador
    const userRole = localStorage.getItem('user_role');
    const allowedRoles = ['Admin', 'Brigada', 'Sgte'];
    if (!userRole || !allowedRoles.includes(userRole)) {
      navigate("/"); // Redirecione para a página inicial ou outra página de acesso negado.
    }
  }, [navigate]); // Este array vazio garante que o efeito seja executado apenas uma vez após a montagem inicial do componente.

  return (
    <MilitaryEditContent navigate={navigate} />
  );
}

function MilitaryEditContent({ navigate }) {
  const { id } = useParams()

  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [subunit, setSubunit] = useState("")
  const [rank, setRank] = useState("")
  const [validationError, setValidationError] = useState({})

  const [workplace, setWorkplace] = useState("")
  const [workplaceOptions, setWorkplaceOptions] = useState([]);

  async function fetchWorkplaceData() {
    // Fetch data
    const { data } = await axios.get(`${server_ip}/api/workplaces/`);
    const results = []
    // Store results in the results array
    data.forEach((value) => {
      results.push({
        key: value.workplace,
        value: value.id,
      });
    });
    // Update the options state
    setWorkplaceOptions([
      { key: 'Selecione uma opção', value: '' },
      ...results
    ])
  }

  const [rankOptions, setRankOptions] = useState([]);
  async function fetchRankData() {
    // Fetch data
    const { data } = await axios.get(`${server_ip}/api/ranks/`);
    const results = []
    // Store results in the results array
    data.forEach((value) => {
      results.push({
        key: value.name,
        value: value.id,
      });
    });
    // Update the options state
    setRankOptions([
      { key: 'Selecione uma opção', value: '' },
      ...results
    ])
  }

  const [subunitOptions, setSubunitOptions] = useState([]);
  async function fetchSubunitData() {
    // Fetch data
    const { data } = await axios.get(`${server_ip}/api/subunits/`);
    const results = []
    // Store results in the results array
    data.forEach((value) => {
      results.push({
        key: value.name,
        value: value.id,
      });
    });
    // Update the options state
    setSubunitOptions([
      { key: 'Selecione uma opção', value: '' },
      ...results
    ])
  }

  useEffect(() => {
    fetchMilitary()
    fetchRankData()
    fetchSubunitData();
    fetchWorkplaceData();
  }, [])

  const fetchMilitary = async () => {
    await axios.get(`${server_ip}/api/militaries/${id}`).then(({ data }) => {
      const { name, number, subunit_id, rank_id, workplace_id } = data.military
      setName(name)
      setNumber(number)
      setSubunit(subunit_id)
      setRank(rank_id)
      setWorkplace(workplace_id)
    }).catch(({ response: { data } }) => {
      Swal.fire({
        text: data.message,
        icon: "error",
        confirmButtonColor: '#198754',
      })
    })
  }

  const updateMilitary = async (e) => {
    e.preventDefault();
    console.log(number);
    const formData = new FormData()
    formData.append('_method', 'PATCH');
    formData.append('name', name)
    if (number != null)
      formData.append('number', number)
    formData.append('rank_id', rank)
    formData.append('subunit_id', subunit)
    formData.append('workplace_id', workplace)

    await axios.post(`${server_ip}/api/militaries/${id}`, formData).then(({ data }) => {
      Swal.fire({
        icon: "success",
        text: data.message,
        confirmButtonColor: '#198754',
      })
      navigate("/militaries/list")
    }).catch(({ response }) => {
      if (response.status === 422) {
        setValidationError(response.data.errors)
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
          confirmButtonColor: '#198754',
        })
      }
    })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">

              <Link to={`/militaries/list`}>
                voltar
              </Link>

              <h4 className="card-warName mt-2">Editar Militar</h4>
              <hr />
              <div className="form-wrapper">
                <Form onSubmit={updateMilitary}>
                  <Row>
                    <Col xs={6} className="mb-3">
                      <Form.Group controlId="Rank">
                        <Form.Label>Posto/Graduação</Form.Label>
                        <Form.Select required value={rank} onChange={(event) => {
                          setRank(event.target.value)
                        }}>
                          {rankOptions.map((option) => {
                            return (
                              <option key={option.value} value={option.value}>
                                {option.key}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col xs={6} className="mb-3">
                      <Form.Group controlId="Name">
                        <Form.Label>Número</Form.Label>
                        <Form.Control type="number" value={(number === null) ? "" : number} onChange={(event) => {
                          setNumber(event.target.value);
                        }} />
                      </Form.Group>
                    </Col>

                    <Col xs={12} className="mb-3">
                      <Form.Group controlId="Name">
                        <Form.Label>Nome de Guerra</Form.Label>
                        <Form.Control required type="text" value={name} onChange={(event) => {
                          setName(event.target.value);
                        }} />
                      </Form.Group>
                    </Col>

                    <Col xs={6} className="mb-3">
                      <Form.Group controlId="Subunit">
                        <Form.Label>Subunidade</Form.Label>
                        <Form.Select required value={subunit} onChange={(event) => {
                          setSubunit(event.target.value)
                        }}>
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

                    <Col xs={6} className="mb-3">
                      <Form.Group controlId="Workplace">
                        <Form.Label>Seção</Form.Label>
                        <Form.Select required value={workplace} onChange={(event) => {
                          setWorkplace(event.target.value)
                        }}>
                          {workplaceOptions.map((option) => {
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

                  <Row className="justify-content-center">
                    <Button variant="success" className="mt-3 text-center col-4" type="submit">
                      Salvar
                    </Button>
                  </Row>

                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

