import React,{useState} from 'react';
// import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import {Config} from '../../config/connect';
import { Message, useToaster } from 'rsuite';
function Login() {
  const api = Config.urlApi;
  // const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    userEmail: '',
    userPass: ''
})

  const handleChange = (name, value) => {
    setInputs({
        ...inputs, [name]: value
    });
}

const handleSubmit = async (e) => {
  e.preventDefault();
  axios.post(api + 'login/check', inputs)
      .then(function (res) {
        console.log(res.data)
          if (res.status === 200) {
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('username', res.data.username);
              localStorage.setItem('user_uuid', res.data.user_uuid);
              localStorage.setItem('userEmail', res.data.userEmail);
              localStorage.setItem('branch_Id', res.data.branch_Id);
              window.location.href = '/home';
          } else {
            showMessage()
          }
      })
      .catch(function (error) {
          console.error('Error:', error);
          showMessage()
      });
};
const [showPassword, setShowPassword] = useState(false);
// const [password, setPassword] = useState('');
const handleCheckboxChange = () => {
  setShowPassword(prevState => !prevState);
};

const [placement, setPlacement] = React.useState('topCenter');
const toaster = useToaster();

const showMessage = () => {
  const message = (
    <Message showIcon type="warning" closable>
      <strong>ແຈ້ງເຕືອນ!</strong> ຊື່ ແລະ ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ.
    </Message>
  );
  // toaster.push(message, { placement });
  toaster.push(message, { placement:'topCenter' });
};

  return (
    <div id="app" className="app">
    <div className="login login-v2 fw-bold">
      <div className="login-cover">
        <div
          className="login-cover-img"
          style={{
            backgroundImage: "url(/assets/img/login-bg/login-gold.jpg)"
          }}
          data-id="login-cover-image"
        />
        <div className="login-cover-bg" />
      </div>
      <div className="login-container">
        <div className="login-header">
          <div className="brand">
            <div className="d-flex align-items-center">
              <span className="img" ><img src="./assets/img/logo/logo.png" width={50} alt="" /></span> <b className='me-2'>ຮ້ານຄຳ </b> ນາງວຽງຄຳ
            </div>
            <small>ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຖຶກຕ້ອງ ເພື່ອເຂົ້າສູ້ລະບົບ</small>
          </div>
          <div className="icon">
          <i class="fa-solid fa-user-lock"></i>
          </div>
        </div>
        <div className="login-content">
          <form  onSubmit={handleSubmit}>
            <div className="form-floating mb-20px">
              <input type="text"  className="form-control fs-13px h-45px border-0" placeholder="ຊື່ຜູ້ເຂົ້າໃຊ້" id="userEmail"  name='userEmail' onChange={(e) => handleChange('userEmail', e.target.value)}  required />
              <label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px" >
                ຊື່ຜູ້ໃຊ້
              </label>
            </div>
            <div className="form-floating mb-20px">
              <input  type={showPassword ? "text" : "password"}  className="form-control fs-13px h-45px border-0" placeholder="ລະຫັດຜ່ານ" name='userPass' id='userPass' onChange={(e) => handleChange('userPass', e.target.value)} required />
              <label htmlFor="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px"  >
                ລະຫັດຜ່ານ
              </label>
            </div>
            <div className="form-check mb-20px">
              <input className="form-check-input border-0" type="checkbox" checked={showPassword} 
          onChange={handleCheckboxChange}  id="showPass" />
              <label className="form-check-label fs-13px text-gray-500" htmlFor="showPass" > ສະແດງລະຫັດ</label>
            </div>
            <div className="mb-20px">
              <button type="submit" className="btn btn-theme d-block w-100 h-45px btn-lg" >
                ເຂົ້າສູ່ລະບົບ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login