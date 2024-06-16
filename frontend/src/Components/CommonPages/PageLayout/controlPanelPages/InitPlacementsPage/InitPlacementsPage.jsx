import React, {Fragment} from 'react';
import {Breadcrumbs} from '../../../../../AbstractElements';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import DataTableComponent from "./components/DataTable/DataTableComponent";
import {EditModal} from "./components/EditModal/EditModal";
import {ModelsName} from "../../../../../Constant";

const InitPlacementsPage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={ModelsName} parent='Страницы' title={ModelsName} />
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

export default InitPlacementsPage;
