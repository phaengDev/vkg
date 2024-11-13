import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Input, Message, useToaster, } from 'rsuite';
import { Config } from '../config/connect';
import axios from 'axios';
const FormAddPolicy = ({ show, handleClose, fetchPolicy, val }) => {
    const api = Config.urlApi;

    const [values, setValues] = useState({
        policy_id: '',
        policy_name: '',
        policy_detail: ''
    });

    const handleChange = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(api + 'policy/create', values);
            if (response.status === 200) {
                fetchPolicy();
                handleClose();
                showMessage('ຢືນຢັນ', response.data.message, 'success');
                setValues({
                    policy_id: '',
                    policy_name: '',
                    policy_detail: ''
                })
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
        }
    };

    const toaster = useToaster();
    const showMessage = (titleName, messName, notifi) => {
        const message = (
            <Message showIcon type={notifi} closable>
                <strong>{titleName} </strong> {messName}
            </Message>
        );
        toaster.push(message, { placement: 'topEnd' }); // Correct placement usage
    };
    useEffect(() => {
        if (val) {
            setValues({
                policy_id: val.policy_id || '',
                policy_name: val.policy_name || '',
                policy_detail: val.policy_detail || ''
            })
        }else{
            setValues({
                policy_id: '',
                policy_name: '',
                policy_detail: ''
            })
        }
    }, [val])
    return (
        <Modal show={show} size='lg' onHide={handleClose}>
            <Modal.Header className='py-2' closeButton>
                <Modal.Title >ຟອມເພີ່ມນະໂຍບາຍຮ້ານ</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="form-group mb-2">
                        <label htmlFor="" className='form-label'>ຫົວຂໍ້ {values.policy_id}</label>
                        <Input value={values.policy_name} onChange={(e) => handleChange('policy_name', e)} placeholder='ຫົວຂໍ້ນະໂຍບາຍ....' required />
                    </div>
                    <CKEditor
                        editor={ClassicEditor}
                        data={values.policy_detail}
                        config={{
                            placeholder: 'ໃສ່ເນື້ອຫາຂອງທ່ານທີ່ນີ້...',
                            toolbar: [
                                'heading', '|',
                                'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
                                'undo', 'redo', 'tracking'
                            ]
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            handleChange('policy_detail', data);
                        }}
                    />

                </Modal.Body>
                <Modal.Footer className='py-2'>
                    <Button type='submit' variant="primary" > ບັນທຶກນະໂຍບາຍ</Button>
                    <Button variant="danger" onClick={handleClose}>ຍົກເລີກ </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default FormAddPolicy