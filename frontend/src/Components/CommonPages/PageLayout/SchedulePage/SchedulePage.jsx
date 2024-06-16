import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../AbstractElements';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import {ScheduleChart} from "./components/ScheduleChart";

const SchedulePage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle='Расписание' parent='Страницы' title='Расписание' />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <ScheduleChart/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default SchedulePage;
