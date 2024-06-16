import React from 'react';
import { Link } from 'react-router-dom';
import rosatomImg from "../../assets/images/logo/logo-icon.png"

const SidebarIcon = () => {
  return (
    <div className="logo-icon-wrapper">
      <Link to={`${process.env.PUBLIC_URL}/main`}>
        <img
            style={{width: 30}}
          className="img-fluid"
          src={rosatomImg}
          alt=""
        />
      </Link>
    </div>
  );
};

export default SidebarIcon;
