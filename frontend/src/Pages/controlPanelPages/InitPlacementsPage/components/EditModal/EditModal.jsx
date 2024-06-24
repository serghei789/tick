import React, {Fragment, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Btn } from '../../../../../AbstractElements';
import {
    Cancel, Create, EditInitPlacement, InitPlacementName,
    Save
} from '../../../../../Constant';
import {InitPlacementsContext} from "../../../../../_helper/InitPlacements";

export const EditModal = () => {
    const { editingInitPlacement, updateInitPlacement, isOpenEditModal, initPlacementModalToggle, createInitPlacement } = useContext(InitPlacementsContext);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    const onSubmitHandler = (data) => {
        if(!editingInitPlacement)return createInitPlacement({
            ...data,
            datetime_end: '9999-12-31 00:00:00',
            datetime_start: '1900-01-01 00:00:00',
            free: '1',
        })
        if (data !== '') {
            updateInitPlacement(data);
        } else {
            errors.showMessages();
        }
    };

    useEffect(() => {
        if (editingInitPlacement) {
            setValue('id', editingInitPlacement.id)
            setValue('imo', editingInitPlacement.imo)
            setValue('point_name', editingInitPlacement.point_name)
            setValue('icebreaker', editingInitPlacement.icebreaker)
        }else{
            reset()
        }
    }, [editingInitPlacement]);

    return (
        <Fragment>
            <Modal isOpen={isOpenEditModal} toggle={initPlacementModalToggle} size="lg">
                <ModalHeader>
                    {EditInitPlacement}
                    <Button color="transparent" className="btn-close float-end" onClick={initPlacementModalToggle} type="button" data-bs-dismiss="modal" aria-label="Close">
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(onSubmitHandler)} >
                        <div className="form-row">
                            <FormGroup className="col-md-12">
                                <Label>imo</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('imo', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.imo && 'imo is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>Расположение</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('point_name', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.point_name && 'point_name is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>Ледокол</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('icebreaker', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.icebreaker && 'icebreaker is required'}
                                </span>
                            </FormGroup>
                        </div>
                        {editingInitPlacement
                            ? <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Save}</Btn>
                            : <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Create}</Btn>
                        }&nbsp;&nbsp;
                        <Btn attrBtn={{ color: 'secondary', onClick: initPlacementModalToggle }} >{Cancel}</Btn>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};
