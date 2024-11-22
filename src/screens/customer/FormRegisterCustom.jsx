import React, { useState ,useEffect} from 'react'
import { Modal, Button, Input, SelectPicker, InputGroup } from 'rsuite';
import { Config } from '../../config/connect';
import { useProvince, useDistrict } from '../../utils/selectOption';
import numeral from 'numeral';
import { Notification } from '../../utils/Notifig';
import axios from 'axios';
function FormRegisterCustom({ open, handleClose, data,fetchData }) {
    const api = Config.urlApi;
    const itemProvince = useProvince();
    const [idpv, setIdpv] = React.useState('');
    const itemDistrict = useDistrict(idpv);

    const [values, setValues] = useState({
        sale_uuid_fk: '',
        bill_shop: '',
        cus_fname: '',
        cus_lname: '',
        cus_tel: '',
        card_number: '',
        district_id_fk: null,
        villageName: '',
        cus_remark: ''
    })
    const handleChange = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post(api + 'customer/create', values)
                .then(function (res) {
                    if (res.status === 200) {
                        handleClose();
                        fetchData();
                        Notification.success('ຢືນຢັນ',res.data.message);
                        setValues({
                            sale_uuid_fk: '',
                            bill_shop: '',
                            cus_fname: '',
                            cus_lname: '',
                            cus_tel: '',
                            card_number: '',
                            district_id_fk: null,
                            villageName: '',
                            cus_remark: ''
                        })
                    } else {
                        Notification.error('ແຈ້ງເຕືອນ',res.data.message)
                    }
                });
        } catch (error) {
            Notification.error('ແຈ້ງເຕືອນ','ເກີດຂໍຜິດພາດທາງລະບົບ')
        }
    }
    useEffect(() => {
        setValues({
            ...values, sale_uuid_fk: data.sale_uuid
        })
    },[data])
    return (
        <Modal open={open} size={"lg"} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title className="py-1">ອອກບິນລູກຄ້າ</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-6">
                        <div class="widget py-2 widget-stats bg-dark border-gold border-top border-4 rounded-top-4 rounded-bottom-4">
                            <div class="stats-icon"><i class="fa-solid fa-hand-holding-dollar text-gold"/></div>
                            <div class="stats-info">
                                <h4 class="fs-4">ຍອດຂາຍທັງໝົດ</h4>
                                <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                                            <stop stop-color="rgb(255, 213, 127)" offset="0" />
                                            <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                                            <stop stop-color="rgb(179, 149, 0)" offset="1" />
                                        </linearGradient>
                                    </defs>
                                    <text font-family="arial" font-size="40" id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                                        <tspan x="0" y="37">{numeral(data.balance_total).format('0,00')} ₭</tspan>
                                    </text>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 ">
                        <div className="form-group my-2 bg-dark px-5 text-center rounded bm-3">
                            <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg" >
                                <defs>
                                    <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                                        <stop stop-color="rgb(255, 213, 127)" offset="0" />
                                        <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                                        <stop stop-color="rgb(179, 149, 0)" offset="1" />
                                    </linearGradient>
                                </defs>
                                <text font-family="arial" text-align="center" font-size="30" id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                                    <tspan x="0" y="37">Bill No: {data.sale_billNo} </tspan>
                                </text>
                            </svg>
                        </div>
                        <div className="form-group">
                            <InputGroup inside >
                            <InputGroup.Addon><i class="fa-solid fa-receipt fs-4"/></InputGroup.Addon>
                            <Input type="text" value={values.bill_shop} onChange={e => handleChange('bill_shop', e)} placeholder="ບິນຮ້ານ" />
                            </InputGroup>
                        </div>
                    </div>


                    <div className="col-6 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ຊື່ລູກຄ້າ</label>
                            <Input type="text" value={values.cus_fname} onChange={e => handleChange('cus_fname', e)} placeholder="ຊື່ລູກຄ້າ" required />
                        </div>
                    </div>
                    <div className="col-6 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ນາມສະກຸນ</label>
                            <Input type="text" value={values.cus_lname} onChange={e => handleChange('cus_lname', e)} placeholder="ນາມສະກຸນ" />
                        </div>
                    </div>
                    <div className="col-6 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ເບີໂທລະສັບ</label>
                            <Input type="text" value={values.cus_tel} onChange={e => handleChange('cus_tel', e)} placeholder="ເບີໂທລະສັບ" required />
                        </div>
                    </div>
                    <div className="col-6 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ເລກບັດປະຈຳຕົວ</label>
                            <Input type="text" value={values.card_number} onChange={e => handleChange('card_number', e)} placeholder="ເລກບັດປະຈຳຕົວ" />
                        </div>
                    </div>
                    <div className="col-6 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ຊື່ແຂວງ</label>
                            <SelectPicker data={itemProvince} onChange={(value) => setIdpv(value)} placeholder="ເລືອກຊື່ແຂວງ" block />
                        </div>
                    </div>
                    <div className="col-6 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ຊື່ເມືອງ</label>
                            <SelectPicker data={itemDistrict} onChange={(value) => handleChange('district_id_fk', value)} placeholder="ເລືອກຊື່ເມືອງ" block />
                        </div>
                    </div>
                    <div className="col-12 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ຊື່ບ້ານ</label>
                            <Input type="text" value={values.villageName} onChange={e => handleChange('villageName', e)} placeholder="ປ້ອນຊື່ບ້ານ..." />
                        </div>
                    </div>
                    <div className="col-12 mb-2">
                        <div className="form-group">
                            <label className='form-label'>ໝາຍເຫດ</label>
                            <Input as={'textarea'} value={values.cus_remark} onChange={e => handleChange('cus_remark', e)} placeholder="ໝາຍເຫດ..." />
                        </div>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' appearance="primary"> ບັນທືກ</Button>
                <Button onClick={handleClose} color='red' appearance="primary">ຍົກເລີກ </Button>
            </Modal.Footer>
            </form>
        </Modal>
    )
}

export default FormRegisterCustom