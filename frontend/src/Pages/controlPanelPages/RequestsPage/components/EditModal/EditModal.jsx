import React, {Fragment, useContext, useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Btn } from '../../../../../AbstractElements';
import {
    Cancel, Create, CreateRequest, EditRequest, EndDate, PointA, PointB,
    Save, Ship, StartDate,

} from '../../../../../Constant';
import {RequestsContext} from '../../../../../_helper/Requests';
import {Typeahead} from "react-bootstrap-typeahead";
import {ShipsContext} from "../../../../../_helper/Ships";
import {getPoints} from "../../../../../api/methods/points";

let pointsA = []
let pointsB = []
let shipsOptions = []

export const EditModal = () => {
    const [selectedPointA, setSelectedPointA] = useState([]);
    const [selectedPointB, setSelectedPointB] = useState([]);
    const [selectedShip, setSelectedShip] = useState([]);

    const { editingRequest, updateRequest, isOpenEditModal, requestModalToggle, createRequest } = useContext(RequestsContext);
    const {ships} = useContext(ShipsContext)

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    const onSubmitHandler = (data) => {
        if(!editingRequest)return createRequest({...data,
            pointA: selectedPointA[0]?.name,
            pointB: selectedPointB[0]?.name,
            ship: selectedShip[0]?.name})
        if (data !== '') {
            console.log(selectedPointA[0]?.name,
            selectedPointB[0]?.name,
            selectedShip[0]?.name)
            updateRequest({...data,
                pointA: selectedPointA[0]?.name,
                pointB: selectedPointB[0]?.name,
                ship: selectedShip[0]?.name});
        } else {
            errors.showMessages();
        }
    };

    const onChangeShip = (selected) => {
        setSelectedShip(selected);
        setValue('imo', selected[0]?.imo)
    };


    useEffect(() => {
        getPoints().then(res => {
            pointsA = Object.keys(res.points_a).map(point => ({name: point}));
            pointsB = Object.keys(res.points_b).map(point => ({name: point}));
        });
    }, []);

    useEffect(() => {
        shipsOptions = ships.map(ship => ({name: ship.name, imo: ship.imo}));
    }, [ships]);

    useEffect(() => {
        if (editingRequest) {
            setValue('id', editingRequest.id)
            setValue('imo', editingRequest.imo)
            setValue('maxSpeed', editingRequest.maxSpeed)
            setValue('startDate', editingRequest.startDate)
            setValue('endDate', editingRequest.endDate)
            setValue('iceClass', editingRequest.iceClass)
            setSelectedPointA([{name: editingRequest.pointA}])
            setSelectedPointB([{name: editingRequest.pointB}])
            setSelectedShip([{name: editingRequest.ship}])
        }else{
            reset()
            setSelectedPointA([])
            setSelectedPointB([])
            setSelectedShip([])
        }
    }, [editingRequest]);

    return (
        <Fragment>
            <Modal isOpen={isOpenEditModal} toggle={requestModalToggle} size="lg">
                <ModalHeader>
                    {editingRequest ? EditRequest : CreateRequest}
                    <Button color="transparent" className="btn-close float-end" onClick={requestModalToggle} type="button" data-bs-dismiss="modal" aria-label="Close">
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(onSubmitHandler)} >
                        <div className="form-row">
                            <FormGroup className="col-md-12">
                                <Label>{Ship}</Label>
                                <Typeahead
                                    id="typeahead-point-a"
                                    labelKey="name"
                                    options={shipsOptions}
                                    onChange={onChangeShip}
                                    selected={selectedShip}
                                    placeholder="Выберите корабль"
                                />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{PointA}</Label>
                                <Typeahead
                                    id="typeahead-point-a"
                                    labelKey="name"
                                    options={pointsA}
                                    onChange={setSelectedPointA}
                                    selected={selectedPointA}
                                    placeholder="Выберите точку A..."
                                />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{PointB}</Label>
                                <Typeahead
                                    id="typeahead-point-b"
                                    labelKey="name"
                                    options={pointsB}
                                    onChange={setSelectedPointB}
                                    selected={selectedPointB}
                                    placeholder="Выберите точку B..."
                                />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{StartDate}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('startDate', { required: 'Поле обязательно для заполнения' })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.startDate && 'startDate is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{EndDate}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('endDate', { required: 'Поле обязательно для заполнения' })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.endDate && 'endDate is required'}
                                </span>
                            </FormGroup>
                        </div>
                        {editingRequest
                            ? <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Save}</Btn>
                            : <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Create}</Btn>
                        }&nbsp;&nbsp;
                        <Btn attrBtn={{ color: 'secondary', onClick: requestModalToggle }} >{Cancel}</Btn>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};
