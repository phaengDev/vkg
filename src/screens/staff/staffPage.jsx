import React, { useState, useEffect,useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Placeholder } from 'rsuite'
import './../../idCard.css';
import { Config,Urlimage } from './../../config/connect';
import Alert from './../../utils/config';
import moment from 'moment';
import Swal from "sweetalert2";
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import Modal from 'react-bootstrap/Modal';
import { toPng } from 'html-to-image';

export default function StaffPage() {
  const api = Config.urlApi;
  const url=Urlimage.url;
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState([])
  const [itemStaff, setItemStaff] = useState([]);

  const fetchStaff = async () => {
    try {
      const response = await fetch(api + 'staff');
      const jsonData = await response.json();
      setItemStaff(jsonData);
      setFilterName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }
  // const [filter, setFilter] = useState('');
  const Filter = (event) => {
    setItemStaff(filterName.filter(n => n.first_name.toLowerCase().includes(event)))
  }

  //===========================\\
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(100);
  const handleShowLimit = (value) => {
    setitemsPerPage(value);
  };
  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
    setI(indexOfLastItem + 1)
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(itemStaff.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemStaff.slice(indexOfFirstItem, indexOfLastItem);

  const [i, setI] = useState(1);
  const qtyItem = itemStaff.length;
  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li key={number} className={`page-item ${currentPage === number ? "active" : ''}`} >
          <span role="button" id={number} onClick={handleClick} className="page-link border-blue">{number}</span>
        </li>
      );
    } else {
      <li key={number} className="page-item active" >
        <span role="button" className="page-link border-blue">1</span>
      </li>
    }
  });

  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);
    setI(indexOfLastItem - 1)

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };
  //============= delete ==============\\
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
        axios.delete(api + `staff/${id}`).then(function (response) {
          if (response.status === 200) {
            fetchStaff();
            Alert.successData(response.data.message)
          } else {
            Alert.errorData(response.data.message)
          }
        }).catch((error) => {
          Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ ຂໍ້ມູນອາດມິການໃຊ້ງານຢູ່', error)
        });
      }
    });
  }

  const handleEdit = (id) => {
    navigate('/edit-staff?id=' + id);
  }
  //============== 
  const [idcode, setIdcode] = useState('');
  const [staff, setStaff] = useState({
    profile:'',
    id_code:'',
    first_name:'',
    last_name:'',
    staff_tel:'',
    staff_email:''

  })
  const [showqr, setShowqr] = useState(false)
  const viewBarcode = (index) => {
    setIdcode(index.id_code);
    setStaff({
      profile:index.profile,
    id_code:index.id_code,
    first_name:index.first_name,
    last_name:index.last_name,
    staff_tel:index.staff_tel,
    staff_email:index.staff_email
    });
    setShowqr(true)
  }
  const qrRef = useRef(null);
    const downloadQrCode = () => {
      if (qrRef.current === null) {
        return;
      }
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = idcode+'.jpg';
          link.click();
        })
        .catch((err) => {
          console.error('Failed to generate QR code image:', err);
        });
    };
