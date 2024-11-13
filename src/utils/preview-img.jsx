import React, { useEffect, useState } from 'react';
import { Button, Input,Message,useToaster } from 'rsuite';
import { Modal } from 'react-bootstrap';
import {Config, Urlimage } from '../config/connect';
import axios from 'axios';
const PreviewImg = ({ open, onClose, images}) => {
    const api=Config.urlApi;
    const url = Urlimage.url;
    const [openview, setOpenview] =useState(false);

    const [openEd, setOpenEd] =useState(false);
    const handleClose = () => {
        setOpenEd(false);
        setOpenview(true)
    }

    const handleEdit = (data) => {
        setOpenEd(true)
        setOpenview(false)
        onClose()
        setImageUrl(`${url}potstnew/${data.img_list}`)
        setInputs({
            ...inputs,
            detail_id: data.detail_id,
            newText: data.newText
          });
    }
const [inputs,setInputs]=useState({
    detail_id:'',
    img_list:'',
    newText:''
})

    const [imageUrl, setImageUrl] = useState('');
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setInputs({
        ...inputs,
        img_list: file
      });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
const handleChange=(name,value)=>{
    setInputs({
        ...inputs,
        [name]: value
      });
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = new FormData();
    for (const key in inputs) {
      inputData.append(key, inputs[key]);
    }
    try {
      const response = await axios.post(api + 'news/editList', inputData);
      if (response.status === 200) {
        setOpenEd(false);
        setOpenview(true)
        showMessage('ຢືນຢັນ', response.data.message, 'success');
        setInputs({
        detail_id:'',
        img_list:'',
        newText:''
        });
        setImageUrl(null);
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${api}news/deleteList/${id}`);
      if (response.status === 200) {
        showMessage('ຢືນຢັນ', response.data.message, 'success');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
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
useEffect(()=>{
    setOpenview(open)
},[open,images])
    return (
        <>
            <Modal show={openview} size='lg' onClose={onClose}>
                <Modal.Body className='gallery row p-0'>
                    {images.map((item, index) =>
                        <div className={`px-0 ${images.length >1 ? 'col-6':'col-12' }`}>
                            <div class="image gallery-group-1 w-100">
                                <div class="image-inner">
                                    <img src={`${url}potstnew/${item.img_list}`} className='h-100' alt="" />
                                </div>
                                <div class="image-info p-2 ">
                                    <div class="desc">
                                        <div>{item.newText}</div>
                                        <span className='float-end '>
                                            <a href="javascript:;" onClick={() => handleEdit(item)} className='text-blue me-3'><i class="fa-solid fa-pen-to-square"></i> ແກ້ໄຂ</a>
                                            <a href="javascript:;" onClick={() => handleDelete(item.detail_id)} className='text-red ms-2'><i class="fa-solid fa-trash"></i>ລົບ</a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={onClose} color='red' appearance="primary">ປິດ</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={openEd} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                <Modal.Body className='row '>
                    <div className="form-group">
                        <div class="card border-0 bg-dark rounded-4">
                            <div class="h-300px w-100 rounded-4 card-img" style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat"
                            }} />
                            <div class="card-img-overlay pt-0 ">
                                <label class="float-end text-white" role='button'>
                                    <input type="file" onChange={handleFileChange} className='hide' />
                                    <i class="fa-solid fa-pen-to-square text-green"></i>
                                     </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
                        <Input as='textarea' value={inputs.newText} onChange={(e)=>handleChange('newText',e)} placeholder='ລາຍລະອຽດ....' />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button  type='submit' appearance="primary"> ບັນທຶກ</Button>
                    <Button color='red' onClick={handleClose} appearance="primary"> ຍົກເລີກ</Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default PreviewImg;
