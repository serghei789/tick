import React, {Fragment, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Btn } from '../../../../../AbstractElements';
import {
    Cancel, Create, EditModel, EndDate,
    Imo, MaxSpeed, ModelLateArrival, ModelName, ModelNecessity, ModelSpeed, ModelStart, ModelTime,
    PointA, PointB,
    Save, Ship, StartDate,

} from '../../../../../Constant';
import {ModelsContext} from "../../../../../_helper/Models";

export const EditModal = () => {
    const { editingModel, updateModel, isOpenEditModal, modelModalToggle, createModel } = useContext(ModelsContext);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    const onSubmitHandler = (data) => {
        if(!editingModel)return createModel(data)
        if (data !== '') {
            updateModel(data);
        } else {
            errors.showMessages();
        }
    };

    useEffect(() => {
        if (editingModel) {
            setValue('model_id', editingModel.model_id)
            setValue('model_name', editingModel.model_name)
            setValue('c_start', editingModel.c_start)
            setValue('c_necessity', editingModel.c_necessity)
            setValue('c_time', editingModel.c_time)
            setValue('c_speed', editingModel.c_speed)
            setValue('c_late_arrival', editingModel.c_late_arrival)
        }else{
            reset()
        }
    }, [editingModel]);

    return (
        <Fragment>
            <Modal isOpen={isOpenEditModal} toggle={modelModalToggle} size="lg">
                <ModalHeader>
                    {EditModel}
                    <Button color="transparent" className="btn-close float-end" onClick={modelModalToggle} type="button" data-bs-dismiss="modal" aria-label="Close">
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(onSubmitHandler)} >
                        <div className="form-row">
                            <FormGroup className="col-md-12">
                                <Label>{ModelName}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('model_name', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.model_name && 'model_name is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{ModelStart}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('c_start', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.c_start && 'c_start is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{ModelNecessity}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('c_necessity', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.c_necessity && 'c_necessity is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{ModelTime}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('c_time', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.c_time && 'c_time is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{ModelSpeed}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('c_speed', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.c_speed && 'c_speed is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{ModelLateArrival}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('c_late_arrival', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.c_late_arrival && 'c_late_arrival is required'}
                                </span>
                            </FormGroup>
                        </div>
                        {editingModel
                            ? <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Save}</Btn>
                            : <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Create}</Btn>
                        }&nbsp;&nbsp;
                        <Btn attrBtn={{ color: 'secondary', onClick: modelModalToggle }} >{Cancel}</Btn>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};
