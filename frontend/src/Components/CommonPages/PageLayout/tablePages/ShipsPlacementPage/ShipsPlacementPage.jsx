import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../../../AbstractElements';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';
import { ShipsPlacementLink, ShipsPlacementName} from "../../../../../Constant";

const ShipsPlacementPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={ShipsPlacementName} parent='Страницы' title={ShipsPlacementName} />
                <iframe className='for-light' width='100%' height='2500px'
                        src={`${ShipsPlacementLink}?_embedded=1&_no_controls=1&_theme=light`}
                ></iframe>
                <iframe className='for-dark' width='100%' height='2500px'
                        src={`${ShipsPlacementLink}?_embedded=1&_no_controls=1&_theme=dark`}
                ></iframe>
        </Fragment>
    );
};

export default ShipsPlacementPage;
