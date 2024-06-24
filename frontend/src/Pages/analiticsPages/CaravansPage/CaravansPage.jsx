import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {CaravansLink, CaravansName} from "../../../Constant";

const CaravansPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={CaravansName} parent='Страницы' title={CaravansName} />
            <iframe className='for-light' width='100%' height='3500px'
                    src={`${CaravansLink}?_embedded=1&_no_controls=1&_theme=light`}
            ></iframe>
            <iframe className='for-dark' width='100%' height='3500px'
                    src={`${CaravansLink}?_embedded=1&_no_controls=1&_theme=dark`}
            ></iframe>
        </Fragment>
    );
};

export default CaravansPage;
