import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';


function RowMilitar(props) {
    const [checked, setChecked] = useState(props.checked);
    const [destination, setDestination] = useState(props.destination);


    useEffect(() => {
        if(props.layoffDestination !== false){
            setDestination(props.layoffDestination);
        }
    }, [])


    const handleChange = (event) => {    
    setChecked(event.currentTarget.checked);
    setDestination(props.destination);
    }


    return (
        <Col md={6} lg={4} sm={12} xs={12}>
            <Card>
                <Card.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={6} md={7}>{props.name}</Col>

                            <Col xs={3} md={2} className="justify-content-center">
                                <Row className="justify-content-md-center text-center">
                                <Form.Check type={'checkbox'}>
                                    <Form.Check.Input onClick={()=> props.changeIdPresence(props.id)} onChange={handleChange} type={'checkbox'} isValid checked={checked}/>
                                </Form.Check>
                                </Row>
                            </Col>

                            <Col xs={3} md={3}>

                            <Row>
                                {/* { !checked &&  */}
                                <Button id={props.id} variant={checked && 'success'}>{checked && destination }</Button>
                            </Row>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default RowMilitar;

