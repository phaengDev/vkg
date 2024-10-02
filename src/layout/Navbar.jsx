import React, { useEffect, useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import mainMenu  from '../utils/mainMenu.json'
import _ from 'lodash';
export default function Navbar() {
  const userName=localStorage.getItem('username');
  const dataMain=mainMenu.main;

  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);
  useEffect(()=>{
    setPath(pathName);
    
  },[dataMain,pathName])
    return (
      <>
     <div id="sidebar" className="app-sidebar" data-bs-theme="dark">
    <div
      className="app-sidebar-content"
      data-scrollbar="true"
      data-height="100%"
    >
      <div className="menu">
        <div className="menu-profile">
          <a href="javascript:;" className="menu-profile-link" data-toggle="app-sidebar-profile" data-target="#appSidebarProfileMenu" >
            <div className="menu-profile-cover with-shadow" />
            <div className="menu-profile-image">
              <img src="/assets/img/user/user.png" alt="" />
            </div>
            <div className="menu-profile-info">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">ຮ້ານຂາຍຄຳ ວຽງຄຳ</div>
              </div>
              <small>{userName}</small>
            </div>
          </a>
        </div>
        <div className="menu-header p-1">ລາຍການເມນູ </div>
         {dataMain.map((item, index) =>
        item.sts === '1'? (
        <div key={index} className={`menu-item fs-14px ${path === `/${item.link}` ? 'active' : ''}`}>
          <Link to={item.link} className="menu-link ">
            <div className="menu-icon fs-18px">
            <i className={item.icon} />
            </div>
            <div className="menu-text"> {item.mainName}</div>
          </Link>
        </div>
      ):(
        <div key={index} className={`menu-item has-sub fs-14px  ${
          item.datasub.some(subItem => path === `/${subItem.parth}`) ? 'active' : ''
        }`}>
          <a href="javascript:;" className="menu-link">
            <div className="menu-icon">
            <i className={item.icon} />
            </div>
            <div className="menu-text"> {item.mainName}</div>
            <div className="menu-caret" />
          </a>
          <div className="menu-submenu fs-13px">
            {item.datasub.map((val,key)=>
          <div key={key} className={`menu-item ${path === `/${val.parth}` ? 'active' : ''}`}>
              <Link to={val.parth} className={`menu-link`}>
                <div className="menu-text"> {val.sumName}</div>
              </Link>
            </div>
            )}
          </div>
        </div>
        )
        )}
        <div className="menu-item d-flex">
          <a
            href="javascript:;"
            className="app-sidebar-minify-btn ms-auto d-flex align-items-center text-decoration-none"
            data-toggle="app-sidebar-minify"
          >
            <i className="fa fa-angle-double-left" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <div className="app-sidebar-bg" data-bs-theme="dark" />
  <div className="app-sidebar-mobile-backdrop">
    <a href="#" data-dismiss="app-sidebar-mobile" className="stretched-link" />
  </div>
  </>
    )
}
