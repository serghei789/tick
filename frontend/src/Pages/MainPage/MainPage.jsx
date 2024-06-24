import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../AbstractElements';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import HeroScreen from "./components/HeroScreen/HeroScreen";
import ShipsGrid from "./components/ShipsList/ShipsList";

const MainPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle='Главная' parent='Страницы' title='Главная' />
            <Container fluid={true}>
                <Row>
                    <Col sm='12'>
                        <HeroScreen />
                        <Card>
                            <CardBody>
                                <ShipsGrid/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default MainPage;
