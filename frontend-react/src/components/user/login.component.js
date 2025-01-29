import server_ip from '../config';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function LoginUser() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [validationError, setValidationError] = useState({})

  const loginUser = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('username', username)
    formData.append('password', password)

    try {
      const response = await axios.post(`${server_ip}/api/users/login`, formData)
      const { data } = response;


      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_role', data.user_role);
      localStorage.setItem('user_subunit', data.user_subunit);


      if (data.message === 'success') {
        Swal.fire({
          text: 'Acesso autorizado!',
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        })
        switch (data.user_role) {
          case 'Sgte':
            navigate("/militaries/presence")
            break;

          case 'Visitor':
            navigate("/militaries/report")
            break;

          default:
            navigate("/militaries/presence")
            break;
        }
      } else if (data.message === 'nouser') {
        Swal.fire({
          title: 'Usuário não encontrado!',
          text: 'Solicite um acesso à equipe de Assessoria de Gestão.',
          icon: "error",
          showConfirmButton: false,
          timer: 3500
        })
        navigate("/")
      } else {
        Swal.fire({
          text: 'Nome de usuário ou senha inválidos!',
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch ({ response }) {
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
    }
  }

  const ResetPassword = () => {
    Swal.fire({
      title: 'Redefinir senha',
      text: 'Para redefinir sua senha, por favor entre em contato com a equipe de Assessoria de Gestão.',
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }

  return (
    <div id="form_div" className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
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
                <Form onSubmit={loginUser}>
                  <Row>
                    <Col className="text-center" md={12} lg={12} sm={12} xs={12}>
                      <img height={50} src={`${server_ip}/storage/logo.png`} alt="Logo" />
                    </Col>
                    <Col className="text-center" md={12} lg={12} sm={12} xs={12}>
                      <h4 className="card-title text-center">SISCONEF</h4>
                    </Col>
                  </Row>

                  <hr />

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

                  <Button id="SubmitButton" className="float-end" size="lg" block="block" type="submit">Acessar</Button>
                  <Button id="InfoButton" className="mt-1" size="sm" block="block" onClick={ResetPassword}>Esqueci meus dados de acesso</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}