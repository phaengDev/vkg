import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Modal, Button } from 'rsuite';
import { useStaff } from '../../utils/selectOption';
import { Config } from '../../config/connect';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Invoice from '../../invoice/bill-invoice';
function ReportsaleDaily() {
  const itemStaff = useStaff();
  const api = Config.urlApi;
  const [open, setOpen] = React.useState(false);
  const handleModal = (index) => {
    setOpen(index)
  }
  const datastt = [
    { data: 1, sttName: 'ຄ້າງປິດ' },
    { data: 2, sttName: 'ປິດຍອດແລ້ວ' }
  ].map(
    item => ({ label: item.sttName, value: item.data })
  );
  const [dataSearch, setDataSearch] = useState({
    startDate: new Date(),
    endDate: new Date(),
    staffId: '',
    statusOff: '',
  });

  const handleChange = (name, value) => {
    setDataSearch({
      ...dataSearch, [name]: value
    });
  }
  const [isLoading, setIsLoading] = useState(true);
  const [filterName, setFilterName] = useState([])
  const [itemData, setItemData] = useState([]);
  const fetchDataReport = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(api + 'sale-r/report', dataSearch);
      const jsonData = response.data;
      setItemData(jsonData);
      setFilterName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }
  const handleSaerch = () => {
    fetchDataReport();
  }

  // const [filter, setFilter] = useState('');
  const Filter = (event) => {
    setItemData(filterName.filter(n => n.sale_billNo.toLowerCase().includes(event)))
  }

  // ================================
  const sumData = itemData.reduce((acc, item) => {
    const currency = item.currency_name;
    const genus = item.genus;
    if (!acc[currency]) {
      acc[currency] = {
        balance_total: 0,
        balance_totalpay: 0,
        balance_cash: 0,
        balance_transfer: 0,
        balance_return: 0,
        genus: genus, // Capture genus here
      };
    }

    acc[currency].balance_totalpay += parseFloat(item.balance_totalpay);
    acc[currency].balance_cash += parseFloat(item.balance_cash);
    acc[currency].balance_transfer += parseFloat(item.balance_transfer);
    acc[currency].balance_return += parseFloat(item.balance_return);
    acc[currency].balance_total += parseFloat(item.balance_total);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00');

  //======================================
  const [detail, setDetail] = useState([]);
  const [data, setData] = useState({});
  const [id, setId] = useState('');
  const handleView = async (id, data) => {
    setData(data);
    setId(id);
    try {
      const response = await axios.post(api + 'sale-r/veiw/' + id);
      const jsonData = response.data;
      setDetail(jsonData);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  };
  // ============== // ============

  const exportToExcel = () => {
    const table = document.getElementById('table-to-xls');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ຍອດຂາຍລວມ");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "ລາຍງານການຂາຍລວມ.xlsx");
  };
  useEffect(() => {
    fetchDataReport();
  }, [])

  const [show, setShow] = useState(false);
const [billId,setBillId]=useState('');
const handlePrint=(id)=>{
  setBillId(id)
  setShow(true)
}
const [showStaff,setShowStaff]=useState(false)
const fetchChart=()=>{
  
}
  return (
    <>
      <div id="content" className="app-content px-3">
        <ol className="breadcrumb float-end">
          <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
          <li className="breadcrumb-item "><Link to={'/billsale'} className='text-blue'><i class="fa-solid fa-list"></i> ບິນຂາຍ</Link> </li>
          <li className="breadcrumb-item active">ຕາຕະລາຍງານຂາຍປະຈຳວັນ</li>
        </ol>
        <h1 className="page-header  mb-3">ລາຍການຂາຍປະຈຳວັນ</h1>
        <div className="panel " data-sortable-id="ui-widget-5">

          <div className="panel-body">
            <div className="row mb-4">
              <div className='col-sm-4 col-6  col-lg-2'>
                <label htmlFor="" className='form-label'>ວັນທີ</label>
                <DatePicker oneTap color="red" format="dd/MM/yyyy" onChange={(e) => handleChange('startDate', e)} defaultValue={dataSearch.startDate} placeholder='ວັນທີ' block />
              </div>
              <div className='col-sm-4 col-6  col-lg-2'>
                <label htmlFor="" className='form-label'>ວັນທີ</label>
                <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('endDate', e)} defaultValue={dataSearch.endDate} placeholder='ວັນທີ' block />
              </div>
              <div className='col-sm-4 col-lg-3'>
                <label htmlFor="" className='form-label'>ພະນັກງານຂາຍ</label>
                <SelectPicker data={itemStaff} onChange={(e) => handleChange('staffId', e)} block placeholder="ເລືອກ" />
              </div>
              <div className='col-sm-4 col-8 col-lg-3'>
                <label htmlFor="" className='form-label'>ສະຖານະ</label>
                <SelectPicker data={datastt} onChange={(e) => handleChange('statusOff', e)} block placeholder="ເລືອກ" />
              </div>
              <div className="col-sm-3 col-4 col-lg-2 mt-4">
                <button type='button' onClick={handleSaerch} className='btn btn-danger rounded ms-1'><i className="fas fa-search fa-lg"></i></button>
                <button type='button' onClick={exportToExcel} className='btn btn-green rounded ms-1'><i className="fas fa-file-excel fa-lg"></i></button>
              </div>
            </div>

            <div className="table-responsive">
              <div className="d-lg-flex align-items-center mb-2">
                {/* <div className="d-lg-flex d-none align-items-center text-nowrap">
                  page:
                  <select className="form-select form-select-sm ms-2  ps-2 ">
                    <option>100</option>
                    <option>50</option>
                    <option selected="">30</option>
                  </select>
                </div> */}
                <div className="pagination pagination-sm mb-0 ms-auto justify-content-center">
                  <InputGroup inside block>
                    <InputGroup.Addon>
                      <i className="fas fa-search"></i>
                    </InputGroup.Addon>
                    <Input onChange={(event) => Filter(event)} placeholder='ເລກທີບິນ' />
                  </InputGroup>
                </div>
              </div>

              <table id="table-to-xls" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                <thead className='thead-plc'>
                  <tr>
                    <th width="1%" className='text-center'>ລ/ດ</th>
                    <th className='text-center'>ວັນທີຂາຍ</th>
                    <th className='text-center'>ບິນເລກທີ</th>
                    <th className=''>ພະນັກງານຂາຍ</th>
                    <th className='text-end'>ລວມຍອດທັງໝົດ ກີບ</th>
                    <th className='text-end'>ລວມຍອດທັງໝົດທີ່ຈ່າຍ</th>
                    <th className='text-end'>ຮັບເງິນສົດ</th>
                    <th className='text-end'>ຮັບເງິນໂອນ</th>
                    <th className='text-end'>ຍອດຮັບທັງໝົດ</th>
                    <th className='text-end'>ຍອດເງິນທອນ</th>
                    <th className=''>ຊື່ລູກຄ້າ</th>
                    <th className=''>ເບີໂທລະສັບ</th>
                    <th className=''>ໝາຍເຫດ</th>
                    <th className=''>ພ/ງ ບັນທຶກ</th>
                    <th className=''>ສະຖານະ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading === true ? <tr>
                      <td colSpan={'16'} className='border-0 bg-white'><Placeholder.Grid rows={9} columns={6} active /></td>
                    </tr> :
                      itemData.length > 0 ? (
                        <>
                          {itemData.map((val, key) => (
                            <tr key={key}>
                              <td className='text-center'>{key + 1}</td>
                              <td className='text-center'>{moment(val.sale_date).format('DD/MM/YYYY hh:mm')}</td>
                              <td className='text-center'><span role='button' className='text-h-blue' onClick={() => handleView(val.sale_uuid, val)} >{val.sale_billNo}</span> </td>
                              <td>{val.first_name + ' ' + val.last_name}</td>
                              <td className='text-end'>{numeral(val.balance_total).format('0,00')} ₭</td>
                              <td className='text-end'>{numeral(val.balance_totalpay).format('0,00')} {val.genus}</td>
                              <td className='text-end'>{numeral(val.balance_cash).format('0,00')} {val.genus}</td>
                              <td className='text-end'>{numeral(val.balance_transfer).format('0,00')} {val.genus}</td>
                              <td className='text-end'>{numeral(val.balance_payment).format('0,00')}  {val.genus}</td>
                              <td className='text-end'>{numeral(val.balance_return).format('0,00')} ₭</td>
                              <td>{val.cus_fname + ' ' + val.cus_lname}</td>
                              <td>{val.cus_tel}</td>
                              <td>{val.sale_remark}</td>
                              <td>{val.userName}</td>
                              <td>{val.status_off_sale === 1 ? 'ຄ້າງປິດ' : 'ປິດຍອດ'}</td>
                              <td className='text-center'><span className='' role='button' onClick={()=>handlePrint(val.sale_uuid)}><i class="fa-solid fa-print"></i></span></td>
                            </tr>
                          ))}

                        </>
                      ) : (
                        <tr>
                          <td colSpan={16} className='text-center text-danger'>ບໍ່ລາຍການຂາຍທີ່ທ່ານຊອກຫາ</td>
                        </tr>
                      )}
                </tbody>
                { itemData.length > 0 && (
                <tfoot>
                  {itemData.length > 0 && (
                    Object.keys(sumData).map((currency, key) => (
                      <tr key={key}>
                        <td colSpan={4} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>
                        <td className='text-end'>{formatNumber(sumData[currency].balance_totalpay)} {sumData[currency].genus}</td>
                        <td className='text-end'>{formatNumber(sumData[currency].balance_cash)} {sumData[currency].genus}</td>
                        <td className='text-end'>{formatNumber(sumData[currency].balance_transfer)} {sumData[currency].genus}</td>
                        <td className='text-end'>{formatNumber(0)}</td>
                        <td className='text-end'>{formatNumber(sumData[currency].balance_return)} ₭</td>
                        <td colSpan={5}></td>
                      </tr>
                    ))
                  )}
                </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* <Invoice ref={invoiceRef} invoice={invoice} /> */}

        <Modal size={'lg'} open={open} onClose={() => handleModal(false)}>
          <Modal.Header>
            <Modal.Title className='py-2'>ລາຍລະອຽດບິນ: {data.sale_billNo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className="row mb-3">
              <div className="col-12 text-center">
                <img src="./assets/img/logo/logo.png" className='w-10' alt="" />
              </div>
              <div className="col-6">
                <div>ຮ້ານຄຳ ນາງວຽງຄຳ </div>
                <div>ເບີໂທລະສັບ: 02095555609</div>
                <div>Email: </div>
                <div>ຕັ້ງຢູ່: ຕັ້ງຢູ່ຕະຫລາດເຊົ້າມໍຊັ້ນ2</div>
                <div>ທີ່ຢູ່: ບ້ານ ຫັດສະດີ ,ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ</div>
              </div>

              <div className="col-6 text-end">
                <div className='fs-18px'> No: {data.sale_billNo}</div>
                <div className='fs-16px'> Date: {moment(data.sale_date).format('DD/MM/YYYY hh:mm')}</div>
                <div>ຊື່ລູກຄ້າ: {data.cus_fname + ' ' + data.cus_lname}</div>
                <div>ເບີໂທລະສັບ: {data.cus_tel}</div>
                <div>ທີ່ຢູ່: {data.cus_address}</div>
              </div>
            </div>
            <table className="table  table-bordered table-bordered align-middle w-100 text-nowrap">
              <thead className='thead-plc'>
                <tr>
                  <th width="1%" className='text-center'>ລ/ດ</th>
                  <th className='text-center'>ລະຫັດ</th>
                  <th className=''>ຊື່ສິນຄ້າ</th>
                  <th className='text-center'>ນ້ຳໜັກ</th>
                  <th className='text-center'>ກຣາມ</th>
                  <th className='text-center'>ຊື້ເພີ່ມ</th>
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
                    <td className='text-center'>{item.qty_grams} g</td>
                    <td className='text-center'>{item.qty_sale_add > 0 ? (<span className='text-green'>+ {item.qty_sale_add}</span>) : '-'} </td>
                    <td className='text-center'>{item.order_qty + '/' + item.unite_name}</td>
                    <td className='text-end'>{numeral(item.order_qty * item.price_pattern).format('0,00')}</td>
                    <td className='text-end'>{numeral((item.total_balance)).format('0,00')}</td>
                    <td>{item.zone_name}</td>
                    <td>{item.staff_name}</td>
                  </tr>
                )
                )}
              </tbody>
              <tfoot>
                <tr className='border-bottom-0'>
                  <td colSpan={7} className='text-end border'>ລວມຍອດທັງໝົດ</td>
                  <td className='text-end bg-black border text-white'>{numeral(detail.reduce((acc, val) => acc + parseFloat(val.order_qty * val.price_pattern * val.qty_baht), 0)).format('0,00')}</td>
                  <td className='text-end bg-black border text-white'>{numeral(detail.reduce((acc, val) => acc + parseFloat(val.total_balance), 0)).format('0,00')}</td>
                  <td colSpan={2} className='border-0'></td>
                </tr>
              </tfoot>
            </table>
            <hr />
            <table className='table text-nowrap'>
              <tbody>
                <tr>
                  <td width={'30%'} rowSpan={5} className='text-end border-0'>ປະເພດຈ່າຍເງິນ : {data.currency_name} ({data.genus})</td>
                  <td width={'30%'} className='text-end border-0'>ລວມເປັນເງິນ :</td>
                  <td width={'10%'}>{numeral(data.balance_totalpay).format('0,00')} {data.genus}</td>
                </tr>
                <tr>
                  <td width={'30%'} className='text-end border-0'>ຈ່າຍເງິນສົດ :</td>
                  <td width={'10%'}>{numeral(data.balance_cash).format('0,00')} {data.genus}</td>
                </tr>
                <tr>
                  <td width={'30%'} className='text-end border-0'>ຈ່າຍເງິນໂອນ :</td>
                  <td width={'10%'}>{numeral(data.balance_transfer).format('0,00')} {data.genus}</td>
                </tr>
                <tr>
                  <td className='text-end border-0' >ເງິນທອນ</td>
                  <td width={'10%'}>{numeral(data.balance_return).format('0,00')} ₭</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className='text-let'>ພະນັກງານຂາຍ : {data.first_name} {data.last_name}</td>
                </tr>
              </tfoot>
            </table>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button onClick={handlePrint} appearance="primary">
          ພີມບິນ
          </Button> */}
            <Button onClick={() => handleModal(false)} appearance="primary" color='red'>
              ອອກ
            </Button>
          </Modal.Footer>
        </Modal>


<Invoice
invoice={billId}
show={show}
handleClose={()=>setShow(false)}
showStaff={()=>setShowStaff(true)}
fetchChart={fetchChart}
/>
      </div>
    </>
  )
}

export default ReportsaleDaily