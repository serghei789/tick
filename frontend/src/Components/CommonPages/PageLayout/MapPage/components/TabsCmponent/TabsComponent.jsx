import React, {useState} from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import {P} from "../../../../../../AbstractElements";
import {ConditionsName, ModelsName, RequestsName} from "../../../../../../Constant";
import ModelTable from "../../../controlPanelPages/ModelsPage/components/DataTable/DataTableComponent";
import RequestsTable from "../../../controlPanelPages/RequestsPage/components/DataTable/DataTableComponent";
import {ConditionsPanel} from "../../../controlPanelPages/ConditionsPage/components/ConditionsPanel";
import {EditModal as EditModelModal} from "../../../controlPanelPages/ModelsPage/components/EditModal/EditModal";
import {EditModal as EditRequestModal} from "../../../controlPanelPages/RequestsPage/components/EditModal/EditModal";

export const TabsComponent = () => {

    const [activeTab, setActiveTab] = useState('1');
    return (
        <div>
            <div className="tabbed">
                <Nav className={'pull-right nav-pills nav-primary'}>
                    <NavItem>
                        <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                            {ConditionsName}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                            {/*{glassIcon ? item.glassIcon : ''}*/} {ModelsName}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
                            {/*{contactIcon ? item.contactIcon : ''}*/} {RequestsName}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '4' ? 'active' : ''} onClick={() => setActiveTab('4')}>
                            {/*{contactIcon ? item.contactIcon : ''} */}Расположение кораблей
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '7' ? 'active' : ''} onClick={() => setActiveTab('7')}>
                            {/*{contactIcon ? item.contactIcon : ''} */}Пункты сбора
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '5' ? 'active' : ''} onClick={() => setActiveTab('5')}>
                            {/*{contactIcon ? item.contactIcon : ''} */}Ледовая обстановка
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '6' ? 'active' : ''} onClick={() => setActiveTab('6')}>
                            {/*{contactIcon ? item.contactIcon : ''} */}Корабли
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }} ></P>
                        <P attrPara={{ className: 'mb-0' }} ></P>
                        <ConditionsPanel />
                    </TabPane>
                    <TabPane tabId="2" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }}>{' '}</P>
                        <P attrPara={{ className: 'mb-0' }}>{' '}</P>
                        <ModelTable />
                        <EditModelModal />
                    </TabPane>
                    <TabPane tabId="3" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }}></P>
                        <P attrPara={{ className: 'mb-0' }}></P>
                        <RequestsTable />
                        <EditRequestModal />
                    </TabPane>
                    <TabPane tabId="4" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }}></P>
                        <P attrPara={{ className: 'mb-0' }}></P>
                    </TabPane>
                    <TabPane tabId="7" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }}></P>
                        <P attrPara={{ className: 'mb-0' }}></P>
                    </TabPane>
                    <TabPane tabId="5" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }}></P>
                        <P attrPara={{ className: 'mb-0' }}></P>
                    </TabPane>
                    <TabPane tabId="6" style={{paddingTop: 40}}>
                        <P attrPara={{ className: 'mb-0' }}></P>
                        <P attrPara={{ className: 'mb-0' }}></P>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
};
