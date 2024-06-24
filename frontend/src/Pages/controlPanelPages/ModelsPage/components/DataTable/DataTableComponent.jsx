import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component';
import {getTableColumns} from "../../data";
import {useContext} from "react";
import {ModelsContext} from "../../../../../_helper/Models";
import {Reset} from "../../../../../Constant";

const DataTableComponent = () => {
    const { models, isOpenEditModal, setIsOpenEditModal, setEditingModel, deleteModel, reset } = useContext(ModelsContext);

    const editToggle = (model) => {
        if(model) {
            setEditingModel(model)
            setIsOpenEditModal(true)
        }
        setIsOpenEditModal(!isOpenEditModal);
    };

    const createHandler = () => {
        setEditingModel(null)
        setIsOpenEditModal(true)
    }

    return (
        <Fragment>
            <div className='text-end'>
                <div className='btn btn-primary' onClick={createHandler}>
                    Создать модель
                </div>
                <div className='btn btn-outline-primary ms-2' onClick={reset}>
                    {Reset}
                </div>
            </div>
            <DataTable
                data={models}
                columns={getTableColumns(editToggle, deleteModel)}
                striped={true}
                center={true}
                pagination
                paginationComponentOptions={{rowsPerPageText: 'Записей на странице'}}
                paginationPerPage={40}
                paginationRowsPerPageOptions={[10, 20, 40, 100]}
                noDataComponent={'Пока ничего не найдено..'}
            />
        </Fragment>
    )
}
export default DataTableComponent
