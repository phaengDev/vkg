import { values } from 'lodash';
import React, { useState, useEffect } from 'react'
import { Modal, Button, Grid, Row, Col, Input,useToaster,Message } from 'rsuite'
import { Config, Urlimage } from '../config/connect';
import axios from 'axios';
function FormPycenter({ open, handleClose, data, fetchData }) {
    const api = Config.urlApi;
    const img = Urlimage.url;
    const [inputs, setInputs] = useState({
        pcenterId: '',
        pcenter_image: '',
        pcenter_name: '',
        description: '',
    })

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    const [imageUrl, setImageUrl] = useState('./assets/img/icon/upload-add.jpg');
    const [files, setFiles] = useState('')
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            pcenter_image: file
        });
        setFiles(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleClearImage = () => {
        setImageUrl('./assets/img/icon/upload-add.jpg')
        setInputs({
            ...inputs,
            pcenter_image: ''
        });
        setFiles('')
    };

const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputData = new FormData();
        for (const key in inputs) {
            inputData.append(key, inputs[key]);
        }
        setLoading(true);
            try {
                const response = await axios.post(api + 'pcenter/create', inputData);
                if (response.status === 200) {
                    setInputs({
                        pcenterId: '',
                        pcenter_image: '',
                        pcenter_name: '',
                        description: '',
                    });
                    handleClose();
                    showMessage('ຢືນຢັນ',response.data.message,'success');
                    fetchData();
                    handleClearImage()
                }
            } catch (error) {
                console.error('Error inserting data:', error);
                showMessage('ແຈ້ງເຕືອນ','ອັບໂຫລດພາບບໍ່ສຳເລັດ','orrer');
            }
            finally {
                setLoading(false);
            }
       
    };

    useEffect(() => {
        if (data) {
            setInputs({
                pcenterId: data.pcenter_id,
                pcenter_name: data.pcenter_name,
                description: data.description
            });
            setImageUrl(`${img}slider/${data.pcenter_image}`);
            setFiles(data.pcenter_image);
        }else{
            setInputs({
                pcenterId:'',
                pcenter_name:'',
                pcenter_image: '',
                description:''
            });
            setImageUrl('./assets/img/icon/upload-add.jpg')
            setFiles('');
        }

    }, [data])
    const toaster = useToaster();
    const showMessage = (titleName, messName, notifi) => {
      const message = (
          <Message showIcon type={notifi} closable>
              <strong>{titleName} </strong> {messName}
          </Message>
      );
      toaster.push(message, { placement: 'topEnd' }); // Correct placement usage
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title className='py-1'>ຟອມເພີ່ມພີເຊັນເຕີ</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col xs={7}></Col>
                            <Col xs={10}>
                                <div className="container-file">
                                    <label class="widget-card rounded square mb-5px" role='button'>
                                        <div class="widget-card-cover" style={{ backgroundImage: `url(${imageUrl})` }} />
                                        <input type="file" onChange={handleFileChange} className='hide' />
                                    </label>
                                    <div class="cancle-top-right">
                                        {files && (
                                            <a href="javascript:void(0);" onClick={handleClearImage}><i class="fa-solid fa-circle-xmark text-red fs-3"></i></a>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col xs={7}></Col>
                            <Col xs={24}>
                                <div className="form-group mb-2">
                                    <label htmlFor="" className='form-label'>ຊື່ນາງແບບ</label>
                                    <Input value={inputs.pcenter_name} onChange={(e) => handleChange('pcenter_name', e)} placeholder='ຊື່ນາງແບບ' required />
                                </div>
                            </Col>
                            <Col xs={24}>
                                <div className="form-group">
                                    <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
                                    <Input as='textarea' value={inputs.description} onChange={(e) => handleChange('description', e)} placeholder='ລາຍລະອຽດ' />
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' appearance="primary" disabled={loading}> {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}  </Button>
                    <Button onClick={handleClose} color='red' appearance="primary"> ຍົກເລີກ </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default FormPycenter