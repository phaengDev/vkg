import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Message, useToaster, Pagination,Placeholder,Loader } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../config/connect';
import Swal from 'sweetalert2';
import Alert from '../utils/config';
import numeral from 'numeral';
export default function GiftMenory() {
    const api = Config.urlApi;
    const img = Urlimage.url;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () =>{
        setOpen(true);
        setInputs({
            giftId: '',
            gift_name: '',
            gift_text: '',
            gift_img: '',
            giftPrice:0
        })
    } 
    const handleClose = () => setOpen(false);

    const [inputs, setInputs] = useState({
        giftId: '',
        gift_name: '',
        gift_text: '',
        gift_img: '',
        giftPrice:0
    })


    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            gift_img: file
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
            gift_img: ''
        });
    };

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputData = new FormData();
        for (const key in inputs) {
            inputData.append(key, inputs[key]);
        }
        try {
            const response = await axios.post(api + 'gift/create', inputData);
            if (response.status === 200) {
                fetchgift();
                handleClose();
                showMessage('ຢືນຢັນ', response.data.message, 'success');
                setInputs({
                    giftId: '',
                    gift_name: '',
                    gift_text: '',
                    gift_img: '',
                    giftPrice:0
                });
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
        }
    };

    const [itemGift, setItemGift] = useState([]);
    const [isloading,setIsLoading]=useState(true)
    const fetchgift = async () => {
        try {
            const response = await fetch(api + 'gift/');
            const jsonData = await response.json();
            setItemGift(jsonData);
            setTotal(jsonData.length)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (item) => {
        setInputs({
            giftId: item.gift_id,
            gift_name: item.gift_name,
            gift_text: item.gift_text,
            giftPrice:item. gift_price
        })
        setOpen(true);
        if (item.gift_img) {
            setImageUrl(img + 'gift/' + item.gift_img);
            setSelectedFile(item.gift_img)
        } else {
            setImageUrl('');
            setSelectedFile(null);
        }

    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "ຢືນຢັນ?",
            text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
            icon: "warning",
            width: 400,
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            denyButtonText: `ຍົກເລີກ`
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + `gift/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchgift()
                        Alert.successData(response.data.message)
                    }
                }).catch((error) => {
                    Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ', error)
                });
            }
        });
    }

    const [activePage, setActivePage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50);


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
        fetchgift(activePage)
    }, [activePage])
    const currentItems = itemGift.slice((activePage - 1) * limit, activePage * limit);

    return (
        <div id="content" class="app-content px-3">
            <div class="breadcrumb float-end">
                <Button onClick={handleOpen} appearance="primary"> <i className="fas fa-plus me-2"></i> ເພີ່ມຂໍ້ມູນ</Button>
            </div>
            <h1 class="page-header mb-3">ລາຍການຂອງຂວັນ ຫຼື ຂອງທີ່ລະລຶກ</h1>

            <div className="row">
                { isloading===true ?(
                    <>
                    <Loader backdrop content="ກຳລັງໂຫລດຂໍ້ມູນ..." vertical />
                <div className="col-sm-4">
                    <div className='p-4 card border-0'>
                    <Placeholder.Paragraph size='lg' graph="image" active />
                    </div>
                </div>
                <div className="col-sm-4">
                     <div className='p-4 card border-0'>
                    <Placeholder.Paragraph size='lg' graph="image" active />
                    </div>
                </div>
                <div className="col-sm-4">
                     <div className='p-4 card border-0'>
                    <Placeholder.Paragraph size='lg' graph="image" active />
                    </div>
                </div>
                </>
                ):(
                    currentItems.length > 0 ? (
                    <>
                        {currentItems.map((item, key) => (
                            <div key={key} className="col-sm-6 col-lg-3 col-md-4 mb-4">
                                <div className="card border-0">
                                    <div
                                        className="h-250px rounded-top"
                                        style={{
                                            backgroundImage: `url(${img}/gift/${item.gift_img})`,
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat"
                                        }}
                                    />
                                    <div className="card-img-overlay">
                                        <div className="text-white float-end">
                                            <a href="#" data-bs-toggle="dropdown" className="btn btn-xs btn-default dropdown-toggle">
                                                <i className="fa-solid fa-ellipsis fs-4"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:;" onClick={() => handleDelete(item.gift_id)} className="dropdown-item text-red">
                                                    <i className="fa-solid fa-trash"></i> Delete
                                                </a>
                                                <a href="javascript:;" onClick={() => handleEdit(item)} className="dropdown-item text-blue">
                                                    <i className="fa-regular fa-pen-to-square"></i> Edit
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title mb-2">{item.gift_name}</h5>
                                        <div className='price text-red'>{numeral(item.gift_price).format('0,00')} ກີບ</div>
                                        <div className="card-text three-lines">
                                            {item.gift_text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className='col-12 float-end'>
                        <Pagination
                                prev
                                last
                                next
                                first
                                size="md"
                                total={total}
                                limit={limit}
                                activePage={activePage}
                                onChangePage={setActivePage}
                                onChangeLimit={(newLimit) => {
                                    setLimit(newLimit);
                                    setActivePage(1);
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="col-12 text-center">
                        <img src="/assets/img/icon/file-not.png" className="w-50" alt="No items found" />
                    </div>
                )
                )}
            </div>

            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title className='py-1'>ເພີ່ມຂອງທີ່ລະລຶກ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ຊື່ຂອງຂວັນ</label>
                            <Input value={inputs.gift_name} onChange={(e) => handleChange('gift_name', e)} />
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ມູນຄ່າເຄື່ອງ</label>
                            <Input value={numeral(inputs.giftPrice).format('0,00')} onChange={(e) => handleChange('giftPrice', e)} />
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
                            <Input as='textarea' value={inputs.gift_text} onChange={(e) => handleChange('gift_text', e)} placeholder='ລາຍລະອຽດ.....' rows={3} />
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
                        <Button type='submit' appearance="primary"> ບັນທຶກ </Button>
                        <Button onClick={handleClose} color='red' appearance="primary"> ຍົກເລີກ</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
