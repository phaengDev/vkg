import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import numeral from 'numeral';
import moment from 'moment';
import { Button } from 'rsuite';
// import '../../style.invoice.css';
import Barcode from 'react-barcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {Config, Urlimage } from '../../config/connect';
import ModalCancle from './Modal-Cancle';
import Swal from "sweetalert2"; 
import axios from 'axios';
const ViewBillOnline = ({ show, handleClose, data,fetchData }) => {
    const image = Urlimage.url;
    const api=Config.urlApi;
    const userId=localStorage.getItem('user_uuid');
    const downloadIMG = (fileName) => {
        const modalBody = document.querySelector('.invoiceholder'); // select the modal body content
        html2canvas(modalBody).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = fileName + '.png'; // specify image file name
            link.click();
        });
    };

    const downloadPDF = (fileName) => {
        const modalBody = document.querySelector('.invoiceholder');
        html2canvas(modalBody).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(fileName + '.pdf'); // specify PDF file name
        });
    };


    // const handleDownload = (linkImg) => {
    //     // const imageSrc = './assets/img/pos/gold-01.jpg';
    //     const link = document.createElement('a');
    //     link.href = linkImg;
    //     link.download = linkImg;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    const handleDownload = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob(); // Convert the file to a blob
            const url = window.URL.createObjectURL(blob); // Create a blob URL
            const link = document.createElement('a');
            link.href = url;
            link.download = fileUrl.split('/').pop(); // Use the file name from the URL
            document.body.appendChild(link);
            link.click(); // Trigger the download
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // Clean up the blob URL
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

// ================= check confrim=========
const [dataCF, setDataCF] = useState({
    pay_sale_id: '',
    pays_remark: 'ການກວດສອບການສັ່ງຊື້ໄດ້ເຫັນວ່າມີການໂອນຈ່າຍຄົບຕາມການສັ່ງຊື້ແລ້ວ',
    check_user_id: userId,
});

