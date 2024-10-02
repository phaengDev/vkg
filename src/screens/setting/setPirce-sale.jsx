import React, { useState, useEffect } from 'react';
import { Modal, Button, Message, useToaster, Input, SelectPicker, InputGroup } from 'rsuite';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Config } from '../../config/connect';
import numeral from 'numeral';
import { useOption, useType } from '../../utils/selectOption';
// import ChartPrice from '../Chart/chartUpdate-price';
export default function SetPirceSale() {
    const api = Config.urlApi;
    const itempt = useOption();
    const itemty = useType();

    const [openpt, setOpenpt] = useState(false);
    const optionModal = (index) => {
        setOpenpt(index)
    }

    const [itemoPtion, setItemoPtion] = useState([]);
    const fetchOption = async () => {
        try {
            const response = await fetch(api + 'type/option');
            const jsonData = await response.json();
            setItemoPtion(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }



    const [values, setValues] = useState({
        option_id: '',
        option_name: '',
        kilograms: ''
    })
    const handleOption = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }
    const headleEditOption = (item) => {
        setOpenpt(true)
        setValues({
            option_id: item.option_id,
            option_name: item.option_name,
            grams: item.grams
        })
    }
    const handleSumitPt = (event) => {
        event.preventDefault();
        axios.post(api + 'option/create', values)
            .then(function (res) {
                if (res.status === 200) {
                    setOpenpt(false)
                    fetchOption();
                    showMessage(res.data.message, 'success')
                } else {
                    showMessage(res.data.message, 'error')
                }
            }).catch(function (error) {
                showMessage('ເກີດຂໍ້ຜິດພາດບໍ່ສາມາດບັນທຶກໄດ້', 'error')
            })

    }

    //==========================
    const [datasch, steDataValue] = useState({
        typeId: '',
    })
    const [itemData, setItemData] = useState([]);
    const fecthData = async () => {
        try {
            const response = await axios.post(api + 'price/', datasch);
            setItemData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    const [open, setOpen] = React.useState(false);
    const handleModal = (index) => {
        setOpen(index)
    }
    const headleEdit = (item) => {
        setOpen(true)
        setInputs({
            prices_id: item.prices_id,
            type_id_fk: item.type_id_fk,
            kilograms: item.kilograms,
            price_buy: item.price_buy,
            price_sale: item.price_sale,
            price_buy_old: item.price_buy,
            price_sale_old: item.price_sale,
            Decrease:item.decrease,
            price_img: ''
        })
    }


    const [inputs, setInputs] = useState({
        prices_id: '',
        kilograms: '',
        type_id_fk: '',
        price_buy: '',
        price_sale: '',
        price_buy_old: '0',
        price_sale_old: '0',
        price_img: '',
        Decrease:'0'
    })


    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
       
    }

    const handleSumit = (event) => {
        event.preventDefault();
        const inputData = new FormData();
        for (const key in inputs) {
            inputData.append(key, inputs[key]);
        }
        try {
            axios.post(api + 'price/create', inputData)
                .then(function (res) {
                    if (res.status === 200) {
                        setOpen(false)
                        fecthData();
                        showMessage(res.data.message, 'success')
                    } else {
                        showMessage(res.data.message, 'error')
                    }
                }).catch(function (error) {
                    showMessage('ເກີດຂໍ້ຜິດພາດບໍ່ສາມາດບັນທຶກໄດ້', 'error')
                })
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }


    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            price_img: file
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
    const handleClearImage = () => {
        setSelectedFile(null);
        setImageUrl('')
        setInputs({
            ...inputs,
            price_img: ''
        });
    };


    const toaster = useToaster();
    // const [placement, setPlacement] = useState('topEnd');
    const showMessage = (messName, notifi) => {
        const message = (
            <Message showIcon type={notifi} closable>
                <strong>ຢືນຢັນ! </strong> {messName}
            </Message>
        );
        toaster.push(message, { placement: 'topEnd' });
    };
    useEffect(() => {
        fetchOption();
        fecthData();
    }, [])


    const [isReadOnly, setIsReadOnly] = useState(true); // Initialize state to control read-only mode

    const handleUnlock = () => {
        setIsReadOnly(!isReadOnly); // Toggle the read-only state
    };

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
                            <div className="fs-16px " >
                                ລາຍການເມນູ
                            </div>
                        </div>
                        <div className="mailbox-sidebar-content collapse d-lg-block" id="emailNav"  >
                            <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                                <ul className="nav nav-inbox">
                                    <li className=''>
                                        <Link to={'/system'}>
                                            <i className="fa fa-home fa-lg fa-fw me-2" /> ຂໍ້ມູນຮ້ານນາງວຽງຄຳ
                                        </Link>
                                    </li>
                                    <li className=''>
                                        <Link to={'/unite'}>
                                            <i class="fa-brands fa-ubuntu fa-lg fa-fw me-2"></i> ຕັ້ງຄ່າຫົວໜ່ວຍ
                                        </Link>
                                    </li>
                                    <li className='active'>
                                        <a href="javascript:;">
                                            <img alt="" src="assets/img/icon/price-2.png" className="rounded-0 me-2px mb-1px" width={30} /> ຕັ້ງຄ່າລາຄາ ຊື້-ຂາຍ
                                        </a>
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
                                <div class="btn-group me-2">
                                    <h4>ການຕັ້ງຄ່າ ລາຄາຊື້-ຂາຍ</h4>
                                </div>
                            </div>
                        </div>
                        <div className="mailbox-content-body p-1">
                            <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                                <div className="row">
                                    <div className="col-sm-6 col-lg-6">
                                        <div className="panel panel-inverse">
                                            <div class="panel-heading">
                                                <h4 class="panel-title">ການຕັ້ງຄ່ານ້ຳໜັກ</h4>
                                                <div class="panel-heading-btn">
                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                                                </div>
                                            </div>
                                            <div className="panel-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                                        <thead className='thead-plc'>
                                                            <tr>
                                                                <th width="1%" className='text-center'>ລ/ດ</th>
                                                                <th className=''>ຫົວໜ່ວຍນ້ຳໜັກ</th>
                                                                <th className='text-center'>ກຣາມ</th>
                                                                <th className='text-center'>ຕັ້ງຄ່າ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {itemoPtion.map((val, key) =>
                                                                <tr>
                                                                    <td className='text-center'>{key + 1}</td>
                                                                    <td>1/ {val.option_name}</td>
                                                                    <td className='text-center'>{val.grams} g </td>
                                                                    <td className='text-center' >
                                                                        <button type='button' onClick={() => headleEditOption(val)} className="btn btn-blue btn-xs me-2">
                                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-6">
                                        <div className="panel panel-inverse">
                                            <div class="panel-heading">
                                                <h4 class="panel-title">ການຕັ້ງຄ່າລາຄາຊື້-ຂາຍຄຳ</h4>
                                                <div class="panel-heading-btn">
                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-danger" data-toggle="panel-remove"><i class="fa fa-times"></i></a>
                                                </div>
                                            </div>
                                            <div className="panel-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                                        <thead className='thead-plc'>
                                                            <tr>
                                                                <th width="1%" className='text-center'>ລ/ດ</th>
                                                                <th className=''>ປະເພດ</th>
                                                                <th className='text-center'>ກຣາມ</th>
                                                                <th className='text-end'>ລາຄາຊື້</th>
                                                                <th className='text-end'>ລາຄາຂາຍ</th>
                                                                <th className='text-center'>ຕັ້ງຄ່າ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {itemData.map((item, key) =>
                                                                <tr>
                                                                    <td>{key + 1}</td>
                                                                    <td>{item.typeName}</td>
                                                                    <td className='text-center'>{item.kilograms} g</td>
                                                                    <td className='text-end'>{numeral(item.price_buy).format('0,00')} Kip</td>
                                                                    <td className='text-end'>{numeral(item.price_sale).format('0,00')} Kip</td>
                                                                    <td className='text-center' >
                                                                        <button type='button' onClick={() => headleEdit(item)} className="btn btn-blue btn-xs me-2">
                                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                                        </button>
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
                                {itemData.map((item, key) =>
                                    <div class="row ">
                                        {itemoPtion.map((val, key) =>
                                            <div class="col-xl-4 col-sm-6 col-md-6">
                                                <div class="widget widget-stats bg-vk border-4 border-top border-gold rounded-4">
                                                    <div class="stats-icon"><img src={`./assets/img/icon/${item.type_Id === 1 ? 'gold-2.png' : 'gold.webp'}`} width={50} alt="" /></div>
                                                    <div class="stats-info">
                                                        <h4 className='fs-16px'>{item.typeName} <span className='text-gold'>1 {val.option_name}</span> </h4>
                                                        <p className='fs-18px'>ຊື້: {numeral(item.price_buy * val.grams).format('0,00')} Kip </p>
                                                        <p className='mt-1 fs-18px'>ຂາຍ : {numeral(item.price_sale * val.grams).format('0,00')} Kip </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* <ChartPrice className="w-100" /> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal size={'md'} open={open} onClose={() => handleModal(false)}>
                <form onSubmit={handleSumit}>
                    <Modal.Header >
                        <Modal.Title className='py-2'>ຟອມຕັ້ງຄ່າລາຄາຊື້-ຂາຍ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ປະເພດ </label>
                                <SelectPicker data={itemty} value={inputs.type_id_fk} onChange={(e) => handleChange('type_id_fk', e)} placeholder='ເລືອກປະເພດ' block readOnly />
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ນ້ຳໜັກ </label>
                                <InputGroup inside >
                                    <Input data={itempt} value={inputs.kilograms} onChange={(e) => handleChange('kilograms', e)} placeholder='ນ້ຳໜັກ' block readOnly />
                                    <InputGroup.Addon>g</InputGroup.Addon>
                                </InputGroup>
                            </div>

                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ລາຄາຂາຍ /1g </label>
                                <InputGroup inside >
                                    <Input value={numeral(inputs.price_sale).format('0,00')} onChange={(e) => handleChange('price_sale', e)} placeholder='ລາຄາຂາຍ' block />
                                    <InputGroup.Addon>Kip</InputGroup.Addon>
                                </InputGroup>
                            </div>

                            <div className="col-sm-6 mb-2">
                                <label htmlFor="" className='form-label'>ລາຄາຊື້   <i class="fa-solid fa-sort-down text-red"/> {numeral(inputs.Decrease).format('0,00')} /1g</label>
                                <InputGroup inside >
                                    <Input value={numeral(inputs.Decrease).format('0,00')} onChange={(e) => handleChange('Decrease', e)} placeholder='ລາຄາຊື້' block readOnly={isReadOnly} />
                                    <InputGroup.Addon role='button' onClick={handleUnlock}>
                                        {isReadOnly ? (
                                            <i className="fa-solid fa-lock" /> 
                                        ) : (
                                            <i className="fa-solid fa-lock-open" /> 
                                        )}
                                    </InputGroup.Addon>
                                </InputGroup>
                            </div>

                        </div>

                        {!selectedFile && (
                            <div className="form-group text-center  rounded-3 mb-2 mt-3 border-dotted">
                                <label role='button'>
                                    <input type="file" id='fileInput' onChange={handleFileChange} className='hide' accept="image/*" />
                                    <img src="assets/img/icon/upload-add.jpg" width={'25%'} alt="" />
                                </label>
                            </div>
                        )}
                        {selectedFile && (
                            <div class="card border-0 mt-3">
                                <div className="h-250px rounded-3"
                                    style={{
                                        backgroundImage: `url(${imageUrl})`,
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat"
                                    }} />
                                <div class="card-img-overlay float-end">
                                    <div class="float-end">
                                        <a href="javascript:;" onClick={handleClearImage} class="text-red "><i class="fa-solid fa-circle-xmark fs-2"></i></a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">
                            ບັນທຶກ
                        </Button>
                        <Button onClick={() => handleModal(false)} color='red' appearance="primary">
                            ຍົກເລິກ
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>


            <Modal size={'xs'} open={openpt} onClose={() => optionModal(false)}>
                <form onSubmit={handleSumitPt}>
                    <Modal.Header >
                        <Modal.Title className='py-2'>ຟອມແກ້ໄຂນ້ຳໜັກ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-sm-12 mb-2">
                                <label htmlFor="" className='form-label'>ຫົວໜ່ວຍນ້ຳໜັກ </label>
                                <input type="text" value={values.option_id} className='hide' />
                                <Input value={values.option_name} onChange={(e) => handleOption('option_name', e)} placeholder='ຫົວໜ່ວຍນ້ຳໜັກ' block readOnly />
                            </div>
                            <div className="col-sm-12 mb-2">
                                <label htmlFor="" className='form-label'>ກຣາມ</label>
                                <InputGroup inside >
                                    <InputGroup.Addon> 1/{values.option_name} :</InputGroup.Addon>
                                    <Input value={values.grams} onChange={(e) => handleOption('grams', e)} placeholder='ກຣາມ' block />
                                    <InputGroup.Addon>g</InputGroup.Addon>
                                </InputGroup>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">
                            ບັນທຶກ
                        </Button>
                        <Button onClick={() => optionModal(false)} color='red' appearance="primary">
                            ຍົກເລິກ
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}
