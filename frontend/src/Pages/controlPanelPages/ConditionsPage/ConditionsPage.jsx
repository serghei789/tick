import React, {Fragment} from 'react';
import {Breadcrumbs} from '../../../AbstractElements';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import DataTableComponent from "./components/DataTable/DataTableComponent";
import {EditModal} from "./components/EditModal/EditModal";
import {ConditionsName} from "../../../Constant";

const ConditionsPage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={ConditionsName} parent='Страницы' title={ConditionsName} />
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

export default ConditionsPage;
