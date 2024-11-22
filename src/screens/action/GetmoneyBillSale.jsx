import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, DatePicker, Input, SelectPicker, Loader, Grid, Row, Col, Placeholder } from 'rsuite';
import { Config } from '../../config/connect';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { useStaff } from '../../utils/selectOption';
import { Notification } from '../../utils/Notifig';
import FormRegisterCustom from '../customer/FormRegisterCustom';
import BillInvoiceSale from '../customer/Bill-Invoice-Sale';
function GetmoneyBillSale() {
    const api = Config.urlApi;
    const itemStaff = useStaff();
    const datastt = [
        { data: 1, sttName: 'ຄ້າງຮັບເງິນ' },
        { data: 2, sttName: 'ຮັບເງິນແລ້ວ' },
        { data: null, sttName: 'ທັງໝົດ' }
    ].map(
        item => ({ label: item.sttName, value: item.data })
    );

    const [open, setOpen] = React.useState(false);
    const [bill, setBill] = React.useState('');
    const handleAddCustomer = (data) => {
        setOpen(true);
        setBill(data);
    }


    const [values, setValues] = React.useState({
        startDate: new Date(),
        endDate: new Date(),
        staffId: '',
        status_gets: 1,
    })

    const handleChange = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }


    const [balance, setBalance] = useState({
        balanceSale: 0,
        balance_arrears: 0,
        balance_get_paid: 0
    });

    const [isLoading, setIsLoading] = useState(true);
    const [filterName, setFilterName] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const fetchDataReport = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(api + 'sale-r/getmoney', values);
            const jsonData = response.data;
            setItemData(jsonData);
            setFilterName(jsonData);
            const res = await axios.post(api + 'payment/balance', values);
            const item = res.data
            setBalance({
                balanceSale: item.data.balanceSale,
                balance_arrears: item.data.balance_arrears,
                balance_get_paid: item.data.balance_get_paid
            })

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }
    // console.log(balance.balanceSale)
    const Filter = (event) => {
        setItemData(filterName.filter(n => n.sale_billNo.toLowerCase().includes(event)))
    }

    // Calculate total pages
    const totalPages = Math.ceil(itemData.length / itemsPerPage);
    // Calculate items for current page
    const currentItems = itemData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Pagination function
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // Calculate the display range for "Showing X to Y of Z entries"
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, itemData.length);

    // =====================================

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.some((item) => item.saleId === itemId)
                ? prevSelected.filter((item) => item.saleId !== itemId) // Uncheck item
                : [...prevSelected, { saleId: itemId }] // Check item with saleId field
        );
    };
    const [loadingup, setLoadingup] = useState(false)
    const handleUpdate = () => {
        setLoadingup(true)
        try {
            axios.post(api + 'payment/update', selectedItems).then(function (res) {
                if (res.status === 200) {
                    Notification.success('ຢືນຢັນ', res.data.message)
                    fetchDataReport();
                } else {
                    Notification.error('ແຈ້ງເຕືອນ', res.data.message)
                }
            });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
        finally {
            setLoadingup(false); // Reset loading state whether successful or not
        }
    }


    const [show, setShow] = useState(false);
const handleViewBill = (data) => {
    setShow(true);
    setBill(data)
}

    useEffect(() => {
        fetchDataReport();
    }, [values]);
    return (
        <div id="content" className="app-content p-0 bg-component">

            <ol className="breadcrumb float-end px-3 pt-2">
                <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                <li className="breadcrumb-item active">ຕາຕະລາຍງານຂາຍປະຈຳວັນ</li>
            </ol>
            <h1 className="page-header mb-3 px-3 pt-2">ລາຍການຂາຍປະຈຳວັນ</h1>

            <div className="panel">
                <div className="panel-body">
                    <div className="row mb-3">
                        <div className="col-sm-4 mb-2">
                            <div class="widget py-2 widget-stats bg-dark border-gold border-top border-4 rounded-top-4 rounded-bottom-4">
                                <div class="stats-icon"><i class="fa-solid fa-kip-sign text-white" /></div>
                                <div class="stats-info">
                                    <h4 class="fs-4">ຍອດຂາຍທັງໝົດ</h4>
                                    <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                                                <stop stop-color="rgb(255, 213, 127)" offset="0" />
                                                <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                                                <stop stop-color="rgb(179, 149, 0)" offset="1" />
                                            </linearGradient>
                                        </defs>
                                        <text font-family="arial" font-size="40" id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                                            <tspan x="0" y="37">{numeral(balance.balanceSale).format('0,00')} ₭</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-2">
                            <div class="widget py-2 widget-stats bg-dark border-gold border-top border-4 rounded-top-4 rounded-bottom-4">
                                <div class="stats-icon"><i class="fa-solid fa-triangle-exclamation text-gold" /></div>
                                <div class="stats-info">
                                    <h4 class="fs-4">ຍອດຂາຍຄ້າງຮັບ</h4>
                                    <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                                                <stop stop-color="rgb(255, 213, 127)" offset="0" />
                                                <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                                                <stop stop-color="rgb(179, 149, 0)" offset="1" />
                                            </linearGradient>
                                        </defs>
                                        <text font-family="arial" font-size="40" id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                                            <tspan x="0" y="37">{numeral(balance.balance_arrears).format('0,00')} ₭</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 mb-2">
                            <div class="widget py-2 widget-stats bg-dark border-gold border-top border-4 rounded-top-4 rounded-bottom-4">
                                <div class="stats-icon"><i class="fa-solid fa-circle-check text-green" /></div>
                                <div class="stats-info">
                                    <h4 class="fs-4">ຍອດຂາຍຮັບແລ້ວ</h4>
                                    <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                                                <stop stop-color="rgb(255, 213, 127)" offset="0" />
                                                <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                                                <stop stop-color="rgb(179, 149, 0)" offset="1" />
                                            </linearGradient>
                                        </defs>
                                        <text font-family="arial" font-size="40" id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                                            <tspan x="0" y="37">{numeral(balance.balance_get_paid).format('0,00')} ₭</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Grid fluid>
                        <Row gutter={16} className='mb-3'>
                            {/* <div className="row mb-3"> */}
                            <Col xs={12} sm={8} md={8} lg={5} className="mb-2">
                                <label htmlFor="" className='form-label'>ວັນທີຂາຍ</label>
                                <DatePicker oneTap format='dd/MM/yyyy' value={values.startDate} onChange={e => handleChange('startDate', e)} block />
                            </Col>
                            <Col xs={12} sm={8} md={8} lg={5} className="mb-2">
                                <label htmlFor="" className='form-label'>ວັນທີຂາຍ</label>
                                <DatePicker oneTap format='dd/MM/yyyy' value={values.endDate} onChange={e => handleChange('endDate', e)} block />
                            </Col>
                            <Col xs={12} sm={8} md={8} lg={6} className="mb-2">
                                <label htmlFor="" className='form-label'>ພະນັກງານ</label>
                                <SelectPicker value={values.staffId} onChange={e => handleChange('staffId', e)} data={itemStaff} block />
                            </Col>
                            <Col xs={12} sm={7} md={6} lg={4} className="mb-2">
                                <label htmlFor="" className='form-label'>ສະຖານະ</label>
                                <SelectPicker value={values.status_gets} onChange={e => handleChange('status_gets', e)} data={datastt} block />
                            </Col>
                            <Col xs={12} sm={3} md={3} className="mb-2 ">
                                {selectedItems.length > 0 &&
                                    <Button color='blue' onClick={handleUpdate} appearance="primary" disabled={loadingup === true ? true : false} className='mt-4'>{loadingup === true ? <Loader content="ກຳລັງດຳເນີນ..." /> : (<span><i className="fa-solid fa-check" />  ຢືນຢົນ</span>)} </Button>}
                            </Col>
                            {/* </div> */}
                        </Row>
                    </Grid>
                    <div class="d-lg-flex align-items-center mb-2">
                        <div class="d-lg-flex d-none align-items-center text-nowrap mb-n4">
                            <span className='me-2'>ສະແດງ</span>
                            <select class="form-select form-select-sm me-2">
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={150}>150</option>
                                <option value={300}>300</option>
                                <option value={5000}>5000</option>
                                <option value={itemData.length}>All</option>
                            </select>
                        </div>
                        <div class="d-lg-block d-none ms-2 text-body text-opacity-50 mb-n4">
                            ລາຍການ
                        </div>

                        <div class="pagination pagination-sm mb-0 ms-auto ">
                            <label htmlFor="" className='form-label'>ຄົ້ນຫາ..</label>
                            <Input onChange={(e) => Filter(e)} placeholder='ຄົ້ນຫາເລກທີບິນ' />
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-striped table-bordered text-nowrap">
                            <thead className='thead-plc'>
                                <tr>
                                    <th className='text-center'>#</th>
                                    <th className='text-center w-5'>ລ/ດ</th>
                                    <th className='text-center w-5'>ອອກບິນລູກຄ້າ</th>
                                    <th className='text-center'>ວັນທີ</th>
                                    <th className='text-center'>ເລກທີບິນ</th>
                                    <th className='text-end'>ຍອດຂາຍ</th>
                                    <th className='text-end'>ຍອດຮັບເງິນສົດ</th>
                                    <th className='text-end'>ຍອດຮັບເງິນໂອນ</th>
                                    <th className='text-end'>ຍອດເງິນທອນ</th>
                                    <th>ພະນັກງານ</th>
                                    <th className='text-center'>ສະຖານະ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading === true ? (
                                    <tr>
                                        <td colSpan={11} className='text-center'> <Placeholder.Grid rows={5} columns={6} active /></td>
                                    </tr>
                                ) : (
                                    <>
                                        {itemData.length > 0 ?
                                            currentItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td className='text-center'>
                                                        {item.status_gets === 1 ? (
                                                            <input class="form-check-input is-invalid" type="checkbox" checked={selectedItems.some((selected) => selected.saleId === item.sale_uuid)}
                                                                onChange={() => handleCheckboxChange(item.sale_uuid)} />
                                                        ) : (
                                                            <i className="fa-solid fa-circle-check fs-3 text-green" />
                                                        )}
                                                    </td>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td className='text-center'>
                                                        {item.customer_id_fk === null ?
                                                            <span class="badge bg-primary" onClick={() => handleAddCustomer(item)} role='button'><i className="fa-solid fa-plus"></i> ຂຽນບິນລູກຄ້າ</span>
                                                            : (
                                                                <span class="badge bg-success" onClick={() => handleViewBill(item)} role='button'><i class="fa-solid fa-eye"></i> ເບິ່ງ</span>
                                                            )
                                                        }
                                                    </td>
                                                    <td className='text-center'>{moment(item.sale_date).format('DD/MM/YYYY')}</td>
                                                    <td className='text-center'>{item.sale_billNo}</td>
                                                    <td className='text-end'>{numeral(item.balance_total).format('0,00')}</td>
                                                    <td className='text-end'>{numeral(item.balance_cash).format('0,00')}</td>
                                                    <td className='text-end'>{numeral(item.balance_transfer).format('0,00')}</td>
                                                    <td className='text-end'>{numeral(item.balance_return).format('0,00')}</td>
                                                    <td>{item.first_name + ' ' + item.last_name}</td>
                                                    <td className='text-center'>
                                                        {item.status_gets === 1 ? (
                                                            <span><i className="fa-solid fa-circle-exclamation text-warning" /> ຄ້າງຮັບເງິນ</span>
                                                        ) : (
                                                            <span>{moment(item.gets_date).format('DD/MM/YYYY h:mm')}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={11} className='text-center text-danger'>ບໍ່ມີຂໍ້ມູນ</td>
                                                </tr>
                                            )
                                        }
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-md-flex align-items-center">
                        <div className="me-md-auto text-md-left text-center mb-2 mb-md-0">
                            ສະແດງ {startEntry} - {endEntry} ຈາກທັງໝົດ {itemData.length} ລາຍການ
                        </div>
                        <ul className="pagination mb-0 justify-content-center">
                            <li
                                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                <a href="javascript:void(0)" className="page-link">ທີ່ຜ່ານມາ</a>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <li
                                    key={page}
                                    className={`page-item ${currentPage === page ? "active" : ""}`}
                                    onClick={() => goToPage(page)}
                                >
                                    <a href="javascript:void(0)" className="page-link">{page}</a>
                                </li>
                            ))}
                            <li
                                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                <a href="javascript:void(0)" className="page-link">ຖັດໄປ</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <FormRegisterCustom open={open} handleClose={() => setOpen(false)}
                data={bill}
                fetchData={fetchDataReport}
            />

            <BillInvoiceSale show={show} handleClose={() => setShow(false)} data={bill} />
        </div>
    )
}

export default GetmoneyBillSale