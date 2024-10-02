import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, DatePicker, Button, SelectPicker } from 'rsuite';
import axios from 'axios';
import { Config } from '../../config/connect';
import Select from 'react-select'
import Alert from '../../utils/config';
import { useProvince, useBranch } from '../../utils/selectOption';
function FormStaff() {
    const api = Config.urlApi;
    const itemPv = useProvince();
    const itembn = useBranch();
    const branch_Id = localStorage.getItem('branch_Id')
    const handleProvice = (name, value) => {
        setProvince(value)
        setInputs({
            ...inputs, [name]: value
        });
    }
    const [pvid, setProvince] = useState('');
    const [itemDistrict, setItemDistrict] = useState([]);
    const showDistrict = async () => {
        try {
            const response = await fetch(api + 'district/pv/' + pvid);
            const jsonData = await response.json();
            setItemDistrict(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const itemDt = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));

    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        first_name: '',
        last_name: '',
        profile:'',
        gender: '',
        birthday: '',
        province_id_fk: '',
        district_id_fk: '',
        village_name: '',
        staff_tel: '',
        branch_id_fk: branch_Id,
        staff_email: '',
        staff_remark: '',
        register_date: ''
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imputData=new FormData();
        for(const key in inputs){
            imputData.append(key,inputs[key])
        }
        try {
            axios.post(api + 'staff/create', imputData)
                .then(function (res) {
                    if (res.status === 200) {
                        Alert.successData(res.data.message);
                        navigate('/staff');
                    } else {
                        Alert.errorData(res.data.message)
                    }
                });
        } catch (error) {
            Alert.errorData('Error inserting data:', error)
            // console.error('Error inserting data:', error);
        }
    };
//=====================

const [selectedFile, setSelectedFile] = useState(null);
const [imageUrl, setImageUrl] = useState('assets/img/icon/user.webp');
const handleChangeProfile = (e) => {
    const file = e.target.files[0];
    setInputs({
        ...inputs,
        profile: file
    });
    if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    }
};
const handleClearprofile = () => {
    setSelectedFile(null);
    setImageUrl('assets/img/icon/user.webp')
    document.getElementById('fileInput').value = '';
    setInputs({
        ...inputs,
        profile: ''
    });
};


    const backPage = () => {
        navigate('/staff')
    }

    useEffect(() => {
        showDistrict();
    }, [pvid])
    return (
        <>
            <div id="content" className="app-content px-3">
                <ol class="breadcrumb float-xl-end">
                    <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li class="breadcrumb-item "><Link to={'/staff'}>ລາຍການພະນັກງານ</Link></li>
                    <li class="breadcrumb-item active">ແບບຟອມບັນທຶກຂໍ້ມູນ</li>
                </ol>
                <h1 className="page-header mb-3"><span role='button' onClick={backPage} className='text-danger me-2'><i class="fa-solid fa-circle-arrow-left"></i></span>  ຟອມລົງທະບຽນພະນັກງານ</h1>
                <div className="panel panel-inverse" >
                    <div className="panel-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-2 text-center">
                                    <div className='w-130px h-130px  position-relative'>
                                        <label role='button' className='rounded-3'>
                                            <input type="file" id='fileInput' onChange={handleChangeProfile} accept="image/*" className='hide' />
                                            <img src={imageUrl} className='w-120px rounded-3' alt="" />
                                        </label>
                                        {selectedFile && (
                                        <span role='button' onClick={handleClearprofile} class="w-20px h-20px p-0 d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-0 top-0 rounded-pill mt-n2 me-n4">x</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-sm-10 mb-2">
                                    <div className="row">
                                        <div className="col-sm-6 mb-2">
                                            <label htmlFor="" className='form-label'>ຊື່ພະນັກງານ</label>
                                            <Input type="text" name='first_name' onChange={(e) => handleChange('first_name', e)} placeholder='ຊື່ພະນັກງານ' required />
                                        </div>
                                        <div className="col-sm-6  mb-2">
                                            <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                                            <Input type="text" name='last_name' onChange={(e) => handleChange('last_name', e)} placeholder='ນາມສະກຸນ' required />
                                        </div>
                                        <div className="col-sm-6  mb-2">
                                            <label htmlFor="" className='form-label'>ວັນເດືອນປິເກີດ</label>
                                            <DatePicker oneTap format="dd/MM/yyyy" name='birthday' onChange={(e) => handleChange('birthday', e)} block placeholder="ວັນເດືອນປິເກີດ" required />
                                        </div>
                                        <div className="col-sm-6 mb-2">
                                            <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                            <Input type="text" name='staff_tel' onChange={(e) => handleChange('staff_tel', e)} placeholder='020 ........' required />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ເລືອກແຂວງ</label>
                                    <Select options={itemPv} onChange={(e) => handleProvice('province_id_fk', e.value)} block placeholder="ເລືອກແຂວງ" required />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ເລືອກເມືອງ</label>
                                    <Select options={itemDt} onChange={(e) => handleChange('district_id_fk', e.value)} block placeholder="ເລືອກເມືອງ" required />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ປ້ອນຊື່ບ້ານ</label>
                                    <Input onChange={(e) => handleChange('village_name', e)} placeholder='ຊື່ບ້ານ' block required />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>Email</label>
                                    <Input type="text" name='staff_email' onChange={(e) => handleChange('staff_email', e)} placeholder='****@gmail.com' />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ສາຂາ</label>
                                        <Select options={itembn} value={itembn.find(obj => obj.value === inputs.branch_id_fk)} onChange={(e) => handleChange('branch_id_fk', e.value)} />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <label htmlFor="" className='form-label'>ວັນທີເຂົ້າວຽກ</label>
                                    <DatePicker oneTap format="dd/MM/yyyy" defaultValue={new Date()} name='register_date' onChange={(e) => handleChange('register_date', e)} block placeholder="ວັນເດືອນປິເກີດ" />
                                </div>

                                <div className="col-sm-12 mb-2">
                                    <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                                    <Input as="textarea" rows={3} name='staff_remark' onChange={(e) => handleChange('staff_remark', e)} placeholder='ໝາຍເຫດ.......' />
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <Button type='reset' color='red' appearance="primary" startIcon={<i class="fa-solid fa-arrows-rotate" />} block> ຍົກເລີກ</Button>
                                </div>
                                <div className="col-6">
                                    <Button type='submit' appearance="primary" block startIcon={<i class="fa-solid fa-floppy-disk" />}> ບັນທຶກ</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FormStaff