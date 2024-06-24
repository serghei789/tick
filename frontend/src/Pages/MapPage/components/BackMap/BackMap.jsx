import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css'
import {MapApi} from "../../../../api";

const BackMap = () => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const fetchHtml = async () => {
            try {
                const response = await axios.get(MapApi);
                setHtmlContent(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке HTML:', error);
            }
        };

        fetchHtml();
    }, []);

    if(htmlContent){
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = htmlContent;
        const block = document.getElementById('script-div')
        block.appendChild(script);
    }

    return (
        <div id='script-div'>
            <div id="polzunok" style={{margin: "15px 0 15px 0"}}></div>

            <div id="map" style={{width: "100%", height: "500px", marginTop: "15px"}}></div>
        </div>

    );
};

export default BackMap;