const checkConfrim = (id) => {
    setDataCF((prevData) => ({
        ...prevData,
        pay_sale_id: id,
    }));
    Swal.fire({
        title: "ຢືນຢັນ?",
        text: "ທ່ານໄດ້ກວດສອບການສັ່ງຊື້ແລະການໂອນຊຳລະຖຶກຕ້ອງຄົບຖ້ວນແລ້ວບໍ່!",
        icon: "warning",
        width: 400,
        showDenyButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ຕົກລົງ",
        denyButtonText: `ຍົກເລີກ`,
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post(api + `paysale/check`, dataCF)
                .then((resp) => {
                    if (resp.status === 200) {
                        fetchData();
                        handleClose();
                        Swal.fire({
                            icon: 'success',
                            title: 'ສຳເລັດ!',
                            width: 400,
                            text: 'ການຢືນຢັນໄດ້ສຳເລັດແລ້ວ',
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


    // =====================
    const [openCanle,setOpenCanle]=useState(false);
    const handleCancel = (id) => {
        setOpenCanle(true);
        handleClose();
    };
useEffect(()=>{

},[userId])
    return (
<>
        <Modal show={show} size='lg' onHide={handleClose}>
            <Modal.Header className='py-2' >
                <Modal.Title className='w-100'>
                    ລາຍລະອຽດການສັ່ງຊື້
                    <div className='float-end'>
                        <button onClick={() => downloadIMG(data.pay_sale_code)} className='btn btn-sm btn-primary me-2' ><i class="fa-solid fa-download" /> ຮູບ</button>
                        <button onClick={() => downloadPDF(data.pay_sale_code)} className='btn btn-sm btn-danger' ><i class="fa-solid fa-download" /> PDF</button>
                        <button onClick={handleClose} className='btn btn-sm btn-orange ms-2' ><i class="fa-solid fa-circle-xmark" /></button>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='invoiceholder'>
                <div id="invoiceholder">
                    <div id="invoice" className="row mb-3">
                        <div className="col-2">
                            <img src="./assets/img/logo/logo.png" className='w-80' alt="" />
                        </div>
                        <div className="col-6 fs-15px">
                            <div>ຮ້ານຄຳ ນາງວຽງຄຳ</div>
                            <div>ໂທລະສັບ: 020 95 555 609 </div>
                            <div>ທີ່ຢູ່: ຕະຫລາດເຊົ້າມໍຊັ້ນ2</div>
                            <div>ບ້ານ ຫັດສະດີ ,ເມືອງ ຈັນທະບູລີ,ແຂວງ ນະຄອນຫຼວງວຽງຈັນ</div>
                        </div>
                        <div className="col-4 text-end">
                            <div className="fs-22px">No: {data.pay_sale_code}</div>
                            <div className="fs-18px">Date: {moment(data.paysale_date).format('DD/MM/YYYY')}</div>
                            <div className="fs-15px">Time: {moment(data.paysale_date).format('hh:mm:ss')}</div>
                        </div>
                        <div className="col-12 text-center"><h3>ບິນຮັບເງິນສົດ</h3></div>
                    </div>
                    <table className='table  text-nowrap'>
                        <tbody>
                        <tr>
                            <th width={'5%'} className='text-end border-0'>ຊື່ສິນຄ້າ:</th>
                            <td className='border-bottom'><span className='ms-1'>{data.cus_fname + '' + data.cus_lname}</span></td>
                            <th width={'5%'} className='text-end border-0'>ເບີໂທລະສັບ:</th>
                            <td className='border-bottom'><span className='ms-1'>{data.cus_tel}</span></td>
                            <th width={'5%'} className='text-end border-0'>email:</th>
                            <td className='border-bottom '><span className='ms-1'>{data.email}</span></td>
                        </tr>
                        <tr>
                            <th width={'5%'} className='text-end'>ບັດປະຈຳຕົວ:</th>
                            <td className='border-bottom border-0'><span className='ms-1'>{data.card_number} </span></td>
                            <th width={'5%'} className='text-end border-0'>ທີ່ຢູ່:</th>
                            <td colSpan={3} className='border-bottom'><span className='ms-1'>{data.villageName + ', ' + data.district_name + ', ' + data.province_name}</span> </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className='thead-plc'>
                                <tr className=''>
                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                    <th>ລາຍການສິນຄ້າ</th>
                                    <th className='text-center'>ຈຳນວນ</th>
                                    <th className='text-center'>ນຳໜັກ</th>
                                    <th className='text-end'>ລວມລາຄາ</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr key={1}>
                                    <td className="text-center">{1}</td>
                                    <td>ທອງຄຳແທ່ງ</td>
                                    <td className="text-center">{data.qty_baht} ບາດ</td>
                                    <td className="text-center"> {data.qty_grams} g</td>
                                    <td className="text-end"> {numeral(data.balance_gold).format('0,0')}  </td>
                                </tr>

                                {[2, 3, 4, 5].map((item) => (
                                        <tr key={item}>
                                            <td className="text-center">{item}</td>
                                            <td>-</td>
                                            <td></td>
                                            <td></td>
                                            <td className='text-end'>-</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-4 text-center">
                            <img src={`${image}document/paysale/${data.file_transfer}`} className='w-100' alt="" />
                            <a href="javascript:;" onClick={() => handleDownload(`${image}document/paysale/${data.file_transfer}`)} className='text-blue'><i class="fa-solid fa-download" /> ໂຫລດ..</a>
                        </div>
                        <div className="col-sm-6 col-8 border-start border-1">
                            <table className='table text-nowrap fs-15px'>
                                <tr>
                                    <th className='text-end'>ລວມຍອດເງິນ:</th>
                                    <td width={'10%'} className='text-end'><h5>{numeral(data.balance_gold).format('0,00')}</h5> ₭</td>
                                </tr>
                                <tr>
                                    <th className='text-end'>ສ່ວນຫຼຸດ:</th>
                                    <td width={'10%'} className='text-end'><h5> {numeral(data.balance_discount).format('0,00')}</h5> ₭</td>
                                </tr>
                                <tr>
                                    <th className='text-end'>ລວມເງິນ:</th>
                                    <td width={'10%'} className='text-end'><h5>{numeral(data.balance_gold - data.balance_discount).format('0,00')} ₭</h5></td>
                                </tr>
                            </table>
                            <div className="p-2 fs-14px border-top">
                                <div>ຊື່ບັນຊີ: {data.cardholder_name}</div>
                                <div>ເລກທີໂອນ: {data.transfer_number}</div>
                                <div>ວັນທີແລະເວລາ: {moment(data.date_transfer).format('DD/MM/YYYY HH:mm')}</div>
                                <hr />
                                <div className='mt-3'>ລາຍລະອຽດ:{data.pays_remark} </div>
                                {data.status_sale_use===1 ?(
                                <>
                                <div className={`mt-3 fs-16px ${data.status_pays === 1 ? 'text-red' : data.status_pays === 2 ? 'text-orange' : 'text-green'}`}>
                                  <strong className='text-dark me-2'> ສະຖານະ:</strong> 
                                     {data.status_pays === 1 ? 'ຍັງບໍ່ໄດ້ຮັບການກວດສອບ' : data.status_pays === 2 ? (<>ໄດ້ຮັບການກວດສອບແລ້ວ ( {moment(data.date_check).format('DD/MM/YYYY HH:mm')} )</>) : (<>ການມອບຮັບສິນຄ້າສຳເລັດ ( {moment(data.date_approved).format('DD/MM/YYYY HH:mm')} )</>)}
                                    </div>
                                    {data.status_pays === 1 ? (
                                    <div className='mt-3'>
                                        <Button type='button' color='red' onClick={() => handleCancel(data.pay_sale_uuid)} className='' appearance="primary"> ປະຕິເສດ</Button>
                                        <Button type='button' color='green' onClick={()=>checkConfrim(data.pay_sale_uuid)} className='ms-3'  appearance="primary"> <i className="fa-solid fa-check me-3"></i> ຢືນຢັນການກວດສອບຖຶກຕ້ອງ</Button>
                                    </div>
                                    ):(data.status_pays === 2 && (<>
                                    <div className='mt-3 mb-3'>
                                        <div className="text-blue">- ຂໍ້ມູນການສັ່ງຊື້ນີ້ໄດ້ຮັບການກວດສອບແລະ ພົບຂໍ້ມູນທີ່ມີຄວາມຖຶກຕ້ອງແລ້ວ ສາມາດອອກສິນຄ້າໄດ້</div>
                                    <div className='text-dark'>ຜູ້ກວດສອບ: {data.check_user_name}</div>
                                    </div>
                                        <Button type='button' color='green' className='ms-3' block appearance="primary"> <i className="fa-solid fa-check me-3"></i> ຢືນຢັນອະນຸມັດອອກ</Button>
                                </>  ))}
                                 {data.status_pays === 3 && (
                                    <>
                                        <div className='fs-15 text-success'>ວັນທີຮັບສິນຄ້າ: {moment(data.date_approved).format('DD/MM/YYYY hh:mm:ss')}</div>
                                        <div>ພະນັກງານອານຸມັດ: {data.user_approved_name}</div>
                                    </>
                                )}
                                </>
                        ):(<>
                        <div className='fs-15 text-red mt-4'>ການສັ່ງຊື້ໄດ້ຮັບການຍົກເລີກ  ( {moment(data.date_check).format('DD/MM/YYYY HH:mm')} )

                            <h6>ພະນັກງານກວດສອບ:  {data.check_user_name}</h6>
                        </div>
                        </>)}

                            </div>
                        </div>
                    </div>

                </div>
            </Modal.Body>
        </Modal>

        <ModalCancle show={openCanle} handleClose={()=>setOpenCanle(false)} Id={data.pay_sale_uuid} fetchData={fetchData} />
        </>
    )
}

export default ViewBillOnline