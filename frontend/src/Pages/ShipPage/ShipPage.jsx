import React, {Fragment, useEffect, useState} from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import {useParams} from "react-router";
import ShipInfo from "./components/ShipInfo/ShipInfo";
import { Breadcrumbs } from "../../AbstractElements";
import axios from "axios";
import {ShipApi} from "../../api";
import {ImageSlider} from "./components/ImageSlider/ImageSilder";
import {MapLink} from "../../Constant";

const ShipPage = () => {
    const {id} = useParams()
    const [ship, setShip] = useState({});

    const getShip = async () => {
        try {
            const resp = await axios.get(`${ShipApi}&imo=${id}`)
            console.log(resp.data)
            setShip(resp.data[0])
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        getShip();
    }, []);
    return (
        <Fragment>
            <Breadcrumbs mainTitle={ship.name} parent='Страницы' title='Страница корабля' />
            <Container className='mt-4' fluid={true}>
                <div>
                    <Row className='product-page-main p-0'>
                        <Col xxl='4' md='6' className='box-col-12'>
                            <Card>
                                <CardBody>
                                     <Row>
                                    <ImageSlider  ship={ship}/>
                                     </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <ShipInfo ship={ship}/>
                        {/*<Col xxl="3" md="6" className='box-col-6'>*/}
                        {/*    <ColumnInfoCard />*/}
                        {/*</Col>*/}
                    </Row>
                    <Row className='product-page-main p-0'>
                        <div>
                            <iframe src={`${MapLink}&imo=${id}`}
                                    width="100%" height='3000px'>
                            </iframe>
                        </div>
                    </Row>
                </div>
            </Container>
        </Fragment>
    );
};

export default ShipPage;
