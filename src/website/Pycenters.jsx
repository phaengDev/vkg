import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormPycenter from './Form-Pycenter';
import { Config, Urlimage } from '../config/connect';
import Alert from '../utils/config';
import Swal from 'sweetalert2';
import axios from 'axios';
function Pycenters() {
  const api = Config.urlApi;
  const img = Urlimage.url;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const backPage = () => {
    navigate(-1);
  };
  const [data, setData] = useState('')
  const handleAdd = () => {
    setOpen(true)
    setData('')
  }

  const [itemPycenter, setItemPycenter] = useState([]);
  const fetchPycenter = async () => {
    try {
      const response = await fetch(api + 'pcenter/');
      const jsonData = await response.json();
      setItemPycenter(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleDelete = (id) => {
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
          axios.delete(api + `pcenter/${id}`).then(function (response) {
            if (response.status === 200) {
              fetchPycenter()
              Alert.successData(response.data.message)
            }
          }).catch((error) => {
            Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ', error)
          });
        }
      });
  }

  const heandleEdit = (data) => {
    setData(data);
    setOpen(true);
  }

  useEffect(() => {
    fetchPycenter();
  }, [])
  return (
    <div id="content" className="app-content px-3">
      <ol class="breadcrumb float-end">
        <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
        <li class="breadcrumb-item "><span role='button' onClick={handleAdd} className='text-blue'> <i className="fas fa-plus"></i> ເພີ່ມຂໍ້ມູນ</span></li>
        <li class="breadcrumb-item active">ຂໍ້ມູນແບບປະຈຳຮ້ານ</li>
      </ol>
      <h1 className="page-header mb-3"><span role='button' onClick={backPage} className='text-danger me-2'><i class="fa-solid fa-circle-arrow-left"></i></span> ນາງແບບປະຈຳຮ້ານ</h1>

      <div className="row">
        {itemPycenter.map((item, index) => (
          <div key={index} className="col-sm-3 col-6">
            <div class="card border-0">
              <img class="card-img-top" src={`${img}slider/${item.pcenter_image}`} alt="" />
              <div class="card-img-overlay">
                <div class="text-white float-end">
                  <a href="#" data-bs-toggle="dropdown" class="btn btn-xs btn-default dropdown-toggle"><i class="fa-solid fa-ellipsis fs-4"></i></a>
                  <div class="dropdown-menu dropdown-menu-end ">
                    <a href="javascript:;" onClick={() => handleDelete(item.pcenter_id)} class="dropdown-item text-red"><i class="fa-solid fa-trash"></i> Delete</a>
                    <a href="javascript:;" onClick={() => heandleEdit(item)} class="dropdown-item text-blue"><i class="fa-regular fa-pen-to-square"></i> Edit</a>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title mb-1px">{item.pcenter_name}</h5>
                <p class="card-text">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      <FormPycenter
        open={open}
        handleClose={() => setOpen(false)}
        data={data}
        fetchData={fetchPycenter}
      />
    </div>
  )
}

export default Pycenters