import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {BestRoutesLink, BestRoutesName} from "../../../Constant";

const BestRoutesPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={BestRoutesName} parent='Страницы' title={BestRoutesName} />
                <div style={{height: 'calc(100vh - 200px)'}}>
                    <iframe className='for-light' width='100%' height='100%'
                            src={`${BestRoutesLink}?_embedded=1&_no_controls=1&_theme=light`}
                    ></iframe>
                    <iframe className='for-dark' width='100%' height='100%'
                            src={`${BestRoutesLink}?_embedded=1&_no_controls=1&_theme=dark`}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default BestRoutesPage;
