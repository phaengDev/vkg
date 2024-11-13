import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Modal } from 'react-bootstrap';
import { Button, Input } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../config/connect';
function ReviewsProduct() {
    const api = Config.urlApi;
    const img = Urlimage.url;
    const videoUrl = `https://www.youtube.com/embed/6nuGcivLGlc`;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [values, setValues] = useState({
        event_id: '',
        titleName: '',
        newText: '',
        url_link: '',
        type_video: '1',
        videoFile: ''
    })

    // const [embedUrl, setEmbedUrl] = useState("");
    const handleChange = (name, value) => {
        setValues({
            ...values, [name]: value
        })
        let updatedValues = { ...values, [name]: value }
        if (name === 'url_link' && values.type_video === '3') {
            // const videoId = value.split("youtu.be/")[1];
            // // const embedLink = `https://www.youtube.com/embed/${videoId}`;
            // // setEmbedUrl(embedLink);
            const videoId = value.includes("youtu.be/") ? value.split("youtu.be/")[1] : value;
            updatedValues = { ...updatedValues, url_link: videoId, videoFile: '' };
           
        }else if(name === 'url_link' && values.type_video === '2'){
            updatedValues = { ...updatedValues, url_link: value, videoFile: '' };
        }else{
            updatedValues = { ...updatedValues, url_link: ''};
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputData = new FormData();
        for (const key in values) {
            inputData.append(key, values[key]);
        }
        console.log(values);return;
        // fileList.forEach(fileItem => {
        //     inputData.append('fileList', fileItem.file);
        // });
        try {
            const response = await axios.post(api + 'news/create', inputData);
            if (response.status === 200) {
                // fetchNews();
                // handleClose();
                // showMessage('ຢືນຢັນ', response.data.message, 'success');
                // setFileList([]);
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            // showMessage('ແຈ້ງເຕືອນ', 'ອັບໂຫລດພາບບໍ່ສຳເລັດ', 'error');
        }
    };



    const [videoFile, setVideoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setValues({
                ...values, videoFile: file
            })
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }

    };
    const handleMoveVideo = () => {
        setVideoFile(null)
        setPreviewUrl('');
    }

    useEffect(() => {

    }, [])
    return (

        <div id="content" className="app-content px-3">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                <li className="breadcrumb-item active">ລີວິວສິຄ້າ</li>
                <li className="breadcrumb-item "><a href="javascript:;" className='text-green' onClick={handleOpen}> <i className="fas fa-plus fs-4"></i>ເພີ່ມຂໍ້ມູນ</a></li>
            </ol>
            <h1 className="page-header  mb-3">ລາຍການ ລີວິວສິຄ້າ</h1>

            <div class="row">

                <div class="col-xl-3 col-sm-4 px-2">
                    <div class="card">
                        <div className="video-container" style={{ position: 'relative', paddingBottom: '100%', height: 0 }}>
                            <iframe
                                src={videoUrl}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube Video"
                            />
                        </div>
                        <div class="card-body">
                            <h4 class="card-title">Card title</h4>
                            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            <p class="card-text text-gray">Last updated 3 mins ago</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-xl-3 col-sm-4 px-2">
                    <div class="card">
                        <video width="100%" controls>
                            <source src="./assets/img/pos/461125336_1037480234369568_2468457238090032849_n.mp4"
                                title="YouTube Video" />
                            Your browser does not support the video tag.
                        </video>
                        <div class="card-body">
                            <h4 class="card-title">Card title</h4>
                            <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                            <p class="card-text text-gray">Last updated 3 mins ago</p>
                        </div>
                    </div>
                </div>
                
            </div>


            <Modal show={open} size={'lg'} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>ເພີ່ມຂໍ້ມູນຂ່າວສານ</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body className='p-0 row'>
                        <div className="form-group col-sm-12 px-4 mb-2">
                            <label htmlFor="" className='form-label'>ຫົວຂໍ້ຂ່າວສານ</label>
                            <Input size='lg' value={values.titleName} onChange={(e) => handleChange('titleName', e)} placeholder='ຫົວຂໍ້ຂ່າວສານ ....' />
                        </div>
                        <div className="form-group col-sm-6 px-4 ">
                            <label htmlFor="" className='form-label'>ປະເພດ</label>
                            <select className='form-select form-select-lg ' value={values.type_video} onChange={(e) => handleChange('type_video', e.target.value)} >
                                <option value="1">ເລືອກວິດີໂອ ໃນເຄື່ອງ </option>
                                <option value="2">ເລືອກວິດີໂອ Facebook</option>
                                <option value="3">ເລືອກວິດີໂອ YouTube</option>
                            </select>
                        </div>
                        <div className="form-group col-sm-6 px-4 ">
                            <label htmlFor="" className='form-label'>ເລືອກວິດີໂອ</label>
                            {values.type_video === '1' ? (
                                <p>
                                    <label role='button' className='btn btn-primary fs-14px'>
                                        <i class="fa-solid fa-photo-film"></i>  ເລືອກວິດີໂອ ....
                                        <input type="file" accept="video/*" onChange={handleVideoChange} className='hide' />
                                    </label>
                                </p>
                            ) : (
                                <>
                                    <Input onChange={(e) => handleChange('url_link', e)} value={values.url_link} placeholder='https://www.......' />
                                </>
                            )}
                        </div>
                        <div className="col-sm-12 text-center px-4 mt-3">
                            {values.type_video === '1' ? (
                                previewUrl && (
                                    <div style={{ position: 'relative', height: '300' }}>
                                        <video width="100%" height="300" controls>
                                            <source src={previewUrl} type={videoFile.type} />
                                        </video>
                                        <div style={{ position: 'absolute', top: '8px', right: '16px' }}>
                                            <span role='button' className='badge bg-danger' onClick={handleMoveVideo} style={{ cursor: 'pointer' }}><i class="fa-solid fa-circle-xmark" /></span>
                                        </div>
                                    </div>
                                )
                            ) : (
                                values.url_link !== '' && (
                                    values.type_video === '2' ? (
                                        <>
                                            <iframe
                                                src={`https://www.facebook.com/plugins/video.php?href=${values.url_link}`}
                                                width="100%"
                                                height="300"
                                                allowFullScreen={true}
                                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                            ></iframe>
                                        </>
                                    ) : (
                                        <>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${values.url_link}`}
                                                width="100%"
                                                height="300"
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe></>
                                    )
                                )
                            )}
                        </div>
                        <div className="col-sm-12 px-4 mt-3 ">
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
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary">ບັນທຶກ </Button>
                        <Button onClick={handleClose} appearance="subtle"> ຍົກເລີກ </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div >
    )
}

export default ReviewsProduct