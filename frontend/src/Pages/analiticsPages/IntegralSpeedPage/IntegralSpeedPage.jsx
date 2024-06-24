import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {IntegralSpeedLink, IntegralSpeedName} from "../../../Constant";

const IntegralSpeedPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={IntegralSpeedName} parent='Страницы' title={IntegralSpeedName} />
                <div className="iframe-container" style={{height: 'calc(100vh - 200px)'}}>
                    <iframe className='for-light' width='100%' height='100%'
                            src={`${IntegralSpeedLink}?_embedded=1&_no_controls=1&_theme=light`}
                    ></iframe>
                    <iframe className='for-dark' width='100%' height='100%'
                            src={`${IntegralSpeedLink}?_embedded=1&_no_controls=1&_theme=dark`}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default IntegralSpeedPage;
