import React, {Fragment, useCallback, useContext, useEffect, useState} from "react";
import {ConditionsContext} from "../../../../_helper/Conditions";
import RangeComponent from "./RangeComponent/RangeComponent";
import {Btn, H5, P} from "../../../../AbstractElements";
import { Reset, Save} from "../../../../Constant";
import {Col, Row} from "reactstrap";

export const ConditionsPanel = () => {

    const { conditions, update, reset } = useContext(ConditionsContext);

    const [values, setValues] = useState({});

    const onChange = useCallback((field, newValue) => {
        setValues({...values, [field]: newValue})
    }, [values])

    const onSave = useCallback((values) => {
        const responseData = {}
        for (const valuesKey in values) {
            responseData[valuesKey] = values[valuesKey][0]
        }

        update(responseData)
    }, [update])

    const onReset = useCallback(() => {
        reset()
    }, [])

    useEffect(() => {
        const result = conditions.reduce((acc, cur) => {
            return {...acc, [cur.id]: [+cur.value]}
        }, {})
        setValues( result)
    }, [conditions]);
    return (
        <Fragment>
            <div className='text-end'>
                <div className='btn btn-primary' onClick={() => onSave(values)}>
                    {Save}
                </div>
                <div className='btn btn-outline-primary ms-2' onClick={onReset}>
                    {Reset}
                </div>
            {conditions.length && conditions.map(condition => <Fragment key={condition.id}> {
                    +condition.active
                        ? <Row>
                            <Col md="4">
                                <P attrPara={{className: 'my-4'}}>{condition.text}</P>
                            </Col>
                            <Col md="8"><RangeComponent
                                min={+condition.min}
                                max={+condition.max}
                                values={values[+condition.id] || [+condition.min]}
                                step={+condition.step || 1}
                                setValues={(values) => onChange(+condition.id, values)}
                            />
                            </Col>
                        </Row>
                        : null
                }
                </Fragment>
            )}
            </div>
</Fragment>
    );
};
