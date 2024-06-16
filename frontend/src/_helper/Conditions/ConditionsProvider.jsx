import React, { useEffect, useState } from 'react';
import {ConditionsContext} from './index';
import {getConditions, resetConditions, updateConditions} from "../../api/methods/conditions";

export const ConditionsProvider = (props) => {
  const [conditions, setConditions] = useState([]);
  const [editingCondition, setEditingCondition] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const conditionModalToggle = () => {
      setIsOpenEditModal(!isOpenEditModal);
  };

  const update = (updatedData) => {
      updateConditions(updatedData).then(() => {
          setConditions(conditions.map((item) => (item.name === updatedData.name ? updatedData : item)));
          setIsOpenEditModal(false)
          getConditions().then(resp => {
              setConditions(resp);
          });
      });
  };

  const reset = () => {
      resetConditions().then(() => {
          getConditions().then(resp => {
              setConditions(resp);
          });
      });
  };

  useEffect(() => {
    getConditions().then(resp => {
        setConditions(resp);
    });

  }, [setConditions]);

  return (
    <ConditionsContext.Provider
      value={{
        ...props,
        conditions,
        editingCondition,
        setEditingCondition,
        isOpenEditModal,
        setIsOpenEditModal,
        conditionModalToggle,
        update,
        reset
      }}
    >
      {props.children}
    </ConditionsContext.Provider>
  );
};
