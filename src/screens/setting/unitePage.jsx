import React, { useEffect, useState } from 'react'
import { Modal, Button} from 'rsuite';
import {Config} from '../../config/connect';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import Alert from '../../utils/config';
function UnitePage() {
    const api = Config.urlApi;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
        setInputs({
            unite_id:'',
            unite_name: ''
        })
    }
    const handleClose = () => setOpen(false);
    const [inputs, setInputs] = useState({
        unite_id:'',
        unite_name: ''
    })

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post(api + 'unite/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        handleClose();
                        fetchZone();
                        Alert.successData(res.data.message)
                    } else {
                        Alert.errorData(res.data.message)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    const headleEdit=(item)=>{
        setInputs({
            unite_id:item.unite_uuid,
            unite_name: item.unite_name
        })
        setOpen(true);
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
                axios.delete(api + `unite/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchZone();
                        Alert.successData(response.data.message)
                    } else {
                        Alert.errorData(response.data.message)
                    }
                });
            }
        });
    }

    const [filterName, setFilteName] = useState([])
    const [itemUnite, setItemUnite] = useState([]);
    const fetchZone = async () => {
        try {
            const response = await fetch(api + 'unite/');
            const jsonData = await response.json();
            setItemUnite(jsonData);
            setFilteName(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    }

    // const [filter, setFilter] = useState('');
    const Filter = (event) => {
        setItemUnite(filterName.filter(n => n.unite_name.toLowerCase().includes(event)))
    }

    useEffect(() => {
        fetchZone();
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
                                    <li  className='active'>
                                        <a href="javascript:;">
                                        <i class="fa-brands fa-ubuntu fa-lg fa-fw me-2"></i> ຕັ້ງຄ່າຫົວໜ່ວຍ
                                        </a>
                                    </li>
                                    <li>
                                        <Link to={'/price'}>
                                        <img alt="" src="assets/img/icon/price-2.png" className="rounded-0 me-2px mb-1px" width={30} /> ຕັ້ງຄ່າລາຄາ ຊື້-ຂາຍ
                                        </Link>
                                    </li>
                                    <li className=''>
                                        <Link to={'/h-price'}>
                                            <img alt="" src="assets/img/icon/price-h.png" className="rounded-0 me-2px mb-1px" width={30} />ປະຫວັດອັບເດດ ຊື້-ຂາຍ
                                        </Link>
                                    </li>
                                    <li className=''>
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
                               <h4>ຫົວໜ່ວຍສິນຄ້າ</h4>
                               <div class="ms-auto">
                            <button onClick={handleOpen} class="btn btn-danger btn-sm">
                            <i class="fa fa-plus"></i> ເພີ່ມຫົວໜ່ວຍ
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
                        <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className='thead-plc'>
                                <tr>
                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                    <th>ຊື່ຫົວໜ່ວຍ</th>
                                    <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemUnite.length > 0 ? (
                                    itemUnite.map((item, key) => (
                                        <tr key={key}>
                                            <td className='text-center' width='1%'>{key + 1}</td>
                                            <td>{item.unite_name}</td>
                                            <td className='text-center' width='10%'>
                                                <button type='button' onClick={()=>headleEdit(item)} className="btn btn-blue btn-xs me-2">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button type='button' onClick={() => headleDelete(item.unite_uuid)} className="btn btn-red btn-xs">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
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
                    <Modal.Title className='py-1'>ແບບຟອມພີ່ມຫົວໜ່ວຍ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="" className='form-label'>ຊື່ຫົວໜ່ວຍ</label>
                            <input type="text" name='unite_id' value={inputs.unite_id} className='hide' />
                            <input type='text' name='unite_name' value={inputs.unite_name} onChange={(e) => handleChange('unite_name', e.target.value)} className='form-control' placeholder='ຊື່ຫົວໜ່ວຍ'  required />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">ບັນທຶກ </Button>
                        <Button onClick={handleClose} color='red' appearance="primary">
                            ຍົກເລີກ
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default UnitePage