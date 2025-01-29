import server_ip from '../config';
import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate, useParams, Link } from 'react-router-dom'


export default function CreateLayoff() {
  const navigate = useNavigate();


  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const allowedRoles = ['Admin', 'Brigada', 'Sgte'];
    if (!userRole || !allowedRoles.includes(userRole)) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <CreateLayoffContent navigate={navigate} />
  );
}


function CreateLayoffContent({ navigate }) {
  const { id } = useParams()

  const [name, setName] = useState("")
  const [rank, setRank] = useState("")

  const [validationError, setValidationError] = useState({})

  const [destinations, setDestinations] = useState([])
  const [destination, setDestination] = useState("")

  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")


  useEffect(() => {
    fetchDestinations()
    fetchMilitary()
  }, [])


  const fetchMilitary = async () => {
    await axios.get(`${server_ip}/api/militaries/${id}`).then(({ data }) => {
      const { name, rank_name } = data.military
      setName(name)
      setRank(rank_name)
    }).catch(({ response: { data } }) => {
      Swal.fire({
        text: data.message,
        icon: "error",
        confirmButtonColor: '#198754',
      })
    })
  }


  const fetchDestinations = async () => {
    var array = [];
    array.push({
      key: 'Selecione uma opção',
      value: '',
    });
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


  const insertLayoff = async (e) => {
    e.preventDefault();
    const formData = new FormData()

    formData.append('date_start', dateStart);
    formData.append('date_end', dateEnd);
    formData.append('military_id', id);
    formData.append('destination_id', destination);


    await axios.post(`${server_ip}/api/layoffs`, formData).then(({ data }) => {
      Swal.fire({
        icon: "success",
        text: data.message,
        confirmButtonColor: '#198754',
      })
      navigate("/layoff/list")
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

              <Link to={`/layoff/presence`}>
                voltar
              </Link>

              <h4 className="card-warName mt-2">Cadastrar férias ou dispensa longa</h4>
              <hr />

              <h4 className="card-warName mt-2">{rank} {name}</h4>
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

                <Form onSubmit={insertLayoff}>
                  <Row>
                    <Col xs={12} className="mb-3">
                        <Form.Group controlId="dateStart">
                          <Form.Label>Data de início</Form.Label>
                          <Form.Control type="date" value={dateStart} onChange={(event) => {
                            setDateStart(event.target.value);
                          }} />
                        </Form.Group>
                      </Col>

                      <Col xs={12} className="mb-3">
                        <Form.Group controlId="dateEnd">
                          <Form.Label>Data de fim</Form.Label>
                          <Form.Control type="date" value={dateEnd} onChange={(event) => {
                            setDateEnd(event.target.value);
                          }} />
                        </Form.Group>
                      </Col>

                      <Col xs={12} className="mb-3">
                        <Form.Group controlId="destination">
                          <Form.Label>Destino</Form.Label>
                          <Form.Select onChange={(event) => {
                            setDestination(event.target.value)
                          }}>
                            {destinations.map((option) => {
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

                  {/* send form button */}
                  <Row className="justify-content-center">
                    <Button variant="success" className="mt-3 text-center col-4" type="submit">
                      Registrar
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


