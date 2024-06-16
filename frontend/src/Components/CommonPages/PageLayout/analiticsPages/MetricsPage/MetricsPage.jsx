import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { MetricsLink, MetricsName} from "../../../../../Constant";

const MetricsPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={MetricsName} parent='Страницы' title={MetricsName} />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <div className="iframe-container" style={{height: 'calc(100vh - 315px)'}}>
                                    <iframe className='for-light' width='100%' height='100%'
                                            src={`${MetricsLink}?_embedded=1&_no_controls=1&_theme=light`}
                                    ></iframe>
                                    <iframe className='for-dark' width='100%' height='100%'
                                            src={`${MetricsLink}?_embedded=1&_no_controls=1&_theme=dark`}
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

export default MetricsPage;
