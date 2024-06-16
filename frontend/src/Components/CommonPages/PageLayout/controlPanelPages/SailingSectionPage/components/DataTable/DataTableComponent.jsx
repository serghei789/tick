import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component';
import {getTableColumns} from "../../data";
import {useContext} from "react";
import {SailingSectionsContext} from "../../../../../../../_helper/SailingSections";
import {Reset} from "../../../../../../../Constant";

const DataTableComponent = () => {
    const { sailingSections, isOpenEditModal, setIsOpenEditModal, setEditingSailingSection, deleteSailingSection, reset } = useContext(SailingSectionsContext);

    const editToggle = (sailingSection) => {
        if(sailingSection) {
            setEditingSailingSection(sailingSection)
            setIsOpenEditModal(true)
        }
        setIsOpenEditModal(!isOpenEditModal);
    };

    const createHandler = () => {
        setEditingSailingSection(null)
        setIsOpenEditModal(true)
    }

    return (
        <Fragment>
            <div className='text-end'>
                <div className='btn btn-primary' onClick={createHandler}>
                    Создать пункт сбора
                </div>
                <div className='btn btn-outline-primary ms-2' onClick={reset}>
                    {Reset}
                </div>
            </div>
            <DataTable
                data={sailingSections}
                columns={getTableColumns(editToggle, deleteSailingSection)}
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
