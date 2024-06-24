import React, {useContext, useEffect, useState} from 'react';
import {Gantt, ViewMode} from "gantt-task-react";
import {TooltipContent} from "./TooltipContent";
import axios from "axios";
import {ScheduleApi} from "../../../api";
import {Input} from "reactstrap";
import "gantt-task-react/dist/index.css";
import {useParams} from "react-router";
import {ShipsContext} from "../../../_helper/Ships";

let trips = []
let shipFilterOptions = ['Штурман Альбанов', 'Штурман Кошелев']
let modelFilterOptions = ['1', '2']

const Empty = () => {
    return (
        <div>
        </div>
    );
};

export const getShipName = (ship) => {
    if(ship.ice_class.includes('Arc9')) return '🚢 ' + ship.name
    else return ship.name
}

const getFilterOptions = (arr, field) => {
    const set = new Set(arr.map(item => item[field]))
    return Array.from(set)
}

const getTrips = async () => {
    try {
        const resp = await axios.get(ScheduleApi)
        return resp.data
    } catch (error) {
        console.log('error', error);
    }
}

export const ScheduleChart = () => {
    const [shipFilter, setShipFilter] = useState('');
    const [modelFilter, setModelFilter] = useState('');
    const [time, setTime] = useState('Day');
    const [filteredTrips, setFilteredTrips] = useState([]);

    const {ships} = useContext(ShipsContext)

    const {imo} = useParams()

    useEffect(() => {
        let filtered = trips.filter(trip => trip.model_id === modelFilter)
        if(shipFilter !== '') {
            filtered = filtered.filter(trip => trip.name === shipFilter)
        }
        setFilteredTrips(filtered)
    }, [shipFilter, modelFilter]);

    useEffect(() => {
        getTrips().then((res) => {
            trips = res.sort((a, b) => a.start < b.start).map((trip, index) => {
                return {
                    ...trip,
                    start: new Date(+trip.start),
                    end: new Date(+trip.end),
                    styles: { progressColor: trip.color, progressSelectedColor: '#ff9e0d' },
                    progress: trip.progress,
                    name:  getShipName(trip),
                    dependencies: [trip.dependencies]
                }
            } )
            shipFilterOptions = getFilterOptions(trips, 'name')
            modelFilterOptions = getFilterOptions(trips, 'model_id')
            setFilteredTrips(trips)
            setModelFilter(modelFilterOptions[0])
        })
    }, []);

    useEffect(() => {
        if(imo){
            const ship = ships.find(item => item.imo === imo)
            const option = shipFilterOptions.find(item => item.includes(ship?.name))
            if(option) setShipFilter(option)
        }
    }, [ships]);
    return (<>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width:'40%'}}>
                    <div style={{marginBottom: '10px'}}>
                        <Input onChange={(e) => {
                            setShipFilter(e.target.value)
                        }}
                               value={shipFilter} type="select" name="select" className="form-control btn-pill digits">
                            <option value=''>Все</option>
                            {shipFilterOptions && shipFilterOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </Input>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <Input onChange={(e) => {
                            setModelFilter(e.target.value)
                        }}
                               value={modelFilter} type="select" name="select" className="form-control btn-pill digits">
                            {modelFilterOptions && modelFilterOptions.map(option => <option key={option} value={option}>{option}</option>)}
                        </Input>
                    </div>
                </div>

                <div style={{width:'15%', marginBottom: '10px'}}>
                    <Input onChange={(e) => {
                        setTime(e.target.value)
                    }}
                           value={time} type="select" name="select" className="form-control btn-pill digits" multiple="">
                        <option value="Hour">Час</option>
                        <option value="Day">День</option>
                    </Input>
                </div>
            </div>

            {filteredTrips.length > 0 && <Gantt columnWidth={70} TaskListTable={Empty} TaskListHeader={Empty} viewDate={new Date()} tasks={filteredTrips} TooltipContent={TooltipContent} barCornerRadius={7} locale='rus' viewMode={ViewMode[time]} />}

        </>

    );
};
