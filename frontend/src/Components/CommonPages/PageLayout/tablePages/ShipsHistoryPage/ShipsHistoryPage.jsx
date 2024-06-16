import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { ShipHistoryLink, ShipHistoryName} from "../../../../../Constant";

const ShipsHistoryPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={ShipHistoryName} parent='Страницы' title={ShipHistoryName} />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <div className="iframe-container" style={{height: 'calc(100vh - 315px)'}}>
                                    <iframe className='for-light' width='100%' height='100%'
                                            src={`${ShipHistoryLink}?_embedded=1&_no_controls=1&_theme=light`}
                                    ></iframe>
                                    <iframe className='for-dark' width='100%' height='100%'
                                            src={`${ShipHistoryLink}?_embedded=1&_no_controls=1&_theme=dark`}
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

export default ShipsHistoryPage;
