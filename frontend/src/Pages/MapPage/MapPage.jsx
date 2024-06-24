import React, {Fragment} from 'react';
import { Breadcrumbs} from '../../AbstractElements';
import {MapLink} from "../../Constant";
import './styles.css'
import {ControlAccordion} from "./components/ControlAccordeon/ControlAccordion";

const MapPage = () => {
    const searchString = new URLSearchParams(window.location.search);
    const pointA = encodeURI(searchString.get('pointA'))
    const pointB = encodeURI(searchString.get('pointB'))
    return (
        <Fragment>
            <Breadcrumbs mainTitle='Карта' parent='Страницы' title='Карта' />
            <ControlAccordion/>
            <div>
                <iframe src={`${MapLink}${pointA ? `&point_a=${pointA}` : ''}${pointB ? `&point_b=${pointB}` : ''}`}
                        width="100%" height='25000px'>
                </iframe>
            </div>
        </Fragment>
    );
};

export default MapPage;
