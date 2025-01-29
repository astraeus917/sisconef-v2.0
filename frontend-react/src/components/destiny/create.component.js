import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom'

export default function CreateDestiny() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    if (!userRole || userRole !== 'Admin') {
      navigate("/");
    }
  }, [navigate]);

  return (
    <CreateDestinyContent navigate={navigate} />
  );
}

function CreateDestinyContent({ navigate }) {
  const [validationError, setValidationError] = useState({})

  const [destination, setDestination] = useState("")

  const createDestiny = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('destination', destination.toUpperCase());

    await axios.post(`http://localhost:8000/api/destinations`, formData).then(({ data }) => {
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

              <h4 className="card-warName mt-2">Cadastrar novo destino</h4>
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

                <Form onSubmit={createDestiny}>
                  <Row>
                    <Col xs={12} className="mb-3">
                      <Form.Group controlId="Destination">
                        <Form.Label>Nome do destino</Form.Label>
                        <Form.Control type="text" value={destination} onChange={(event) => {
                          setDestination(event.target.value);
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="justify-content-center">
                    <Button variant="success" className="mt-3 text-center col-4" type="submit">
                      Cadastrar
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