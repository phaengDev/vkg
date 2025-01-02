import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, DatePicker, SelectPicker, InputPicker, Button, Loader, Placeholder } from 'rsuite';
import { useTitle, useOption, } from '../../utils/selectOption';
import { Config } from '../../config/connect';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
export default function ReportSaleQty() {
    const api = Config.urlApi;
    const itemTile = useTitle();
    const itemOption = useOption();
    const [values, setValues] = useState({
        startDate: new Date(),
        endDate: new Date(),
        option_id_fk: '',
        product_id_fk: ''
    })

    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState([]);
    const fetchDataReport = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(api + 'sale-r/list-qty', values);
            const jsonData = response.data;
            setItemData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataReport();
    }, []);

    const totalSum = Array.isArray(itemData)
  ? itemData.reduce((sum, item) => sum + (parseFloat(item.total_balance) || 0), 0)
  : 0;

    return (
        <div id="content" className="app-content px-3">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                <li className="breadcrumb-item "><Link to={'/r-list'} className='text-red'> ລາຍການຂາຍປະຈຳວັນ </Link></li>
                <li className="breadcrumb-item active">ລາຍງານຂາຍລວມຈຳນວນ</li>
            </ol>
            <h1 className="page-header  mb-3">ລວມຈຳນວນຂາຍປະຈຳວັນ</h1>
            <div className="panel " data-sortable-id="ui-widget-5">
                <div className="panel-body">
                    <Grid fluid>
                        <Row className="show-grid">
                            <Col xs={12} sm={8} md={5} className='mb-2'>
                                <label className="form-label">ວັນທີ</label>
                                <DatePicker oneTap value={values.startDate} onChange={value => setValues({ ...values, startDate: value })} format='dd/MM/yyyy' block />
                            </Col>
                            <Col xs={12} sm={8} md={5} className='mb-2'>
                                <label className="form-label">ວັນທີ</label>
                                <DatePicker oneTap value={values.endDate} onChange={value => setValues({ ...values, endDate: value })} format='dd/MM/yyyy' block />
                            </Col>
                            <Col xs={12} sm={8} md={6} className='mb-2'>
                                <label className="form-label">ລາຍການສິນຄ້າ</label>
                                <SelectPicker data={itemTile} value={values.product_id_fk} onChange={value => setValues({ ...values, product_id_fk: value })} block placeholder='ເລືອກສິນຄ້າ' />
                            </Col>
                            <Col xs={12} sm={8} md={4} className='mb-2'>
                                <label className="form-label">ນ້ຳໜັກ</label>
                                <InputPicker data={itemOption} value={values.option_id_fk} onChange={value => setValues({ ...values, option_id_fk: value })} block placeholder='ນ້ຳໜັກ' />
                            </Col>
                            <Col xs={12} sm={8} md={4} className='mb-2'>
                                <Button appearance="primary" onClick={fetchDataReport} color='red' className='mt-4'>ຄົ້ນຫາ</Button>
                            </Col>
                        </Row>
                    </Grid>

                    <div className="table-resposive">
                        <table className="table table-striped table-bordered text-nowrap table-hover">
                            <thead className="thead-plc">
                                <tr>
                                    <th className='text-center'>ລ/ດ</th>
                                    <th>ວັນທີຂາຍ</th>
                                    <th>ລະຫັດສິນຄ້າ</th>
                                    <th>ຊື່ສິນຄ້າ</th>
                                    <th className='text-center'>ນ້ຳໜັກ</th>
                                    <th className='text-center'>ຈໍານວນ</th>
                                    <th className='text-end'>ລວມເງິນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">
                                            <Loader center size="lg" content="ກຳລັງໂຫລດຂໍ້ມູນ....." vertical />
                                            <Placeholder.Grid rows={7} columns={6} active />
                                        </td>
                                    </tr>
                                ) : (
                                    itemData.length > 0 ? (
                                        <>
                                            {itemData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td>{moment(item.create_date).format('DD/MM/YYYY')}</td>
                                                    <td>{item.pos_code}</td>
                                                    <td>{item.tile_name}</td>
                                                    <td className="text-center"> {item.qty_baht} {item.option_name} </td>
                                                    <td className="text-center"> {item.orderqty} {item.unite_name} </td>
                                                    <td className="text-end"> {numeral(item.total_balance).format('0,0.00')} ₭</td>
                                                </tr>
                                            ))}
                                            <tr  className='fs-18px'>
                                                <td colSpan={6} className="text-end">
                                                    ລວມຍອດເງິນທັງໝົດ
                                                </td>
                                                <td className="text-end">
                                                    {numeral(totalSum).format('0,0.00')} ₭
                                                </td> 
                                            </tr>
                                        </>
                                    ) : (
                                        <tr className="text-center">
                                            <td colSpan={7}>
                                                <img src="../assets/img/icon/file-not.png" className="w-25 text-center" alt="No Data" />
                                                <h5 className="text-red">ບໍ່ມີຂໍ້ມູນ</h5>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    )
}
