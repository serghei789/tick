import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import {AlgorithmLink, AlgorithmName} from "../../../Constant";

const AlgorithmPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={AlgorithmName} parent='Страницы' title={AlgorithmName} />
                <div style={{height: 'calc(100vh - 195px)'}}>
                    <iframe width='100%' height='100%'
                            src={AlgorithmLink}
                            allowFullScreen={true}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default AlgorithmPage;
