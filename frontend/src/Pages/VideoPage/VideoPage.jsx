import React, { Fragment } from 'react';
import { Breadcrumbs } from '../../AbstractElements';

const VideoPage = () => {
    return (
        <Fragment>
            <Breadcrumbs mainTitle={'Видео инструкция'} parent='Страницы' title={"Видео инструкция"} />

            <div style={{height: 'calc(100vh - 195px)'}}>
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/fnylu3mha8c?si=KEmWPcLYc5Dakzp8"
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>

                </iframe>
            </div>
        </Fragment>
    );
};

export default VideoPage;
