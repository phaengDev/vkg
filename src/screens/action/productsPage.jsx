import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Input, Placeholder, Modal, Button } from 'rsuite';
import Select from 'react-select'
import { SelectPicker } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connect';
import Alert from '../../utils/config';
import Swal from "sweetalert2";
import { useOption, useType, useTitle } from '../../utils/selectOption';

function ProductsPage() {
    const api = Config.urlApi;
    const url = Urlimage.url;

    const itemType = useType();
    const itemTile = useTitle();
    const itemOption = useOption();

    const [inputs, setInputs] = useState({
        product_uuid: '',
        quantity_all: 0,
        option_id_fk: '',
        qty_baht: '',
        tiles_id_fk: '',
        file_image: null,
        porduct_detail: ''
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_uuid', inputs.product_uuid);
        formData.append('quantity_all', inputs.quantity_all);
        formData.append('option_id_fk', inputs.option_id_fk);
        formData.append('qty_baht', inputs.qty_baht);
        formData.append('tiles_id_fk', inputs.tiles_id_fk);
        formData.append('file_image', inputs.file_image);
        // const imputData=new FormData();
        // for(const key in inputs){
        //     imputData.append(key,inputs[key])
        // }
        // console.log(inputs)
        try {
            axios.post(api + 'posd/create', formData)
                .then(function (res) {
                    if (res.status === 200) {
                        fetchPorduct();
                        Alert.successData(res.data.message);
                        setInputs({
                            product_uuid: '',
                            option_id_fk: '',
                            qty_baht: '',
                            tiles_id_fk: '',
                            file_image: null
                        });
                        setFormAdd(false)
                    } else if (res.status === 400) {
                        Alert.warningData(res.data.message)
                    } else {
                        Alert.errorData(res.data.message)
                    }
                })
        } catch (error) {
            Alert.errorData('ການດຳເນິນງານ ເກິດການຜິດຜາດ')
        }
    };

    const [formAdd, setFormAdd] = useState(false);
    const headleAddNew = (data) => {
        setFormAdd(data)
        if (data === true) {
            setInputs({
                product_uuid: '',
                option_id_fk: '',
                qty_baht: '',
                tiles_id_fk: '',
                file_image: null,
                porduct_detail: ''
            });
            setImageUrl('assets/img/icon/camera.png');
        }
        setFormEdit(false)
    }
    const [formEdit, setFormEdit] = useState(false);
    const [imageUrl, setImageUrl] = useState('assets/img/icon/camera.png');
    const handleEdit = (item) => {
        setInputs({
            product_uuid: item.product_uuid,
            option_id_fk: item.option_id_fk,
            qty_baht: item.qty_baht,
            tiles_id_fk: item.tiles_id_fk,
            file_image: null,
            porduct_detail: item.porduct_detail
        })
        if (item.file_image) {
            setImageUrl(url + 'pos/' + item.file_image);
        } else {
            setImageUrl('assets/img/icon/camera.png')
        }
        setFormEdit(true)
        setFormAdd(true)
    }



    //=====================================
    const [formsearch, setFormsearch] = useState({
        type_id_fk: '',
        option_id_fk: '',
        tiles_id_fk: ''
    });
    const changeSeaerch = (name, value) => {
        setFormsearch({
            ...formsearch, [name]: value
        });
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
                axios.delete(api + `posd/${id}`).then(function (response) {
                    if (response.status === 200) {
                        fetchPorduct();
                        Alert.successData(response.data.message)
                    } else {
                        Alert.errorData(response.data.message)
                    }
                }).catch((error) => {
                    Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ ຂໍ້ມູນອາດມິການໃຊ້ງານຢູ່', error)
                });
            }
        });
    }

    const headleSearch = () => {
        fetchPorduct();
    }

    const [isLoading, setIsLoading] = useState(true);
    const [filterName, setFilterName] = useState([])
    const [itemPorduct, setItemProduct] = useState([]);
    const totalQtyBaht = itemPorduct.reduce((sum, item) => sum + parseFloat(item.qty_all), 0);
    const fetchPorduct = async () => {
        setIsLoading(true);
        // console.log(formsearch)
        try {
            const response = await axios.post(api + 'posd/', formsearch);
            const jsonData = response.data;
            setItemProduct(jsonData);
            setFilterName(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // const [filter, setFilter] = useState('');
    const Filter = (event) => {
        const searchTerm = event.toLowerCase(); // Convert the input to lowercase for case-insensitive comparison
        setItemProduct(filterName.filter(n =>
            n.tile_name.toLowerCase().includes(searchTerm) || // Check if tile_name includes the search term
            n.code_gold.toLowerCase().includes(searchTerm)    // Check if code_gold includes the search term
        ));
    }

    //===========================\\
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const handleClick = (event) => {
        setcurrentPage(Number(event.target.id));
        setI(indexOfLastItem + 1)
    };
    
    const pages = [];
    for (let i = 1; i <= Math.ceil(itemPorduct.length / itemsPerPage); i++) {
        pages.push(i);
    }
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemPorduct.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemPorduct.length;
    const renderPageNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <li key={number} className={`page-item ${currentPage === number ? "active" : ''}`} >
                    <span role="button" id={number} onClick={handleClick} className="page-link border-blue">{number}</span>
                </li>
            );
        } else {
            <li key={number} className="page-item active" >
                <span role="button" className="page-link border-blue">1</span>
            </li>
        }
    });

    const handleNextbtn = () => {
        setcurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        setI(indexOfLastItem - 1)

        if ((currentPage - 1) % pageNumberLimit === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };
    //===========================\\

    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            file_image: file
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
        setImageUrl('assets/img/icon/camera.png')
        document.getElementById('fileInput').value = '';
    };
    //================================


    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        setNewFile(null)
    }
    const [img, setImg] = useState({
        productName: '',
        image: '',
    })
    const [fileEdit, setFileEdit] = useState({
        productId: '',
        fileNew: ''
    })

    const [fileImg, setFileImg] = useState('');
    const viewImage = (id, image, name) => {
        setImg({
            productName: name,
            file_image: image,
        })
        setOpen(true);
        setFileEdit({
            ...fileEdit,
            productId: id
        });
        setFileImg(image !== '' ? url + 'pos/' + image : 'assets/img/icon/picture.jpg')

    }

    const [newFile, setNewFile] = useState(null);
    const handleFileEdit = (e) => {
        const file = e.target.files[0];
        setFileEdit({
            ...fileEdit,
            file_image: e.target.files[0]
        });
        if (file) {
            setNewFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpdate = () => {
        const formData = new FormData();
        const id = fileEdit.productId;
        formData.append('file', fileEdit.file_image);
        axios.post(api + 'posd/editimg/' + id, formData)
            .then(function (res) {
                if (res.status === 200) {
                    setOpen(false);
                    fetchPorduct();
                }
            });
    }

    useEffect(() => {
        fetchPorduct();
    }, [])

    return (
        <>
            <div id="content" className="app-content bg-default px-3">
                <ol className="breadcrumb float-end">
                    <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li className="breadcrumb-item active">ລາຍການສິນຄ້າ</li>
                </ol>
                <h1 className="page-header  mb-3">ລາຍການສິນຄ້າທັງໝົດ</h1>
                <div className="row">
                    <div className={formAdd === false ? 'col-sm-12' : 'col-sm-8'}>
                        <div className="panel panel-inverse pb-3">
                            <div className="panel-body ">
                                <div className="row mb-4">
                                    <div className="col-sm-3 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຮູບປະພັນ</label>
                                        <SelectPicker data={itemType} onChange={(e) => changeSeaerch('type_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>

                                    <div className="col-sm-3 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ລາຍການ</label>
                                        <SelectPicker data={itemTile} onChange={(e) => changeSeaerch('tiles_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-3 col-8 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ປະເພດຫົວໜ່ວຍ</label>
                                        <SelectPicker data={itemOption} onChange={(e) => changeSeaerch('option_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-3 col-4 mt-4">
                                        <button type="button" onClick={headleSearch} className="btn btn-danger px-3 "><i className="fas fa-search fs-16px"></i> </button>
                                        {formAdd === false && formEdit === false ?
                                            <button type="button" onClick={() => headleAddNew(true)} className="btn btn-black px-3 ms-2"><i className="fa-regular fa-plus fs-16px"></i> </button>
                                            : ''}
                                    </div>
                                </div>
                                <div className="d-lg-flex align-items-center mb-2">
                                    <div className="d-lg-flex d-none align-items-center text-nowrap">
                                        ສະແດງ:
                                        <select onChange={(e) => handleShowLimit(e.target.value)} className="form-select border-blue form-select-sm ms-2  ps-2 pe-30px" >
                                            <option value={100} selected>100</option>
                                            <option value={250}>250</option>
                                            <option value={500}>500</option>
                                            <option value={1000}>1,000</option>
                                            <option value={2500}>2,500</option>
                                            <option value={5000}>5,000</option>
                                            <option value={qtyItem}>ທັງໝົດ</option>
                                        </select>
                                    </div>
                                    <div className="d-lg-block d-none ms-2 text-body text-opacity-50">
                                        ລາຍການ
                                    </div>
                                    <div className="pagination pagination-sm mb-0 ms-auto justify-content-center">
                                        <input type="text" onChange={(event) => Filter(event.target.value)} className='form-control' />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                        <thead className='thead-plc'>
                                            <tr>
                                                <th width="1%" className='text-center'>ລ/ດ</th>
                                                <th width="5%" className='text-center'>ຮູບ</th>
                                                <th className='text-center'>ລະຫັດສິນຄ້າ</th>
                                                <th className=''>ຊື່ສິນຄ້າ</th>
                                                {/* <th className='text-center'>ລະຫັດບາໂຄດ</th> */}
                                                <th className=''>ນ້ຳໜັກ</th>
                                                <th className='text-center'>ຈຳນວນລວມ</th>
                                                <th className=''>ຫົວໜ່ວຍ</th>
                                                <th className=''>ປະເພດ</th>
                                                <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                isLoading === true ? <tr><td colSpan={10}><Placeholder.Grid rows={10} columns={6} active /></td></tr> :
                                                    currentItems.length > 0 ? (
                                                        <>
                                                            {currentItems.map((item, key) => {
                                                                const namePs = item.tile_name + ' ( ' + item.qty_baht + '' + item.option_name + ' ) ';
                                                                return (
                                                                    <tr key={key}>
                                                                        <td className='text-center' width='1%'>{key + 1}</td>
                                                                        <td className='text-center with-img dt-type-numeric' width='5%'>
                                                                            <img src={item.file_image !== '' ? url + 'pos/' + item.file_image : 'assets/img/icon/picture.jpg'} className='rounded h-30px my-n1 mx-n1' role='button' onClick={() => viewImage(item.product_uuid, item.file_image, namePs)} alt="" />
                                                                        </td>
                                                                        <td className='text-center'>{item.code_gold}</td>
                                                                        <td>{item.tile_name}</td>
                                                                        <td>{item.qty_baht} {item.option_name}</td>
                                                                        <td className='text-center'>{item.qty_all}</td>
                                                                        <td>{item.unite_name}</td>
                                                                        <td>{item.typeName}</td>
                                                                        <td className='text-center' width='10%'>
                                                                            <button type='button' onClick={() => handleEdit(item)} className="btn btn-blue btn-xs me-2">
                                                                                <i className="fa-solid fa-pen-to-square"></i>
                                                                            </button>
                                                                            <button type='button' onClick={() => headleDelete(item.product_uuid)} className="btn btn-red btn-xs">
                                                                                <i className="fa-solid fa-trash"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                            <tr>
                                                                <td className='text-end' colSpan={5}>ລວມຈຳນວນທັງໝົດ</td>
                                                                <td className='text-center'><span className='fs-16px text-red'>{totalQtyBaht} </span> (ຈ/ນ)</td>
                                                                <td colSpan={3}></td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                                                        </tr>
                                                    )
                                            }
                                        </tbody>
                                    </table>
                                    {isLoading === false ?
                                        <div className="d-md-flex align-items-center">
                                            <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
                                                ສະແດງ 1 ຫາ {itemsPerPage} ຂອງ {qtyItem} ລາຍການ
                                            </div>
                                            <ul className="pagination  mb-0 ms-auto justify-content-center">
                                                <li className="page-item "><span role="button" onClick={handlePrevbtn} className={`page-link  ${currentPage === pages[0] ? 'disabled' : 'border-blue'}`} >ກອນໜ້າ</span></li>
                                                {minPageNumberLimit >= 1 ? (
                                                    <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                                                ) : ''}
                                                {renderPageNumbers}
                                                {pages.length > maxPageNumberLimit ? (
                                                    <li className="page-item"><span role="button" className="page-link disabled">...</span></li>
                                                ) : ''}
                                                <li className="page-item"><span role="button" onClick={handleNextbtn} className={`page-link  ${currentPage === pages[pages.length - 1] ? 'disabled' : 'border-blue'}`}>ໜ້າຕໍ່ໄປ</span></li>
                                            </ul>
                                        </div>
                                        : ""}
                                </div>

                            </div>
                        </div>
                    </div>
                    {formAdd === true && (
                        <div className="col-sm-4 ">

                            <div class="navbar navbar-sticky  d-xl-block my-n4 py-4 h-100 ">

                                <div class={`panel panel-inverse border-4 border-bottom nav  rounded-4 ${formEdit === false ? 'border-green' : 'border-red'}`}>
                                    <div class={`panel-heading  text-white ${formEdit === false ? 'bg-green-700' : 'bg-red-700'}`}>
                                        <h4 className="panel-title fs-16px">{formEdit === true ? 'ຟອມແກ້ໄຂຂໍ້ມູນສິນຄ້າ' : 'ຟອມບັນທຶກຂໍ້ມູນສິນຄ້າ'}</h4>
                                        <div className="panel-heading-btn">
                                            <span className="btn btn-xs btn-icon btn-danger" onClick={() => headleAddNew(false)} data-toggle="panel-remove"><i className="fa fa-times fa-lg"></i></span>
                                        </div>
                                    </div>
                                    <div className="panel-body row">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group text-center mb-3 pos-img ">
                                                {selectedFile && (
                                                    <span className="badge text-danger topright " onClick={handleClearImage}><i className="fa-solid fa-circle-xmark fa-xl"></i> </span>
                                                )}
                                                <label className="w-50" role='button'>
                                                    <input type="file" id="fileInput" name='file_image' onChange={handleFileChange} accept="image/*" className='hide' />
                                                    <img className="w-120px rounded" src={imageUrl} alt="" />
                                                </label>
                                            </div>
                                            <div className="form-group mb-2 col-12">
                                                <label htmlFor="" className='form-label'>ເລືອກລາຍການສິນຄ້າ</label>
                                                <Select options={itemTile} value={itemTile.find(obj => obj.value === inputs.tiles_id_fk)} onChange={(e) => handleChange('tiles_id_fk', e.value)} placeholder="ເລືອກສິນຄ້າ" required />
                                            </div>

                                            <div className="form-group mb-2 col-12">
                                                <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                                <Input type="number" name='qty_baht' value={inputs.qty_baht} onChange={(e) => handleChange('qty_baht', e)} placeholder='ນ້ຳໜັກ' required />
                                            </div>

                                            <div className="form-group mb-2 col-12">
                                                <label htmlFor="" className='form-label'>ຂະໜາດ </label>
                                                <Select options={itemOption} value={itemOption.find(obj => obj.value === inputs.option_id_fk)} onChange={(e) => handleChange('option_id_fk', e.value)} block placeholder="ເລືອກ" required />
                                                {/* <SelectPicker name='option_id_fk' value={inputs.option_id_fk} onChange={(e) => handleChange('option_id_fk', e)} data={itemOption} block placeholder="ເລືອກ" required /> */}
                                            </div>
                                            <div className="form-group mb-2 col-12">
                                                <label htmlFor="" className='form-label'>ລາຍລະອຽດ </label>
                                                <Input as='textarea' onChange={(e) => handleChange('porduct_detail', e)} placeholder='ລາຍລະອຽດ.....' />
                                            </div>
                                            <div className="pagination row mt-2 p-4">
                                                <div className="col-sm-6">
                                                    <button type='reset' className="btn btn-danger block w-100 rounded-pill px-3"><i className="fa-solid fa-rotate"></i> ລ້າງ</button>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button type='submit' className="btn btn-primary w-100 rounded-pill px-3">{formEdit === false ? (<><i className="fa-regular fa-floppy-disk"></i> ບັນທຶກ</>) : (<><i className="fa-solid fa-pen"></i> ແກ້ໄຂ້</>)}</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}

                </div>
                <Modal size={'xs'} keyboard={false} open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title>{img.productName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-center ps--active-y' data-height="200px">
                        <img src={fileImg} className='w-100' />
                    </Modal.Body>
                    <Modal.Footer>
                        <label className='btn btn-orange me-2 fs-13px'>
                            <i class="fa-solid fa-cloud-arrow-up me11"></i> ຮູບໃໝ່
                            <input type="file" onChange={(e) => handleFileEdit(e)} className='hide' accept='image/*' />
                        </label>
                        {newFile !== null ? (
                            <Button type="button" onClick={handleUpdate} appearance="primary"> ແກ້ໄຂຮູບໃໝ່ </Button>
                        ) : ('')}
                        <Button onClick={handleClose} color='red' appearance="primary"> ອອກ </Button>
                    </Modal.Footer>
                </Modal>
            </div>


        </>
    )
}

export default ProductsPage