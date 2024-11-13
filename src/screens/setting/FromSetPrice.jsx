import React, { useState, useEffect } from 'react'
import { Config } from '../../config/connect';
import { Modal, Button, Message, useToaster, Input, SelectPicker, InputGroup, InputPicker } from 'rsuite';
import axios from 'axios';
import numeral, { options } from 'numeral';
import { useOptionLm, useType } from '../../utils/selectOption';
function FromSetPrice({ open, handleClose, item, fecthData }) {
    const api = Config.urlApi;
    const itempt = useOptionLm();
    const itemty = useType();


    const [inputs, setInputs] = useState({
        prices_id: '',
        kilograms: '',
        type_id_fk: '',
        price_buy: '',
        price_sale: '',
        price_buy_old: '0',
        price_sale_old: '0',
        price_img: '',
        Decrease: '0',
        option_id: '4'
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
        // return console.log(inputs);
        try {
            axios.post(api + 'price/create', inputData)
                .then(function (res) {
                    if (res.status === 200) {
                        handleClose()
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

    const [prices, setPrices] = useState(0);
    const [grams, setGrams] = useState(1)
    const handleChangeGram = (event) => {
        const data = itempt.find(item => item.value === event);
        if (data) {
            const newGrams = data.grams;
            const newPrice = item.price_sale * newGrams;

            setGrams(newGrams);
            setPrices(newPrice);
            const formattedPriceSale = (newPrice / newGrams).toFixed(2);
            setInputs((prevInputs) => ({
                ...prevInputs,
                option_id: event,
                price_sale: formattedPriceSale
            }));
        }
    }

    const handleChangePrice=(value)=>{
        const newAmount = parseFloat(value.replace(/,/g, ''));
        setPrices(newAmount);

        setInputs((prevInputs) => ({
            ...prevInputs,
            price_sale: newAmount/grams
        }));
    }

    useEffect(() => {
        setPrices(item.price_sale)
        setInputs({
            prices_id: item.prices_id,
            type_id_fk: item.type_id_fk,
            kilograms: item.kilograms,
            price_buy: item.price_buy,
            price_sale: item.price_sale,
            price_buy_old: item.price_buy,
            price_sale_old: item.price_sale,
            Decrease: item.decrease,
            option_id: '4',
            price_img: ''
        })
    }, [item])

    const toaster = useToaster();
    const showMessage = (messName, notifi) => {
        const message = (
            <Message showIcon type={notifi} closable>
                <strong>ຢືນຢັນ! </strong> {messName}
            </Message>
        );
        toaster.push(message, { placement: 'topEnd' });
    };
    const [isReadOnly, setIsReadOnly] = useState(true);
    const handleUnlock = () => {
        setIsReadOnly(!isReadOnly); // Toggle the read-only state
    };

    return (
        <Modal size={'md'} open={open} onClose={handleClose}>
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
                            <SelectPicker label={inputs.kilograms} value={inputs.option_id} data={itempt} onChange={(e) => handleChangeGram(e)} block />
                        </div>

                        <div className="col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ລາຄາຂາຍ /{grams}g </label>
                            <InputGroup inside >
                                <Input value={numeral(prices).format('0,00')} onChange={(e) => handleChangePrice(e)} placeholder='ລາຄາຂາຍ' block />
                                <InputGroup.Addon>Kip</InputGroup.Addon>
                            </InputGroup>
                        </div>

                        <div className="col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ລາຄາຊື້   <i class="fa-solid fa-sort-down text-red" /> {numeral(inputs.Decrease).format('0,00')} /1g</label>
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
                    <Button onClick={handleClose} color='red' appearance="primary">
                        ຍົກເລິກ
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default FromSetPrice