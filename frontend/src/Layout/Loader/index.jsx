import React, { Fragment,useState,useEffect } from 'react';

const Loader = () => {

    const [show, setShow] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false);
        }, 4000);//todo 4  секунд

        return () => {
            clearTimeout(timeout);
        };
    }, [show]);

    return (
        <Fragment>
            <div className={`loader-wrapper ${show ? '' : 'loderhide'}`}>
                <div className="wrap-loader">
                    <div className="loader">
                        <div className="box"></div>
                        <div className="box"></div>
                        <div className="box"></div>
                        <div className="box"></div>
                        <div className="wrap-text">
                            <div className="text">
                                <span>⚓️</span><span>С</span><span>М</span><span>П</span><span>💖</span>
                            </div>
                        </div>
                    </div>
                    <div className="loader-text">загружаем корабли</div>
                </div>
            </div>
        </Fragment>
    );
}

export default Loader;
