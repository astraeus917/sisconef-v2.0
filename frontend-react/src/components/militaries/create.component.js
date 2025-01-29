import server_ip from '../config';
import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom'


export default function CreateMilitary() {
  const navigate = useNavigate();


  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const allowedRoles = ['Admin', 'Brigada', 'Sgte'];
    if (!userRole || !allowedRoles.includes(userRole)) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <CreateMilitaryContent navigate={navigate} />
  );
}


function CreateMilitaryContent({ navigate }) {
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [rank, setRank] = useState("")
  const [rankOptions, setRankOptions] = useState([]);


  async function fetchRankData() {
    // Fetch data.
    const { data } = await axios.get(`${server_ip}/api/ranks/`);
    const results = []
    // Store results in the results array.
    data.forEach((value) => {
      results.push({
        key: value.name,
        value: value.id,
      });
    });
    // Update the options state.
    setRankOptions([
      { key: 'Selecione uma opção', value: '' },
      ...results
    ])
  }


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
      { key: 'Selecione uma opção', value: '' },
      ...results
    ])
  }


  const [workplace, setWorkplace] = useState("")
  const [workplaceOptions, setWorkplaceOptions] = useState([]);


  async function fetchWorkplaceData() {
    // Fetch data.
    const { data } = await axios.get(`${server_ip}/api/workplaces/`);
    const results = []
    // Store results in the results array.
    data.forEach((value) => {
      results.push({
        key: value.workplace,
        value: value.id,
      });
    });
    // Update the options state.
    setWorkplaceOptions([
      { key: 'Selecione uma opção', value: '' },
      ...results
    ])
  }


  useEffect(() => {
    fetchRankData();
    fetchSubunitData();
    fetchWorkplaceData();
  }, []);


  const [validationError, setValidationError] = useState({})


  // const createMilitary = async (e) => {
  //   e.preventDefault();


  //   const formData = new FormData()


  //   formData.append('name', name.toUpperCase());
  //   formData.append('rank_id', rank);
  //   formData.append('subunit_id', subunit);
  //   formData.append('number', number);
  //   formData.append('workplace_id', workplace);


  //   await axios.post(`${server_ip}/api/militaries`, formData).then(({ data }) => {
  //     Swal.fire({
  //       icon: "success",
  //       text: data.message,
  //       confirmButtonColor: '#198754',
  //     })
  //     navigate("/militaries/list")
  //   }).catch(({ response }) => {
  //     if (response.status === 422) {
  //       setValidationError(response.data.errors)
  //     } else {
  //       Swal.fire({
  //         text: response.data.message,
  //         icon: "error",
  //         confirmButtonColor: '#198754',
  //       })
  //     }
  //   })
  // }

  const createMilitary = async (e) => {
      e.preventDefault();

      const militaryData = {
          name: name.toUpperCase(),
          rank_id: rank,
          subunit_id: subunit,
          number: number,
          workplace_id: workplace,
      };

      try {
          const { data } = await axios.post(`${server_ip}/api/militaries`, militaryData, {
              headers: {
                  'Content-Type': 'application/json',
              }
          });

          if (data.message === 'O militar já está registrado!') {
              Swal.fire({
                  icon: "warning",
                  title: data.message,
                  html: `
                      <p><strong>${data.rank} ${data.name},</strong> <strong>Subunidade:</strong> ${data.subunit}</p>
                  `,
                  showConfirmButton: false,
                  timer: 4000
              });
          } else {
              Swal.fire({
                  icon: "success",
                  text: data.message,
                  confirmButtonColor: '#198754',
              });
              navigate("/militaries/list");
          }
      } catch (error) {
          if (error.response && error.response.status === 422) {
              const responseData = error.response.data;
              Swal.fire({
                  icon: "warning",
                  text: responseData.message || "Erro de validação!",
                  confirmButtonColor: '#ffc107',
              });
          } else {
              Swal.fire({
                  icon: "error",
                  text: "Erro ao processar a solicitação. Tente novamente mais tarde.",
                  confirmButtonColor: '#198754',
              });
          }
      }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">

              <Link to={`/militaries/list`}>
                voltar
              </Link>

              <h4 className="card-warName mt-2">Cadastrar Militar</h4>
              <hr />

              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value]) => (
                                <li key={key}>{value}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }

                <Form onSubmit={createMilitary}>
                  <Row>
                    <Col xs={6} className="mb-3">
                      <Form.Group controlId="Rank">
                        <Form.Label>Posto/Graduação</Form.Label>
                        <Form.Select onChange={(event) => {
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
                      <Form.Group controlId="Number">
                        <Form.Label>Número</Form.Label>
                        <Form.Control type="number" value={number} onChange={(event) => {
                          setNumber(event.target.value);
                        }} />
                      </Form.Group>
                    </Col>

                    <Col xs={12} className="mb-3">
                      <Form.Group controlId="Name">
                        <Form.Label>Nome de Guerra</Form.Label>
                        <Form.Control type="text" value={name} onChange={(event) => {
                          setName(event.target.value);
                        }} />
                      </Form.Group>
                    </Col>

                    <Col xs={6} className="mb-3">
                      <Form.Group controlId="Subunit">
                        <Form.Label>Subunidade</Form.Label>
                        <Form.Select onChange={(event) => {
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
                        <Form.Label>Sessão</Form.Label>
                        <Form.Select onChange={(event) => {
                          setWorkplace(event.target.value)
                        }} required>
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