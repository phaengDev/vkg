import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Message, useToaster, DatePicker, Pagination, Placeholder, Loader } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../config/connect';
import Swal from 'sweetalert2';
import Alert from '../utils/config';
import moment from 'moment';
export default function PromotionPage() {
  const api = Config.urlApi;
  const img = Urlimage.url;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () =>{
    setInputs({
      promotionId: '',
      promotion_title: '',
      promotion_detail: '',
      pro_image: '',
      start_date: new Date(),
      end_date: new Date(),
    })
    setOpen(true);
    setImageUrl('')
    setSelectedFile(null);
  }
  const handleClose = () => setOpen(false);

  const [inputs, setInputs] = useState({
    promotionId: '',
    promotion_title: '',
    promotion_detail: '',
    pro_image: '',
    start_date: new Date(),
    end_date: new Date(),
  })


  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputs({
      ...inputs,
      pro_image: file
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
      pro_image: ''
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
      const response = await axios.post(api + 'promotion/create', inputData);
      if (response.status === 200) {
        fetchPromotion();
        handleClose();
        showMessage('ຢືນຢັນ', response.data.message, 'success');
        setInputs({
          promotionId: '',
          promotion_title: '',
          promotion_detail: '',
          pro_image: '',
          start_date: new Date(),
          end_date: new Date(),
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
    }
  };

  const [itemPromotion, setItemPormotionn] = useState([]);
  const [isloading, setIsLoading] = useState(true)
  const fetchPromotion = async () => {
    try {
      const response = await fetch(api + 'promotion/');
      const jsonData = await response.json();
      setItemPormotionn(jsonData);
      setTotal(jsonData.length)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const heandleEdit = (item) => {
    setInputs({
      promotionId: item.promotion_id,
      promotion_title: item.promotion_title,
      promotion_detail: item.promotion_detail,
      start_date: new Date(item.start_date),
      end_date: new Date(item.end_date)
    })
    setOpen(true);
    if (item.pro_image) {
      setImageUrl(img + 'promotion/' + item.pro_image);
      setSelectedFile(item.pro_image)
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
        axios.delete(api + `promotion/${id}`).then(function (response) {
          if (response.status === 200) {
            fetchPromotion()
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
    fetchPromotion(activePage)
  }, [activePage])
  const currentItems = itemPromotion.slice((activePage - 1) * limit, activePage * limit);
  return (
    <div id="content" class="app-content px-3">
      <div class="breadcrumb float-end">
        <Button onClick={handleOpen} appearance="primary"> <i className="fas fa-plus me-2"></i> ເພີ່ມຂໍ້ມູນ</Button>
      </div>
      <h1 class="page-header mb-3">ລາຍການໂປຣໂມຊັ່ນ</h1>

      <div className="row">
        {isloading === true ?(
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
              <div className="col-sm-6 col-lg-4 mb-4" >
                <div class="card border-0">
                  <div
                    className="h-250px rounded-top"
                    style={{
                      backgroundImage: `url(${img}/promotion/${item.pro_image})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat"
                    }}
                  />
                  <div class="card-img-overlay">
                    <div class="text-white float-end">
                      <a href="#" data-bs-toggle="dropdown" class="btn btn-xs btn-default dropdown-toggle"><i class="fa-solid fa-ellipsis fs-4"></i></a>
                      <div class="dropdown-menu dropdown-menu-end ">
                        <a href="javascript:;" onClick={() => handleDelete(item.promotion_id)} class="dropdown-item text-red"><i class="fa-solid fa-trash"></i> Delete</a>
                        <a href="javascript:;" onClick={() => heandleEdit(item)} class="dropdown-item text-blue"><i class="fa-regular fa-pen-to-square"></i> Edit</a>
                      </div>
                    </div>

                  </div>
                  <div class="card-body ">
                    <h5 class="card-title mb-2">{item.promotion_title}</h5>
                    <div class="card-text  three-lines" >
                      {item.promotion_detail}
                    </div>
                    <hr className='mt-2 mb-2' />
                    <span className='me-3'><i class="fa-regular fa-calendar-days me-2"></i>: {moment(item.start_date).format('DD/MM/YYYY')}</span> <i class="fa-solid fa-chevron-right"></i>
                    <span className='ms-3'><i class="fa-regular fa-calendar-days me-2"></i>: {moment(item.end_date).format('DD/MM/YYYY')}</span>
                  </div>
                </div>

              </div>
            ))}
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
          </>
        ) : (
            <div className="col-12 text-center">
              <img src="/assets/img/icon/file-not.png" className="w-50" alt="No items found" />
            </div>
        ))
      }

      </div>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className='py-1'>ເພີ່ມລາຍກນໂປຣໂມຊັ່ນ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="form-group mb-2">
              <label htmlFor="" className='form-label'>ຊື່ໂປຣໂມຊັ່ນ</label>
              <Input value={inputs.promotion_title} onChange={(e) => handleChange('promotion_title', e)} />
            </div>
            <div className="form-group mb-2">
              <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
              <Input as='textarea' value={inputs.promotion_detail} onChange={(e) => handleChange('promotion_detail', e)} placeholder='ລາຍລະອຽດ.....' rows={3} />
            </div>
            <div className="row">
              <div className="form-group mb-2 col-6">
                <label htmlFor="" className='form-label'>ວັນທີເລີມ</label>
                <DatePicker oneTap format='dd/MM/yyyy' value={inputs.start_date} onChange={(e) => handleChange('start_date', e)} block />
              </div>
              <div className="form-group mb-2 col-6">
                <label htmlFor="" className='form-label'>ວັນທີສິນສຸດ</label>
                <DatePicker oneTap format='dd/MM/yyyy' value={inputs.start_date} onChange={(e) => handleChange('start_date', e)} block />
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
            <Button type='submit' appearance="primary"> ບັນທຶກ </Button>
            <Button onClick={handleClose} color='red' appearance="primary"> ຍົກເລີກ</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
