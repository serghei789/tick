import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component';
import {getTableColumns} from "../../data";
import {useContext} from "react";
import {InitPlacementsContext} from "../../../../../../../_helper/InitPlacements";
import {Reset} from "../../../../../../../Constant";

const DataTableComponent = () => {
    const { initPlacements, isOpenEditModal, setIsOpenEditModal, setEditingInitPlacement, deleteInitPlacement, reset } = useContext(InitPlacementsContext);

    const editToggle = (initPlacement) => {
        if(initPlacement) {
            setEditingInitPlacement(initPlacement)
            setIsOpenEditModal(true)
        }
        setIsOpenEditModal(!isOpenEditModal);
    };

    const createHandler = () => {
        setEditingInitPlacement(null)
        setIsOpenEditModal(true)
    }

    return (
        <Fragment>
            <div className='text-end'>
                <div className='btn btn-primary' onClick={createHandler}>
                    Добавить расположение
                </div>
                <div className='btn btn-outline-primary ms-2' onClick={reset}>
                    {Reset}
                </div>
            </div>
            <DataTable
                data={initPlacements}
                columns={getTableColumns(editToggle, deleteInitPlacement)}
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
