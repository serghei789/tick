export const getTableColumns = (onEdit) => [
    {
        name: 'Название',
        selector: row => row['name'],
        sortable: true,
        center: false,
    },
    {
        name: 'Значение',
        selector: row => row['value'],
        sortable: true,
        center: true,
    },
    {
        name: '',
        selector: row => <div className='btn btn-outline-primary btn-xs' onClick={() => onEdit(row)} title='Изменить'>
            <i className='icon'>
                <i className="fa fa-pencil"></i>
            </i>
        </div>,
            /*<span className='task-action-btn mb-5'>
                            <span className='action-box large complete-btn' title='Delete Task' onClick={() => onEdit(row)}>
                              <i className='icon'>
                                <i className="fa fa-pencil"></i>
                              </i>
                            </span>
                      </span>*/
        sortable: true,
        center: true,
    }
];
