import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder, Modal, Button, Grid, Row, Col } from 'rsuite';
import { useStaff } from '../../utils/selectOption';
import { Config } from '../../config/connect';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Invoice from '../../invoice/bill-invoice';

import ViewSaleList from '../reports/ViewSaleList';
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
        balance_payment: 0,
        genus: genus, // Capture genus here
      };
    }

    acc[currency].balance_totalpay += parseFloat(item.balance_totalpay);
    acc[currency].balance_cash += parseFloat(item.balance_cash);
    acc[currency].balance_transfer += parseFloat(item.balance_transfer);
    acc[currency].balance_return += parseFloat(item.balance_return);
    acc[currency].balance_total += parseFloat(item.balance_total);
    acc[currency].balance_payment += parseFloat(item.balance_payment);
    return acc;
  }, {});
  const formatNumber = (num) => numeral(num).format('0,00');

  //======================================
  const [detail, setDetail] = useState([]);
  const [data, setData] = useState({});
  // const [id, setId] = useState('');
  const handleView = async (data) => {
    setData(data);
    setOpen(true);
    // setId(id);
    // try {
    //   const response = await axios.post(api + 'sale-r/veiw/' + id);
    //   const jsonData = response.data;
    //   setDetail(jsonData);
    //   setOpen(true);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
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
  const [billId, setBillId] = useState('');
  const handlePrint = (id) => {
    setBillId(id)
    setShow(true)
  }


  const [showStaff, setShowStaff] = useState(false)
  const fetchChart = () => {

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
            <Grid fluid>
              <Row>
                {/* <div className="row mb-4"> */}
                <Col xs={12} sm={8} md={8} lg={5} className='mb-2'>
                  <label htmlFor="" className='form-label'>ວັນທີ</label>
                  <DatePicker oneTap color="red" format="dd/MM/yyyy" onChange={(e) => handleChange('startDate', e)} defaultValue={dataSearch.startDate} placeholder='ວັນທີ' block />
                </Col>
                <Col xs={12} sm={8} md={8} lg={5} className='mb-2'>
                  <label htmlFor="" className='form-label'>ວັນທີ</label>
                  <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('endDate', e)} defaultValue={dataSearch.endDate} placeholder='ວັນທີ' block />
                </Col>
                <Col xs={12} sm={8} md={8} lg={6} className='mb-2'>
                  <label htmlFor="" className='form-label'>ພະນັກງານຂາຍ</label>
                  <SelectPicker data={itemStaff} onChange={(e) => handleChange('staffId', e)} block placeholder="ເລືອກ" />
                </Col>
                <Col xs={12} sm={8} md={6} lg={4} className='mb-2'>
                  <label htmlFor="" className='form-label'>ສະຖານະ</label>
                  <SelectPicker data={datastt} onChange={(e) => handleChange('statusOff', e)} block placeholder="ເລືອກ" />
                </Col>
                <Col xs={24} sm={8} md={6} lg={3} className=" mt-4 mb-2">
                  <button type='button' onClick={handleSaerch} className='btn btn-danger rounded ms-1'><i className="fas fa-search fa-lg"></i></button>
                  <button type='button' onClick={exportToExcel} className='btn btn-green rounded ms-1'><i className="fas fa-file-excel fa-lg"></i></button>
                </Col>
                {/* </div> */}
              </Row>
            </Grid>

            <Grid fluid>
              <Row>
                <Col xs={16} lg={6} xsPush={8} lgPush={18}>
                  <InputGroup inside block>
                    <InputGroup.Addon>
                      <i className="fas fa-search"></i>
                    </InputGroup.Addon>
                    <Input onChange={(event) => Filter(event)} placeholder='ເລກທີບິນ' />
                  </InputGroup>
                </Col>
              </Row>
            </Grid>

            <div className="table-responsive mt-2">
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
                    <th>#</th>
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
                              <td className='text-center'><span role='button' className='text-h-blue' onClick={() => handleView(val)} >{val.sale_billNo}</span> </td>
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
                              <td className='text-center'><span className='btn btn-xs btn-danger' role='button' onClick={() => handlePrint(val.sale_uuid)}><i class="fa-solid fa-print"></i></span></td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={16} className='text-center text-danger'>ບໍ່ລາຍການຂາຍທີ່ທ່ານຊອກຫາ</td>
                        </tr>
                      )}
                </tbody>
                {itemData.length > 0 && (
                  <tfoot>
                    {itemData.length > 0 && (
                      Object.keys(sumData).map((currency, key) => (
                        <tr key={key}>
                          <td colSpan={4} className='text-end'>ລວມຍອດທັງໝົດ ({currency})</td>

                          <td className='text-end'>{formatNumber(sumData[currency].balance_total)}</td>
                          <td className='text-end'>{formatNumber(sumData[currency].balance_totalpay)} {sumData[currency].genus}</td>
                          <td className='text-end'>{formatNumber(sumData[currency].balance_cash)} {sumData[currency].genus}</td>
                          <td className='text-end'>{formatNumber(sumData[currency].balance_transfer)} {sumData[currency].genus}</td>
                          <td className='text-end'>{formatNumber(sumData[currency].balance_payment)} {sumData[currency].genus}</td>
                          <td className='text-end'>{formatNumber(sumData[currency].balance_return)} ₭</td>
                          <td colSpan={6}></td>
                        </tr>
                      ))
                    )}
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
        <ViewSaleList
          data={data}
          open={open}
          handleModal={() => handleModal(false)} />


        <Invoice
          invoice={billId}
          show={show}
          handleClose={() => setShow(false)}
          showStaff={() => setShowStaff(true)}
          fetchChart={fetchChart}
        />
      </div>
    </>
  )
}

export default ReportsaleDaily