
import React, { useEffect, useState } from 'react'
import { Input, Modal, Button, InputGroup,InputPicker } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Config } from '../../config/connect';
import axios from 'axios';
import Swal from "sweetalert2";
import Alert from '../../utils/config';

export default function UserPage() {
  const api = Config.urlApi;
  const [titlename, setTilename] = useState(true)
const branchId=localStorage.getItem('branch_Id');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setInputs({
      userUuid:'',
      userName: '',
      userEmail: '',
      userPassword:'',
      userStatus:'Admin',
      status_offon: 1
    });
    setTilename(true)
  }
  const handleClose = () => setOpen(false);
  const [inputs, setInputs] = useState({
    userUuid:'',
    branch_Id_fk:branchId,
    userName: '',
    userEmail: '',
    userPassword:'',
    userStatus:'Admin',
    status_offon: 1
  })

  const handleChange = (name, value) => {
    setInputs({
      ...inputs, [name]: value
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs)
    try {
      axios.post(api + 'user/create', inputs)
        .then(function (res) {
          if (res.status === 200) {
            handleClose();
            fetchUser();
            Alert.successData(res.data.message)
          } else {
            Alert.errorData(res.data.message)
          }
        });
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const headleEedit = (val) => {
    setInputs({
      userUuid:val.user_uuid,
      userName: val.userName,
      userEmail: val.userEmail,
      userPassword:'',
      userStatus:val.userStatus,
      status_offon: val.status_offon
    });
    setOpen(true);
    setTilename(false)
  }


  const headleDelete = (id) => {
    Swal.fire({
      title: "ຢືນຢັນ?",
      text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
      icon: "warning",
      width: 400,
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ຕົກລົງ",
      denyButtonText: `ຍົກເລີກ`
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(api + `user/${id}`).then(function (resp) {
          if (resp.status === 200) {
            fetchUser();
            Alert.successData(resp.data.message);
          } else if (resp.status === 400) {
            Alert.warningData(resp.data.message);
          } else {
            Alert.errorData(resp.data.message);
          }
        })
          .catch((error) => {  // Fixed the syntax error here
            Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
          });
      }
    });
  };


  const [filterName, setFilteName] = useState([])
  const [itemUser, setItemUser] = useState([]);
  const fetchUser = async () => {
    try {
      const response = await fetch(api + 'user/');
      const jsonData = await response.json();
      setItemUser(jsonData);
      setFilteName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  // const [filter, setFilter] = useState('');
  const Filter = (event) => {
    // setFilter(event)
    setItemUser(filterName.filter(n => n.userName.toLowerCase().includes(event)))
  }

  const [visible, setVisible] = React.useState(false);
  const handleShowpass = () => {
    setVisible(!visible);
  };

  const data1 = [
    'Admin',
    'User'
  ].map(item => ({ label: item, value: item }));

const data2 =[
  { label: 'ເປິດໃຊ້ງານ', value: 1 },
  { label: 'ປິດໃຊ້ງານ', value: 2 }
];


const [openPas,setOpenPass]=useState(false);
const openPass=(index)=>{
  setOpenPass(index)
}

const headlePass=(id)=>{
  setOpenPass(true)
  setDataEdit({
    user_uuid:id
  })
}
const [dataEdit,setDataEdit]=useState({
user_uuid:'',
userPassword:''
})
const handleChangepass=(name,value)=>{
  setDataEdit({
    ...dataEdit,[name]:value
  })
}
const handleEditPass=()=>{
  console.log(dataEdit)
    axios.post(api + 'user/editpass', dataEdit)
      .then(function (res) {
        if (res.status === 200) {
          setOpenPass(false)
          Alert.successData(res.data.message)
        } else {
          Alert.errorData(res.data.message)
        }
      }).catch(function (error) {
        Alert.errorData('ເກີດຂໍ້ຜິດພາດບໍ່ສາມາດແກ້ໄຂລະຫັດໄດ້')
      });
  
}

  useEffect(() => {
    fetchUser();
  }, [branchId]);
  return (
    <>
      <div id="content" class="app-content">
        <ol class="breadcrumb float-end">
          <li class="breadcrumb-item">
            <button type="button" onClick={handleOpen} className="btn btn-sm btn-dark"><i class="fa-solid fa-plus"></i> ເພີ່ມຂໍ້ມູນໃໝ່</button>
          </li>
        </ol>
        <h1 class="page-header mb-3">ຂໍ້ມູນຜູ້ເຂົ້າໃຊ້ລະບົບ</h1>
        <div className="panel pt-4 px-2">
          <div className="table-responsive">
            <div className="row mb-3">
              <div className="col-sm-9 fs-20px"> </div>
              <div className="col-sm-3">
                <div className='input-group' >
                  <input type='text' className='form-control' onChange={(event) => Filter(event.target.value)} placeholder="ຄົ້ນຫາ" />
                </div>
              </div>
            </div>
            <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
              <thead className='thead-plc'>
                <tr>
                  <th width="1%" className='text-center'>ລ/ດ</th>
                  <th className=''>ຊື່ຜູ້ເຂົ້າໃຊ້</th>
                  <th>ຊື່ອີເມວ</th>
                  <th width="15%" className='text-center'>ປະເພດຜູ້ໃຊ້</th>
                  <th className='text-center'>ສະຖານະ</th>
                  <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                </tr>
              </thead>
              <tbody>
                {itemUser.length > 0 ? (
                  itemUser.map((item, key) => (
                    <tr key={key}>
                      <td className='text-center' >{key + 1}</td>
                      <td className=''>{item.userName}</td>
                      <td>{item.userEmail}</td>
                      <td  className='text-center'>{item.userStatus}</td>
                      <td width='10%' className='text-center'>
                        <span className={`badge ${item.status_offon === 1 ? 'bg-primary' : 'bg-danger'}`}>
                          {item.status_offon === 1 ? 'ເປິດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                        </span>
                      </td>
                      <td className='text-center' width='10%'>
                        <button type='button' onClick={() => headlePass(item.user_uuid)} className="btn btn-green btn-xs me-2">
                        <i class="fa-solid fa-key"></i>
                        </button>
                        <button type='button' onClick={() => headleEedit(item)} className="btn btn-blue btn-xs me-2">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type='button' onClick={() => headleDelete(item.user_Id)} className="btn btn-red btn-xs">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className='py-1'>{titlename === true ? 'ແບບຟອມພີ່ມຜູ້ເຂົ້າໃຊ້' : 'ແບບຟອມແກ້ໄຂຜູ້ເຂົ້າໃຊ້'} </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-sm-12 mb-2">
                <div className="form-group">
                  <label htmlFor="" className='form-label'>ຊື່ຜູ້ເຂົ້າໃຊ້</label>
                  <Input type='text' name='userName' value={inputs.userName} onChange={(e) => handleChange('userName', e)} placeholder='ຊື່ ແລະ ນາມສະກຸນ' required />
                </div>
              </div>
              <div className={`mb-2 ${titlename === true ?'col-sm-6':'col-sm-12'}`} >
                <div className="form-group">
                  <label htmlFor="" className='form-label'>ຊື່ອີເມວ</label>
                  <Input type='text' value={inputs.userEmail} onChange={(e) => handleChange('userEmail', e)} placeholder='**@.gmail'  required />
                </div>
              </div>
              {titlename===true?(
              <div className="col-sm-6 mb-2">
                <div className="form-group">
                  <label htmlFor="" className='form-label'>ລະຫັດຜ່ານ</label>
                  <InputGroup inside >
                    <Input type={visible ? 'text' : 'password'} onChange={(e) => handleChange('userPassword', e)} placeholder='******'  required  />
                    <InputGroup.Button onClick={handleShowpass}>
                      {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                  </InputGroup>
                </div>
              </div>
              ):('')}
            <div className="col-sm-6 mb-2">
            <div className="form-group">
              <label htmlFor="" className='form-label'>ປະເພດຜູ້ໃຊ້ </label>
              <InputPicker data={data1} value={inputs.userStatus} onChange={(e) => handleChange('userStatus', e)} block />
              </div>
            </div>
            <div className="col-sm-6 mb-2">
            <div className="form-group">
              <label htmlFor="" className='form-label'>ສະຖານະ </label>
              <InputPicker data={data2} defaultValue={inputs.status_offon} onChange={(e) => handleChange('status_offon', e)} block />
              </div>
            </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' appearance="primary"> {titlename === true ? 'ບັນທຶກ' : 'ແກ້ໄຂ'}  </Button>
            <Button onClick={handleClose} color='red' appearance="primary">
              ຍົກເລີກ
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      
      <Modal open={openPas} onClose={()=>openPass(false)}>
        <Modal.Header>
          <Modal.Title className='py-1'>ຟອມແກ້ໄຂລະຫັດຜ່ານ</Modal.Title>
        </Modal.Header>
          <Modal.Body>
                <div className="form-group">
                  <label htmlFor="" className='form-label'>ລະຫັດຜ່ານໃໝ່</label>
                  <InputGroup inside >
                    <Input type={visible ? 'text' : 'password'} onChange={(e) => handleChangepass('userPassword', e)} placeholder='******'  required  />
                    <InputGroup.Button onClick={handleShowpass}>
                      {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                  </InputGroup>
                </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='button' onClick={handleEditPass} appearance="primary">ແກ້ໄຂ </Button>
            <Button onClick={()=>openPass(false)} color='red' appearance="primary">
              ຍົກເລີກ
            </Button>
          </Modal.Footer>
      </Modal>
      
      </>

  )
}
