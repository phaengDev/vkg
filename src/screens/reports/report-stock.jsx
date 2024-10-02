import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, SelectPicker, Input, InputGroup, Placeholder } from 'rsuite';
import { useTitle, useOption, useZone } from '../../utils/selectOption';
import { Config } from '../../config/connect';
import moment from 'moment';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function ReportStock() {
  const branchId=localStorage.getItem('branch_Id')
  const itemTile = useTitle();
  const itemOption = useOption();
  const itemZone = useZone();
  const api = Config.urlApi;
  const [dataSearch, setDataSearch] = useState({
    startDate: new Date(),
    endDate: new Date(),
    productId: '',
    titleId: '',
    zoneId: '',
    branchId:branchId
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
      const response = await axios.post(api + 'stock/check', dataSearch);
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

  const [filter, setFilter] = useState('');
  const Filter = (event) => {
    setFilter(event)
    setItemData(filterName.filter(n => n.tile_name.toLowerCase().includes(event)))
  }

  const exportToExcel = () => {
    const table = document.getElementById('table-to-xls');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ລວມສະຕ໋ອກ");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "ລາຍງານສະຕ໋ອກ.xlsx");
  };
  

  useEffect(() => {
    fetchDataReport();
  }, [branchId])
  return (
    <>
      <div id="content" className="app-content bg-default px-3">
        <ol className="breadcrumb float-end">
          <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
          <li className="breadcrumb-item active">ລາຍງານສະຕ໋ອກ</li>
          <li className="breadcrumb-item text-green" onClick={exportToExcel} role='button'><i class="fa-solid fa-cloud-arrow-down"></i> Export excel</li>
        </ol>
        <h2 className="page-header mb-3">ລາຍງານສະຕ໋ອກ</h2>
        <div className="panel">
          <div className="panel-body">
            <div className="row mb-4">
              <div className='col-sm-4 col-6  col-lg-2 mb-2'>
                <label htmlFor="" className='form-label'>ວັນທີ</label>
                <DatePicker oneTap color="red" format="dd/MM/yyyy" onChange={(e) => handleChange('startDate', e)} defaultValue={dataSearch.startDate} placeholder='ວັນທີ' block />
              </div>
              <div className='col-sm-4 col-6  col-lg-2 mb-2'>
                <label htmlFor="" className='form-label'>ວັນທີ</label>
                <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('endDate', e)} defaultValue={dataSearch.endDate} placeholder='ວັນທີ' block />
              </div>
              <div className='col-sm-4 col-lg-3 mb-2'>
                <label htmlFor="" className='form-label'>ລາຍການສິນຄ້າ</label>
                <SelectPicker data={itemTile} onChange={(e) => handleChange('titleId', e)} block placeholder="ເລືອກ" />
              </div>
              <div className='col-sm-4 col-lg-2 mb-2'>
                <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                <SelectPicker data={itemOption} onChange={(e) => handleChange('productId', e)} block placeholder="ເລືອກ" />
              </div>
              <div className='col-sm-4 col-lg-2 col-9 mb-2'>
                <label htmlFor="" className='form-label'>ໂຊນຂາຍ</label>
                <SelectPicker data={itemZone} onChange={(e) => handleChange('zoneId', e)} block placeholder="ເລືອກ" />
              </div>
              <div className="col-lg-1 col-3  mb-2 mt-4">
                <button type='button' onClick={handleSaerch} className='btn btn-danger rounded ms-1'> <i className="fas fa-search fa-lg " /></button>
              </div>
            </div>

            <div className="table-responsive">
              <div className="d-lg-flex align-items-center mb-2">
                <div className="pagination pagination-sm mb-0 ms-auto justify-content-center">
                  <InputGroup inside block>
                    <InputGroup.Addon>
                      <i className="fas fa-search"></i>
                    </InputGroup.Addon>
                    <Input onChange={(event) => Filter(event)} placeholder='ຄົ້ນຫາ' />
                  </InputGroup>
                </div>
              </div>
              <table id='table-to-xls' className="table table-striped table-bordered align-middle w-100 text-nowrap">
                <thead className='thead-plc'>
                  <tr>
                    <th width="1%" className='text-center'>ລ/ດ</th>
                    <th className='text-center'>ວັນທີ</th>
                    <th className='text-center'>ລະຫັດສິນຄ້າ</th>
                    <th className=''>ລາຍການສິນຄ້າ</th>
                    <th className='text-center'>ນ້ຳໜັກ</th>
                    <th className='text-center'>ນຳເຂົ້າ</th>
                    <th className='text-center'>ຂາຍອອກ</th>
                    <th className='text-center'>ຄົງເຫຼືອ</th>
                    <th className=''>ຫົວໜ່ວຍ</th>
                    <th className=''>ໂຊນຂາຍ</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isLoading === true ? <tr>
                      <td colSpan={'10'} className='border-0 bg-white'><Placeholder.Grid rows={9} columns={6} active /></td>
                    </tr> :
                      itemData.length > 0 ? (
                        <>
                          {itemData.map((val, key) => (
                            <tr key={key}>
                              <td className='text-center'>{key + 1}</td>
                              <td className='text-center'>{moment(val.balance_date).format('DD/MM/YYYY')}</td>
                              <td className='text-center'>{val.code_id}</td>
                              <td>{val.tile_name}</td>
                              <td className='text-center'>{val.qty_baht + ' ' + val.option_name}</td>
                              <td className='text-center'>{val.qty_import}</td>
                              <td className='text-center'>{val.qty_sale}</td>
                              <td className='text-center'>{val.quantity}</td>
                              <td>{val.unite_name}</td>
                              <td>{val.zone_name}</td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={10} className='text-center text-danger'>ບໍ່ລາຍການຂາຍທີ່ທ່ານຊອກຫາ</td>
                        </tr>
                      )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
