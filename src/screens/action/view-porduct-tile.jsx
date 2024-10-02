import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, SelectPicker, Placeholder } from 'rsuite';
import Select from 'react-select'
import { useOption, useType } from '../../utils/selectOption';
import { Config, Urlimage } from '../../config/connect';
import axios from 'axios';
import Alert from '../../utils/config';
export default function ViewPorductTile() {
    const api = Config.urlApi;
    const url = Urlimage.url;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const tileId = searchParams.get('id');
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    const itemType = useType();
    const itemOption = useOption();
    const [data, setData] = useState({});
    const fetchTypetle = async () => {
        try {
            const response = await fetch(api + 'tileps/single/' + tileId);
            const jsonData = await response.json();
            setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // ==============================
    const [inputs, setInputs] = useState({
        product_uuid: '',
        quantity_all: 0,
        option_id_fk: '',
        qty_baht: '',
        tiles_id_fk: tileId,
        file_image: null,
        porduct_detail: ''
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });

    }


    const handleEdit = (data) => {
        setFormAdd(true);
        setInputs({
            product_uuid: data.product_uuid,
            quantity_all: 0,
            option_id_fk: data.option_id_fk,
            qty_baht: data.qty_baht,
            tiles_id_fk: tileId,
            file_image: null,
            porduct_detail: data.porduct_detail
        });
        if (data.file_image !== '') {
            setImageUrl(url + 'pos/' + data.file_image);
            setSelectedFile(true)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const imputData = new FormData();
        for (const key in inputs) {
            imputData.append(key, inputs[key])
        }
        try {
            axios.post(api + 'posd/create', imputData)
                .then(function (res) {
                    if (res.status === 200) {
                        fetchPorduct();
                        Alert.successData(res.data.message);
                        setInputs({
                            product_uuid: '',
                            option_id_fk: '',
                            qty_baht: '',
                            tiles_id_fk: tileId,
                            file_image: null,
                            porduct_detail: ''
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
    }
    // ================ delete ============ 
    const headleDelete = (id) => {

    }



    // ==============================
    const [formsearch, setFormsearch] = useState({
        type_id_fk: '',
        option_id_fk: '',
        tiles_id_fk: tileId
    });
    const changeSeaerch = (name, value) => {
        setFormsearch({
            ...formsearch, [name]: value
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

    const Filter = (event) => {
        setItemProduct(filterName.filter(n => n.tile_name.toLowerCase().includes(event)))
    }


    const FilterKg = (value) => {
        const numericValue = parseInt(value, 10);  // Convert the input value to an integer
        setItemProduct(filterName.filter(n => parseInt(n.qty_baht, 10) === numericValue));  // Convert qty_baht to an integer and compare
    }

    const [formAdd, setFormAdd] = useState(false);
    const handleAddNew = (index) => {
        setFormAdd(index);
        if (index === false) {
            setInputs({
                product_uuid: '',
                quantity_all: 0,
                option_id_fk: '',
                qty_baht: '',
                tiles_id_fk: tileId,
                file_image: null,
                porduct_detail: ''
            });
            setSelectedFile(null);
            setImageUrl('assets/img/icon/camera.png')
        }

    }

    //===========================\\
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(100);
    const handleShowLimit = (value) => {
        setitemsPerPage(value);
    };
    // const [pageNumberLimit, setpageNumberLimit] = useState(5);
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
            setmaxPageNumberLimit(maxPageNumberLimit + 5);
            setminPageNumberLimit(minPageNumberLimit + 5);
        }
    };

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        setI(indexOfLastItem - 1)

        if ((currentPage - 1) % 5 === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - 5);
            setminPageNumberLimit(minPageNumberLimit - 5);
        }
    };



    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('assets/img/icon/camera.png');
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
    //===========================\\
    useEffect(() => {
        fetchPorduct();
        fetchTypetle()
    }, [])

    return (
        <>
            <div id="content" class="app-content">
                <ol class="breadcrumb float-xl-end">
                    <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li class="breadcrumb-item "><Link to={'/type'}>ລາຍການປະເພດ</Link></li>
                    <li class="breadcrumb-item active">ລາຍການສິນຄ້າ</li>
                </ol>
                <h1 class="page-header mb-3"> <span className='me-3 text-danger' onClick={handleGoBack}><i class="fa-solid fa-circle-arrow-left"></i></span> ລາຍການສິນຄ້າ / {data.tile_name}</h1>
                <div className="row">
                    <div className={formAdd === true ? 'col-sm-8' : 'col-sm-12'}>
                        <div className="panel panel-inverse pb-3">
                            <div class="panel-body ">
                                <div className="row mb-4">
                                    <div className="col-sm-3 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຮູບປະພັນ</label>
                                        <SelectPicker data={itemType} onChange={(e) => changeSeaerch('type_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>

                                  
                                    <div className="col-sm-3 col-8 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຫົວໜ່ວຍນ້ຳໜັກ</label>
                                        <SelectPicker data={itemOption} onChange={(e) => changeSeaerch('option_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-3 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                        <Input type='number' onChange={(e) => FilterKg(e)} block placeholder="ນ້ຳໜັກ" />
                                    </div>
                                    <div className="col-sm-3 col-4 mt-4">
                                        <button type="button" onClick={headleSearch} className="btn btn-danger px-3 "><i class="fas fa-search fs-16px"></i> </button>
                                        {formAdd === false ? (
                                            <button type="button" onClick={() => handleAddNew(true)} className="btn btn-dark px-3 ms-2 "><i class="fas fa-plus fs-16px"></i> </button>
                                        ) : ''}
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
                                    <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                        <thead className='thead-plc'>
                                            <tr>
                                                <th width="1%" className='text-center'>ລ/ດ</th>
                                                <th width="5%" className='text-center'>ຮູບ</th>
                                                <th className='text-center'>ລະຫັດສິນຄ້າ</th>
                                                <th className=''>ຊື່ສິນຄ້າ</th>
                                                <th className=''>ນ້ຳໜັກ</th>
                                                <th className='text-center'>ຈຳນວນ</th>
                                                <th className=''>ຫົວໜ່ວຍ</th>
                                                <th className=''>ປະເພດ</th>
                                                <th className='text-center'>ຕັ້ງຄ່າ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                isLoading === true ? <Placeholder.Grid rows={9} columns={6} active /> :
                                                    currentItems.length > 0 ? (
                                                        <>
                                                            {currentItems.map((item, key) => (
                                                                <tr key={key}>
                                                                    <td className='text-center' width='1%'>{key + 1}</td>
                                                                    <td className='text-center with-img dt-type-numeric' width='5%'>
                                                                        <img src={item.file_image !== '' ? url + 'pos/' + item.file_image : 'assets/img/icon/picture.jpg'} className='rounded h-30px my-n1 mx-n1' alt="" />
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
                                                            ))}

                                                            <tr>
                                                                <td className='text-end' colSpan={5}>ລວມຈຳນວນທັງໝົດ ({data.tile_name})</td>
                                                                <td className='text-center'><span className='fs-16px text-red'>{totalQtyBaht} </span> (ຈ/ນ)</td>
                                                                <td colSpan={3}></td>
                                                            </tr>
                                                        </>

                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                                                        </tr>
                                                    )}
                                        </tbody>
                                    </table>
                                    {isLoading === false ?
                                        <div class="d-md-flex align-items-center">
                                            <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
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
                    {formAdd && (
                        <div className="col-sm-4">
                            <form onSubmit={handleSubmit}>
                                <div className="widget-todolist rounded mb-4">
                                    <div class="widget-todolist-header">
                                        <div class="widget-todolist-header-title">ຟອມເພີ່ມຂໍ້ມູນສິນຄ້າ</div>
                                        <div class="widget-todolist-header-total fs-14px"><span className='badge bg-danger rounded-pill' role='button' onClick={() => handleAddNew(false)}><i class="fa-solid fa-xmark" /></span></div>
                                    </div>
                                    <div class="widget-todolist-body p-3">
                                        <div className="form-group text-center mb-2">
                                            <center>
                                                <div class="h-100px w-100px position-relative">
                                                    <label role='button'>
                                                        <input type="file" id="fileInput" name='pattern_img' onChange={handleFileChange} accept="image/*" className='hide' />
                                                        <img src={imageUrl} class="w-100px h-100px rounded-3" />
                                                    </label>
                                                    {selectedFile && (
                                                        <span role='button' onClick={handleClearImage} class="w-20px h-20px p-0 d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-0 top-0 rounded-pill mt-n2 me-n4">x</span>
                                                    )}
                                                </div>
                                            </center>
                                        </div>
                                        <div className="form-group mb-2 col-12">
                                            <label htmlFor="" className='form-label'>ຊື່ປະເພດ</label>
                                            <Input name='qty_baht' value={data.tile_name} readOnly />
                                        </div>
                                        <div className="form-group mb-2 col-12">
                                            <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                            <Input type="number" name='qty_baht' value={inputs.qty_baht} onChange={(e) => handleChange('qty_baht', e)} placeholder='ນ້ຳໜັກ' required />
                                        </div>

                                        <div className="form-group mb-2 col-12">
                                            <label htmlFor="" className='form-label'>ຂະໜາດ </label>
                                            <Select options={itemOption} value={itemOption.find(obj => obj.value === inputs.option_id_fk)} onChange={(e) => handleChange('option_id_fk', e.value)} block placeholder="ເລືອກ" required />
                                        </div>
                                        <div className="form-group mb-2 col-12">
                                            <label htmlFor="" className='form-label'>ລາຍລະອຽດ </label>
                                            <Input as='textarea' onChange={(e) => handleChange('porduct_detail', e)} placeholder='ລາຍລະອຽດ.....' />
                                        </div>
                                    </div>
                                    <div className="pagination row p-2 pt-0">
                                        <div className="col-sm-6">
                                            <button type='reset' className="btn btn-danger block w-100 rounded-pill px-3"><i className="fa-solid fa-rotate"></i> ລ້າງ</button>
                                        </div>
                                        <div className="col-sm-6">
                                            <button type='submit' className="btn btn-primary w-100 rounded-pill px-3"><i className="fa-regular fa-floppy-disk"></i> ບັນທຶກ</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
