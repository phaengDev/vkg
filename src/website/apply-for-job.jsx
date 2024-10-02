import React, { useEffect, useState } from 'react'
import { Button, Input, DateInput, DatePicker, useToaster, Message, Loader, Placeholder, Pagination } from 'rsuite'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Modal } from 'react-bootstrap';
import { Config, Urlimage } from '../config/connect';
import axios from 'axios';
import moment from 'moment';
import Alert from '../utils/config';
import Swal from 'sweetalert2';
export default function ApplyForJob() {
    const api = Config.urlApi;
    const url = Urlimage.url;
    const [open, setOpen] = React.useState(false);
    const handleOpen = (index) => {
        setOpen(index);
    }
    const [inputs, setInputs] = useState({
        apply_jobId: '',
        apply_job_title: '',
        apply_job_text: '',
        start_date: new Date(),
        end_date: new Date(),
        job_image: ''
    })

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            job_image: file
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
            job_image: ''
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputData = new FormData();
        for (const key in inputs) {
            inputData.append(key, inputs[key]);
        }
        try {
            const response = await axios.post(api + 'job/create', inputData);
            if (response.status === 200) {
                fetchApplyJob();
                setOpen(false);
                showMessage('ຢືນຢັນ', response.data.message, 'success');
                setInputs({
                    apply_job_id: '',
                    apply_job_title: '',
                    apply_job_text: '',
                    job_image: '',
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
const [datas,setDatas]=useState({
    start_date:null,
    end_date:null
})

    const [itemJob, setItemJob] = useState([]);
    const [isloading, setIsLoading] = useState(true)
    const [filter,setFilter]=useState([]);
    const fetchApplyJob = async () => {
        try {
            const response = await axios.post(api + 'job/',datas);
            const jsonData = response.data;
            setItemJob(jsonData);
            setFilter(jsonData)
            setTotal(jsonData.length)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }
    const Filter = (event) => {
        setItemJob(filter.filter(n => n.apply_job_title.toLowerCase().includes(event)))
    }


const handleEdit=(item)=>{
    setOpen(true);
    setInputs({
        apply_jobId: item.apply_job_id,
        apply_job_title: item.apply_job_title,
        apply_job_text: item.apply_job_text,
        job_image: '',
        start_date: new Date(item.start_date),
        end_date: new Date(item.end_date),
    });
    if (item.job_image) {
        setImageUrl(url + 'job/' + item.job_image);
        setSelectedFile(item.job_image)
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
            axios.delete(api + `job/${id}`).then(function (response) {
              if (response.status === 200) {
                fetchApplyJob();
                Alert.successData(response.data.message)
              }
            }).catch((error) => {
              Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ', error)
            });
          }
        });
      }


    //=================================
    const changeSearch=(name,value)=>{
        setDatas({
            ...datas,[name]:value
        })
    }

    const [detailStates, setDetailStates] = useState({});
    const toggleDetail = (key) => {
        setDetailStates(prevStates => ({
            ...prevStates,
            [key]: !prevStates[key]
        }));
    };
//========================

   const [isearch,setIsearch]=useState(false)

    const [activePage, setActivePage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    useEffect(() => {
        fetchApplyJob(activePage);
    }, [activePage,datas])
    const currentItems = itemJob.slice((activePage - 1) * limit, activePage * limit);
    //===================
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
        <div id="content" class="app-content">

            <ol class="breadcrumb float-end">
                <li class="breadcrumb-item"><a href="javascript:;">Home</a></li>
                <li class="breadcrumb-item active">ຮັບສະໝັກວຽກ</li>
            </ol>
            <h1 class="page-header mb-10px">ລາຍການຮັບສະໝັກວຽກ </h1>
            <div className="row">
                <div className='col-sm-1'></div>
                <div className="col-xl-10">
                    <div className="row" data-masonry='{"percentPosition": true }'>
                        <div className="panel rounded-pill">
                            {/* <div className="panel-body"> */}
                            <div class="widget-input-container py-1">
                                <div class="widget-input-box row">
                                    {isearch === false ? (
                                    <div className="col-sm-12">
                                    <Input className='rounded-pill' onChange={(e)=>Filter(e)} placeholder="ຄົ້ນຫາ...."  />
                                    </div>
                                    ):(
                                     <>
                                    <div className="col-sm-4">
                                    <DatePicker oneTap format='dd/MM/yyyy' value={datas.start_date}  className='rounded-pill' onChange={(e)=>changeSearch('start_date',e)} placeholder="ເລືອກວັນທີ...." block  />
                                    </div>
                                    <div className="col-sm-4">
                                    <DatePicker oneTap format='dd/MM/yyyy' value={datas.end_date} className='rounded-pill' onChange={(e)=>changeSearch('end_date',e)} placeholder="ເລືອກວັນທີ...." block />
                                    </div>
                                    <div className="col-sm-4">
                                    <Input className='rounded-pill' onChange={(e)=>Filter(e)} placeholder="ຄົ້ນຫາ...."  />
                                    </div>
                                    </>
                                    )}
                                </div>
                                <div class="widget-input-icon">
                                {isearch === false ? (
                                    <a href="javascript:;" onClick={()=>setIsearch(true)} class="text-body text-opacity-50" ><i class="fa-regular fa-calendar-days"/></a>
                                ):(
                                    <a href="javascript:;"  onClick={()=>setIsearch(false)} class="text-red text-opacity-50" ><i class="fa-solid fa-xmark"></i></a>
                                )}
                                    </div>
                                <div class="widget-input-divider ms-2"></div>
                                <div class="widget-input-icon"><a href="javascript:;" onClick={() => handleOpen(true)} class="text-red" ><i class="fa-solid fa-cloud-arrow-up"></i></a></div>
                            </div>
                            {/* </div> */}
                        </div>
                        {isloading === true ? (
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
                        ) : (
                            currentItems.length > 0 ? (
                                <>
                                    {currentItems.map((item, key) => (
                                        <div key={key} className="col-sm-12 col-lg-12 mb-4">
                                            <div className="card border-0">
                                                <div
                                                    className="h-350px rounded-top"
                                                    style={{
                                                        backgroundImage: `url(${url}job/${item.job_image})`,
                                                        backgroundPosition: "center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat: "no-repeat"
                                                    }}
                                                />
                                                <div className="card-body">
                                                    <ol class="breadcrumb float-end">
                                                        <li class="breadcrumb-item"><a href="javascript:;" onClick={()=>handleEdit(item)} className='text-blue'><i class="fa-solid fa-pen-to-square"></i> ແກ້ໄຂ</a></li>
                                                        <li class="breadcrumb-item"><a href="javascript:;" onClick={()=>handleDelete(item.apply_job_id)} className='text-red'><i class="fa-solid fa-trash"></i> ລົບ</a></li>
                                                    </ol>
                                                    <h5 className="card-title mb-2">
                                                        {item.apply_job_title}
                                                    </h5>
                                                    <p className="card-text">
                                                        <span><i class="fa-regular fa-calendar-days"></i>: {moment(item.start_date).format('DD/MM/YYYY')}</span> <i class="fa-solid fa-chevron-right ms-3 me-3"></i>
                                                        <span><i class="fa-regular fa-calendar-days"></i>: {moment(item.end_date).format('DD/MM/YYYY')}</span>
                                                    </p>
                                                    {detailStates[key] && (
                                                        <p className="card-text" dangerouslySetInnerHTML={{ __html: item.apply_job_text }} />
                                                    )}
                                                    {!detailStates[key] ? (
                                                        <p role="button" tabIndex="0" onClick={() => toggleDetail(key)} className="card-text float-end text-blue">
                                                            ອ່ານ​ຕື່ມ...
                                                        </p>
                                                    ):( <p role="button" tabIndex="0" onClick={() => toggleDetail(key)} className="card-text float-end text-blue">
                                                  -- <i class="fa-solid fa-angles-up"></i> ປິດ..
                                                </p>)}
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
                </div>
                <div className='col-sm-1'></div>
            </div>

            <Modal size={'lg'} show={open} onHide={() => handleOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <Modal.Body className='row'>
                        <div className="form-group mb-2">
                            <label htmlFor="" className='form-label'>ຫົວຂໍ້ສະໝັກ</label>
                            <Input value={inputs.apply_job_title} onChange={(e) => handleChange('apply_job_title', e)} placeholder='ຫົວຂໍ້ສະໝັກ' />
                        </div>
                        <div className="col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີເປິດຮັບ</label>
                            <DateInput format='dd/MM/yyyy' value={inputs.start_date} onChange={(e) => handleChange('start_date', e)} block />
                        </div>
                        <div className="col-sm-6 mb-2">
                            <label htmlFor="" className='form-label'>ວັນທີປິດຮັບ</label>
                            <DateInput format='dd/MM/yyyy' value={inputs.end_date} onChange={(e) => handleChange('end_date', e)} block />
                        </div>
                        <div className="col-sm-12">
                            <CKEditor
                                editor={ClassicEditor}
                                data={inputs.apply_job_text}
                                config={{
                                    placeholder: 'ໃສ່ເນື້ອຫາຂອງທ່ານທີ່ນີ້...',
                                    toolbar: [
                                        'heading', '|',
                                        'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                        'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
                                        'undo', 'redo', 'emoji'
                                    ]
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    handleChange('apply_job_text', data);
                                }}
                            />
                        </div>
                        {!selectedFile && (
                            <div className="text-center  rounded-4 mb-2 col-12 border-dotted">
                                <label role='button'>
                                    <input type="file" id='fileInput' onChange={handleFileChange} className='hide' accept="image/*" />
                                    <img src="assets/img/icon/upload-add.jpg" width={'25%'} alt="" />
                                </label>
                            </div>
                        )}
                        {selectedFile && (
                            <div class="card border-0 mt-3 p-0">
                                <img src={imageUrl} className='w-100' alt="" />
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
                        <Button onClick={() => handleOpen(false)} color='red' appearance="primary"> ຍົກເລີກ</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>

    )
}
