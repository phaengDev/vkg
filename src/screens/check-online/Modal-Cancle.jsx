import React,{useState,useEffect} from 'react';
import { Button, Input} from 'rsuite';
import { Modal } from 'react-bootstrap';
import { Config } from '../../config/connect';
import axios from 'axios';
import { Notification } from '../../utils/Notifig';
function ModalCancle({show,handleClose,Id,fetchData}) {
const api=Config.urlApi;
const userId=localStorage.getItem('user_uuid');
const [data,setData]=useState(
{pay_sale_id:Id,
  pays_remark:'',
  check_user_id:''
});
const handleCancle = () => {
  try {
    axios.post(api + 'paysale/cancel', data)
        .then(function (res) {
            if (res.status === 200) {
                handleClose();
                fetchData();
                Notification.success(res.data.message, 'ຢືນຢັນ')
            } else {
              Notification.error(res.data.message, 'ແຈ້ງເຕືອນ')
            }
        }).catch(function (error) {
          Notification.error('ເກີດຂໍ້ຜິດພາດບໍ່ສາມາດບັນທຶກໄດ້', 'ແຈ້ງເຕືອນ')
        })
} catch (error) {
    console.error('Error inserting data:', error);
}
}

useEffect(() => {
  setData({
    ...data,pay_sale_id:Id,
    check_user_id:userId
  })
}, [Id,userId])
  return (
    <>
    <Modal show={show} size={''} onHide={handleClose} >
        <Modal.Header className='py-2' closeButton>
          <Modal.Title>ຢືນຢັນການຍົກເລີກ </Modal.Title>
        </Modal.Header>
        <Modal.Body className=''>
        <Input as="textarea" value={data.pays_remark} onChange={(e) => setData({ ...data, pays_remark: e })} placeholder="ໃສ່ລາຍລະອຽດການຍົກເລີກ" />
        </Modal.Body>
        <Modal.Footer className=' py-1'>
          <Button onClick={handleCancle} color="bleu" appearance="primary">ຢ້ນຢັນ</Button>
          <Button onClick={handleClose} color="red" appearance="primary">ຍົກເລີກ</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalCancle