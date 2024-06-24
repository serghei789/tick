export const getTableColumns = (onEdit, onDelete) => [
    {
        name: 'imo',
        selector: row => row['imo'],
        sortable: true,
        center: true,
    },
    {
        name: 'корабль',
        selector: row => row['ship'],
        sortable: true,
        center: true,
    },
    {
        name: 'точка А',
        selector: row => row['pointA'],
        sortable: true,
        center: true,
    },
    {
        name: 'точка Б',
        selector: row => row['pointB'],
        sortable: true,
        center: true,
    },
    {
        name: 'дата начала',
        selector: row => row['startDate'],
        sortable: true,
        center: true,
    },
    {
        name: 'дата окончания',
        selector: row => row['endDate'],
        sortable: true,
        center: true,
    },
    // {
    //     name: 'ледовый класс',
    //     selector: row => row['iceClass'],
    //     sortable: true,
    //     center: true,
    // },
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
