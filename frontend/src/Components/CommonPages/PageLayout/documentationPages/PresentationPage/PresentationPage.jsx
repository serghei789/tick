import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import { Card, Col, Container, Row } from 'reactstrap';
import {PresentationLink, PresentationName} from "../../../../../Constant";

const PresentationPage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={PresentationName} parent='Страницы' title={PresentationName} />
            <Container>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <div className="iframe-container" style={{height: 'calc(100vh - 260px)'}}>
                                <iframe width='100%' height='100%'
                                        src={PresentationLink}
                                        allowFullScreen={true}
                                ></iframe>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default PresentationPage;
