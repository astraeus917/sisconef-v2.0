import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Link } from 'react-router-dom';


function RowLayoffMade(props) {
    return (
        <Col md={6} lg={6} sm={6} xs={6}>
            <Card>
                <Card.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={4} md={4}>{props.name}</Col>
                            <Col xs={4} md={4}>{props.destination}</Col>
                            <Col xs={4} md={4}>
                                <Row className='justify-content-center'>
                                    <Link to={`/layoff/create/${props.id}`} className='col btn btn-outline-success'>
                                        Registrar
                                    </Link>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default RowLayoffMade;

