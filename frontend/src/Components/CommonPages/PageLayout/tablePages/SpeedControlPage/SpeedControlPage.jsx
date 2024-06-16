import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import {SpeedControlLink, SpeedControlName} from "../../../../../Constant";

const SpeedControlPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={SpeedControlName} parent='Страницы' title={SpeedControlName} />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <div className="iframe-container" style={{height: 'calc(100vh - 315px)'}}>
                                    <iframe className='for-light' width='100%' height='100%'
                                            src={`${SpeedControlLink}?_embedded=1&_no_controls=1&_theme=light`}
                                    ></iframe>
                                    <iframe className='for-dark' width='100%' height='100%'
                                            src={`${SpeedControlLink}?_embedded=1&_no_controls=1&_theme=dark`}
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

export default SpeedControlPage;
