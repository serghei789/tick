import React, { useEffect, useState } from 'react';
import { ShipsContext} from './index';
import {getShips} from "../../api/methods/ships";

export const ShipsProvider = (props) => {
  const [ships, setShips] = useState([]);
  const [editingShip, setEditingShip] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const shipModalToggle = () => {
      setIsOpenEditModal(!isOpenEditModal);
  };

    // const create = (createData) => {
    //     createShip(createData)
    //         .then(() => {
    //             setIsOpenEditModal(false)
    //             return getShips()
    //         })
    //         .then(resp => {
    //             setShips(resp);
    //         });
    // };
  //
  // const update = (updatedData) => {
  //     updateShip(updatedData).then(() => {
  //         setShips(ships.map((item) => (item.id === updatedData.id ? updatedData : item)));
  //         setIsOpenEditModal(false)
  //     });
  // };

    // const remove = (id) => {
    //     if (window.confirm(`Вы уверены, что хотите удалить эту запись?`)) {
    //         deleteShip(id).then(() => {
    //             setShips(ships.filter((data) => data.id !== id));
    //         })
    //     }
    // };

  useEffect(() => {
      getShips().then(resp => {
        setShips(resp);
    });

  }, [setShips]);

  return (
    <ShipsContext.Provider
      value={{
        ...props,
        ships,
        editingShip,
        setEditingShip,
        isOpenEditModal,
        setIsOpenEditModal,
        shipModalToggle,
      }}
    >
      {props.children}
    </ShipsContext.Provider>
  );
};
