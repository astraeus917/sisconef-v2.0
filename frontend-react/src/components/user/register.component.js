import server_ip from '../config';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Authentication from '../auth/auth.component';

export default function CreateUser() {
  const navigate = useNavigate();

  useEffect(() => { // Verifique se o usuário tem permissão de administrador
    const userRole = localStorage.getItem('user_role');
    if (!userRole || userRole !== 'Admin') {
      navigate("/"); // Redirecione para a página inicial ou outra página de acesso negado.
    }
  }, [navigate]); // Este array vazio garante que o efeito seja executado apenas uma vez após a montagem inicial do componente.

  return (
    <CreateUserContent navigate={navigate} />
  );
}

function CreateUserContent({ navigate }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [subunit_id, setSubUnitId] = useState("")
  const [role, setRole] = useState("")

  const [subUnits, setSubUnits] = useState([]);

  const [validationError, setValidationError] = useState({})

  const selectedSubunit = (event) => { // Desabilita o placeholder do Select para que apenas opções validas sejam selecionadas.
    setSubUnitId(event.target.value)
    event.target.firstChild.disabled = true;
  };
  const selectedRole = (event) => { // Desabilita o placeholder do Select para que apenas opções validas sejam selecionadas.
    setRole(event.target.value)
    event.target.firstChild.disabled = true;
  };

  useEffect(() => {
    axios.get(`${server_ip}/api/subunits`)
      .then(response => {
        setSubUnits(response.data);
      })
      .catch(error => {
        console.error('Error fetching subunits:', error);
      });
  }, []);

  const createUser = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('username', username)
    formData.append('password', password)
    formData.append('subunit_id', subunit_id)
    formData.append('role', role)

    await axios.post(`${server_ip}/api/users/register`, formData).then(({ data }) => {
      Swal.fire({
        text: data.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      })
      navigate("/militaries/list")
    }).catch(({ response }) => {
      if (response.status === 422) {
        setValidationError(response.data.errors)
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  return (
    <div id="form_div" className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-center">Registrar um novo Usuário</h4>
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
                <Authentication>
                  {(Logout) => (
                    <Form onSubmit={createUser}>
                      <Row>
                        <Col>
                          <Form.Group controlId="Nome">
                            <Form.Label>Usuário</Form.Label>
                            <Form.Control type="text" value={username} onChange={(event) => {
                              setUsername(event.target.value)
                            }} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="my-3">
                        <Col>
                          <Form.Group controlId="Password">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" value={password} onChange={(event) => {
                              setPassword(event.target.value)
                            }} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="my-3">
                        <Col>
                          <Form.Group controlId="Subunit">
                            <Form.Select value={subunit_id} onChange={selectedSubunit}>
                              <option value="">Subunidade:</option> {/* Ajustado para um valor vazio */}
                              {subUnits.map(subUnit => (
                                <option key={subUnit.id} value={subUnit.id}>
                                  {subUnit.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="my-3">
                        <Col>
                          <Form.Group controlId="Role">
                            <Form.Select value={role} onChange={selectedRole}>
                              <option value="">Nível de acesso:</option> {/* Ajustado para um valor vazio */}
                              <option value="Admin">Admin</option>
                              <option value="Brigada">Brigada</option>
                              <option value="Sgte">Sgte</option>
                              <option value="Visitor">Visitor</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button id="SubmitButton" className="mt-2 float-end" size="lg" block="block" type="submit">Registrar</Button>
                    </Form>
                  )}
                </Authentication>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}