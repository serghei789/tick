import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import {AlgorithmLink, AlgorithmName} from "../../../../../Constant";

const AlgorithmPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={AlgorithmName} parent='Страницы' title={AlgorithmName} />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <div className="iframe-container" style={{height: 'calc(100vh - 315px)'}}>
                                    <iframe width='100%' height='100%'
                                            src={AlgorithmLink}
                                            allowFullScreen={true}
                                    ></iframe>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default AlgorithmPage;
