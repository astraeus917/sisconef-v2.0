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

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const allowedRoles = ['Admin', 'Brigada', 'Sgte'];
    if (!userRole || !allowedRoles.includes(userRole)) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <LayoffEditContent navigate={navigate} />
  );
}


function LayoffEditContent({ navigate }) {
  const { id } = useParams()

  const [rankName, setRankName] = useState("")
  const [name, setName] = useState("")
  const [layoffId, setLayoffId] = useState("")
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const [destinations, setDestinations] = useState([])
  const [destination, setDestination] = useState("")

  const [validationError, setValidationError] = useState({})


  useEffect(() => {
    fetchMilitary()
    fetchDestinations()
  }, [])


  const fetchMilitary = async () => {
    await axios.get(`${server_ip}/api/layoff/${id}`).then(({ data }) => {
      const { rank_name, military_name, layoff_id, date_start, date_end, destination_id} = data
      setRankName(rank_name)
      setName(military_name)
      setLayoffId(layoff_id)
      setDateStart(date_start)
      setDateEnd(date_end)
      setDestination(destination_id)
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


  const updateLayoff = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('date_start', dateStart);
    formData.append('date_end', dateEnd);
    formData.append('destination_id', destination);
  
    console.log([...formData]);
  
    await axios.post(`${server_ip}/api/layoffs/${layoffId}`, formData).then(({ data }) => {
      Swal.fire({
        icon: "success",
        text: data.message,
        confirmButtonColor: '#198754',
      });
      navigate("/layoff/list");
    }).catch(({ response }) => {
      console.log(response.data);
      if (response.status === 422) {
        setValidationError(response.data.errors);
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
          confirmButtonColor: '#198754',
        });
      }
    });
  }


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">

              <Link to={`/layoff/list`}>
                voltar
              </Link>

              <h4 className="card-warName mt-2">Alterar Férias/Dispensa</h4>
              <hr />

              <h4 className="card-warName mt-2">{rankName} {name}</h4>
              <hr />

              <div className="form-wrapper">
                <Form onSubmit={updateLayoff}>

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
                        <Form.Select value={destination} onChange={(event) => {
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