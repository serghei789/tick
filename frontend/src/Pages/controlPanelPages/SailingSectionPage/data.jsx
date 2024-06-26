import {
    SailingSectionName
} from "../../../Constant";

export const getTableColumns = (onEdit, onDelete) => [
    {
        name: 'id',
        selector: row => row['id'],
        sortable: true,
        center: false,
    },
    {
        name: SailingSectionName,
        selector: row => row['point_name'],
        sortable: true,
        center: true,
    },
    {
        name: '',
        selector: row => <div className='d-flex gap-2'>
            <div className='btn btn-outline-primary btn-xs' onClick={() => onEdit(row)} title='Изменить'><i className='icon'>
                <i className="fa fa-pencil"></i>
            </i></div>
            <div className='btn btn-outline-secondary btn-xs' onClick={() => onDelete(row.id)} title='Удалить'><i className='icon'>
                <i className="fa fa-trash-o"></i>
            </i></div>
        </div>,
        sortable: true,
        center: true,
    }
];
