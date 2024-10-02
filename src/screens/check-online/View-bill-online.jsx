import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import numeral from 'numeral';
import moment from 'moment';
// import { Button } from 'rsuite';
// import '../../style.invoice.css';
import Barcode from 'react-barcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Urlimage } from '../../config/connect';
const ViewBillOnline = ({ show, handleClose, data }) => {
    const image=Urlimage.url;
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


      const handleDownload = (linkImg) => {
        const imageSrc = './assets/img/pos/gold-01.jpg';
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = linkImg;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    return (

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
                    <table className='table text-nowrap'>
                        <tr>
                            <th width={'5%'} className='text-end'>ຊື່ສິນຄ້າ:</th>
                            <td className='border-bottom'>3535</td>
                            <th width={'5%'} className='text-end'>ເບີໂທລະສັບ:</th>
                            <td className='border-bottom'>3543</td>
                            <th width={'5%'} className='text-end'>email:</th>
                            <td className='border-bottom'>353</td>
                        </tr>
                        <tr>
                            <th width={'5%'} className='text-end'>ບັດປະຈຳຕົວ:</th>
                            <td className='border-bottom'>353</td>
                            <th width={'5%'} className='text-end'>ທີ່ຢູ່:</th>
                            <td colSpan={3} className='border-bottom'>3543</td>
                        </tr>
                    </table>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className='thead-plc'>
                                <tr className=''>
                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                    <th>ລາຍການສິນຄ້າ</th>
                                    <th className='text-center'>ນຳໜັກ</th>
                                    <th className='text-center'>ຈຳນວນ</th>
                                    <th className='text-center'>ບັນຈຸ</th>
                                    <th className='text-end'>ລວມລາຄາ</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(data?.dataList) && data.dataList.length > 0 ? (
                                    <>
                                        {data.dataList.map((item, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>{item.tile_name}</td>
                                                <td className="text-center">{item.qty_grams + ' ' + item.option_name}</td>
                                                <td className="text-center"> {item.qty_order} {item.unite_name}  </td>
                                                <td className="text-center">{item.qty_grams * item.qty_order} g</td>
                                                <td className="text-end">
                                                    {numeral(item.price_sale * item.qty_order * item.qty_grams).format('0,00')}
                                                </td>
                                            </tr>
                                        ))}

                                        {data.dataList.length < 4 &&
                                            Array.from({ length: 4 - data.dataList.length }).map((_, index) => (
                                                <tr key={`empty-${index}`}>
                                                    <td className="text-center">{data.dataList.length + index + 1}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            ))}
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-4 text-center">
                            <img src="./assets/img/pos/gold-01.jpg" className='w-100' alt="" />
                            <a href="javascript:;" onClick={()=>handleDownload()} className='text-blue'><i class="fa-solid fa-download" /> ໂຫລດ..</a>
                        </div>
                        <div className="col-sm-6 col-8">
                            <table className='table text-nowrap fs-15px'>
                                <tr>
                                    <th className='text-end'>ລວມຍອດເງິນ:</th>
                                    <td width={'10%'}  className='text-end'><h5>{numeral(data.balance_gold).format('0,00')}</h5> </td>
                                </tr>
                                <tr>
                                    <th className='text-end'>ສ່ວນຫຼຸດ:</th>
                                    <td  width={'10%'}  className='text-end'><h5> {numeral(data.balance_discount).format('0,00')}</h5></td>
                                </tr>
                                <tr>
                                    <th className='text-end'>ລວມເງິນ:</th>
                                    <td  width={'10%'} className='text-end'><h5>{numeral(data.balance_gold-data.balance_discount).format('0,00')}</h5></td>
                                </tr>
                            </table>
                            <div className="p-5 fs-14px">
                                <div>ຊື່ບັນຊີ: {data.cardholder_name}</div>
                                <div>ເລກທີໂອນ: {data.transfer_number}</div>
                                <div className='mt-3'>ລາຍລະອຽດ:{data.pays_remark} </div>
                                <div className={`mt-5 fs-16px ${data.status_pays === 1 ? 'text-red' : data.status_pays === 2 ? 'text-orange' : 'text-green'}`}>ສະຖານະ: {data.status_pays === 1 ? 'ຍັງບໍ່ໄດ້ຮັບການກວດສອບ' : data.status_pays === 2 ? 'ໄດ້ຮັບການກວດສອບແລ້ວ' : 'ການມອບຮັບສິນຄ້າສຳເລັດ'}</div>
                                {data.status_pays===3 &&(
                                    <>
                                <div className='fs-15 text-success'>ວັນທີຮັບສິນຄ້າ: {moment(data.date_receiving).format('DD/MM/YYYY hh:mm:ss')}</div>
                                <div>ພະນັກງານອານຸມັດ: {data.userName}</div>
                                </>
                                )}
                                </div>
                        </div>
                    </div>
                    <Barcode value={data.pay_sale_uuid} width={'1'} height={50} />
                </div>
                    
            </Modal.Body>
        </Modal>
    )
}

export default ViewBillOnline