import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, Input, InputPicker, Dropdown } from 'rsuite'
import { Config } from '../../config/connect'
import axios from 'axios';
import PageIcon from '@rsuite/icons/Page';
import moment from 'moment';
import Swal from 'sweetalert2';
import Alert from '../../utils/config'
import FormConfirmStaff from './form-confirm-staff';
function ItemRegisterJop() {
    const api = Config.urlApi;
    const statsConfirm = [{
        label: '> ຄ້າງຮັບ',
        value: 1
    }, {
        label: '> ຍ້ອມຮັບຂໍສະເໜີ',
        value: 2
    }, {
        label: '> ປະຕິເສດການສະເໜີ',
        value: 3
    }]

    const [data, setData] = useState({
        start_date: '',
        end_date: '',
        statusUse: 1
    })

    const handleSearch = (name, values) => {
        setData({
            ...data, [name]: values
        })
    }

    const [itemRegister, setItemRegister] = useState([]);
    const fetchRegister = async () => {
        try {
            const response = await axios.post(api + 'job/fetchRegis', data);
            const jsonData = response.data;
            setItemRegister(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // ===========================================

    const handleCancle = (id) => {
        try {
            axios.get(api + `job/can-regist/${id}`).then(function (resp) {
                if (resp.status === 200) {
                    fetchRegister();
                    Alert.successData(resp.data.message);
                } else if (resp.status === 400) {
                    Alert.warningData(resp.data.message);
                } else {
                    Alert.errorData(resp.data.message);
                }
            })
        } catch (error) {
            Alert.errorData('ບໍ່ມີສາມາດຍົກເລີກໄດ້ ');
        }
    }

    // ========================================
    const handleDelete = (id) => {
        Swal.fire({
            title: "ຢືນຢັນ?",
            text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
            icon: "warning",
            width: 350,
            height: 300,
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            denyButtonText: `ຍົກເລີກ`
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + `job/del-regist/${id}`).then(function (resp) {
                    if (resp.status === 200) {
                        fetchRegister();
                        Alert.successData(resp.data.message);
                    } else if (resp.status === 400) {
                        Alert.warningData(resp.data.message);
                    } else {
                        Alert.errorData(resp.data.message);
                    }
                })
                    .catch((error) => {  // Fixed the syntax error here
                        Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
                    });
            }
        });
    }

    const [open, setOpen] = React.useState(false);
    const [dataView, setDataView] = useState({})
    const handleConfrim = (data) => {
        setOpen(true);
        setDataView(data);
    }

    useEffect(() => {
        fetchRegister()
    }, [data])
    return (
        <div className='app-content px-2'>
            <ol className="breadcrumb float-xl-end">
                <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                <li className="breadcrumb-item active">ລາຍການສະໝັກງານ</li>
            </ol>
            <h1 class="page-header mb-3">ລາຍການສະໝັກງານ</h1>

            <div className="panel">
                <div className="panel-heading">
                    <div class="panel-title fs-14px">
                        <div className="row ">
                            <div className="col-sm-3 col-6">
                                <label htmlFor="" className='form-label'>ວັນທີສະໝັກ</label>
                                <DatePicker oneTap format='dd/MM/yyyy' value={data.start_date} onChange={(e) => handleSearch('start_date', e)} block />
                            </div>
                            <div className="col-sm-3 col-6">
                                <label htmlFor="" className='form-label'>ວັນທີສະໝັກ</label>
                                <DatePicker oneTap format='dd/MM/yyyy' value={data.end_date} onChange={(e) => handleSearch('end_date', e)} block />
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="" className='form-label'>ສະຖານະຮັບ</label>
                                <InputPicker data={statsConfirm} value={data.statusUse} onChange={(e) => handleSearch('statusUse', e)} block />
                            </div>
                        </div>

                    </div>
                    <div class="panel-heading-btn">
                        <a href="#" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand">
                            <i class="fa fa-expand"></i>
                        </a>
                    </div>
                </div>
                <div class="panel-body">
                    <div className="table-responsive">
                        <table class="table table-striped table-bordered align-middle text-nowrap">
                            <thead className='thead-plc'>
                                <tr>
                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                    <th className='text-center' width={'10%'} >ວັນທີ່ສະໝັກ</th>
                                    <th>ຫົວຂໍ້ປະກາດ</th>
                                    <th className=''>ຊື່ແລະນາມສະກຸນ</th>
                                    <th className='text-center'>ເບີໂທລະສັບ</th>
                                    <th className=''>ອີເມວ</th>
                                    <th className=''>ທີ່ຢູ່ປະຈຸບັນ</th>
                                    <th className=''>ສະຖານະ</th>
                                    <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemRegister.length > 0 ? (
                                    itemRegister.map((item, index) => (
                                        <>
                                            <tr>
                                                <td className='text-center'>{index + 1}</td>
                                                <td className='text-center'>{moment(item.register_date).format('DD/MM/YYYY')}</td>
                                                <td>{item.apply_job_title}</td>
                                                <td>{item.staff_name}</td>
                                                <td>{item.staff_phone}</td>
                                                <td>{item.staff_email}</td>
                                                <td>{item.staff_address}</td>
                                                <td className={`text-center ${item.status_use === 1 ? 'text-orange' : item.status_use === 2 ? 'text-green' : 'text-red'}`}>{item.status_use === 1 ? 'ຍັງບໍ່ໄດ້ຮັບກວດສອບ' : item.status_use === 2 ? 'ໄດ້ຮັບເປັນພະນັກງານ' : 'ປະຕິເສດ'}</td>
                                                <td className='text-center'>
                                                    <Dropdown appearance="primary" title="ຂໍ້ມູນ..." size="xs" color="blue" icon={<PageIcon />} placement="bottomEnd">
                                                        <Dropdown.Item icon={<PageIcon />} className='text-red'>ເອກະສານ...</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => { handleCancle(item.registerjob_id) }}><i class="fa-solid fa-user-xmark text-red" /> ຍົກເລິກການສະໝັກ </Dropdown.Item>
                                                        {item.status_use !== 2 && (
                                                            <Dropdown.Item onClick={() => handleConfrim(item)}><i class="fa-regular fa-circle-check text-green" /> ຍ້ອມຮັບເປັນພະນັກງານ</Dropdown.Item>
                                                        )}
                                                        <Dropdown.Item onClick={() => { handleDelete(item.registerjob_id) }}> <i class="fa-solid fa-trash text-red" /> ລົບຂໍ້ມູນ</Dropdown.Item>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        </>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <FormConfirmStaff
                open={open}
                handleClose={() => setOpen(false)}
                item={dataView}
                fetchDate={fetchRegister}
            />
        </div>
    )
}

export default ItemRegisterJop