import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {CompoundRoutesLink, CompoundRoutesName} from "../../../Constant";

const CompoundRoutesPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={CompoundRoutesName} parent='Страницы' title={CompoundRoutesName} />
                <div style={{height: 'calc(100vh - 195px)'}}>
                    <iframe className='for-light' width='100%' height='100%'
                            src={`${CompoundRoutesLink}?_embedded=1&_no_controls=1&_theme=light`}
                    ></iframe>
                    <iframe className='for-dark' width='100%' height='100%'
                            src={`${CompoundRoutesLink}?_embedded=1&_no_controls=1&_theme=dark`}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default CompoundRoutesPage;
