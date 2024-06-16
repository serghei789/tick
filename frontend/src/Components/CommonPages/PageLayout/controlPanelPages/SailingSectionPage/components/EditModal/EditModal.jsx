import React, {Fragment, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Btn } from '../../../../../../../AbstractElements';
import {
    Cancel, Create, EditSailingSection, SailingSectionName,
    Save
} from '../../../../../../../Constant';
import {SailingSectionsContext} from "../../../../../../../_helper/SailingSections";

export const EditModal = () => {
    const { editingSailingSection, updateSailingSection, isOpenEditModal, sailingSectionModalToggle, createSailingSection } = useContext(SailingSectionsContext);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    const onSubmitHandler = (data) => {
        if(!editingSailingSection)return createSailingSection(data)
        if (data !== '') {
            updateSailingSection(data);
        } else {
            errors.showMessages();
        }
    };

    useEffect(() => {
        if (editingSailingSection) {
            setValue('id', editingSailingSection.id)
            setValue('point_name', editingSailingSection.point_name)
        }else{
            reset()
        }
    }, [editingSailingSection]);

    return (
        <Fragment>
            <Modal isOpen={isOpenEditModal} toggle={sailingSectionModalToggle} size="lg">
                <ModalHeader>
                    {EditSailingSection}
                    <Button color="transparent" className="btn-close float-end" onClick={sailingSectionModalToggle} type="button" data-bs-dismiss="modal" aria-label="Close">
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <Form
                        className="form-bookmark needs-validation"
                        onSubmit={handleSubmit(onSubmitHandler)} >
                        <div className="form-row">
                            <FormGroup className="col-md-12">
                                <Label>{SailingSectionName}</Label>
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
                        </div>
                        {editingSailingSection
                            ? <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Save}</Btn>
                            : <Btn attrBtn={{ color: 'primary', type: 'submit' }} >{Create}</Btn>
                        }&nbsp;&nbsp;
                        <Btn attrBtn={{ color: 'secondary', onClick: sailingSectionModalToggle }} >{Cancel}</Btn>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};
