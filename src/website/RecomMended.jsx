import React,{useState,useEffect} from 'react'
import { Input, InputGroup, Modal, Button, SelectPicker, InputPicker,Message,useToaster } from 'rsuite'
import { Config,Urlimage } from '../config/connect';
import { useTitle,useTitleList,useOption } from '../utils/selectOption';
import axios from 'axios';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import Alert from '../utils/config';
function RecomMended() {
  const api=Config.urlApi;
  const img=Urlimage.url;
  const titileList=useTitleList();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () =>{
    setOpen(true);
setInputs({
  recomendedId: '',
    title_id_fk: '',
    recomennde_name: '',
    qty_baht: '',
    optoin_id_fk:'',
    recd_remark: '',
    recd_image:''
})
  } 
  const handleClose = () => setOpen(false);
const itemType=useTitle();
const itemoPtion=useOption();

  const [inputs, setInputs] = useState({
    recomendedId: '',
    title_id_fk: '',
    recomennde_name: '',
    qty_baht: '',
    optoin_id_fk:'',
    recd_remark: '',
    recd_image:''
  })
  
  const handledChange=(name,value)=>{
    setInputs({
      ...inputs,[name]:value
    })
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputs({
      ...inputs,
      recd_image: file
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
      recd_image: ''
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = new FormData();
    for (const key in inputs) {
      inputData.append(key, inputs[key]);
    }
    try {
      const response = await axios.post(api + 'recd/create', inputData);
      if (response.status === 200) {
        fetchRecomende();
        handleClose();
        showMessage('ຢືນຢັນ', response.data.message, 'success');
        setInputs({
          recomendedId: '',
          title_id_fk: '',
          recomennde_name: '',
          qty_baht: '',
          optoin_id_fk:'',
          recd_remark: '',
          recd_image:''
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
    }
  };

  const [itemRecomende, setItemRecomende] = useState([]);
  const [isloading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [filterName, setFilterName] = useState([])
  const fetchRecomende = async () => {
    try {
      const response = await fetch(api + 'recd/');
      const jsonData = await response.json();
      setItemRecomende(jsonData);
      setFilterName(jsonData)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }


  const Filter = (event) => {
    setItemRecomende(filterName.filter(n => 
      n.recomennde_name.toLowerCase().includes(event.toLowerCase())));
  }


  const heandleEdit = (item) => {
    setInputs({
    recomendedId: item.recomended_id,
    title_id_fk: item.title_id_fk,
    recomennde_name: item.recomennde_name,
    qty_baht: item.qty_baht,
    recd_remark: item.recd_remark,
    optoin_id_fk:item.optoin_id_fk,
    recd_image:null
    })
    setOpen(true);
    if (item.recd_image) {
      setImageUrl(img + 'pos/' + item.recd_image);
      setSelectedFile(item.recd_image)
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
        axios.delete(api + `recd/${id}`).then(function (response) {
          if (response.status === 200) {
            fetchRecomende()
            Alert.successData(response.data.message)
          }
        }).catch((error) => {
          Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ', error)
        });
      }
    });
  }

  useEffect(()=>{
    fetchRecomende()
  },[])

// =======================
const [selectedTitle, setSelectedTitle] = useState('ເລືອກປະເພດ'); // Default label

const handleSelect = (item) => {
  if(item===null){
    setSelectedTitle('ເລືອກປະເພດ');
    setItemRecomende(filterName.filter(n => 
      n.title_id_fk.toLowerCase().includes(''.toLowerCase())));
  }else{
    setSelectedTitle(item.tile_name); // Update the selected item
    setItemRecomende(filterName.filter(n => 
      n.title_id_fk.toLowerCase().includes(item.tile_uuid.toLowerCase())));
    }
};

// =============================



  const toaster = useToaster();
  const showMessage = (titleName, messName, notifi) => {
    const message = (
      <Message showIcon type={notifi} closable>
        <strong>{titleName} </strong> {messName}
      </Message>
    );
    toaster.push(message, { placement: 'topEnd' }); // Correct placement usage
  };


  const totalPages = Math.ceil(itemRecomende.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemRecomende.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (

    <div id="content" class="app-content">
      <div class="d-flex align-items-center mb-3">
        <div>
          <h1 class="page-header mb-0">ສິນຄ້າແນະນຳ</h1>
        </div>
        <div class="ms-auto">
          <button class="btn btn-red btn-rounded px-4 rounded-pill" onClick={handleOpen}><i class="fa fa-plus fa-lg me-2 ms-n2 text-success-900"></i> ເພີ່ມຂໍ້ມູນໃໝ່</button>
        </div>
      </div>
      <div class="card border-0">
        <div class="tab-content p-3">
          <div class="input-group mb-3">
            <button class="btn btn-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{selectedTitle} <b class="caret"></b></button>
            <div class="dropdown-menu">
            <a class="dropdown-item fs-14px" href="javascript:;" onClick={() => handleSelect(null)} >--ທັງໝົດ--</a>
              {titileList.map((item,index)=>
              <a class="dropdown-item fs-14px" href="javascript:;" onClick={() => handleSelect(item)} ><i class="fa-solid fa-angle-right"/> {item.tile_name}</a>
            )}
            </div>

            <div class="flex-fill position-relative">
              <InputGroup inside className='rounded-start-0'>
                <InputGroup.Addon><i className='fas fa-search' /></InputGroup.Addon>
                <Input placeholder='ຄົ້ນຫາ.....' onChange={(e)=>Filter(e)} />
              </InputGroup>
            </div>
          </div>


          <div class="table-responsive">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th class="pt-0 pb-2"></th>
                  <th class="pt-0 pb-2">ລາຍການສິນຄ້າ</th>
                  <th class="pt-0 pb-2">ນ້ຳໜັກ</th>
                  <th class="pt-0 pb-2">ລາຄາຂາຍ</th>
                  <th class="pt-0 pb-2">ປະເພດ</th>
                  <th class="pt-0 pb-2">ໝາຍເຫດ</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item,index)=>(
                <tr>
                  <td class="w-10px align-middle"> {index+1} 
                    <span className='ms-1'>
                      <button type='button' onClick={()=>heandleEdit(item)} className='btn btn-xs btn-green me-1' ><i class="fa-solid fa-pen-to-square"/></button>
                      <button type='button' onClick={()=>handleDelete(item.recomended_id)} className='btn btn-xs btn-red' ><i class="fa-solid fa-trash"></i></button>
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="w-50px h-50px bg-light d-flex align-items-center justify-content-center">
                        <img alt class="mw-100 mh-100" src={`${img}pos/${item.recd_image}`} />
                      </div>
                      <div class="ms-3">
                        <a href="javascript:;" class="text-dark text-decoration-none">{item.recomennde_name}</a>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">{item.qty_baht+' '+item.option_name}</td>
                  <td class="align-middle">{numeral(item.qty_baht*item.price_sale).format('0,00')}</td>
                  <td class="align-middle">{item.tile_name}</td>
                  <td class="align-middle">{item.recd_remark}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-md-flex align-items-center">
        <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, itemRecomende.length)} of {itemRecomende.length} entries
        </div>
        <ul className="pagination mb-0 justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          </li>
          {[...Array(totalPages).keys()].map(number => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number + 1)}>
                {number + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </div>
    </div>
      </div>



      <Modal open={open} size={'md'} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>ສິນຄ້າແນະນຳ</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-6 mb-2">
              <label htmlFor="" className='form-label'>ປະເພດ</label>
              <SelectPicker block data={itemType} value={inputs.title_id_fk} onChange={(e)=>handledChange('title_id_fk',e)} />
            </div>
            <div className="col-sm-6 mb-2">
              <label htmlFor="" className='form-label'>ຊື່ສິນຄ້າ</label>
              <Input block value={inputs.recomennde_name} onChange={(e)=>handledChange('recomennde_name',e)} placeholder='ຊື່ສິນຄ້າ' />
            </div>
            <div className="col-sm-6 col-6 mb-2">
              <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
              <Input type='number' block value={inputs.qty_baht} onChange={(e)=>handledChange('qty_baht',e)} placeholder='0' />
            </div>
            <div className="col-sm-6 col-6 mb-2">
              <label htmlFor="" className='form-label'>ຫົວໜ່ວຍ</label>
              <InputPicker block  data={itemoPtion} value={inputs.optoin_id_fk} onChange={(e)=>handledChange('optoin_id_fk',e)} />
            </div>
            <div className="col-sm-12 mb-2">
              <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
              <Input as='textarea' placeholder='ໝາຍເຫດ....' value={inputs.recd_remark} onChange={(e)=>handledChange('recd_remark',e)} block />
            </div>
            <div className="col-sm-12">
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type='submit' appearance="primary"> <i className="fas fa-save"></i> ບັນທຶກ </Button>
          <Button onClick={handleClose} appearance="primary" color='red'> ຍົກເລີກ </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>

  )
}

export default RecomMended