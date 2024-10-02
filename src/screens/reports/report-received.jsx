import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { DatePicker, SelectPicker, Button,Placeholder } from 'rsuite';
import { useZone, useOption, useTitle } from '../../utils/selectOption';
import axios from 'axios';
import { Config } from '../../config/connect';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function ReportReceived() {
    const api = Config.urlApi;
    const itemZone = useZone();
    const itemOption = useOption();
    const itemTile = useTitle();

    const [data, setData] = useState({
        startDate: new Date(),
        endDate: new Date(),
        title_id_fk: '',
        option_id_fk: '',
        zone_id_fk: ''
    });
    const changeReport = (name, value) => {
        setData({
            ...data, [name]: value
        })
    }

    const [isLoading, setIsLoading] = useState(true);
    const [itemreceived, setItemreceived] = useState([]);
    const fetchReceived = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(api + 'received/r-port', data);
            const jsonData = response.data;
            setItemreceived(jsonData);
            console.log(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const [visibleItems, setVisibleItems] = useState({});
    const toggleVisibility = (index) => {
        setVisibleItems((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };
    // =================//=============
    const exportToExcel = () => {
        const table = document.getElementById('table-to-xls');
        const worksheet = XLSX.utils.table_to_sheet(table);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ລາຍການນຳເຂົ້າ");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "ລາຍງານການນຳເຂົ້າ.xlsx");
    };

    useEffect(() => {
        fetchReceived()
    }, [])

    return (
        <>
            <div id="content" className="app-content px-3">
                <ol className="breadcrumb float-end">
                    <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li className="breadcrumb-item active">ລາຍງານການນຳເຂົ້າ</li>
                    <li className="breadcrumb-item text-green" role='button' onClick={exportToExcel}><i class="fa-solid fa-cloud-arrow-up fs-16px"></i> Export Excel</li>
                </ol>
                <h3 className="page-header  mb-3">ລາຍງານການນຳເຂົ້າປະຈຳວັນ</h3>
                <div className="panel">
                    <div className="panel-body">
                        <div className="row fs-15px">
                            <div className="col-sm-2 col-6 mb-2">
                                <label htmlFor="" className='form-label'>ວັນທິນຳເຂົ້າ</label>
                                <DatePicker oneTap format="dd/MM/yyyy" defaultValue={data.startDate} onChange={(e) => changeReport('startDate', e)} />
                            </div>
                            <div className="col-sm-2  col-6  mb-2">
                                <label htmlFor="" className='form-label'>ຫາວັນທິ</label>
                                <DatePicker oneTap format="dd/MM/yyyy" defaultValue={data.endDate} onChange={(e) => changeReport('endDate', e)} />
                            </div>
                            <div className="col-sm-3  mb-2">
                                <label htmlFor="" className='form-label'>ລາຍການສິນຄ້າ</label>
                                <SelectPicker data={itemTile} onChange={(e) => changeReport('title_id_fk', e)} block />
                            </div>
                            <div className="col-sm-2 col-6 mb-2">
                                <label htmlFor="" className='form-label'>ຫົວໜ່ວຍ</label>
                                <SelectPicker data={itemOption} onChange={(e) => changeReport('option_id_fk', e)} block />
                            </div>
                            <div className="col-sm-2 col-6 mb-2">
                                <label htmlFor="" className='form-label'>ໂຊນຂາຍ</label>
                                <SelectPicker data={itemZone} onChange={(e) => changeReport('zone_id_fk', e)} block />
                            </div>
                            <div className="col-sm-1 mt-4">
                                <Button onClick={fetchReceived} appearance="primary" color='red' className='mt-1'> <i className="fas fa-search fs-18px"></i></Button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table id='table-to-xls' className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                <thead className='thead-plc'>
                                    <tr className=''>
                                        <th width="1%" className='text-center'>ລ/ດ</th>
                                        <th width="1%" className='text-center'>#</th>
                                        <th width="10%" className='text-center'>ວັນທິນຳເຂົ້າ</th>
                                        <th className='text-center'>ລະຫັດ</th>
                                        <th className=''>ຊື່ສິນຄ້າ</th>
                                        <th className=''>ນ້ຳໜັກ</th>
                                        <th className='text-center' width="15%">ຈຳນວນ</th>
                                        <th>ໂຊນຂາຍ</th>
                                    </tr>
                                </thead>
                               
                                <tbody>
                                    {isLoading===true ?(
                                        <tr>
                                        <td colSpan={8} className='bg-white'> <Placeholder.Grid rows={5} columns={8} active /></td>
                                        </tr>
                                    ):(
                                        itemreceived.length > 0 ? (
                                            itemreceived.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    <tr>
                                                        <td className='text-center'>{key + 1}  </td>
                                                        <td className='text-center'><a href="javascript:;" onClick={() => toggleVisibility(key)}> {visibleItems[key] ? (<i class="fa-solid fa-circle-minus fa-lg text-red"></i>) : (<i class="fa-solid fa-circle-plus fa-lg text-green"></i>)}</a> </td>
                                                        <td className='text-center'>{moment(item.received_date).format('DD/MM/YYYY')}</td>
                                                        <td className='text-center'>{item.code_id}</td>
                                                        <td>{item.tile_name}</td>
                                                        <td>{item.qty_baht} {item.option_name}</td>
                                                        <td className='text-center'> {item.received_qty} {item.unite_name}</td>
                                                        <td>{item.zone_name}</td>
                                                    </tr>
                                                    {visibleItems[key] && (
                                                        <tr>
                                                            <td colSpan={8}>
                                                                <table className='table table-sm'>
                                                                    <thead className='thead-plc'>
                                                                        <tr>
                                                                            <th className='text-center'>ລ/ດ</th>
                                                                            <th className='text-center'>ເວລານຳເຂົ້າ</th>
                                                                            <th className='text-center'>ຈຳນວນ</th>
                                                                            <th className='text-center'>ຍົກຍອດ</th>
                                                                            <th className='text-center'>ຈຳນວນລວມ</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {item.detail.map((val, index) => (
                                                                            <tr>
                                                                                <td className='text-center'>{index + 1}</td>
                                                                                <td className='text-center'>{moment(val.received_date).format('h:mm')}</td>
                                                                                <td className='text-center'>{val.received_qty + ' ' + val.unite_name}</td>
                                                                                <td className='text-center'>{val.old_quantity + ' ' + val.unite_name}</td>
                                                                                <td className='text-center'>{val.received_qty + val.old_quantity + ' ' + val.unite_name}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (<>
                                            <tr>
                                                <td colSpan={8} className='text-center text-red'> ບໍ່ພົບຂໍ້ມູນການນຳເຂົ້າສິນຄ້າ</td>
                                            </tr>
                                        </>)
                                    
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