//=============== =============== =
  useEffect(() => {
    fetchStaff();
  }, []);
  return (
    <>
      <div id="content" class="app-content px-2">
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
          <li className="breadcrumb-item active">ລາຍການພະນັກງານ</li>
          <li className="breadcrumb-item "><Link to={'/form-staff'} className='text-green'> <i className="fas fa-plus"></i> ເພີ່ມພະນັກງານໃໝ່</Link></li>
        </ol>
        <h1 class="page-header mb-3">ຂໍ້ມູນພະນັກງານ</h1>
        <div className="panel pt-4 px-2">
          <div className="table-responsive">
            <div class="d-lg-flex align-items-center mb-2">
              <div class="d-lg-flex d-none align-items-center text-nowrap">
                ສະແດງ:
                <select onChange={(e) => handleShowLimit(e.target.value)} class="form-select ms-2  ">
                  <option selected>50</option>
                  <option>100</option>
                  <option>150</option>
                </select>
              </div>
              <div class="d-lg-block d-none ms-2 text-body text-opacity-50">ລາຍການ</div>
              <div class="pagination pagination-sm mb-0 ms-auto justify-content-center">
                <Input  onChange={(event) => Filter(event)} placeholder='ຄົ້ນຫາ...' />
              </div>
            </div>
            <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
              <thead className='thead-plc'>
                <tr>
                  <th width="1%" className='text-center'>ລ/ດ</th>
                  <th width="5%" className='text-center'>ຮູບ</th>
                  <th className='text-center'>ລະຫັດ</th>
                  <th className=''>ຊື່ແລະນາມສະກຸນ</th>
                  <th className='text-center'>ວັນເດືອນປິເກີດ</th>
                  <th className='text-center'>ເບີໂທລະສັບ</th>
                  <th className=''>ອີເມວ</th>
                  <th colSpan={3} className='text-center'>ທີ່ຢູ່ປະຈຸບັນ</th>
                  <th className=''>ວັນທີເຂົ້າເຂົ້າວຽກ</th>
                  <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading === true ? (<tr>
                  <td colSpan={12}><Placeholder.Grid rows={7} columns={9} active /></td>
                </tr>) : (<>
                  {
                    currentItems.length > 0 ? (
                      currentItems.map((item, key) => (
                        <tr key={key}>
                          <td className='text-center' width='1%'>{key + 1}</td>
                        <td className='text-center'> <img src={item.profile && item.profile !=='null'? url+'porfile/'+item.profile: 'assets/img/icon/user.webp'} class="rounded h-30px" /></td>
                          <td className='text-center'>{item.id_code}</td>
                          <td>{item.first_name + ' ' + item.last_name}</td>
                          <td className='text-center'>{moment(item.birthday).format('DD/MM/YYYY')}</td>
                          <td className='text-center'>{item.staff_tel} </td>
                          <td className=''>{item.staff_email} </td>
                          <td>{item.village_name}</td>
                          <td>{item.district_name}</td>
                          <td>{item.province_name}</td>
                          <td className='text-center'>{moment(item.register_date).format('DD/MM/YYYY')}</td>
                          <td className='text-center' width='10%'>
                            <button type='button' onClick={() => viewBarcode(item)} className="btn btn-green btn-xs me-2">
                              <i class="fa-solid fa-qrcode"></i>
                            </button>
                            <button type='button' onClick={() => handleEdit(item.staff_uuid)} className="btn btn-blue btn-xs me-2">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>

                            <button type='button' onClick={() => headleDelete(item.staff_uuid)} className="btn btn-red btn-xs">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                      </tr>
                    )
                  }
                </>)}
              </tbody>
            </table>
            <div class="d-md-flex align-items-center mb-4">
              <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
              </div>
              <ul className="pagination  mb-0 ms-auto justify-content-center">
                <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} >ກອນໜ້າ</span></li>
                {minPageNumberLimit >= 1 ? (
                  <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                ) : ''}
                {renderPageNumbers}
                {pages.length > maxPageNumberLimit ? (
                  <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                ) : ''}
                <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}>ໜ້າຕໍ່ໄປ</span></li>
              </ul>
            </div>
          </div>
        </div>

        <Modal size='sm' show={showqr} onHide={() => setShowqr()}>
          <Modal.Body className='text-center p-0'>
            <div ref={qrRef} class="padding-card">
                <div class="font-card">
                    <div class="top-card">
                        <img src={staff.profile && staff.profile !=='null'? url+'porfile/'+staff.profile: 'assets/img/icon/user.webp'} />
                    </div>
                    <div class="bottom-card">
                        <p>ຮ້ານຄຳ ນາງວຽງຄຳ</p>
                        <div class="barcode mb-3">
                           <QRCodeSVG
                            value={idcode}
                            size={'250'}
                            bgColor={"#ffffff"}
                            level={"L"}
                            includeMargin={false}
                            style={{ height: "auto", maxWidth: "40%", width: "40%" }}
                            imageSettings={{
                              src: "assets/img/logo/logo.png",
                              excavate: true,
                            }}
                          />
                        </div>
                        <br />
                        <p class="no p text-start ms-3"><i class="fa-solid fa-user" /> : {staff.first_name+' '+staff.last_name}</p>
                        <p class="no p text-start ms-3"><i class="fa-solid fa-phone"/> : {staff.staff_tel}</p>
                        <p class="no p text-start ms-3"><i class="fa-solid fa-envelope"/> : {staff.staff_email}</p>
                    </div>
                </div>
           
            </div>
              <span role='button' className='p-3 text-red' onClick={downloadQrCode}><i class="fa-solid fa-download"></i> ດາວໂຫຼດQR</span>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}
