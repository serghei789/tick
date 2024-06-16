import {Link} from "react-router-dom";
import React, {useState, Fragment, useContext} from "react";
import { H4, LI, P, Image, UL } from "../../../../../../AbstractElements";
import {Row, Card, Button, Input} from "reactstrap";
import {useNavigate} from "react-router";
import {rootPath} from "../../../../../../api";
import {ShipsContext} from "../../../../../../_helper/Ships";

const PICTURE_CODES = {
    KANDINSKY: 'KANDINSKY',
    UHD: 'UHD',
    ANIME: 'ANIME',
    DEFAULT: 'DEFAULT',
    AIVAZOVSKY: 'AIVAZOVSKY',
    REAL: 'REAL',
}

const pictureModOptions = [
    {value: PICTURE_CODES.KANDINSKY, label: 'Кандинский'},
    {value: PICTURE_CODES.UHD, label: 'Детальное фото'},
    {value: PICTURE_CODES.ANIME, label: 'Аниме'},
    {value: PICTURE_CODES.DEFAULT, label: 'Свой стиль'},
    {value: PICTURE_CODES.AIVAZOVSKY, label: 'Айвазовский'},
    {value: PICTURE_CODES.REAL, label: 'Оригинал'},
]

const ShipsGrid = () => {
    const layoutColumns = 3;

    const [pictureMod, setPictureMod] = useState("ANIME");
    const history = useNavigate();

    const { ships} = useContext(ShipsContext)

    const goToShipPage = (productId) => {
        history(`${process.env.PUBLIC_URL}/ship/${productId}`)
    };

    const onChangePictureMod = (e) => {
        setPictureMod(e.target.value)
    }

    return (
        <Fragment>
            <Input onChange={onChangePictureMod}
                   value={pictureMod} type="select" name="select" className="form-control btn-pill digits" multiple="">
                {pictureModOptions && pictureModOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Input>
            <div className='mb-3'></div>
            <div className="product-wrapper-grid" id="product-wrapper-grid">
                <Row className="gridRow" id="gridRow">
                    {ships.length &&
                        ships.map((item) => {
                            return (
                                <div id="gridId" className={`${layoutColumns === 3 ? "col-xl-3 col-lg-6 col-sm-6 xl-4 box-col-4" : "col-xl-" + layoutColumns}`} key={item.imo}>
                                    <Card>
                                        <div className="product-box">
                                            <div className="product-img">
                                                {item.iceclass === "icebreaker" ? <span className="ribbon ribbon-info ribbon-right">Ледокол</span> : ""}
                                                <Image attrImage={{ className: "img-fluid", src: `${rootPath}/img/ai/${pictureMod}/${item.img}`, alt: "" }} />
                                                <div className="product-hover">
                                                    <UL attrUL={{ className: "simple-list d-flex flex-row" }}>
                                                        <LI attrLI={{ className: "border-0" }}>
                                                            <Button color="default" data-toggle="modal" onClick={() => goToShipPage(item.imo)}>
                                                                <i className="icon-eye"></i>
                                                            </Button>
                                                        </LI>
                                                    </UL>
                                                </div>
                                            </div>
                                            <div className="product-details">
                                                <Link to={`${process.env.PUBLIC_URL}/app/ecommerce/product-page/${item.imo}`}>
                                                    <H4>{item.name}</H4>
                                                </Link>

                                                <P>{item.imo}</P>
                                                <P>Ледовый класс: {item.iceclass}</P>
                                                <P>Максимальная скорость: {item.max_speed}</P>
                                                <div className="product-price">
                                                    {item.eta}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                </Row>
            </div>
        </Fragment>
    );
};
export default ShipsGrid;
