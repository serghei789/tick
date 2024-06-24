import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../AbstractElements';
import {VideoLink} from "../../Constant";

const VideoPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={'Видео инструкция'} parent='Страницы' title={"Видео инструкция"} />

            <div style={{height: 'calc(100vh - 195px)'}}>
                <video src={VideoLink}></video>
                {/*<iframe width='100%' height='100%'*/}
                {/*        src={VideoLink}*/}
                {/*        allowFullScreen={true}*/}
                {/*></iframe>*/}
            </div>
        </Fragment>
    );
};

export default VideoPage;
