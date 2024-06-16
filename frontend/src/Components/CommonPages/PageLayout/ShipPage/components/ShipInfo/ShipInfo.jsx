import React, { Fragment } from "react";
import { Col, Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { H3, P, } from "../../../../../../AbstractElements";

const ShipInfo = ({ship}) => {

    return (
        <Fragment>
            <Col xxl="5" className="box-col-6 order-xxl-0 order-1">
                <Card>
                    <CardBody>
                        <div className="product-page-details">
                            <H3>{ship.name}</H3>
                        </div>
                        <div className="product-price">
                            {ship.iceclass}
                        </div>
                        <hr />
                        <P>{"информация о корабле"}</P>
                        <hr />
                        <div>
                            <table className="product-page-width">
                                <tbody>
                                <tr>
                                    <td>
                                        <b>Вместимость &nbsp;&nbsp;&nbsp;:</b>
                                    </td>
                                    <td>{ship.tonnage}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Максимальная скорость &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;</b>
                                    </td>
                                    <td className="txt-success">{ship.max_speed}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Мощность &nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;</b>
                                    </td>
                                    <td>{ship.power}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr />
                        <div>
                            <Link to={`${process.env.PUBLIC_URL}/app/ecommerce/checkout`}>
                                <Button color="primary" className="m-r-10 m-t-10" onClick={() => {}}>
                                    <i className="fa stroke-calendar me-1"></i>
                                    Расписание
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};
export default ShipInfo;
