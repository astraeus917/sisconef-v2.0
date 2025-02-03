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
    <UserEditContent navigate={navigate} />
  );
}

function UserEditContent({ navigate }) {
  const { id } = useParams()

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [subunit, setSubunit] = useState("")
  const [validationError, setValidationError] = useState({})

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
    fetchUser()
    fetchSubunitData();
  }, [])

  const fetchUser = async () => {
    await axios.get(`${server_ip}/api/militaries/${id}`).then(({ data }) => {
      const { name, role, subunit_id } = data.military
      setName(name)
      setRole(role)
      setSubunit(subunit_id)
    }).catch(({ response: { data } }) => {
      Swal.fire({
        text: data.message,
        icon: "error",
        confirmButtonColor: '#198754',
      })
    })
  }

  const updateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData()

    formData.append('_method', 'PATCH');
    formData.append('name', name)
    formData.append('role_id', role)
    formData.append('subunit_id', subunit)

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

              <Link to={`/admin`}>
                voltar
              </Link>

              <h4 className="card-warName mt-2">Editar Usuário</h4>
              <hr />
              <div className="form-wrapper">
                <Form onSubmit={updateUser}>
                  <Row>

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

