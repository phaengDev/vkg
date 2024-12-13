import React, { useState, useEffect, useRef } from 'react'
import { Input, InputGroup, DatePicker, Button, Placeholder, InputPicker } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connect';
import numeral from 'numeral';
import moment from 'moment/moment';
import ViewBillOnline from './View-bill-online';
import { Notification } from '../../utils/Notifig';
import Swal from "sweetalert2"; 
function CheckBillOnline() {
    const api = Config.urlApi;
    const urlimage = Urlimage.url;
    const [data, setData] = useState({
        startDate: new Date(),
        endDate: new Date(),
        status_pays: 1
    });

    const status = [{ label: 'ຄ້າງຮັບ', value: 1 },
    { label: 'ກວດສອບແລ້ວ', value: 2 },
    { label: 'ຢືນຢັນອອກຄຳແລ້ວ', value: 3 }]

    const changeReport = (name, value) => {
        setData({
            ...data, [name]: value
        })
    }

    const [itemPaybill, setItemPaybill] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterName, setFilterName] = useState([])
    const fetchPaybill = async () => {
        try {
            const response = await axios.post(api + 'paysale/report', data);
            const jsonData = response.data;
            setItemPaybill(jsonData);
            setFilterName(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFilter = (value) => {
        setItemPaybill(filterName.filter(n => n.pay_sale_code.toLowerCase().includes(value)))
    }

    const handleDownload = async (fileName) => {
        try {
            const response = await fetch(fileName); // Replace with your server URL
            if (!response.ok) {
                throw new Error('File download failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('ຂໍອະໄພບໍ່ມີໄຟລ໌ໃນໂຟນເດີ ກະລຸນາອັບເດດໄຟລ໌ເຂົ້າໃໝ່!', error);
        }
    }

    const [viewData, setViewData] = useState({});
    const [show, setShow] = useState(false);
    const handleView = (data) => {
        setShow(true);
        setViewData(data);
    }

    const [idbill, setIdbill] = useState('')
    const headleSearchBill = (value) => {
        setIdbill(value);
    }
    const heandleCheck = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(api + 'paysale/invoice/' + idbill);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setShow(true);
            setViewData(jsonData);
            setIdbill('');
        } catch (error) {
            Notification.warning('ບໍ່ພົບຂໍ້ມູນທີ່ທ່ານກຳລັງຊອງຫາ ກະລຸນາກວດຄືນໃຫມ່', 'ຂໍອະໄພ');
            console.error('Error fetching data:', error);
        }
    }



    const handleDelete = (id) => {
        Swal.fire({
            title: "ຢືນຢັນ?",
            text: "ທ່ານແນ່ໃຈແລ້ວບໍາທີ່ຈະລົບຂໍ້ມູນການສັ່ງຊື້ນີ້",
            icon: "warning",
            width: 400,
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ຕົກລົງ",
            denyButtonText: `ຍົກເລີກ`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + `paysale/delete/${id}`)
                .then(function (response) {
                        if (response.status === 200) {
                            fetchPaybill();
                            Swal.fire({
                                icon: 'success',
                                title: 'ສຳເລັດ!',
                                width: 400,
                                text: 'ການລົບຂໍ້ມູນເລັດແລ້ວ',
                                confirmButtonColor: "#3085d6",
                            });
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'ຜິດພາດ!',
                            width: 400,
                            text: 'ມີຂໍ້ຜິດພາດໃນການຢືນຢັນ',
                            confirmButtonColor: "#d33",
                        });
                        console.error('Error:', error);
                    });
            }
        });
    };
    
    



    const inputRef = useRef(null);
    useEffect(() => {
        fetchPaybill();

        const handleKeyPress = (e) => {
            if (e.target.tagName !== "INPUT") {
                const input = inputRef.current;
                input.focus();
                input.value = e.key;
                e.preventDefault();
            }
        };
        document.addEventListener("keypress", handleKeyPress);
        return () => {
            document.removeEventListener("keypress", handleKeyPress);
        };
    }, [])


    return (
        <>
            <div id="content" class="app-content px-2">
                <div className="row mb-3">
                    <div className="col-sm-8">
                        <span className='me-3 fs-20px'>ລາຍການ ການສັ່ງຊື້ສິນຄ້າທາງອອນໄລນ໌</span>
                    </div>
                    <div className="col-sm-4">
                        <form onSubmit={heandleCheck}>
                            <InputGroup inside size='lg'>
                                <Input size='lg' className='text-center' onChange={(e) => headleSearchBill(e)} autoFocus placeholder='|||||||||||||||||||||||||' required />
                                <InputGroup.Button type='submit'>
                                    <i className='fas fa-search' />
                                </InputGroup.Button>
                            </InputGroup>
                        </form>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-body">
                        <div className="row fs-15px mb-2">
                            <div className="col-sm-5">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label htmlFor="" className='form-label'>ວັນທິນຳເຂົ້າ</label>
                                        <DatePicker oneTap format="dd/MM/yyyy" value={data.startDate} onChange={(e) => changeReport('startDate', e)} block />
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="" className='form-label'>ຫາວັນທິ</label>
                                        <DatePicker oneTap format="dd/MM/yyyy" value={data.endDate} onChange={(e) => changeReport('endDate', e)} block />
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-2 col-4 mb-2">
                                <label htmlFor="" className='form-label'>ສະຖານະຮັບ</label>
                                <InputPicker data={status} value={data.status_pays} onChange={(e) => changeReport('status_pays', e)} block />
                            </div>

                            <div className="col-sm-4 col-8 mb-2">
                                <label htmlFor="" className='form-label'>ຄົນຂໍ້ມູນ</label>
                                <InputGroup inside>
                                    <InputGroup.Addon><i className='fas fa-search' /></InputGroup.Addon>
                                    <Input onChange={(e) => handleFilter(e)} placeholder='ຄົ້ນຫາ...' />
                                </InputGroup>
                            </div>
                            <div className="col-sm-1 col-4">
                                <Button type='button' className='mt-4' appearance="primary" onClick={fetchPaybill}><i className='fas fa-search' /> ຄົ້ນຫາ </Button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table id='table-to-xls' className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                <thead className='thead-plc'>
                                    <tr className=''>
                                        <th width="1%" className='text-center'>ລ/ດ</th>
                                        <th width="10%" className='text-center'>ວັນທິສັ່ງຊື້</th>
                                        <th width="10%" className='text-center'>ເລີກທີການສັ່ງຊື້</th>
                                        <th className=''>ຊື່ສິນຄ້າ</th>
                                        <th className=''>ເບີໂທລະສັບ</th>
                                        <th className='text-center'>ຈຳນວນ</th>
                                        <th className='text-center'>ກຣາມ</th>
                                        <th className='text-end' width="15%">ລວມເງິນ</th>
                                        <th>ເລກທີໂອຍ</th>
                                        <th>ລາຍລະອຽດ</th>
                                        <th className='text-center' width={'5%'}>ສະຖານະ</th>
                                        <th className='text-center'>ພະນັງານ</th>
                                        <th className='text-center w-10' width={'5%'}>ເອກະສານຊຳລະ</th>
                                        <th className='text-center' width={'5%'}>ເບີ່ງລະອຽດ</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading === true ? (
                                        <tr>
                                            <td colSpan={14} className='bg-white'> <Placeholder.Grid rows={5} columns={8} active /></td>
                                        </tr>
                                    ) : (
                                        itemPaybill.length > 0 ? (
                                            itemPaybill.map((item, key) => (
                                                <tr key={key}>
                                                    <td className='text-center'>{key + 1}</td>
                                                    <td className='text-center'>{moment(item.paysale_date).format('DD/MM/YYYY hh:mm')}</td>
                                                    <td className='text-center'>{item.pay_sale_code}</td>
                                                    <td>{item.cus_fname} {item.cus_lname} </td>
                                                    <td>{item.cus_tel}</td>
                                                    <td className='text-center'>{item.qty_baht}</td>
                                                    <td className='text-center'>{item.price_gram}</td>
                                                    <td className='text-end'>{numeral(item.balance_gold).format('0,00')}</td>
                                                    <td className=''>{item.transfer_number}</td>
                                                    <td className=''>{item.pays_remark}</td>
                                                    <td className={`text-center ${item.status_pays === 1 ? 'text-red' : item.status_pays === 2 ? 'text-orange' : 'text-green'}`} >
                                                        {item.status_sale_use === 1 ? (
                                                            <>
                                                                {item.status_pays === 1 ? "ຄ້າງກວດສອບ" : item.status_pays === 2 ? "ກວດສອບແລ້ວ" : "ມອບຮັບສິນຄ້າສຳເລັດ"}
                                                            </>
                                                        ) : (<>
                                                            <span className='text-red'>ຂໍ້ມູນນີ້ໄດ້ມີການປະຕິເສດ</span>
                                                        </>)}
                                                    </td>
                                                    <td>{item.status_pays === 3 ? item.user_approved_name : item.check_user_name}</td>
                                                    <td className='text-center'>
                                                        <span className='text-red' onClick={() => handleDownload(`${urlimage}document/paysale/${item.file_transfer}`)} role='button'><i class="fa-solid fa-download" /> ໄຟລ໌... </span>
                                                    </td >
                                                    <td className='text-center'>
                                                        <button type='button' className='btn btn-xs btn-blue' onClick={() => handleView(item)}><i class="fa-solid fa-eye"></i> </button>
                                                        {item.status_pays === 1 && (
                                                            <button type='button'  className='btn btn-xs btn-danger ms-2' onClick={() => handleDelete(item.pay_sale_uuid)} > <i class="fa-solid fa-trash"></i> </button>
                                                        )}
                                                        
                                                         </td>
                                                </tr>
                                            ))
                                        ) : (<>
                                            <tr>
                                                <td colSpan={14} className='text-center text-red'> ບໍ່ພົບຂໍ້ມູນການນຳເຂົ້າສິນຄ້າ</td>
                                            </tr>
                                        </>)

                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ViewBillOnline
                    show={show}
                    handleClose={() => setShow(false)}
                    data={viewData}
                    fetchData={fetchPaybill}
                />
            </div>
        </>
    )
}

export default CheckBillOnline