import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { DatePicker, SelectPicker } from 'rsuite';
import { Link } from 'react-router-dom';
import { Config } from '../../config/connect';
import numeral, { options } from 'numeral';
import axios from 'axios';
import { useType } from '../../utils/selectOption';
function HistorySetPrice() {
    const api = Config.urlApi;
    const itemtp = useType();
    const [dataSearch, setDataSearch] = useState({
        startDate: new Date(),
        endDate: new Date(),
        type_id_fk: '',
    })
    const handleChange = (name, value) => {
        setDataSearch({
            ...dataSearch,
            [name]: value
        });
    };
    const [itemData, setItemData] = useState([]);
    const fetchData = async () => {
        console.log(dataSearch)
        try {
            const response = await axios.post(api + 'price/history/', dataSearch);
            setItemData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [dataSearch])
    return (
        <>
            <div id="content" className="app-content p-0">
                <div className="mailbox">
                    <div className="mailbox-sidebar">
                        <div className="mailbox-sidebar-header d-flex justify-content-center ">
                            <a href="#emailNav"
                                data-bs-toggle="collapse"
                                className="btn btn-dark btn-sm me-auto d-block d-lg-none">
                                <i className="fa fa-cog" />
                            </a>
                            <div className="fs-16px " >
                                ລາຍການເມນູ
                            </div>
                        </div>
                        <div className="mailbox-sidebar-content collapse d-lg-block" id="emailNav"  >
                            <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">

                                <ul className="nav nav-inbox">
                                    <li className=''>
                                        <Link to={'/system'}>
                                            <i className="fa fa-home fa-lg fa-fw me-2" /> ຂໍ້ມູນຮ້ານນາງວຽງຄຳ
                                        </Link>
                                    </li>
                                    <li className=''>
                                        <Link to={'/unite'}>
                                            <i class="fa-brands fa-ubuntu fa-lg fa-fw me-2"></i> ຕັ້ງຄ່າຫົວໜ່ວຍ
                                        </Link>
                                    </li>
                                    <li className=''>
                                        <Link to={'/price'}>
                                            <img alt="" src="assets/img/icon/price-2.png" className="rounded-0 me-2px mb-1px" width={30} /> ຕັ້ງຄ່າລາຄາ ຊື້-ຂາຍ
                                        </Link>
                                    </li>
                                    <li className=''>
                                        <Link to={'/rate'}>
                                            <img alt="" src="assets/img/icon/rate.png" className="rounded-0 me-2px mb-1px" width={30} /> ເລດເງິນ
                                        </Link>
                                    </li>
                                    {/* <li className='active'>
                                        <a href="javascript:;">
                                            <img alt="" src="assets/img/icon/price-h.png" className="rounded-0 me-2px mb-1px" width={30} />ການອັບເດດລາຄາ ຊື້-ຂາຍ

                                            <img alt="" src="assets/img/icon/price-h.png" className="rounded-0 me-2px mb-1px" width={30} />ປະຫວັດອັບເດດ ຊື້-ຂາຍ
                                        </a>
                                    </li> */}
                                </ul>

                            </div>
                        </div>
                    </div>
                    <div className="mailbox-content">
                        <div className="mailbox-content-header py-2">
                            <div className="btn-toolbar align-items-center">
                                <h4>ການຕັ້ງຄ່າ ລາຄາຊື້-ຂາຍ</h4>
                            </div>
                        </div>
                        <div className="mailbox-content-body p-1">
                            <div data-scrollbar="true" data-height="100%" >
                                <div class="list-group list-group-lg no-radius list-email">
                                    <div className="row mb-1 p-3">
                                        <div className="col-sm-3">
                                            <label htmlFor="" className='form-label'>ວັນທີ</label>
                                            <DatePicker oneTap defaultValue={new Date()} format="dd/MM/yyyy" onChange={(e) => handleChange('startDate', e)} block />
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="" className='form-label'>ວັນທີ</label>
                                            <DatePicker oneTap defaultValue={new Date()} format="dd/MM/yyyy" onChange={(e) => handleChange('endDate', e)} block />
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="" className='form-label'>ຫົວໜ່ວຍນ້ຳໜັກ</label>
                                            <SelectPicker data={itemtp} onChange={(e) => handleChange('type_id_fk', e)} block />
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table  table-bordered align-middle w-100 text-nowrap">
                                            <thead className='thead-plc'>
                                                <tr>
                                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                                    <th className='text-center'>ວັນທີ</th>
                                                    <th className=''>ປະເພດ</th>
                                                    <th className='text-center'>ນ້ຳໜັກ</th>
                                                    <th className='text-end bg-red'>ລາຄາຊື້ເກົ່າ</th>
                                                    <th className='text-end bg-green'>ລາຄາຊື້ໃໝ່</th>
                                                    <th className='text-end bg-red'>ລາຄາຂາຍເກົ່າ</th>
                                                    <th className='text-end bg-green'>ລາຄາຂາຍໃໝ່</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    itemData.length > 0 ? (
                                                        itemData.map((item, key) =>
                                                            <tr>
                                                                <td>{key + 1}</td>
                                                                <td className='text-center' > {moment(item.update_date).format('DD/MM/YYYY hh:mm')}</td>
                                                                <td>{item.typeName}</td>
                                                                <td className='text-center'>1 g</td>
                                                                <td className='text-end bg-red-100'>{numeral(item.price_buy_old).format('0,00')} Kip</td>
                                                                <td className='text-end bg-green-100'>{numeral(item.price_buy_new).format('0,00')} Kip</td>
                                                                <td className='text-end bg-red-100'>{numeral(item.price_sale_old).format('0,00')} Kip</td>
                                                                <td className='text-end bg-green-100'>{numeral(item.price_sale_new).format('0,00')} Kip</td>
                                                            </tr>
                                                        )) : (<>
                                                            <tr>
                                                                <td colSpan={8} className='text-center text-red'>ບໍ່ພົບຂໍ້ມູນທີ່ມີການບັນທຶກ</td>
                                                            </tr>
                                                        </>)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HistorySetPrice