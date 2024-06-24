import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {BlockSchemeLink, BlockSchemeName} from "../../../Constant";

const BlockSchemePage = () => {

    return (
        <Fragment>
            <Breadcrumbs mainTitle={BlockSchemeName} parent='Страницы' title={BlockSchemeName} />
                <div style={{height: 'calc(100vh - 195px)'}}>
                    <iframe width='100%' height='100%'
                            src={BlockSchemeLink}
                            allowFullScreen={true}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default BlockSchemePage;
