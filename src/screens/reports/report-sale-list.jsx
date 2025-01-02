import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder} from 'rsuite';
import {useTitle,useOption,useZone } from '../../utils/selectOption';
import { Config } from '../../config/connect';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function ReportSaleList() {
    const itemTile = useTitle();
    const itemOption = useOption();
    const itemZone = useZone();
    const api = Config.urlApi;
 
  
    const [dataSearch, setDataSearch] = useState({
      startDate: new Date(),
      endDate: new Date(),
      tilesId_fk: '',
      zone_id_fk: '',
      product_id_fk:'',
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
      try {
        const response = await axios.post(api + 'sale-r/list', dataSearch);
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
      // console.log(dataSearch)
    }
  
    // const [filter, setFilter] = useState('');
    const Filter = (event) => {
      // setFilter(event)
      setItemData(filterName.filter(n => 
        n.tile_name.toLowerCase().includes(event.toLowerCase()) || 
        n.code_id.toLowerCase().includes(event.toLowerCase())
      ));
    }

    // ============== // ============
  const exportToExcel = () => {
    const table = document.getElementById('table-to-xls');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ຍອດຂາຍລະອຽດ");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "ລາຍງານການຂາຍປະຈຳວັນ.xlsx");
  };

  
    useEffect(() => {
      fetchDataReport();
    }, []);
  
    return (
      <>
        <div id="content" className="app-content px-3">
          <ol className="breadcrumb float-end">
            <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
            <li className="breadcrumb-item "><Link to={'/list-qty'} className='text-red'><i class="fa-solid fa-list"/> ລາຍງານລວມຈຳນວນ </Link></li>
            <li className="breadcrumb-item text-green" onClick={exportToExcel}  role='button'><i class="fa-solid fa-cloud-arrow-down"></i> Export Excel</li>
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
                  <label htmlFor="" className='form-label'>ລາຍການສິນຄ້າ</label>
                  <SelectPicker data={itemTile} onChange={(e) => handleChange('tilesId_fk', e)} block placeholder="ເລືອກ" />
                </div>
                <div className='col-sm-4 col-lg-2'>
                  <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                  <SelectPicker data={itemOption} onChange={(e) => handleChange('product_id_fk', e)} block placeholder="ເລືອກ" />
                </div>
                <div className='col-sm-4 col-lg-2'>
                  <label htmlFor="" className='form-label'>ໂຊນຂາຍ</label>
                  <SelectPicker data={itemZone} onChange={(e) => handleChange('zone_id_fk', e)} block placeholder="ເລືອກ" />
               
                </div>
                <div className="col-sm-3 col-lg-1 mt-4">
                  <button type='button' onClick={handleSaerch} className='btn btn-danger rounded ms-1'><i className="fas fa-search fa-lg"></i></button>
                </div>
              </div>
  
              <div className="table-responsive">
                <div className="d-lg-flex align-items-center mb-2">
                  <div className="pagination pagination-sm mb-0 ms-auto justify-content-center">
                    <InputGroup inside block>
                      <InputGroup.Addon>
                        <i className="fas fa-search"></i>
                      </InputGroup.Addon>
                      <Input onChange={(event) => Filter(event)} placeholder='ລະຫັດ ແລະ ຊື່' />
                    </InputGroup>
                  </div>
                </div>
  
                <table id="table-to-xls" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                  <thead className='thead-plc'>
                    <tr>
                      <th width="1%" className='text-center'>ລ/ດ</th>
                      <th width="10%"  className='text-center'>ວັນທີຂາຍ</th>
                      <th className='text-center'>ລະຫັດ</th>
                      <th className=''>ຊື່ສິນຄ້າ</th>
                      <th className='text-center'>ນ້ຳໜັກ</th>
                      <th className='text-center'>ບັນຈຸ</th>
                      <th className='text-center'>ຊື້ເພີ່ມ</th>
                      <th className='text-center'>ຈຳນວນ</th>
                      <th className='text-end'>ລາຄາຂາຍ</th>
                      <th className='text-end'>ຄ່າລາຍ</th>
                      <th className='text-end'>ລວມເງິນ</th>
                      <th className=''>ໂຊນຂາຍ</th>
                      <th className=''>ພ/ງ ຂາຍ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      isLoading === true ? <tr>
                      <td colSpan={'13'}  className='border-0 td'><Placeholder.Grid rows={11} columns={6} active /></td>
                  </tr>  :
                        itemData.length > 0 ? (
                          <>
                            {itemData.map((val, key) => (
                              <tr key={key}>
                                <td className='text-center td'>{key + 1}</td>
                                <td className='text-center td'>{moment(val.create_date).format('DD/MM/YYYY hh:mm')}</td>
                                <td className='text-center td'>{val.code_id}</td>
                                <td className='td'>{val.tile_name}</td>
                                <td className='text-center td'>{val.qty_baht+' '+val.option_name}</td>
                                <td className='text-center td'>{val.qty_grams}/ g</td>
                              <td> {val.qty_sale_add >0 ?(<span className='text-green'>{val.qty_sale_add+' '+val.option_name}</span>):'-'}</td>
                              <td className='text-center td'>{val.order_qty+'.'+val.unite_name}</td>
                                <td className='text-end td'>{numeral(val.qty_sale_add > 0 ? val.price_grams*val.qty_gram_add: val.price_sale*val.order_qty).format('0,00')}</td>

                                <td className={`text-end td ${val.price_pattern > 0 ?'text-green':''}`}>{val.price_pattern > 0 ?'+':''} {numeral(val.price_pattern*val.qty_baht).format('0,00')}</td>
                                <td className='text-end td'>{numeral((val.total_balance)).format('0,00')}</td>
                                <td className='td'>{val.zone_name}</td>
                                <td className='td'>{val.staff_name}</td>
                              </tr>
                            ))}
                           
                          </>
                        ) : (
                          <tr>
                            <td colSpan={14} className='text-center td text-danger'>ບໍ່ລາຍການຂາຍທີ່ທ່ານຊອກຫາ</td>
                            </tr>
                        )}
                  </tbody>
                  <tfoot>
                    { itemData.length > 0 ? (
                      <tr> <td colSpan={9} className='text-end'>ລວມຍອດທັງໝົດ</td>
                              <td className='text-end bg-green text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat(val.price_pattern*val.order_qty*val.qty_baht), 0)).format('0,00')}</td>
                            <td className='text-end bg-dark text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat((val.total_balance)), 0)).format('0,00')}</td>
                            {/* <td className='text-end bg-dark text-white'>{numeral(itemData.reduce((acc, val) => acc + parseFloat((val.order_qty*val.price_sale)+(val.order_qty*val.price_pattern*val.qty_baht)), 0)).format('0,00')}</td> */}
                            <td colSpan={2}></td>
                            </tr>
                    ):('')}
                  </tfoot>
                </table>
  
              </div>
            </div>
          </div>
  
        </div>
      </>
  
  )
}
