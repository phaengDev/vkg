
import React,{useEffect,useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {SelectPicker,Placeholder } from 'rsuite';
import {useTitle, useOption,useType } from '../../utils/selectOption';
import { Config,Urlimage} from '../../config/connect';
import axios from 'axios';
export default function ViewPorductZone() {
    const api = Config.urlApi;
    const url = Urlimage.url;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const zoneId = searchParams.get('id');
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    const itemType = useType();
    const itemTile = useTitle();
    const itemOption = useOption();

    const [formsearch, setFormsearch] = useState({
        type_id_fk:'',
        zone_id_fk: zoneId,
        option_id_fk: '',
        tiles_id_fk: ''
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
    const fetchPorduct = async () => {
        setIsLoading(true);
        console.log(formsearch)
        try {
            const response = await axios.post(api + 'posd/stock', formsearch);
            const jsonData = response.data;
            setItemProduct(jsonData);
            setFilterName(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const [filter, setFilter] = useState('');
    const Filter = (event) => {
        setFilter(event)
        setItemProduct(filterName.filter(n => n.tile_name.toLowerCase().includes(event)))
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
    useEffect(() => {
        fetchPorduct();
    }, [])

    return (
        <>
            <div id="content" class="app-content">
                <ol class="breadcrumb float-xl-end">
                    <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li class="breadcrumb-item "><Link to={'/zone'}>ລາຍການໂຊນ</Link></li>
                    <li class="breadcrumb-item active">ລາຍການສິນຄ້າ</li>
                </ol>
                <h1 class="page-header mb-3"> <span className='me-3 text-danger' onClick={handleGoBack}><i class="fa-solid fa-circle-arrow-left"></i></span> ລາຍການສິນຄ້າ</h1>

                <div className="panel panel-inverse pb-3">
                            <div class="panel-heading">
                                <h4 class="panel-title fs-16px">ລາຍການສິນຄ້າ</h4>
                                <div class="panel-heading-btn">
                                    {/* {formAdd === true ?
                                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" onClick={() => headleAddNew(false)}> <i class="fa fa-expand"></i></a>
                                        : ''
                                    } */}
                                </div>
                            </div>
                            <div class="panel-body ">
                           
                                <div className="row mb-4">
                                    <div className="col-sm-3 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຮູບປະພັນ</label>
                                        <SelectPicker data={itemType} onChange={(e) => changeSeaerch('type_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>

                                    <div className="col-sm-3 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຊື່ສິນຄ້າສິນຄ້າ</label>
                                        <SelectPicker data={itemTile} onChange={(e) => changeSeaerch('tiles_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-3 col-8 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                        <SelectPicker data={itemOption} onChange={(e) => changeSeaerch('option_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-3 col-4 mt-4">
                                        <button type="button" onClick={headleSearch} className="btn btn-danger px-3 "><i class="fas fa-search fs-16px"></i> </button>
                                       
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
                                                <th className=''>ຊື່ສິນຄ້າ</th>
                                                <th className='text-center'>ລະຫັດສິນຄ້າ</th>
                                                <th className=''>ນ້ຳໜັກ</th>
                                                <th className='text-center'>ຈຳນວນ</th>
                                                <th className=''>ຫົວໜ່ວຍ</th>
                                                <th className=''>ປະເພດ</th>
                                                <th className='text-center' width='10%'>ໂຊນຂາຍ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                isLoading === true ? <Placeholder.Grid rows={9} columns={6} active /> :
                                                currentItems.length > 0 ? (
                                                    currentItems.map((item, key) => (
                                                        <tr key={key}>
                                                            <td className='text-center' width='1%'>{key + 1}</td>
                                                            <td className='text-center with-img dt-type-numeric' width='5%'>
                                                                <img src={item.file_image !==''? url+'pos/'+item.file_image:'assets/img/icon/picture.jpg'} className='rounded h-30px my-n1 mx-n1' alt="" />
                                                                </td>
                                                            <td>{item.tile_name}</td>
                                                            <td className='text-center'>{item.code_id}</td>
                                                            <td>{item.qty_baht} {item.option_name}</td>
                                                            <td className='text-center'>{item.quantity}</td>
                                                            <td>{item.unite_name}</td>
                                                            <td>{item.typeName}</td>
                                                            <td>{item.zone_name}</td>
                                                            
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                                                    </tr>
                                                )
                                            }
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
                                :""}
                                </div>
                              
                            </div>
                        </div>

            </div>
        </>
    )
}
