import React, {useEffect, useState} from 'react';
import './HeroScreen.css';
import {Typeahead} from "react-bootstrap-typeahead";
import {getPoints} from "../../../../../../api/methods/points";
import 'react-bootstrap-typeahead/css/Typeahead.css'
import {useNavigate} from "react-router";

let data = {}
let pointsA = []
let pointsB = []

const HeroScreen = () => {
    const navigate = useNavigate()
    const [selectedPointA, setSelectedPointA] = useState([]);
    const [selectedPointB, setSelectedPointB] = useState([]);
    const [filteredPointsA, setFilteredPointsA] = useState([]);
    const [filteredPointsB, setFilteredPointsB] = useState([]);

    const handleSelectPointA = (selected) => {
        setSelectedPointA(selected);
        if(selectedPointB.length) return
        if (selected.length > 0) {
            setFilteredPointsB(pointsA[selected[0].name]);
        } else {
            setFilteredPointsB(Object.keys(pointsB).map(key => ({name: key})));
        }
        setSelectedPointB([]);
    };

    const handleSelectPointB = (selected) => {
        setSelectedPointB(selected);
        if(selectedPointA.length) return
        if (selected.length > 0) {
            setFilteredPointsA(pointsB[selected[0].name]);
        } else {
            setFilteredPointsA(Object.keys(pointsA).map(key => ({name: key})));
        }
        setSelectedPointA([]);
    };

    const goToMap = (pointA, pointB) => {
        navigate(`${process.env.PUBLIC_URL}/map?pointA=${pointA}&pointB=${pointB}`)
    }

    useEffect(() => {
        getPoints().then(res => {
            data = res
            pointsA = data.points_a;
            for(let i in pointsA){
                pointsA[i] = pointsA[i].map(item => ({name: item}))
            }
            pointsB = data.points_b;
            for(let i in pointsB){
                pointsB[i] = pointsB[i].map(item => ({name: item}))
            }
            setFilteredPointsA(Object.keys(pointsA).map(key => ({name: key})))
            setFilteredPointsB(Object.keys(pointsB).map(key => ({name: key})))
        });
    }, []);

    return (
        <div className="background">
            <div className="overlay">
                <h1 className="title">Маршруты северного морского пути</h1>
                <div className="form-container">
                    <Typeahead
                        className="input-field"
                        id="typeahead-point-a"
                        labelKey="name"
                        options={filteredPointsA}
                        onChange={handleSelectPointA}
                        selected={selectedPointA}
                        placeholder="Выберите точку A..."
                    />
                    <Typeahead
                        className="input-field"
                        id="typeahead-point-b"
                        labelKey="name"
                        options={filteredPointsB}
                        onChange={handleSelectPointB}
                        selected={selectedPointB}
                        placeholder="Выберите точку B..."
                    />
                    <button className="submit-button" onClick={() => {
                        goToMap(selectedPointA[0]?.name, selectedPointB[0]?.name)
                        }}
                    >
                        Поиск
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroScreen;
