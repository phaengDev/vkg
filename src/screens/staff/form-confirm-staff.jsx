import React, { useState, useEffect } from 'react';
import { Modal, Button, DatePicker, Input } from 'rsuite';
import Select from 'react-select';
import { useProvince, useBranch, useDistrict } from '../../utils/selectOption';
import Alert from '../../utils/config';
import axios from 'axios';
import { Config } from '../../config/connect';
const FormConfirmStaff = ({ open, handleClose,item,fetchDate }) => {
    const api = Config.urlApi;
    const itemPv = useProvince();
    const itembn = useBranch();
    const branch_Id = localStorage.getItem('branch_Id')

    const [provinceId, setProvinceId] = useState(null);
    const itemDist = useDistrict(provinceId);
    const handleProvice = (name, value) => {
        setProvinceId(value);
        setInputs({
            ...inputs, [name]: value
        });
    };

    const [inputs, setInputs] = useState({
        registerjob_fk:item.registerjob_id,
        first_name:'',
        last_name: '',
        profile: '',
        gender: '',
        birthday: '',
        province_id_fk: '',
        district_id_fk: '',
        village_name: '',
        staff_tel:'' ,
        branch_id_fk: branch_Id,
        staff_email: '',
        staff_remark:'' ,
        register_date: new Date()
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });
    }

    console.log(inputs)


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imputData=new FormData();
        for(const key in inputs){
            imputData.append(key,inputs[key])
        }
        console.log(inputs)
        try {
            axios.post(api + 'staff/confrim', imputData)
                .then(function (res) {
                    if (res.status === 200) {
                        Alert.successData(res.data.message);
                        handleClose();
                        fetchDate();
                    } else {
                        Alert.errorData(res.data.message)
                    }
                });
        } catch (error) {
            Alert.errorData('Error inserting data:', error)
        }
    };


useEffect(()=>{
    if (item) {
        setInputs({
            registerjob_fk:item.registerjob_id,
            first_name: item.staff_name || '',
            last_name: '',
            profile: '',
            gender: '',
            birthday: '',
            province_id_fk: '',
            district_id_fk: '',
            village_name: '',
            staff_tel: item.staff_phone || '',
            branch_id_fk: branch_Id,
            staff_email: item.staff_email || '',
            staff_remark: item.staff_address || '',
            register_date: new Date(),
        });
    }
},[])
    return (
        <Modal open={open} size={'lg'} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title className='py-2'>ຟອມລົງທະບຽນພະນັກງານ</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
            <Modal.Body className='p-3'>
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
                                <label htmlFor="" className='form-label'>ຊື່ພະນັກງານ  {}</label>
                                <Input type="text" name='first_name' value={inputs.first_name} onChange={(e) => handleChange('first_name', e)} placeholder='ຊື່ພະນັກງານ' required />
                            </div>
                            <div className="col-sm-6  mb-2">
                                <label htmlFor="" className='form-label'>ນາມສະກຸນ</label>
                                <Input type="text" name='last_name'  onChange={(e) => handleChange('last_name', e)} placeholder='ນາມສະກຸນ' required />
                            </div>
                            <div className="col-sm-6  mb-2">
                                <label htmlFor="" className='form-label'>ວັນເດືອນປິເກີດ</label>
                                <DatePicker oneTap format="dd/MM/yyyy" name='birthday' onChange={(e) => handleChange('birthday', e)} block placeholder="ວັນເດືອນປິເກີດ" required />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ເບີໂທລະສັບ</label>
                                <Input type="text" name='staff_tel' value={inputs.staff_tel} onChange={(e) => handleChange('staff_tel', e)} placeholder='020 ........' required />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4 mb-2">
                        <label htmlFor="" className='form-label'>ເລືອກແຂວງ</label>
                        <Select options={itemPv} onChange={(e) => handleProvice('province_id_fk', e.value)} block placeholder="ເລືອກແຂວງ" required />
                    </div>
                    <div className="col-sm-4 mb-2">
                        <label htmlFor="" className='form-label'>ເລືອກເມືອງ</label>
                        <Select options={itemDist} onChange={(e) => handleChange('district_id_fk', e.value)} block placeholder="ເລືອກເມືອງ" required />
                    </div>
                    <div className="col-sm-4 mb-2">
                        <label htmlFor="" className='form-label'>ປ້ອນຊື່ບ້ານ</label>
                        <Input onChange={(e) => handleChange('village_name', e)} placeholder='ຊື່ບ້ານ' block required />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-4 mb-2">
                        <label htmlFor="" className='form-label'>Email</label>
                        <Input type="text" name='staff_email' value={inputs.staff_email} onChange={(e) => handleChange('staff_email', e)} placeholder='****@gmail.com' />
                    </div>
                    <div className="col-sm-4 mb-2">
                        <label htmlFor="" className='form-label'>ສາຂາ</label>
                        <Select options={itembn} value={itembn.find(obj => obj.value === inputs.branch_id_fk)} onChange={(e) => handleChange('branch_id_fk', e.value)} />
                    </div>
                    <div className="col-sm-4 mb-2">
                        <label htmlFor="" className='form-label'>ວັນທີເຂົ້າວຽກ</label>
                        <DatePicker oneTap format="dd/MM/yyyy" defaultValue={inputs.register_date} name='register_date' onChange={(e) => handleChange('register_date', e)} block placeholder="ວັນເດືອນປິເກີດ" />
                    </div>

                    <div className="col-sm-12 mb-2">
                        <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                        <Input as="textarea" rows={3} value={inputs.staff_remark} name='staff_remark' onChange={(e) => handleChange('staff_remark', e)} placeholder='ໝາຍເຫດ.......' />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' appearance="primary" className='px-3'><i class="fa-regular fa-circle-check"/> ຢືນຢັນເຂົ້າເປັນພະນັກງານ</Button>
                <Button onClick={handleClose} appearance="primary" color='red'> ຍົກເລີກ</Button>
            </Modal.Footer>
            </form>
        </Modal>
    )
}

export default FormConfirmStaff