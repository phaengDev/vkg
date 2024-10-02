import React, { useState, useEffect,useRef } from 'react'
import { Input, InputGroup, DatePicker, SelectPicker, Placeholder } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connect';
import numeral from 'numeral';
import moment from 'moment/moment';
import ViewBillOnline from './View-bill-online';
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

    const handleFilter=(value)=>{
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
        setShow(true)
        setViewData(data)
    }

    const [idbill, setIdbill] = useState('')
      const headleSearchBill = (value) => {
        setIdbill(value)
      }
      const heandleCheck = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(api + 'paysale/invoice/' + idbill);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setShow(true)
            setViewData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }



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
    }, [data])
    return (
        <>
            <div id="content" class="app-content px-2">
                <div className="row mb-3">
                    <div className="col-sm-8">
                        <span className='me-3 fs-20px'>ຟອມບັນທຶກສິນຄ້າ</span>
                    </div>
                    <div className="col-sm-4">
                        <form onSubmit={heandleCheck}>
                        <InputGroup inside size='lg'>
                            <Input size='lg' className='text-center' onChange={(e)=>headleSearchBill(e)} autoFocus placeholder='|||||||||||||||||||||||||' required />
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
                            <div className="col-sm-3 col-6 mb-2">
                                <label htmlFor="" className='form-label'>ວັນທິນຳເຂົ້າ</label>
                                <DatePicker oneTap format="dd/MM/yyyy" value={data.startDate} onChange={(e) => changeReport('startDate', e)} block />
                            </div>
                            <div className="col-sm-3  col-6  mb-2">
                                <label htmlFor="" className='form-label'>ຫາວັນທິ</label>
                                <DatePicker oneTap format="dd/MM/yyyy" value={data.endDate} onChange={(e) => changeReport('endDate', e)} block />
                            </div>
                            <div className="col-sm-2 col-4 mb-2">
                                <label htmlFor="" className='form-label'>ສະຖານະຮັບ</label>
                                <SelectPicker data={status} value={data.status_pays} onChange={(e) => changeReport('status_pays', e)} block />
                            </div>

                            <div className="col-sm-4 col-8 mb-2">
                                <label htmlFor="" className='form-label'>ຄົນຂໍ້ມູນ</label>
                                <Input onChange={(e)=>handleFilter(e)} placeholder='ຄົ້ນຫາ...' />
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
                                        <th className='text-end' width="15%">ລວມເງິນ</th>
                                        <th>ເລກທີໂອຍ</th>
                                        <th>ລາຍລະອຽດ</th>
                                        <th className='text-center' width={'5%'}>ສະຖານະ</th>
                                        <th className='text-center w-10' width={'5%'}>ເອກະສານຊຳລະ</th>
                                        <th className='text-center' width={'5%'}>ເບີ່ງລະອຽດ</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading === true ? (
                                        <tr>
                                            <td colSpan={11} className='bg-white'> <Placeholder.Grid rows={5} columns={8} active /></td>
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
                                                    <td className='text-end'>{numeral(item.balance_gold).format('0,00')}</td>
                                                    <td className=''>{item.transfer_number}</td>
                                                    <td className=''>{item.pays_remark}</td>
                                                    <td className={`text-center ${item.status_pays === 1 ? 'text-red' : item.status_pays === 2 ? 'text-orange' : 'text-green'}`} >{item.status_pays === 1 ? "ຍັງບໍ່ໄດ້ຮັບການກວດສອບ" : item.status_pays === 2 ? "ໄດ້ຮັບການກວດສອບແລ້ວ" : "ມອບຮັບສິນຄ້າສຳເລັດ"}</td>
                                                    <td className='text-center'>
                                                        <span className='text-red' onClick={() => handleDownload(`${urlimage}document/paysale/${item.file_transfer}`)} role='button'><i class="fa-solid fa-download" /> ໄຟລ໌... </span>
                                                    </td >
                                                    <td className='text-center'><span className='px-2 rounded text-white bg-blue' onClick={() => handleView(item)} role='button'><i class="fa-solid fa-eye"></i> </span> </td>
                                                </tr>
                                            ))
                                        ) : (<>
                                            <tr>
                                                <td colSpan={11} className='text-center text-red'> ບໍ່ພົບຂໍ້ມູນການນຳເຂົ້າສິນຄ້າ</td>
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
                />
            </div>
        </>
    )
}

export default CheckBillOnline