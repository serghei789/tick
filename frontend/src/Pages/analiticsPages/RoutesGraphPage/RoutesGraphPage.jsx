import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../../AbstractElements';
import { RoutesGraphLink, RoutesGraphName} from "../../../Constant";

const RoutesGraphPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={RoutesGraphName} parent='Страницы' title={RoutesGraphName} />
                <div style={{height: 'calc(100vh - 200px)'}}>
                    <iframe className='for-light' width='100%' height='100%'
                            src={`${RoutesGraphLink}?_embedded=1&_no_controls=1&_theme=light`}
                    ></iframe>
                    <iframe className='for-dark' width='100%' height='100%'
                            src={`${RoutesGraphLink}?_embedded=1&_no_controls=1&_theme=dark`}
                    ></iframe>
                </div>
        </Fragment>
    );
};

export default RoutesGraphPage;
