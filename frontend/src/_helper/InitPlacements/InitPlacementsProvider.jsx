import React, { useEffect, useState } from 'react';
import {InitPlacementsContext} from './index';
import {getInitPlacements, updateInitPlacement, createInitPlacement, deleteInitPlacement, resetInitPlacements} from "../../api/methods/initPlacements";

export const InitPlacementsProvider = (props) => {
    const [initPlacements, setInitPlacements] = useState([]);
    const [editingInitPlacement, setEditingInitPlacement] = useState(null);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const initPlacementModalToggle = () => {
        setIsOpenEditModal(!isOpenEditModal);
    };

    const create = (createData) => {
        createInitPlacement(createData)
            .then(() => {
                setIsOpenEditModal(false)
                return getInitPlacements()
            })
            .then(resp => {
                setInitPlacements(resp);
            });
    };

    const update = (updatedData) => {
        updateInitPlacement(updatedData).then(() => {
            setInitPlacements(initPlacements.map((item) => (item.id === updatedData.id ? updatedData : item)));
            setIsOpenEditModal(false)
        });
    };

    const remove = (id) => {
        if (window.confirm(`Вы уверены, что хотите удалить эту запись?`)) {
            deleteInitPlacement(id).then(() => {
                setInitPlacements(initPlacements.filter((data) => data.id !== id));
            })
        }
    };

    const reset = () => {
        resetInitPlacements().then(() => {
            getInitPlacements().then(resp => {
                setInitPlacements(resp);
            });
        });
    };

    useEffect(() => {
        getInitPlacements().then(resp => {
            setInitPlacements(resp);
        });

    }, [setInitPlacements]);

    return (
        <InitPlacementsContext.Provider
            value={{
                ...props,
                initPlacements,
                editingInitPlacement,
                setEditingInitPlacement,
                isOpenEditModal,
                setIsOpenEditModal,
                initPlacementModalToggle,
                createInitPlacement: create,
                updateInitPlacement: update,
                deleteInitPlacement: remove,
                reset
            }}
        >
            {props.children}
        </InitPlacementsContext.Provider>
    );
};
