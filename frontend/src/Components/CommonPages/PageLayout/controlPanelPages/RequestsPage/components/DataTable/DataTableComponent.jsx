import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component';
import {getTableColumns} from "../../data";
import {useContext} from "react";
import {RequestsContext} from "../../../../../../../_helper/Requests";

const DataTableComponent = () => {

    const { requests, isOpenEditModal, setIsOpenEditModal, setEditingRequest, deleteRequest, reset } = useContext(RequestsContext);

    const editToggle = (request) => {
        if(request) {
            setEditingRequest(request)
            setIsOpenEditModal(true)
        }
        setIsOpenEditModal(!isOpenEditModal);
    };

    const createHandler = () => {
        setEditingRequest(null)
        setIsOpenEditModal(true)
    }

    return (
        <Fragment>
            <div className='text-end'>
            <div className='btn btn-primary' onClick={createHandler}>
                Создать заявку
            </div>
            <div className='btn btn-outline-primary ms-2' onClick={reset}>
                Сбросить
            </div>
        </div>
            <DataTable
                data={requests}
                columns={getTableColumns(editToggle, deleteRequest)}
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
