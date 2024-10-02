import React, { useEffect, useState } from 'react'
import {Input, Modal, Button} from 'rsuite';
import {Config} from '../../config/connect';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import Alert from '../../utils/config';
import numeral from 'numeral';
function RateChange() {
    const api = Config.urlApi;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //============= action =============
    const [inputs, setInputs] = useState({
        currencyId: '',
        genus: '',
        genus_laos:'',
        reate_price:'',
        currency_name: ''
    })
    const handleChange = (name,value) => {
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post(api + 'rate/create', inputs)
                .then(function (respones) {
                    if (respones.status === 200) {
                        handleClose();
                        fetchCurrency();
                        Alert.successData(respones.data.message)
                    } else {
                        Alert.errorData(respones.data.error)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    const handleEdit = (item) => {
        setInputs({
            currencyId: item.currency_id,
            genus: item.genus,
            genus_laos:item.genus_laos,
            reate_price:item.reate_price,
            currency_name: item.currency_name
        })
        setOpen(true)
    }

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
                axios.delete(api + `rate/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchCurrency()
                        Alert.successData(response.data.message)
                    } else {
                        Alert.errorData(response.data.message)
                    }
                }) .catch((error) => {
                    console.error('Error deleting data:', error);
                    Alert.errorData(error.response?.data?.message || "ບໍ່ສາມາດລົບຂໍ້ມູນນີ້");
                });
            }
        });
    }

    //=======================
    const [data, setData] = useState([]);
    const [itemCurrency, setItimeCurrency] = useState([]);
    const fetchCurrency = async () => {
        try {
            const response = await fetch(api + 'rate');
            const jsonData = await response.json();
            setItimeCurrency(jsonData);
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    //====================
    const Filter = (event) => {
        setItimeCurrency(data.filter(n => n.currency_name.toLowerCase().includes(event)))
    }

    //==========
    useEffect(() => {
        fetchCurrency()
    }, []);
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
                            <div  className="fs-16px " >
                                ລາຍການເມນູ
                            </div>
                            
                        </div>
                        <div className="mailbox-sidebar-content collapse d-lg-block" id="emailNav"  >
                            <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                                
                                <ul className="nav nav-inbox">
                                    <li>
                                        <Link to={'/system'}>
                                            <i className="fa fa-home fa-lg fa-fw me-2" /> ຂໍ້ມູນຮ້ານນາງວຽງຄຳ
                                        </Link>
                                    </li>
                                    <li className=''>
                                        <Link to={'/unite'}>
                                            <i class="fa-brands fa-ubuntu fa-lg fa-fw me-2"></i> ຕັ້ງຄ່າຫົວໜ່ວຍ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/price'}>
                                        <img alt="" src="assets/img/icon/price-2.png" className="rounded-0 me-2px mb-1px" width={30} /> ຕັ້ງຄ່າລາຄາ ຊື້-ຂາຍ
                                        </Link>
                                    </li>
                                    <li className='active'>
                                        <Link to={'/rate'}>
                                        <img alt="" src="assets/img/icon/rate.png" className="rounded-0 me-2px mb-1px" width={30} /> ເລດເງິນ
                                        </Link>
                                    </li>
                                </ul>
                               
                            </div>
                        </div>
                    </div>
                    <div className="mailbox-content">
                        <div className="mailbox-content-header py-2">
                            <div className="btn-toolbar align-items-center">
                               <h4>ສະກຸນເງິນ</h4>
                               <div class="ms-auto">
                            <button onClick={handleOpen} class="btn btn-danger btn-sm">
                            <i class="fa fa-plus"></i> ເພີ່ມສະກຸນເງິນ
                            </button>
                            </div>
                            </div>
                        </div>
                        <div className="mailbox-content-body p-2">
                    <div className="table-responsive">
                        <div className="row mb-2">
                            <div className="col-sm-9 fs-20px"> </div>
                            <div className="col-sm-3">
                                <div className='input-group' >
                                    <input type='text' className='form-control' onChange={(event) => Filter(event.target.value)} placeholder="ຄົ້ນຫາ" />
                                </div>
                            </div>
                        </div>
                        <table class="table table-striped table-bordered align-middle w-100 text-nowrap">
                        <thead className='thead-plc'>
                                <tr>
                                    <th className="text-center" width={'5%'}>ລ/ດ</th>
                                    <th className="">ຊື່</th>
                                    <th className="text-center" width={'10%'}>ສະກຸນ</th>
                                    <th className='text-end' width={'10%'}>ເລດເງິນ</th>
                                    <th className="text-center" width={'10%'}>ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemCurrency.map((item, key) =>
                                    <tr>
                                        <td className="text-center">{key + 1}</td>
                                        <td>{item.currency_name}</td>
                                        <td className="text-center">{item.genus} /{item.genus_laos}</td>
                                        <td className="text-end">{numeral(item.reate_price).format('0,00.00')} ₭</td>
                                        <td className='text-center'>
                                            <button type='button' onClick={() => handleEdit(item)} class="btn btn-blue btn-xs me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                            <button type='button' onClick={() => headleDelete(item.currency_id)} class="btn btn-red btn-xs"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                    </div>
                    </div>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title className='pt-1'>ສະກຸນເງິນ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="form-group mb-2">
                            <label htmlFor="" className="form-label">ຊື່</label>
                            <Input value={inputs.currency_name} onChange={(e)=>handleChange('currency_name',e)} placeholder="ຊື່" required />
                        </div>
                        <div className="form-group mb-2 row">
                            <div className="col-sm-6">
                                <label htmlFor="" className="form-label">ສະກຸນ</label>
                                <Input  value={inputs.genus} onChange={(e)=>handleChange('genus',e)} placeholder="₭" />
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="" className="form-label">ຊື່ພາສາລາວ</label>
                                <Input value={inputs.genus_laos} onChange={(e)=>handleChange('genus_laos',e)} placeholder="ລາວ" />
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="" className="form-label">ເລດເງິນ</label>
                            <Input value={numeral(inputs.reate_price).format('0,000')} onChange={(e)=>handleChange('reate_price',e)} placeholder="0,00"/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">ບັນທຶກ </Button>
                        <Button color='red' onClick={handleClose} appearance="primary"> ຍົກເລີກ </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default RateChange