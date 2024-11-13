import React, { useState, useEffect } from 'react';
import { Button, Input, Message, useToaster, Pagination, Placeholder, Loader } from 'rsuite';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { Config, Urlimage } from '../config/connect';
import moment from 'moment';
import Alert from '../utils/config';
import Swal from 'sweetalert2';
import PreviewImg from '../utils/preview-img';

export default function NewEvent() {
    const api = Config.urlApi;
    const img = Urlimage.url;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setValues({
            event_id: '',
            titleName: '',
            newText: ''
        })
        setOpen(true);
        setFileList([]);
    };
    const handleClose = () => {
        setOpen(false);
        setFileList([]);
    }
    const [values, setValues] = useState({
        event_id: '',
        titleName: '',
        newText: ''
    })

    const [fileList, setFileList] = useState([]);
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => {
            return {
                file,
                url: URL.createObjectURL(file)
            };
        });
        setFileList(prevList => [...prevList, ...newFiles]);
    };
    const handleRemove = (index) => {
        const updatedList = [...fileList];
        updatedList.splice(index, 1);
        setFileList(updatedList);
    };

    const handleChange = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputData = new FormData();
        for (const key in values) {
            inputData.append(key, values[key]);
        }
        fileList.forEach(fileItem => {
            inputData.append('fileList', fileItem.file);
        });
        try {
            const response = await axios.post(api + 'news/create', inputData);
            if (response.status === 200) {
                fetchNews();
                handleClose();
                showMessage('ຢືນຢັນ', response.data.message, 'success');
                setFileList([]);
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
        }
    };

    const [itemNews, setItemNews] = useState([]);
    const [isloading, setIsLoading] = useState(true)
    const fetchNews = async () => {
        try {
            const response = await fetch(api + 'news/');
            const jsonData = await response.json();
            setItemNews(jsonData);
            setTotal(jsonData.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setIsLoading(false)
        }
    }


    const handleEdit = (item) => {
        setOpen(true);
        setValues({
            event_id: item.event_id,
            titleName: item.titleName,
            newText: item.newText,
        });
        const newFiles = item.img_list.map(imgs => ({
            file: null,
            url: `${img}potstnew/${imgs.img_list}`
        }));

        setFileList(prevList => [...prevList, ...newFiles]);
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
                axios.delete(api + `news/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchNews();
                        Alert.successData(response.data.message)
                    }
                }).catch((error) => {
                    Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ', error)
                });
            }
        });
    }
    //========================
    const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [idlist,setIdlist]=useState('');
    const handleClick = (imgList,id) => {
        setImages(imgList);
        setIdlist(id)
        setIsOpen(true);
      };

    //=======================
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

        fetchNews(activePage);
    }, [activePage])
    const currentItems = itemNews.slice((activePage - 1) * limit, activePage * limit);
    return (
        <div id="content" class="app-content px-3">
            <ol class="breadcrumb float-end">
                <Button onClick={handleOpen} appearance="primary">post</Button>
            </ol>
            <h1 class="page-header mb-3">ລາຍການ ຂໍ້ມຂ່າວສານ</h1>

            {isloading === true ? (
                <>
                    <Loader backdrop content="ກຳລັງໂຫລດຂໍ້ມູນ..." vertical />
                    <div className='p-4 card border-0 mt-2'>
                        <Placeholder.Paragraph rows={4} size='lg' graph="image" active />
                    </div>
                    <div className='p-4 card border-0 mt-2'>
                        <Placeholder.Paragraph rows={4} size='lg' graph="image" active />
                    </div>
                    <div className='p-4 card border-0 mt-2'>
                        <Placeholder.Paragraph rows={4} size='lg' graph="image" active />
                    </div>
                </>
            ) : (
                currentItems.length > 0 ? (
                    <>
                        {currentItems.map((item, key) => (
                            <div className="card border-0 mb-2">
                                <div class="card-header bg-none p-3 h6 m-0 d-flex align-items-center">
                                    <h5><i class="fa-regular fa-calendar-days"></i> : {moment(item.newDate).format('DD/MM/YYYY hh:mm')}  </h5>
                                    <a href="#" class="ms-auto text-decoration-none text-gray-500 top-0" data-bs-toggle="dropdown">
                                        <i class="fa-solid fa-gear fa-lg"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a href="javascript:;" onClick={() => handleEdit(item)} class="dropdown-item text-blue" ><i class="fa fa-fw fa-edit fa-lg me-1"></i> ແກ້ໄຂ</a>
                                        <a href="javascript:;" onClick={() => handleDelete(item.event_id)} class="dropdown-item text-red"><i class="fa fa-fw fa-trash-alt fa-lg me-1"></i> ລົບອອກ </a>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div class="d-sm-flex row">
                                        <div class={item.img_list.length > 0 ? 'col-sm-4' : 'col-sm-12'}>
                                            <div class="row gx-1" role='button'>
                                                {item.img_list.slice(0, 4).map((list, key) => (
                                                    <div className={key > 0 ? 'col-4' : 'col-12'}>
                                                        <div className="ratio  widget-card  ratio-4x3">
                                                            <a href="javascript:;"  onClick={() => handleClick(item.img_list,list.detail_id)} className="bg-size-cover bg-position-center widget-card-cover " style={{ backgroundImage: `url(${img}potstnew/${list.img_list})` }} >
                                                                {key == 3 && item.img_list.length > 4 && (
                                                                    <span class="widget-card-cover-new"><i class="fa-solid fa-plus"></i></span>
                                                                )}
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div class={item.img_list.length > 0 ? 'col-sm-8 ps-sm-3 pt-3 pt-sm-0' : 'col-sm-12'}>
                                            <h5>{item.titleName}</h5>
                                            <div dangerouslySetInnerHTML={{ __html: item.newText }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    <PreviewImg 
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    images={images}
                    id={idlist}
                    />
                        <div className='float-end mt-2'>
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
                                }} />
                        </div>
                    </>

                ) : (
                    <div className="col-12 text-center">
                        <img src="/assets/img/icon/file-not.png" className="w-50" alt="No items found" />
                    </div>
                )
            )}


            <Modal show={open} size={'lg'} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>ເພີ່ມຂໍ້ມູນຂ່າວສານ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body className='p-0'>
                        <div className="form-group p-3">
                            <label htmlFor="" className='form-label'>ຫົວຂໍ້ຂ່າວສານ</label>
                            <Input size='lg' value={values.titleName} onChange={(e) => handleChange('titleName', e)} placeholder='ຫົວຂໍ້ຂ່າວສານ ....' />
                        </div>
                        <CKEditor
                            editor={ClassicEditor}
                            data={values.newText}
                            config={{
                                placeholder: 'ໃສ່ເນື້ອຫາຂອງທ່ານທີ່ນີ້...',
                                toolbar: [
                                    'heading', '|',
                                    'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                    'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
                                    'undo', 'redo'
                                ]
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                handleChange('newText', data);
                            }}
                        />
                        <div className='form-group p-3'>
                            <div className="row">
                                {fileList.map((fileItem, index) => (
                                    <div className="col-sm-3 col-lg-2 col-6 mb-2 px-1" key={index}>
                                        <div class="card border-0 bg-dark rounded-4">
                                            <div class="h-120px w-100 rounded-4 card-img" style={{
                                                backgroundImage: `url(${fileItem.url})`,
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat"
                                            }} />
                                            <div class="card-img-overlay pt-0 ">
                                                <span class="float-end text-red" onClick={handleRemove} role='button'><i class="fa-solid fa-circle-xmark fs-3"></i> </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <label role='button' className='col-sm-3 col-lg-2 col-6 border-dotted mb-2   rounded-4 '>
                                    <input type="file" className='hide' onChange={handleFileChange} multiple accept="image/*" />
                                    <img src="./assets/img/icon/upload-add.jpg" className='w-100 rounded-4' alt="" />
                                </label>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">ບັນທຶກ </Button>
                        <Button onClick={handleClose} appearance="subtle"> ຍົກເລີກ </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
