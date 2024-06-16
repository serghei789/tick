import React, { useEffect, useState } from 'react';
import {RequestsContext} from './index';
import {createRequest, deleteRequest, getRequests, resetRequests, updateRequest} from "../../api/methods/requests";

export const RequestsProvider = (props) => {
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const requestModalToggle = () => {
      setIsOpenEditModal(!isOpenEditModal);
  };

  const create = (createData) => {
      createRequest(createData)
          .then(() => {
          setIsOpenEditModal(false)
          return getRequests()
      })
          .then(resp => {
              setRequests(resp);
          });
  };

  const update = (updatedData) => {
      updateRequest(updatedData).then(() => {
          setRequests(requests.map((item) => (item.id === updatedData.id ? updatedData : item)));
          setIsOpenEditModal(false)
      });
  };

  const remove = (id) => {
      if (window.confirm(`Вы уверены, что хотите удалить эту запись?`)) {
          deleteRequest(id).then(() => {
              setRequests(requests.filter((data) => data.id !== id));
          })
      }
  };

    const reset = () => {
        resetRequests().then(() => {
            getRequests().then(resp => {
                setRequests(resp);
            });
        });
    };

  useEffect(() => {
    getRequests().then(resp => {
        setRequests(resp);
    });

  }, [setRequests]);

  return (
    <RequestsContext.Provider
      value={{
        ...props,
        requests,
        editingRequest,
        setEditingRequest,
        isOpenEditModal,
        setIsOpenEditModal,
        requestModalToggle: requestModalToggle,
        createRequest: create,
        updateRequest: update,
        deleteRequest: remove,
          reset
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};
