import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {SpeedControlLink, SpeedControlName} from "../../../Constant";

const SpeedControlPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={SpeedControlName} parent='Страницы' title={SpeedControlName} />
                <div style={{height: 'calc(100vh - 195px)'}}>
                    <iframe className='for-light' width='100%' height='100%'
                            src={`${SpeedControlLink}?_embedded=1&_no_controls=1&_theme=light`}
                    ></iframe>
                    <iframe className='for-dark' width='100%' height='100%'
                            src={`${SpeedControlLink}?_embedded=1&_no_controls=1&_theme=dark`}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default SpeedControlPage;
