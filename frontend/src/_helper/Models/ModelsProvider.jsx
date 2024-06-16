import React, { useEffect, useState } from 'react';
import {ModelsContext} from './index';
import {getModels, updateModel, createModel, deleteModel, resetModels} from "../../api/methods/models";

export const ModelsProvider = (props) => {
  const [models, setModels] = useState([]);
  const [editingModel, setEditingModel] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const modelModalToggle = () => {
      setIsOpenEditModal(!isOpenEditModal);
  };

    const create = (createData) => {
        createModel(createData)
            .then(() => {
                setIsOpenEditModal(false)
                return getModels()
            })
            .then(resp => {
                setModels(resp);
            });
    };

  const update = (updatedData) => {
      updateModel(updatedData).then(() => {
          setModels(models.map((item) => (item.model_id === updatedData.model_id ? updatedData : item)));
          setIsOpenEditModal(false)
      });
  };

    const remove = (id) => {
        if (window.confirm(`Вы уверены, что хотите удалить эту запись?`)) {
            deleteModel(id).then(() => {
                setModels(models.filter((data) => data.model_id !== id));
            })
        }
    };

    const reset = () => {
        resetModels().then(() => {
            getModels().then(resp => {
                setModels(resp);
            });
        });
    };

  useEffect(() => {
    getModels().then(resp => {
        setModels(resp);
    });

  }, [setModels]);

  return (
    <ModelsContext.Provider
      value={{
        ...props,
        models,
        editingModel,
        setEditingModel,
        isOpenEditModal,
        setIsOpenEditModal,
        modelModalToggle,
        createModel: create,
        updateModel: update,
        deleteModel: remove,
          reset
      }}
    >
      {props.children}
    </ModelsContext.Provider>
  );
};
