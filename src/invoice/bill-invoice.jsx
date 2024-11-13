
import React, { useEffect, useState, useRef } from 'react';
import '../invoice.css';
import { Config } from '../config/connect';
import moment from 'moment';
import numeral from 'numeral';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactToPrint from 'react-to-print';
import { toPng } from 'html-to-image';
const Invoice = ({ show, handleClose,showStaff,fetchChart, invoice }) => {
    const api = Config.urlApi;
    const [data, setData] = useState({ dataList: [] });
    const fetchData = async () => {
        try {
            const response = await fetch(api + 'sale-r/reques/' + invoice);
            const jsonData = await response.json();
            setData(jsonData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const componentRef = useRef();
    useEffect(() => {
        fetchData();
    }, [invoice]);

    const handleModalClose = () => {
        handleClose();
        showStaff();
        fetchChart();
      };


    //   const qrRef = useRef(null);
      const downloadImg = () => {
        // if (componentRef.current === null) {
        //   return;
        // }
        toPng(componentRef.current)
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = data.sale_billNo+'.jpg';
            link.click();
          })
          .catch((err) => {
            console.error('Failed to generate QR code image:', err);
          });
      };

    return (
        <>
            <Modal show={show} onHide={handleModalClose} size='md'>
                <Modal.Body className='bg-white fonts-laos'>
                    <div style={{ position: 'absolute', top: '5px', right: '10px' }} role='button' onClick={handleModalClose}>
                        <i class="fa-solid fa-circle-xmark fs-2 text-red" />
                    </div>




                    <div ref={componentRef}>
                        <div id='printableArea' class="receipt">
                            <header>
                                <div id="logo" className="media w-50" data-src="6840541.png" src="6840541.png"> <img src="/assets/img/logo/logo.png" className='w-50' alt="" /></div>
                            </header>
                            <p class="tx-c fs-18px">{data.branch_name}</p>
                            <table class="bill-details" width="100%">
                                <tbody>
                                    <tr>
                                        <td colspan="2">ທີ່ຢູ່: <span>{data.village_name + ', ' + data.district_name + ', ' + data.province_name}</span></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">ໂທລະສັບ/Tel: <span>{data.branch_tel}</span></td>
                                    </tr>
                                    <tr>
                                        <th rowSpan={2} width={'55%'}>ພ/ງຂາຍ : <span>{data.staffName}</span></th>
                                        <td className='text-end'>No: {data.sale_billNo}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-end'>Date: {moment(data.sale_date).format('DD/MM/YYYY h:mm')}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="2" class="center-align"><h4 class=""> ບິນຮັບເງິນສົດ</h4></th>
                                    </tr>
                                </tbody>
                            </table>

                            <table class="items">
                                <thead>
                                    <tr>
                                        <th class="heading name">ລາຍການ</th>
                                        <th class="heading qty">ຈຳນວນ</th>
                                        <th class="heading amount text-end">ລວມເງິນ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.dataList.map((item, key) => (
                                        <tr className="service" key={key}>
                                            <td className="itemtext">{item.tile_name + ' ' + item.qty_baht + ' ' + item.option_name} {item.qty_sale_add > 0 ? (<span className='text-green'>+ {item.qty_sale_add}</span>) : ''} </td>
                                            <td className="itemtext text-center">{item.order_qty + ' ' + item.unite_name}</td>
                                            <td className="itemtext text-end">{numeral(item.qty_sale_add > 0 ? item.price_grams * item.qty_gram_add : item.price_sale * item.order_qty).format('0,0')}
                                                {item.price_pattern > 0 ? (
                                                    <>
                                                        <br />
                                                        + {numeral(item.price_pattern * item.order_qty).format('0,00')}
                                                    </>) : ('')}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colspan="2" class="sum-up line tx-l">ລວມທັງໝົດ (Subtota) :</td>
                                        <td class="line price">{numeral(data.balance_total).format('0,00')} </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="sum-up tx-l">ອມພ : %</td>
                                        <td class="price">{numeral(data.balance_vat).format('0,00')}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="2" class="sum-up bottom tx-l">ລວມເປັນເງິນ :</th>
                                        <th class="price tx-r bottom">{numeral(data.balance_total).format('0,00')} ₭</th>
                                    </tr>
                                    <tr>
                                        <th colspan="2" class="sum-up  tx-l">ຮັບເງິນສົດ :</th>
                                        <th class="price tx-r ">{numeral(data.balance_cash).format('0,00')} {data.genus}</th>
                                    </tr>
                                    <tr>
                                        <th colspan="2" class="sum-up  tx-l">ຮັບເງິນໂອນ :</th>
                                        <th class="price tx-r ">{numeral(data.balance_transfer).format('0,00')} {data.genus}</th>
                                    </tr>
                                    {data.balance_return > 0 ? (
                                        <tr>
                                            <th colspan="2" class="sum-up bottom tx-l">ເງິນທອນ :</th>
                                            <th class="price tx-r bottom">{numeral(data.balance_return).format('0,00')} ₭</th>
                                        </tr>
                                    ) : ''}
                                    <tr>
                                        <td className="line bottom pt-2px" colspan="4"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <section>
                                <p>
                                    ຜຸ້ບັນທຶກ : <span>{data.userName}</span>
                                    <br />
                                    <strong>ລາຍຫລະອຽດ: </strong>  {data.sale_remark}
                                </p>
                            </section>
                        </div>
                    </div>




                    <div className="text-center mt-4">
                        <Button variant="red" className='rounded-pill me-2' onClick={downloadImg}> <i class="fa-solid fa-cloud-arrow-down"/> ໂຫລດ </Button>
                        <ReactToPrint trigger={() =>
                                <Button variant="primary" className='rounded-pill'> <i class="fa-solid fa-print" /> print </Button>}
                                content={() => componentRef.current} // use useRef's current
                                documentTitle="New Document"
                                pageStyle={"print"} 
                                onAfterPrint={handleModalClose}
                                />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
};

export default Invoice;
