import React,{useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Config } from "../config/connect";
import { Message, useToaster } from 'rsuite';
import axios from "axios";
export default function Header() {
  const api=Config.urlApi;
  const navigate = useNavigate();
  const Logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('branch_Id');
    navigate(`/login`);
  }

  const [dataSaerch,setDataSearch]=useState('');
  const handelSearch=(e)=>{
      e.preventDefault();
      axios.get(api + 'search/'+dataSaerch)
        .then(function (res) {
          console.log(res.status);
          if (res.status === 200) {
            navigate(`/bill?id=`+res.data.sale_uuid);
          }
        }).catch(function (error) {
          console.error('Error:', error);
          showMessage();
      });
  }
  const toaster = useToaster();
  const showMessage = () => {
    const message = (
      <Message showIcon type="warning" closable>
        <strong>ແຈ້ງເຕືອນ!</strong> ລະຫັດບິນບໍ່ຖຶກຕ້ອງ ກະລຸນາກວດຄືນໃຫມ່
      </Message>
    );
    toaster.push(message, { placement:'topCenter' });
  };
const userName=localStorage.getItem('username');
  useEffect(()=>{
  },[userName])
  return (
    <div id="header" className="app-header">
      <div className="navbar-header">
        <Link to={"home"} className="navbar-brand">
          <span className="navbar-logo">
            <img src="./assets/img/logo/logo.png" alt="logo"className="w-50px" />
          </span>
          <b className="me-1 text-gold">ຮ້ານຄຳ </b>
          <span className="text-white">ນາງວຽງຄຳ</span>
        </Link>
        <button
          type="button"
          className="navbar-mobile-toggler"
          data-toggle="app-top-menu-mobile"
        >
          <span className="icon-bar" />
          <span className="icon-bar" />
          <span className="icon-bar" />
        </button>
      </div>
      <div className="navbar-nav">
      <div className="navbar-item">
          <a href="/price-days" target="_blank" className="navbar-link dropdown-toggle icon">
            <i class="fa-solid fa-desktop fs-3 text-white"></i></a>
        </div>
        <div className="navbar-item navbar-form">
          <form onSubmit={handelSearch} name="search">
            <div className="form-group">
              <input
                type="text" onChange={(e)=>setDataSearch(e.target.value)}
                className="form-control"
                placeholder="ຄົ້ນຫາເລກທີບິນ"
              />
              <button type="submit" className="btn btn-search">
              <i className="fas fa-search"  />
              </button>
            </div>
          </form>
        </div>

        
    
        <div className="navbar-item navbar-user dropdown">
          <a href="javascript:;" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown" >
            <img src="/assets/img/user/user.png" alt="" />
            <span className="text-white">
              <span className="d-none d-md-inline">{userName}</span>
              {/* <b className="caret" /> */}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end me-1">
            <a href="javascript:;" onClick={Logout} className="dropdown-item">
            <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}