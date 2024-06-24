import React, {memo} from 'react';
import {getTrackBackground, Range} from "react-range";
import {Col} from "reactstrap";

const RangeComponent = memo(({values, setValues, min, max, step}) => {
    return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    margin: "1em"
                }}
            >
                <Range
                    values={values}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(values) => setValues(values)}
                    renderTrack={({ props, children }) => (
                        <div
                            onMouseDown={props.onMouseDown}
                            onTouchStart={props.onTouchStart}
                            style={{
                                ...props.style,
                                height: "36px",
                                display: "flex",
                                width: "100%"
                            }}
                        >
                            <output style={{ marginTop: "12px" }}>
                                {min}
                            </output>
                            <div
                                ref={props.ref}
                                style={{
                                    height: "5px",
                                    width: "100%",
                                    borderRadius: "4px",
                                    background: getTrackBackground({
                                        values: values,
                                        colors: ["#2c63f1", "#ccc"],
                                        min: min,
                                        max: max
                                    }),
                                    alignSelf: "center"
                                }}
                            >

                                {children}
                            </div>
                            <output style={{ marginTop: "12px" }}>
                                {max}
                            </output>
                        </div>
                    )}
                    renderThumb={({ props, isDragged }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: "35px",
                                width: "35px",
                                borderRadius: "30px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0px 2px 6px #AAA"
                            }}
                        >
                            <div
                                style={{
                                    height: "16px",
                                    width: "5px",
                                    backgroundColor: isDragged ? "#2c63f1" : "#CCC"
                                }}
                            />
                        </div>
                    )}
                />
                <output style={{ marginTop: "12px" }} id="output">
                    {values?.[0]}
                </output>
            </div>
    );
});

export default RangeComponent;
