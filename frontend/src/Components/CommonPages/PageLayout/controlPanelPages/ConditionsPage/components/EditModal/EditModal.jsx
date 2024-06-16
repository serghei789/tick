import React, {Fragment, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Btn } from '../../../../../../../AbstractElements';
import {
    Cancel, ConditionName, ConditionValue, EditCondition, Save,
} from '../../../../../../../Constant';
import {ConditionsContext} from "../../../../../../../_helper/Conditions";

export const EditModal = () => {
    const { editingCondition, update, isOpenEditModal, conditionModalToggle } = useContext(ConditionsContext);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const onSubmitHandler = (data) => {
        if (data !== '') {
            update(data);
        } else {
            errors.showMessages();
        }
    };

    useEffect(() => {
        if (editingCondition) {
            setValue('name', editingCondition.name)
            setValue('value', editingCondition.value)
        }
    }, [editingCondition]);

    return (
        <Fragment>
            <Modal isOpen={isOpenEditModal} toggle={conditionModalToggle} size="lg">
                <ModalHeader>
                    {EditCondition}
                    <Button color="transparent" className="btn-close float-end" onClick={conditionModalToggle} type="button" data-bs-dismiss="modal" aria-label="Close">
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(onSubmitHandler)} >
                        <div className="form-row">
                            <FormGroup className="col-md-12">
                                <Label>{ConditionName}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('name', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.name && 'name is required'}
                                </span>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label>{ConditionValue}</Label>
                                <input
                                    className="form-control"
                                    type="text"
                                    autoComplete="off"
                                    {...register('value', { required: true })}
                                />
                                <span style={{ color: 'red' }}>
                                    {errors.value && 'value is required'}
                                </span>
                            </FormGroup>
                        </div>
                        <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Save}</Btn>&nbsp;&nbsp;
                        <Btn attrBtn={{ color: 'secondary', onClick: conditionModalToggle }} >{Cancel}</Btn>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};
