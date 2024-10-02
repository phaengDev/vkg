import React,{useState,useEffect} from 'react'
import { Modal, Button, Input,Message ,useToaster} from 'rsuite';
import axios from 'axios';
import { Config,Urlimage } from '../config/connect';
import Swal from 'sweetalert2';
import Alert from '../utils/config';
export default function SliderPage() {
  const api=Config.urlApi;
  const img=Urlimage.url;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [inputs,setInputs]=useState({
    sliderId:'',
    slider_title:'',
    slider_detail:'',
    slider_image:''
  })

  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const handleFileChange = (e) => {
      const file = e.target.files[0];
      setInputs({
          ...inputs,
          slider_image: file
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
        slider_image: ''
    });
  };

const handleChange=(name,value)=>{
  setInputs({
    ...inputs,[name]:value
  })
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const inputData = new FormData();
  for (const key in inputs) {
      inputData.append(key, inputs[key]);
  }
  try {
      const response = await axios.post(api + 'slider/create', inputData);
      if (response.status === 200) {
        fetchSlider();
          handleClose();
          showMessage('ຢືນຢັນ',response.data.message,'success');
          setInputs({
            sliderId:'',
            slider_title:'',
            slider_detail:'',
            slider_image:''
          });
          setSelectedFile(null);
      }
  } catch (error) {
      console.error('Error inserting data:', error);
      showMessage('ແຈ້ງເຕືອນ','ອັບໂຫລດພາບບໍ່ສຳເລັດ','orrer');
  }
};

const [itemSlider, setItemSlider] = useState([]);
const fetchSlider = async () => {
    try {
        const response = await fetch(api + 'slider/');
        const jsonData = await response.json();
        setItemSlider(jsonData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const heandleEdit = (item) => {
  setInputs({
      sliderId: item.slider_id,
      slider_title: item.slider_title,
      slider_detail: item.slider_detail,
  })
  setOpen(true);
  if (item.slider_image) {
    setImageUrl(img + 'slider/' + item.slider_image);
    setSelectedFile(item.slider_image)
  } else {
    setImageUrl('');
    setSelectedFile(null);
  }

}

const headleDelete = (id) => {
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
        axios.delete(api + `slider/${id}`).then(function (response) {
          if (response.status === 200) {
            fetchSlider()
            Alert.successData(response.data.message)
          }
        }).catch((error) => {
          Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ', error)
        });
      }
    });
}




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
  fetchSlider()
},[])
  return (
    <div id="content" class="app-content px-3">
      <div class="breadcrumb float-end">
        <Button onClick={handleOpen} appearance="primary"> <i className="fas fa-plus me-2"></i> ເພີ່ມຂໍ້ມູນ</Button>
      </div>
      <h1 class="page-header mb-3">ຮູບພາບສະໄລ້ໂຊ້</h1>

      <div className="row">
        {itemSlider.length > 0 ?(
          itemSlider.map((item,key)=> (
        <div className="col-sm-6 col-lg-6 mb-4" >
          <div class="card border-0">
            <div
              className="h-250px rounded-top"
              style={{
                backgroundImage: `url(${img}/slider/${item.slider_image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div class="card-img-overlay">
              <div class="text-white float-end">
                <a href="#" data-bs-toggle="dropdown" class="btn btn-xs btn-default dropdown-toggle"><i class="fa-solid fa-ellipsis fs-4"></i></a>
                <div class="dropdown-menu dropdown-menu-end ">
                  <a href="javascript:;" onClick={()=>headleDelete(item.slider_id)} class="dropdown-item text-red"><i class="fa-solid fa-trash"></i> Delete</a>
                  <a href="javascript:;" onClick={()=>heandleEdit(item)} class="dropdown-item text-blue"><i class="fa-regular fa-pen-to-square"></i> Edit</a>
                </div>
              </div>

            </div>
            <div class="card-body">
              <h5 class="card-title mb-2">{item.slider_title}</h5>
              <p class="card-text">{item.slider_detail}</p>
            </div>
          </div>

        </div>
          ))
        ):('')}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>ເພີ່ມຮູບພາບສະໄລ້ໂຊ້</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="form-group mb-2">
            <label htmlFor="" className='form-label'>ຫົກຂໍ້</label>
            <Input value={inputs.slider_title} onChange={(e)=>handleChange('slider_title',e)} />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="" className='form-label'>ລາຍລະອຽດ</label>
            <Input as='textarea'  value={inputs.slider_detail} onChange={(e)=>handleChange('slider_detail',e)} placeholder='ລາຍລະອຽດ.....' rows={3} />
          </div>
          {!selectedFile &&(
          <div className="form-group text-center  rounded-3 mb-2 border-dotted">
            <label role='button'>
              <input type="file" id='fileInput' onChange={handleFileChange} className='hide' accept="image/*" />
           <img src="assets/img/icon/upload-add.jpg" width={'25%'} alt="" />
            </label>
          </div>
)}
          {selectedFile &&(
          <div class="card border-0">
            <div className="h-250px rounded-3"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat"
              }}  />
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
