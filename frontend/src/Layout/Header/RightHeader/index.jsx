import React, { Fragment } from 'react';

import Searchbar from './Searchbar';
import MoonLight from './MoonLight';
import { UL } from '../../../AbstractElements';
import { Col } from 'reactstrap';

const RightHeader = () => {
  return (
    <Fragment>
      <Col xxl='7' xl='6' md='7' className='nav-right pull-right right-header col-8 p-0 ms-auto'>
        <UL attrUL={{ className: 'simple-list nav-menus flex-row' }}>
          <Searchbar />
          <MoonLight />
        </UL>
      </Col>
    </Fragment>
  );
};

export default RightHeader;
