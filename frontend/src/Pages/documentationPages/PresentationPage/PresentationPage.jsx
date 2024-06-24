import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {PresentationLink, PresentationName} from "../../../Constant";

const PresentationPage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={PresentationName} parent='Страницы' title={PresentationName} />
                <div style={{height: 'calc(100vh - 195px)'}}>
                    <iframe width='100%' height='100%'
                            src={PresentationLink}
                            allowFullScreen={true}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default PresentationPage;
