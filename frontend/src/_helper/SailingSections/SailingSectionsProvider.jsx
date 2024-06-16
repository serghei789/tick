import React, { useEffect, useState } from 'react';
import {SailingSectionsContext} from './index';
import {getSailingSections, updateSailingSection, createSailingSection, deleteSailingSection, resetSailingSections} from "../../api/methods/sailingSections";

export const SailingSectionsProvider = (props) => {
    const [sailingSections, setSailingSections] = useState([]);
    const [editingSailingSection, setEditingSailingSection] = useState(null);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);

    const sailingSectionModalToggle = () => {
        setIsOpenEditModal(!isOpenEditModal);
    };

    const create = (createData) => {
        createSailingSection(createData)
            .then(() => {
                setIsOpenEditModal(false)
                return getSailingSections()
            })
            .then(resp => {
                setSailingSections(resp);
            });
    };

    const update = (updatedData) => {
        updateSailingSection(updatedData).then(() => {
            setSailingSections(sailingSections.map((item) => (item.id === updatedData.id ? updatedData : item)));
            setIsOpenEditModal(false)
        });
    };

    const remove = (id) => {
        if (window.confirm(`Вы уверены, что хотите удалить эту запись?`)) {
            deleteSailingSection(id).then(() => {
                setSailingSections(sailingSections.filter((data) => data.id !== id));
            })
        }
    };

    const reset = () => {
        resetSailingSections().then(() => {
            getSailingSections().then(resp => {
                setSailingSections(resp);
            });
        });
    };

    useEffect(() => {
        getSailingSections().then(resp => {
            setSailingSections(resp);
        });

    }, [setSailingSections]);

    return (
        <SailingSectionsContext.Provider
            value={{
                ...props,
                sailingSections,
                editingSailingSection,
                setEditingSailingSection,
                isOpenEditModal,
                setIsOpenEditModal,
                sailingSectionModalToggle,
                createSailingSection: create,
                updateSailingSection: update,
                deleteSailingSection: remove,
                reset
            }}
        >
            {props.children}
        </SailingSectionsContext.Provider>
    );
};
