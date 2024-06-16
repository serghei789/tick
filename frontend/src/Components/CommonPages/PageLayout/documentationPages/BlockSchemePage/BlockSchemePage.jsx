import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import { Card, Col, Container, Row } from 'reactstrap';
import {BlockSchemeLink, BlockSchemeName} from "../../../../../Constant";

const BlockSchemePage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={BlockSchemeName} parent='Страницы' title={BlockSchemeName} />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <div className="iframe-container" style={{height: 'calc(100vh - 260px)'}}>
                                <iframe width='100%' height='100%'
                                        src={BlockSchemeLink}
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

export default BlockSchemePage;
