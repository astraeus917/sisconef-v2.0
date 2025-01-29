import server_ip from "../config";
import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom'


function RowMilitarMade(props) {
  const [destinations, setDestinations] = useState(props.destinations);
  const date = new Date();


  useEffect(() => {
    setDestinations(props.destinations);
  }, []);


  const location = useLocation();
  const navigate = useNavigate();


  const alertOptions = async (name) => {
    const inputOptions = {};
    destinations.forEach((e) => (inputOptions[e.value] = e.key));
    let valueSelected;

    const { value: destination } = await Swal.fire({
      title: `Deseja alterar o destino do \n ${name}? \n Selecione o novo destino`,
      input: "select",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      confirmButtonText: `Concluir Alteração`,
      cancelButtonText: `Cancelar`,
      inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return "Você precisa selecionar um destino!";
        } else {
          valueSelected = value;
        }
      },
    });
    if (destination) {
      const formData = new FormData();
      formData.append("_method", "PATCH");
      formData.append("destination_id", destination);


      // Update military presence in the datebase.
      await axios
        .post(`${server_ip}/api/presences/${props.id}`, formData)
        .then(({ data }) => {
          Swal.fire({
            title: `O destino do \n ${name} \n foi definido como ${inputOptions[valueSelected]}`,
            confirmButtonColor: "#198754",
          }).then(
            () => window.location.reload(false)
          );
        })
        .catch(({ response }) => {
          Swal.fire({
            text: response.data.message,
            icon: "error",
            confirmButtonColor: "#198754",
          });
        });
    }
  };


  return (
    <Col md={6} lg={4} sm={12} xs={12}>
      <Card>
        <Card.Body>
          <Container fluid>
            <Row>

              <Col xs={8} md={8}>
                {props.name}
              </Col>

              <Col xs={4} md={4}>
                <Row>
                  <Button
                    disabled={true}
                    id={props.id}
                    variant={props.variantButton}
                  >
                    {props.destination}
                  </Button>

                  { date.getHours() <= 15 &&
                        <Button
                        disabled={false}
                        onClick={() => alertOptions(props.name)}
                        id={props.id}
                        variant={props.variantButton}
                    >Alterar Destino</Button>
                  }

                </Row>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RowMilitarMade;


