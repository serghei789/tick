import {ModelLateArrival, ModelName, ModelNecessity, ModelSpeed, ModelStart, ModelTime} from "../../../Constant";

export const getTableColumns = (onEdit, onDelete) => [
    {
        name: 'id',
        selector: row => row['model_id'],
        sortable: true,
        center: false,
    },
    {
        name: ModelName,
        selector: row => row['model_name'],
        sortable: true,
        center: true,
    },
    {
        name: ModelStart,
        selector: row => row['c_start'],
        sortable: true,
        center: true,
    },
    {
        name: ModelNecessity,
        selector: row => row['c_necessity'],
        sortable: true,
        center: true,
    },
    {
        name: ModelTime,
        selector: row => row['c_time'],
        sortable: true,
        center: true,
    },
    {
        name: ModelSpeed,
        selector: row => row['c_speed'],
        sortable: true,
        center: true,
    },
    {
        name: ModelLateArrival,
        selector: row => row['c_late_arrival'],
        sortable: true,
        center: true,
    },
    {
        name: '',
        selector: row => <div className='d-flex gap-2'>
            <div className='btn btn-outline-primary btn-xs' onClick={() => onEdit(row)} title='Изменить'><i className='icon'>
                <i className="fa fa-pencil"></i>
            </i></div>
            <div className='btn btn-outline-secondary btn-xs' onClick={() => onDelete(row.model_id)} title='Удалить'><i className='icon'>
                <i className="fa fa-trash-o"></i>
            </i></div>
        </div>,
        sortable: true,
        center: true,
    }
];
