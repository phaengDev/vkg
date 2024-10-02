import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { SelectPicker, Placeholder, Input } from 'rsuite';
import { useOption, useTitle, useZone,useWeight } from '../../utils/selectOption';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connect';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import numeral from 'numeral';
function StockSales() {
    const api = Config.urlApi;
    const paste = Urlimage.url;
    const navigate = useNavigate()
    const itemTitle = useTitle();
    const itemOption = useOption();
    const itemZone = useZone();
    const addResive = () => {
        navigate('/received')
    }


    // const [idpos, setIdpos] = useState(null);
    // const itemWeight = useWeight(idpos);

    const [datasearch, setDataSarch] = useState({
        type_id_fk: '',
        zone_id_fk: '',
        tiles_id_fk: '',
        option_id_fk: '',
        qty_baht:''
    });

    const handleChange = (name, value) => {
        setDataSarch({
            ...datasearch, [name]: value
        })
        // if (name === 'tiles_id_fk') {
        //     setIdpos(value);
        // }
    };



    const heandleSearch = () => {
        fetchStockPorduct();
    }

    const [isLoading, setIsLoading] = useState(true);
    const [filterName, setFilterName] = useState([])
    const [itemProduct, setItemProduct] = useState([]);
    const totalQtyBaht = itemProduct.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
    const fetchStockPorduct = async () => {
        try {
            const response = await axios.post(api + 'posd/stock', datasearch);
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
        const searchTerm = event.toLowerCase();
        setItemProduct(filterName.filter(n => 
            n.tile_name.toLowerCase().includes(searchTerm) || 
            n.code_gold.toLowerCase().includes(searchTerm) 
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
    for (let i = 1; i <= Math.ceil(itemProduct.length / itemsPerPage); i++) {
        pages.push(i);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemProduct.slice(indexOfFirstItem, indexOfLastItem);

    const [i, setI] = useState(1);
    const qtyItem = itemProduct.length;
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

    const exportToExcel = () => {
        const table = document.getElementById('table-to-xls');
        const worksheet = XLSX.utils.table_to_sheet(table);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ະຕ໋ອກສິນຄ້າ");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "ລາຍງານສະຕ໋ອກສິນຄ້າ.xlsx");
      };


    useEffect(() => {
        fetchStockPorduct();
    }, [])
    return (
        <>
            <div id="content" class="app-content px-3">
                <ol class="breadcrumb float-xl-end">
                    <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li class="breadcrumb-item"><Link to={'/stock-all'}>ເບິ່ງແບບລວມ</Link></li>
                    <li class="breadcrumb-item d-sm-block d-none active">ລາຍການສິນຄ້າ</li>
                    <li class="breadcrumb-item"><span className='text-green fs-16px' onClick={exportToExcel} role='button'> <i class="fa-solid fa-download"/> Export</span></li>
                </ol>
                <h1 class="page-header mb-3">ສາງສິນຄ້າ</h1>
                <div className="panel">
                    <div class="panel-body">
                        <div className="row mb-3">
                            <div className="col-sm-3 col-6 form-group mb-2">
                                <label htmlFor="" className='form-label'>ຕູ້ຂາຍ</label>
                                <SelectPicker data={itemZone} onChange={(e) => handleChange('zone_id_fk', e)} block placeholder="ເລືອກ" />
                            </div>
                            <div className="col-sm-3 col-6 form-group mb-2">
                                <label htmlFor="" className='form-label'>ລາຍການ</label>
                                <SelectPicker data={itemTitle} onChange={(e) => handleChange('tiles_id_fk', e)} block placeholder="ເລືອກ" />
                            </div>
                            <div className="col-sm-2 col-6 form-group mb-2">
                                <label htmlFor="" className='form-label'>ຈຳນວນນ້ຳໜັກ</label>
                                <Input type='number' onChange={(e) => handleChange('qty_baht', e)} block placeholder="ນ້ຳໜັກ" />
                            </div>
                            <div className="col-sm-2 col-6 form-group mb-2">
                                <label htmlFor="" className='form-label'>ຫົວໜ່ວຍນ້ຳໜັກ</label>
                                <SelectPicker data={itemOption} onChange={(e) => handleChange('option_id_fk', e)} block placeholder="ເລືອກ" />
                            </div>
                            <div className="col-sm-2 mt-4 mb-2">
                                <button onClick={heandleSearch} className='btn btn-danger fs-13px me-2'><i className="fas fa-search"></i> ຄົ້ນຫາ</button>
                                <button type='button' onClick={addResive} className='btn btn-dark fs-13px'><i className="fas fa-plus"></i> ນຳເຂົ້າ</button>
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
                                    <input type="search" onChange={(event) => Filter(event.target.value)} className='form-control' placeholder='ຄົ້ນຫານ້ຳໜັກ' />
                                </div>
                            </div>
                        <div className="table-responsive">
                            <table id='table-to-xls' className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                <thead className='thead-plc'>
                                    <tr>
                                        <th width="1%" className='text-center'>ລ/ດ</th>
                                        <th width="5%" className='text-conter with-img dt-type-numeric'>ຮູບ</th>
                                        <th className='text-center'>ລະຫັດ</th>
                                        <th className=''>ຊື່ສິນຄ້າ</th>
                                        <th className='text-center'>ນ້ຳໜັກ</th>
                                        <th className='text-center'>ບັນຈຸ</th>
                                        <th className='text-end'>ລາຄາຊື້</th>
                                        <th className='text-end'>ລາຄາຂາຍ</th>
                                        <th className=''>ຫົວໜ່ວຍ</th>
                                        <th width='10%'>ໂຊນຂາຍ</th>
                                        <th className=''>ປະເພດ</th>
                                        <th className='text-center' width='7%'>ແຈ້ງເຕືອນ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        isLoading === true ? <Placeholder.Grid rows={7} columns={6} active /> :
                                            currentItems.length > 0 ? (
                                                <>
                                               { currentItems.map((item, key) => (
                                                    <tr key={key}>
                                                        <td className='text-center' width='1%'>{key + 1}</td>
                                                        <td className='text-center with-img dt-type-numeric' width='5%'>
                                                            <img src={item.file_image !== '' ? paste + 'pos/' + item.file_image : 'assets/img/icon/picture.jpg'} className='rounded h-30px my-n1 mx-n1' alt="" />
                                                        </td>
                                                        <td className='text-center'>{item.code_gold}</td>
                                                        <td>{item.tile_name}</td>
                                                        <td className='text-center'>{item.qty_baht} {item.option_name}</td>
                                                        <td className='text-center'>{item.grams} g</td>
                                                        <td className='text-end'>{numeral(item.price_buy * item.grams).format('0,00')} ກີບ</td>
                                                        <td className='text-end'>{numeral(item.price_sale * item.grams).format('0,00')} ກີບ</td>
                                                        <td className='text-center'>{item.quantity} {item.unite_name}</td>
                                                        <td>{item.zone_name}</td>
                                                        <td>{item.typeName}</td>
                                                        <td className='text-center'>
                                                            {item.quantity <= 5 && item.quantity > 0 ? (
                                                                <span className='badge bg-orange'>
                                                                    <i className="fa-solid fa-circle-exclamation text-white"></i> ໃກ້ໝົດ
                                                                </span>
                                                            ) : item.quantity <= 0 ? (
                                                                <span className='badge bg-danger '>
                                                                    <i className="fa-solid fa-circle-xmark text-white"></i> ໝົດແລ້ວ
                                                                </span>
                                                            ) : ''}
                                                        </td>

                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td className='text-end' colSpan={8}>ລວມຈຳນວນທັງໝົດ</td>
                                                    <td className='text-center'><span className='fs-16px text-red'>{totalQtyBaht} </span> (ຈ/ນ)</td>
                                                    <td colSpan={3}></td>
                                                </tr>
                                                </>
                                            ) : (
                                                <tr>
                                                    <td colSpan="12" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StockSales