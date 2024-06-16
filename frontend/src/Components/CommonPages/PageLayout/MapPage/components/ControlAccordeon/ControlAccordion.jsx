import React, {useState} from 'react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "reactstrap";
import {TabsComponent} from "../TabsCmponent/TabsComponent";
import './styles.css';

export const ControlAccordion = () => {
    const [open, setOpen] = useState('');

    const reacttoggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };
    return (
        <>
            <div style={{width: '98%', margin: '0 auto', backgroundColor: '#fff'}}>
                <Accordion open={open} toggle={reacttoggle}>
                    <AccordionItem>
                        <AccordionHeader targetId="1"  style={{backgroundColor: '#fff'}}>Панель настроек</AccordionHeader>
                        <AccordionBody accordionId="1">
                            <TabsComponent/>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
};
