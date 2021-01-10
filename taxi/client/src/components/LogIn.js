import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { Breadcrumb, Button, Card, Col, Form, Row} from 'react-bootstrap';

function LogIn (props) {
    /*
    * We added a hook to set the isSubmitted state,
    * and we added a conditional statement to redirect
    * the browser to the home page if the form is submitted.
    * */
    const [isSubmitted, setSubmitted] = useState(false);

    /*
    * We also defined a simple onSubmit() function that sets isSubmitted to true when invoked.
    * */
    const onSubmit = (values, actions) => setSubmitted(true);

    if (isSubmitted) {
        return <Redirect to='/' />;
    }

    return (
        <Row>
            <Col lg={12}>
                <Breadcrumb>
                    <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Log in</Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Card.Header>Log in</Card.Header>
                    <Card.Body>
                        <Formik
                            initialValues={{
                                username: '',
                                password: ''
                            }}
                            onSubmit={onSubmit}
                        >
                            {({
                                  handleChange,
                                  handleSubmit,
                                  values
                              }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group controlId='username'>
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control
                                            name='username'
                                            onChange={handleChange}
                                            value={values.username}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId='password'>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            name='password'
                                            onChange={handleChange}
                                            type='password'
                                            value={values.password}
                                        />
                                    </Form.Group>
                                    <Button block type='submit' variant='primary'>Log in</Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                    <p className='mt-3 text-center'>
                        Don't have an account? <Link to='/sign-up'>Sign up!</Link>
                    </p>
                </Card>
            </Col>
        </Row>
    );
}

export default LogIn;