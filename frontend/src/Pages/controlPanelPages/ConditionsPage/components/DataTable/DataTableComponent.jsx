import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component';
import {getTableColumns} from "../../data";
import {useContext} from "react";
import {ConditionsContext} from "../../../../../_helper/Conditions";

const DataTableComponent = () => {

    const { conditions, isOpenEditModal, setIsOpenEditModal, setEditingCondition } = useContext(ConditionsContext);

    const editToggle = (condition) => {
        if(condition) {
            setEditingCondition(condition)
            setIsOpenEditModal(true)
        }
        setIsOpenEditModal(!isOpenEditModal);
    };

    return (
        <Fragment><div className='text-end'>
        </div>
            <DataTable
                data={conditions}
                columns={getTableColumns(editToggle)}
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
