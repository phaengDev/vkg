import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { SelectPicker, Input, DatePicker, InputGroup, Button, Tooltip, Whisper, Modal, Placeholder } from 'rsuite';
import { useStaff, useTitle, useZone } from '../../utils/selectOption';
import axios from 'axios';
import moment from 'moment';
import { Config } from '../../config/connect';
import Alert from '../../utils/config';
import numeral from 'numeral';
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function CancleSale() {
  const api = Config.urlApi;
  const itemStaff = useStaff();
  const [open, setOpen] = React.useState(false);
  const handleModal = (index) => {
    setOpen(index)
  }

  const [datasearch, setDatasearch] = useState({
    startDate: new Date(),
    endDate: new Date(),
    title_id_fk: '',
    zone_id_fk: ''
  });
  const changeReport = (name, value) => {
    setDatasearch({
      ...datasearch, [name]: value
    })
  }

  const [tabTable, setTabTable] = useState('active show');
  const [tabForm, setTabForm] = useState('');
  const headleNewform = (data, form) => {
    setTabTable(data);
    setTabForm(form);
  }

  const [formData, setFormData] = useState({
    billNo_number: '',
  });
  const handleChange = (name, value) => {
    setFormData({
      ...formData, [name]: value
    })
  }

  const [data, setData] = useState({});
  const [itemlis, setItemlis] = useState([]);
  const [qty, setQty] = useState(0);
  const [datacheck, setDatacheck] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(api + 'order/bill', formData)
      .then(function (res) {
        if (res.status === 200) {
          // console.log(res.data.itemdata.sale_uuid)
          setData(res.data.itemdata)
          setItemlis(res.data.itemlist)
          setQty(res.data.itemlist.length);
          setDatacheck(true);
          setBillUuid(res.data.itemdata.sale_uuid)
        }
      }).catch(function () {
        setDatacheck(null);
      })
  }
  let rowCount = 0;
  if (qty < 3) {
    rowCount = 3;
  } else if (qty >= 3) {
    rowCount = 2;
  }
  const qtynull = Array.from({ length: rowCount }, (_, index) => index);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [billUuid, setBillUuid] = useState('');
  const handleCancle = () => {
    Swal.fire({
      title: "ຢືນຢັນ?",
      text: "ທ່ານຕ້ອງການຍົກເລີກແທ້ບໍ່!",
      icon: "warning",
      width: 400,
      padding: "1em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
      cancelButtonColor: "#d33",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        axios.get(api + 'order/cancel/' + billUuid)
          .then(function (res) {
            if (res.status === 200) {
              Alert.successData(res.data.message);
              setTabTable('active show');
              setTabForm('');
              setFormData({
                billNo_number: '',
              });
              setDatacheck(false)
            }
          }).catch(function () {
            Alert.errorData('ການຍົກເລີກຂໍ້ມູນບໍ່ສຳເລັດ ກະລຸນາກວດຄືນໃຫມ່')
          })
      }
    });
  }


  const [dataSearch, setDataSearch] = useState({
    startDate: new Date(),
    endDate: new Date(),
    staffId: '',
    statusOff: ''
  });

  const handleChangeSearch = (name, value) => {
    setDataSearch({
      ...dataSearch, [name]: value
    });
  }
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState([])
  const [itemData, setItemData] = useState([]);
  const fetchDataReport = async () => {
    try {
      const response = await axios.post(api + 'sale-r/r-cancle', dataSearch);
      const jsonData = response.data;
      setItemData(jsonData);
      setFilterName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }
  const heandleSearch = () => {
    fetchDataReport();
  }

  const [filter, setFilter] = useState('');
  const Filter = (event) => {
    setFilter(event)
    setItemData(filterName.filter(n => n.sale_billNo.toLowerCase().includes(event)))
  }

const [role,setRole]=useState({
  balance_total:0,
  balance_cash:0,
  balance_transfer:0,
  balance_payment:0,
  balance_return:0,
  sale_date:'',
  sale_can_date:''
})


  const [detail, setDetail] = useState([]);
  const [billNo, setBillNo] = useState('')
  const [billId, setBillId] = useState('')

  const handleView = async (id, Bill,data) => {
    setBillNo(Bill);
    setBillId(id);
    try {
      const response = await axios.post(api + 'sale-r/veiw/' + id);
      const jsonData = response.data;
      setDetail(jsonData);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setRole({
      balance_total:data.balance_total,
      balance_cash:data.balance_cash,
      balance_transfer:data.balance_transfer,
      balance_payment:data.balance_payment,
      balance_return:data.balance_return,
      sale_date:data.sale_date,
      sale_can_date:data.sale_can_date
    })
  };


  const exportToExcel = () => {
    const table = document.getElementById('table-to-xls');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ຍອດຍົກເລີກ");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "ລາຍງານບິນຍົກເລີກ.xlsx");
  };

  useEffect(() => {
    fetchDataReport();
  }, [])

  return (
    <>
      <div id="content" className="app-content bg-default px-3">
        <ol className="breadcrumb float-end">
          <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
          <li className="breadcrumb-item"><Link to={'/cl-list'}>ເບິ່ງລາຍລະອຽດ</Link></li>
          <li className="breadcrumb-item active">ລາຍການຍົກເລີກການຂາຍ</li>
        </ol>
        <h1 className="page-header mb-3">ຍົກເລີກການຂາຍ</h1>

        <div class="tab-content panel rounded-0 rounded-bottom">
          <div class={`tab-pane fade ${tabTable}`} id="table-tab">
            <div class="panel">
              <div class="panel-body">
                <div className="row mb-2">
                  <div className='col-sm-4 col-6  col-lg-2'>
                    <label htmlFor="" className='form-label'>ວັນທີ</label>
                    <DatePicker oneTap color="red" format="dd/MM/yyyy" onChange={(e) => handleChangeSearch('startDate', e)} defaultValue={dataSearch.startDate} placeholder='ວັນທີ' block />
                  </div>
                  <div className='col-sm-4 col-6  col-lg-2'>
                    <label htmlFor="" className='form-label'>ວັນທີ</label>
                    <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChangeSearch('endDate', e)} defaultValue={dataSearch.endDate} placeholder='ວັນທີ' block />
                  </div>
                  <div className='col-sm-4 col-lg-3'>
                    <label htmlFor="" className='form-label'>ພະນັກງານຂາຍ</label>
                    <SelectPicker data={itemStaff} onChange={(e) => handleChangeSearch('staffId', e)} block placeholder="ເລືອກ" />
                  </div>
                  <div className='col-sm-4 col-lg-3'>
                <label htmlFor="" className='form-label'>ຄົ້ນຫາ</label>
                <InputGroup inside block>
                        <InputGroup.Addon>
                          <i className="fas fa-search"></i>
                        </InputGroup.Addon>
                        <Input onChange={(event) => Filter(event)} placeholder='ເລກທີບິນ' />
                      </InputGroup>
                {/* <SelectPicker data={datastt} onChange={(e) => handleChange('statusOff', e)} block placeholder="ເລືອກ" /> */}
              </div>
                  <div className="col-sm-2 col-4 mt-4">
                    <button type="button" onClick={heandleSearch} className="btn btn-danger fs-14px px-3 "><i className="fas fa-search fs-16px"></i> </button>
                    <button type="button" onClick={exportToExcel} className="btn btn-green fs-14px ms-2 px-3 "><i className="fa-solid fa-file-excel fs-16px"></i></button>
                    <button type="button" onClick={() => headleNewform('', 'show  active')} className="btn btn-black fs-14px px-3 ms-2"><i className="fas fa-plus fs-16px"></i> </button>

                  </div>
                </div>
                <div className="table-responsive mt-3">
                  <table id='table-to-xls' className="table  table-bordered align-middle w-100 text-nowrap">
                    <thead className='thead-plc'>
                      <tr>
                        <th width="1%" className='text-center'>ລ/ດ</th>
                        <th className='text-center'>ວັນທີຂາຍ</th>
                        <th className='text-center'>ວັນທີຍົກເລີກ</th>
                        <th className='text-center'>ບິນເລກທີ</th>
                        <th className='text-end'>ລວມຍອດທັງໝົດ</th>
                        <th className='text-end'>ຮັບເງິນສົດ</th>
                        <th className='text-end'>ຮັບເງິນໂອນ</th>
                        <th className='text-end'>ຍອດຮັບທັງໝົດ</th>
                        <th className='text-end'>ຍອດເງິນທອນ</th>
                        <th className=''>ພະນັກງານຂາຍ</th>
                        <th className=''>ຊື່ລູກຄ້າ</th>
                        <th className=''>ເບີໂທລະສັບ</th>
                        <th className=''>ໝາຍເຫດ</th>
                        <th className=''>ພ/ງ ບັນທຶກ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        isLoading === true ? <Placeholder.Grid rows={14} columns={6} active /> :
                          itemData.length > 0 ? (
                            <>
                              {itemData.map((val, key) => (
                                <tr key={key}>
                                  <td className='text-center'>{key + 1}</td>
                                  <td className='text-center'>{moment(val.sale_date).format('DD/MM/YYYY hh:mm')}</td>
                                  <td className='text-center'>{moment(val.sale_can_date).format('DD/MM/YYYY hh:mm')}</td>
                                  <td className='text-center'><span role='button' className='text-h-blue' onClick={() => handleView(val.sale_uuid, val.sale_billNo,val)} >{val.sale_billNo}</span> </td>
                                  <td className='text-end'>{numeral(val.balance_total).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_cash).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_transfer).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_payment).format('0,00')}</td>
                              <td className='text-end'>{numeral(val.balance_return).format('0,00')}</td>
                                  <td>{val.first_name + ' ' + val.last_name}</td>
                                  <td>{val.cus_fname + ' ' + val.cus_lname}</td>
                                  <td>{val.cus_tel}</td>
                                  <td>{val.sale_remark}</td>
                                  <td>{val.userName}</td>
                                </tr>
                              ))}
                              <tr>
                            <td colSpan={4} className='text-end'>ລວມຍອດທັງໝົດ</td>
                            <td className='text-end'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_total), 0)).format('0,00')}</td>
                            <td className='text-end'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_cash), 0)).format('0,00')}</td>
                            <td className='text-end'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_transfer), 0)).format('0,00')}</td>
                            <td className='text-end'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_payment), 0)).format('0,00')}</td>
                            <td className='text-end'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.balance_return), 0)).format('0,00')}</td>
                            <td colSpan={5}></td>
                          </tr>
                            </>
                          ) : (
                            <tr>
                              <td colSpan={14} className='text-center text-danger'>ບໍ່ລາຍການຂາຍທີ່ທ່ານຊອກຫາ</td>

                            </tr>
                          )}
                    </tbody>
                  </table>



                </div>
              </div>
            </div>
          </div>
          <div className={`tab-pane fade p-0 ${tabForm}`} id="form-tab">
            <div class="panel">
              <div class="panel-heading">
                <h4 class="panel-title">ຟອມຍົກເລີກການຂາຍ</h4>
                <div class="panel-heading-btn">
                  <a href="javascript:;" class="btn btn-xs  btn-danger" onClick={() => headleNewform('show  active', '')} ><i class="fa fa-times"></i></a>
                </div>
              </div>
              <div class="panel-body row">
                <div className="col-sm-5 border-2 border-end border-red">
                  <form onSubmit={handleSubmit}>
                    <div className="img text-center">
                      <img src="./assets/img/icon/bill-invoice.png" className='w-30 rounded-pill' alt="" />
                    </div>
                    <div className="form-group text-center">
                      <label htmlFor="" className='form-label fs-16px b-3'>ພີມເລກທີໃບບິນ</label>
                      <Input size='lg' value={formData.billNo_number} onChange={(e) => handleChange('billNo_number', e)} className='rounded-pill text-center' placeholder='B.No' block required />
                    </div>
                    <div className="form-group text-center mt-4">
                      <Button type='submit' appearance="primary" className='w-50 rounded-pill fs-14px' >
                        <i className="fas fa-search me-2"></i> ຄົນຫາ
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="col-sm-7">
                  {datacheck === false ? (
                    <>
                      <div className='text-center'>
                        <img src="./assets/img/icon/000w.png" className='w-25' alt="" />
                      </div>
                    </>
                  ) : datacheck === null ? (
                    <>
                      <div className='text-center'>
                        <img src="./assets/img/icon/error.png" className='w-25' alt="" />
                        <h5 className='mt-4 text-orange'>ບໍ່ພົບເລກບິນທີ່ທ່ານກຳລັງຊອກຫາ</h5>
                      </div></>
                  ) : (
                    <>
                      <table width='100%' className='table border-0 fs-16px'>
                        <tr>
                          <td colSpan={5} className='text-center border-buttom fs-22px'>ບິນຮັບເງິນສົດ</td>
                        </tr>
                        <tr>
                          <td rowSpan={4} className='text-center border-0 img' width={'20%'}> <img src='./assets/img/logo/logo.png' className='w-75' /></td>
                          <td colSpan={2} className='border-0'><h4> ຮ້ານຂາຍຄຳ ນາງວຽງຄຳ</h4></td>
                        </tr>
                        <tr>
                          <td colSpan={3} className='border-0'>ສຳນັກງານ ຕະຫຼາດເຊົ້າ</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className='border-0'>ບ້ານ ຫາດສະດິ, ເມືອງຈັດທະບູລີ,ນະຄອນຫຼວງວຽງຈັນ</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className='border-0'>ໂທລະສັບ: 20 95 555 609  -{qty}</td>
                        </tr>
                        <tr>
                          <td className='border-0' width={'50%'} colSpan={2}>
                            <h5>ຊື່ລູກຄ້າ: {data.customeName}</h5>
                            ເບີໂທລະສັບ: {data.cus_tel}
                          </td>
                          <td className='text-end border-0' >
                            <h5 >Bill No:{data.sale_billNo}</h5>
                            Date: {moment(data.sale_billNo).format('DD/MM/YYYY hh:ss')}</td>
                        </tr>
                      </table>
                      <div className="table-responsive">
                        <table className='table table-bordered align-middle w-100 text-nowrap table-gold'>
                          <thead className='thead-plc'>
                            <tr>
                              <th className='text-center'>ລ/ດ</th>
                              <th>ລາຍການ</th>
                              <th className='text-center'>ນ້ຳໜັກ</th>
                              <th className='text-center'>ຈຳນວນ</th>
                              <th className='text-end'>ລາຄາ ຊື້-ຂາຍ</th>
                              <th className='text-end'>ຄ່າລາຍ</th>
                              <th className='text-end'>ເປັນເງິນ</th>
                              <th>ໂຊນຂາຍ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemlis.map((item, key) => (
                              <tr>
                                <td className='text-center'>{key + 1}</td>
                                <td>{item.tile_name}</td>
                                <td className='text-center'>{item.qty_baht + ' ' + item.option_name}</td>
                                <td className='text-center'>{item.order_qty + ' ' + item.unite_name}</td>
                                <td className='text-end'>{numeral(item.price_sale).format('0,00')}</td>
                                <td className='text-end'>{numeral(item.price_pattern).format('0,00')}</td>
                                <td className='text-end'>{numeral(item.balance_total).format('0,00')}</td>
                                <td>{item.zone_name}</td>
                              </tr>
                            ))}
                            {qtynull.map((item, index) => (
                              <tr key={index}>
                                <td className='text-center'>{qty + index + 1}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                      <table className='w-100'>
                        <tr >
                          <td className='border-1 text-center' width={'33.33%'}>ລວມຍອດເງິນທັງໝົດ
                            <h5>{numeral(data.balance_total).format('0,00')}  ₭</h5>
                          </td>
                          <td className='border-1 text-center' width={'33.33%'}>ລວມຈ່າຍເງິນສົດ
                            <h5>{numeral(data.balance_cash).format('0,00')} {data.genus}</h5>
                          </td>
                          <td className='border-1 text-center' width={'33.33%'}>ລວມຈ່າຍເງິນໂອນ
                            <h5>{numeral(data.balance_transfer).format('0,00')} {data.genus}</h5>
                          </td>
                        </tr>
                        {data.balance_return > 0 ? (
                          <tr>
                            <td colSpan={3} className='text-end border-1 text-danger'>
                              ເງິນທອນ
                              <h5 className=''>{numeral(data.balance_return).format('0,00')} ₭</h5>
                            </td>
                          </tr>
                        ) : ('')}
                      </table>

                      <div className="row mt-3">
                        {data.sale_status === 1 && data.status_off_sale === 1 ? 
                          <>
                            <div className="col-6 ">
                              <div className='form-check '>
                                <input type="checkbox" name="" id="" checked={isChecked} onChange={handleCheckboxChange} className='form-check-input' />
                                <label class="form-check-label" for="flexCheckDefault">
                                  <span className='me-3'>ທ່ານຍິນດິທີ່ຈະຍົກເລີກບິນຂາຍນີ້ແທ້ບໍ່ </span>
                                  <Whisper followCursor className='me-3' speaker={<Tooltip>ກະລຸນາກວດສອບໃຫ້ດິເພາະຍົກເລີກແລ້ວຈະບໍ່ສາມາດກູ້ຄືນໄດ້</Tooltip>}>
                                    <i class="fa-solid fa-circle-exclamation text-danger "></i>
                                  </Whisper>
                                </label>
                              </div>
                            </div>
                            <div className="col-6">
                              <Button type='button' appearance="primary" onClick={handleCancle} disabled={!isChecked} className='rounded-pill' block> ຢືນຢັນຍົກເລີກ</Button>
                            </div>
                          </>
                        :data.status_off_sale === 2 ? ( 
                          <>
                          <div className="col-12 ">
                          <div class="alert alert-success alert-dismissible fade show">
                            <i class="fa-solid fa-check fs-4 me-3"></i>
                            <strong className='fs-18px me-2'>ຂໍອະໄພ!</strong>
                            ບິນນີ້ໄດ້ມີການປິດຍອດແລ້ວ ບໍ່ສາມາດຍົກເລີກໄດ້ອິກ 
                            <a href="javascript:;" class="alert-link"> ຂອບໃຈ</a>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                          </div>
                        </div>
                          </>
                        ):(<div className="col-12 ">
                          <div class="alert alert-warning alert-dismissible fade show">
                            <i class="fa-solid fa-triangle-exclamation fs-4 me-3"></i>
                            <strong className='fs-18px me-2'>ຂໍອະໄພ!</strong>
                            ບິນນີ້ໄດ້ມີການຍົກເລີກແລ້ວ ບໍ່ສາມາດຍົກເລີກໄດ້ອິກ 
                            <a href="javascript:;" class="alert-link"> ຂອບໃຈ</a>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                          </div>
                        </div>)}
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal size={'lg'} open={open} onClose={() => handleModal(false)}>
          <Modal.Header>
            <Modal.Title className='py-2'>ລາຍລະອຽດບິນ: {billNo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table  table-bordered table-bordered align-middle w-100 text-nowrap">
              <thead className='thead-plc'>
                <tr>
                  <th width="1%" className='text-center'>ລ/ດ</th>
                  <th className='text-center'>ລະຫັດ</th>
                  <th className=''>ຊື່ສິນຄ້າ</th>
                  <th className='text-center'>ນ້ຳໜັກ</th>
                  <th className='text-end'>ລາຄາຂາຍ</th>
                  <th className='text-center'>ຈຳນວນ</th>
                  <th className='text-end'>ຄ່າລາຍ</th>
                  <th className='text-end'>ລວມເງິນ</th>
                  <th className=''>ໂຊນຂາຍ</th>
                  <th className=''>ພະນັກງານຂາຍ</th>
                </tr>
              </thead>
              <tbody>
                {detail.map((item, index) => (
                  <tr>
                    <td className='text-center'>{index + 1}</td>
                    <td className='text-center'>{item.code_id}</td>
                    <td>{item.tile_name}</td>
                    <td className='text-center'>{item.qty_baht + ' ' + item.option_name}</td>
                    <td className='text-end'>{numeral(item.price_sale).format('0,00')}</td>
                    <td className='text-center'>{item.order_qty + '/' + item.unite_name}</td>
                    <td className='text-end'>{numeral((item.order_qty*item.price_pattern)).format('0,00')}</td>
                    <td className='text-end'>{numeral((item.price_sale*item.order_qty)+(item.order_qty*item.price_pattern)).format('0,00')}</td>
                    <td>{item.zone_name}</td>
                    <td>{item.staff_name}</td>
                  </tr>
                )
                )}
                <tr className=''>
                  <td colSpan={8} className='text-end border-0'>ວັນທີຂາຍ:</td>
                  <td colSpan={2} className='text-end'>{moment(role.sale_date).format('DD/MM/YYYY H:mm')}</td>
                </tr>
                <tr className=''>
                  <td colSpan={8} className='text-end border-0'>ວັນທີຍົກເລີກ:</td>
                  <td colSpan={2} className='text-end'>{moment(role.sale_can_date).format('DD/MM/YYYY H:mm')}</td>
                </tr>
                <tr className=''>
                  <td colSpan={8} className='text-end border-0'>ລວມຍອດທັງໝົດ:</td>
                  <td colSpan={2} className='text-end'>{numeral(role.balance_total).format('0,00')} ກີບ</td>
                </tr>
                <tr className=''>
                  <td colSpan={8} className='text-end border-0'>ຮັບເງິນສົດ:</td>
                  <td colSpan={2} className='text-end'>{numeral(role.balance_cash).format('0,00')} ກີບ</td>
                </tr>
                <tr className=''>
                  <td colSpan={8} className='text-end border-0'>ຮັບເງິນໂອນ:</td>
                  <td colSpan={2} className='text-end'>{numeral(role.balance_transfer).format('0,00')} ກີບ</td>
                </tr>
                <tr className=''>
                  <td colSpan={8} className='text-end border-0'>ຮັບເງິນທອນ:</td>
                  <td colSpan={2} className='text-end'>{numeral(role.balance_return).format('0,00')} ກີບ</td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handleModal(false)} appearance="primary">
              ພີມບິນ
            </Button>
            <Button onClick={() => handleModal(false)} appearance="primary" color='red'>
              ອອກ
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </>
  )
}
