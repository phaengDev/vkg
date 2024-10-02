import React, { useState, useEffect } from 'react';
import { Input, SelectPicker, Modal, Button } from 'rsuite';
import { Link } from 'react-router-dom';
import { Config, Urlimage } from '../../config/connect';
// import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { useProvince } from '../../utils/selectOption';
export default function SystemPage() {
    const api = Config.urlApi;
    const img = Urlimage.url;

    const province = useProvince();
    const [idistrict, setIdistrict] = useState(null);

    const [district, setDistrict] = useState([]);
    const showDistrict = async (id) => {
        try {
            const response = await fetch(api + `district/pv/${id}`);
            const jsonData = await response.json();
            setDistrict(jsonData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const dataDist = district.map(item => ({ label: item.district_name, value: item.district_id }));
    const branchId = localStorage.getItem('branch_Id');
    const [data, setData] = useState([]);
    const showpData = async () => {
        const response = await fetch(api + 'system/' + branchId);
        const jsonData = await response.json();
        setData(jsonData);

    } ;

    // ============
    const [inputs, setInputs] = useState({
        branch_uuid: '',
        branch_logo: null,
        branch_name: '',
        branch_tel: '',
        branch_email: '',
        province_id_fk: '',
        district_id_fk: '',
        village_name: '',
        branch_detail: '',
        branch_status: ''
    })
    const stts = [
        { label: 'ເປິດໃຊ້ງານ', value: 1 },
        { label: 'ປິດໃຊ້ງານ', value: 2 }
    ];
    const [lgShow, setLgShow] = useState(false);
    const handleEdit = (data) => {
        setInputs({
            branch_uuid: data.branch_uuid,
            branch_name: data.branch_name,
            branch_tel: data.branch_tel,
            branch_email: data.branch_email,
            province_id_fk: data.province_id_fk,
            district_id_fk: data.district_id_fk,
            village_name: data.village_name,
            branch_detail: data.branch_detail,
            branch_status: data.branch_status,
        })
        setIdistrict(data.district_id_fk);
        showDistrict(data.province_id_fk);
        if (data.branch_logo !== '') {
            setLogo(img + 'logo/' + data.branch_logo);
        }

        setLgShow(true);
    }

    const fetchDistrict = (name, value) => {
        showDistrict(value);
        setInputs({
            ...inputs, [name]: value
        })
    }

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [logo, setLogo] = useState('assets/img/logo/logo.png')
    const viewLogo = (id, logoimg) => {
        if (logoimg !== '') {
            setLogo(img + 'logo/' + logoimg);
        }
        setShow(true)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            branch_logo: file
        });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    //=======================
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('branch_uuid', inputs.branch_uuid);
        formData.append('branch_name', inputs.branch_name);
        formData.append('branch_tel', inputs.branch_tel);
        formData.append('branch_email', inputs.branch_email);
        formData.append('province_id_fk', inputs.province_id_fk);
        formData.append('district_id_fk', inputs.district_id_fk);
        formData.append('village_name', inputs.village_name);
        formData.append('branch_detail', inputs.branch_detail);
        formData.append('branch_status', inputs.branch_status);
        formData.append('file', inputs.branch_logo);

        // console.log(inputs);
        // try {
            axios.post(api + 'system/create', formData)
                .then(function (res) {
                    console.log(res)
                    if (res.status === 200) {
                        showpData();
                        setLgShow(false);
                        setInputs({
                            branch_uuid: '',
                            branch_logo: null,
                            branch_name: '',
                            branch_tel: '',
                            branch_email: '',
                            province_id_fk: '',
                            district_id_fk: '',
                            village_name: '',
                            branch_detail: '',
                            branch_status: ''
                        });
                        
                    } else {

                    }
                }).catch(function (error) {
                    alert()
                })
        
    };




    useEffect(() => {
        showpData();
        showDistrict(null)
    }, [branchId]);
    return (
        <>
            <div id="content" className="app-content p-0" >
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
                                    <li className='active'>
                                        <a href="javascript:;">
                                            <i className="fa fa-home fa-lg fa-fw me-2" /> ຂໍ້ມູນຮ້ານນາງວຽງຄຳ
                                        </a>
                                    </li>
                                    <li>
                                        <Link to={'/unite'}>
                                            <i class="fa-brands fa-ubuntu fa-lg fa-fw me-2"></i> ຕັ້ງຄ່າຫົວໜ່ວຍ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={'/price'}>
                                            <img alt="" src="assets/img/icon/price-2.png" className="rounded-0 me-2px mb-1px" width={30} /> ຕັ້ງຄ່າລາຄາ ຊື້-ຂາຍ
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
                    <div className="mailbox-content" >
                        <div className="mailbox-content-header py-2">
                            <div className="btn-toolbar align-items-center">
                                <h4>ຂໍ້ມູນຮ້ານຄຳ ນາງວຽງຄຳ</h4>
                            </div>
                        </div>
                        <div className="mailbox-content-body p-3" style={{ background: "url(/assets/img/cover/cover-scrum-board.png) no-repeat fixed", backgroundSize: 360, backgroundPosition: "right bottom" }}>
                            <div className="row">
                                <div className="col-sm-8">
                                    <table width={'100%'} className='table table-sm text-nowrap '>
                                        <tbody>
                                            <tr>
                                                <td rowSpan={4} width={'25%'} className='text-center me-3 border-0'>
                                                    <img src={data.branch_logo===''?'assets/img/logo/logo.png':img+'logo/'+data.branch_logo} className='w-75' onClick={() => viewLogo(data.branch_uuid, data.branch_logo)} role='button' alt="" />
                                                </td>
                                                <td width={'10%'} className='text-end border-0'>ຊື່ຮ້ານ:</td>
                                                <td className=''><span className='me-2'>{data.branch_name} </span></td>
                                            </tr>
                                            <tr>
                                                <td className='text-end border-0' width={'10%'}>ເບີໂທລະສັບ:</td>
                                                <td className=''><span className='me-2'>{data.branch_tel} </span></td>
                                            </tr>
                                            <tr>
                                                <td className='text-end border-0' width={'10%'}>ອິເມວ:</td>
                                                <td className=''><span className='me-2'>{data.branch_email}</span></td>
                                            </tr>
                                            <tr>
                                                <td className='text-end border-0' width={'10%'}>ທີ່ຢູ່ປະຈຸບັນ:</td>
                                                <td className=''><span className='me-2'>{data.village_name}, {data.district_name + ', ' + data.province_name} </span></td>
                                            </tr>
                                            <td className='text-center border-0'><span class="badge bg-success px-2 text-white" onClick={() => handleEdit(data)} role='button'><i class="fa-solid fa-pen"></i> ແກ້ໄຂຂໍ້ມູນ</span></td>
                                            <td className='border-0'>ລາຍລະອຽດ:</td>
                                            <td>{data.branch_detail}</td>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-sm-4">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Modal size='xs' open={show} onHide={handleClose}>
                    {/* <Modal.Body className='p-0'> */}
                        <img src={logo} alt="" className='w-100' />
                    {/* </Modal.Body> */}
                </Modal>

                <Modal open={lgShow} onHide={() => setLgShow(false)} >
                    <Modal.Header className='py-2' closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            ຟອມແກ້ໄຂຂໍ້ມູນ
                        </Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-sm-3 mb-2 text-center">
                                    <label role='button' className='widget-card-cover w-100 text-center'>
                                        <img src={logo} className='w-100' alt="" />
                                        <input type="file" accept="image/*" onChange={handleFileChange} className='hide' />
                                    </label>
                                </div>
                                <div className="col-sm-9 mb-2">
                                    <div className="form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຊື່ຮ້ານ ຫຼື ສາຂາ</label>
                                        <Input defaultValue={inputs.branch_name} onChange={(e) => handleChange('branch_name', e)} block />
                                    </div>
                                    <div className="form-group mb-2">
                                        <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                        <Input defaultValue={inputs.branch_tel} onChange={(e) => handleChange('branch_tel', e)} block />
                                    </div>
                                </div>
                                <div className="col-sm-12 mb-2">
                                    <label htmlFor="" className='form-label'>ອີເມວ</label>
                                    <Input defaultValue={inputs.branch_email} onChange={(e) => handleChange('branch_email', e)} block />
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <label htmlFor="" className='form-label'>ແຂວງ</label>
                                    <SelectPicker data={province} defaultValue={inputs.province_id_fk} onChange={(e) => fetchDistrict('province_id_fk', e)} block />
                                </div>
                                <div className="col-sm-6 mb-2">
                                    <label htmlFor="" className='form-label'>ເມື່ອງ </label>
                                    <SelectPicker data={dataDist} value={idistrict} onChange={(e) => handleChange('district_id_fk', e)} block />
                                </div>
                                <div className="col-sm-8 mb-2">
                                    <label htmlFor="" className='form-label'>ບ້ານ</label>
                                    <Input defaultValue={inputs.village_name} onChange={(e) => handleChange('village_name', e)} />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ສະຖານະ</label>
                                    <Select options={stts} defaultValue={stts.find(obj => obj.value === inputs.branch_status)} onChange={(e) => handleChange('branch_detail', e.value)} />
                                </div>
                                <div className="col-sm-12 mb-2">
                                    <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
                                    <Input as="textarea" value={inputs.branch_detail} onChange={(e) => handleChange('branch_detail', e)} />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='submit' appearance="primary"> ບັນທຶກ </Button>
                            <Button onClick={() => setLgShow(false)} color='red' appearance="primary">ອອກ</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        </>
    )
}
