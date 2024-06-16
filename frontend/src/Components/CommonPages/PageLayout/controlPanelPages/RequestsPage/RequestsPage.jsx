import React, {Fragment} from 'react';
import {Breadcrumbs} from '../../../../../AbstractElements';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import DataTableComponent from "./components/DataTable/DataTableComponent";
import {EditModal} from "./components/EditModal/EditModal";
import {RequestsName} from "../../../../../Constant";

const RequestsPage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={RequestsName} parent='Страницы' title={RequestsName} />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <DataTableComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <EditModal />
        </Fragment>
    );
};

export default RequestsPage;
