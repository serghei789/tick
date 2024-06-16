import React, { useState } from 'react';
import Context from './index';

const SearchResultProvider = (props) => {
    const [tabsData] = useState('');

    // useEffect(() => {
    //     axios.get('').then((resp) => {
    //         setTabsData(resp.data);
    //     });
    // }, [setTabsData]);

    return (
        <Context.Provider
            value={{
                ...props,
                tabsData
            }}
        >
            {props.children}
        </Context.Provider>
    );
};

export default SearchResultProvider;
