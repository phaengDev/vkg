import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Config } from '../../config/connect';
import moment from 'moment';
import numeral from 'numeral';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function BillView() {
    const api = Config.urlApi;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const billId = searchParams.get('id');

    const [data, setData] = useState({ dataList: [] });
    const componentRef = useRef();

    const [billNo, setBillNo] = useState('')
    const fetchData = async () => {
        try {
            const response = await fetch(api + 'sale-r/reques/' + billId);
            const jsonData = await response.json();
            setData(jsonData);
            setBillNo(jsonData.sale_billNo)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // const printBill = () => {
    //     const printContent = document.getElementById('printableArea').innerHTML;
    //     const originalContent = document.body.innerHTML;
    //     document.body.innerHTML = printContent;
    //     window.print();
    //     document.body.innerHTML = originalContent;
    // };

    const handleExportAsPDF = async () => {
        const input = componentRef.current;
        const canvas = await html2canvas(input, {
          scale: 2,
        });
    
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save(billNo + '.pdf');
    };

    useEffect(() => {
        fetchData();
    }, [billId])

    return (
        <div id="content"  class="app-content">
            <div className="invoice">
                <div className="invoice-company">
                    <span className="float-end hidden-print">
                        <a href="javascript:;" onClick={handleExportAsPDF} className="btn btn-sm btn-white mb-10px">
                            <i className="fa fa-file-pdf t-plus-1 text-danger fa-fw fa-lg" /> Export
                            as PDF
                        </a>
                        {/* <a href="javascript:;" onClick={printBill} className="btn btn-sm btn-white mb-10px ms-2" >
                            <i className="fa fa-print t-plus-1 fa-fw fa-lg" /> Print
                        </a> */}
                    </span>
                    ລາຍລະອຽດບິນ
                </div>
                <div id='printableArea'  ref={componentRef}>
                    <div className="invoice-header px-3" >
                        <div className="invoice-from">
                            <address className="mt-5px mb-5px">
                                <strong className="text-dark">ຮ້ານຂາຍຄຳ ນາງວຽງຄຳ.</strong>
                                <br />
                                ສາຂາ: {data.branch_name}
                                <br />
                                ທີ່ຢູ່ {data.village_name + ', ' + data.district_name + ', ' + data.province_name}
                                <br />
                                ເບີໂທລະສັບ: {data.branch_tel}
                                <br />
                                ລາຍລະອຽດ: {data.branch_detail}
                            </address>
                        </div>

                        <div className="invoice-date">
                            <div className="date text-dark mt-5px">ວັນທີຂາຍ: {moment(data.sale_date).format('DD/MM/YYYY h:mm')}</div>
                            <div className="invoice-detail">
                                ເລກທີບິນ: <strong className='text-blue'>{data.sale_billNo}</strong>
                                <div>ບິນຮ້ານ: <strong className='text-blue'>{data.bill_shop}</strong></div>
                                <div> ພ/ງ ຂາຍ: {data.staffName}</div>
                                <div>ພ/ງ ບັນທຶກ: {data.userName}</div>
                            </div>
                        </div>
                    </div>
                    <div className="invoice-content">
                        <div className="table-responsive">
                            <table className="table table-invoice text-nowrap">
                                <thead>
                                    <tr>
                                        <th className="text-center">ລ/ດ</th>
                                        <th>ລາຍການ</th>
                                        <th className="text-center"> ນ້ຳໜັກ</th>
                                        <th className="text-center"> ບັນຈຸ</th>
                                        <th className="text-center"> ຊື້ເພີ່ມ</th>
                                        <th className="text-end"> ລາຄາຂາຍ </th>
                                        <th className="text-center" width="5%"> ຈຳນວນ</th>
                                        <th className="text-end"> ຄ່າລາຍ </th>
                                        <th className="text-end"> ລວມເປັນເງິນ </th>
                                        <th>ໂຊນຂາຍ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.dataList.map((val, key) => (
                                        <tr>
                                            <td className='text-center'>{key + 1}</td>
                                            <td>{val.tile_name} ({val.code_id})</td>
                                            <td className='text-center'>{val.qty_baht + ' ' + val.option_name}</td>
                                            <td className='text-center'>{val.qty_grams} g</td>
                                            <td className='text-center'>{val.qty_sale_add > 0? '+ '+ val.qty_sale_add + ' ' + val.option_name:'-'} </td>
                                            <td className='text-end'>{numeral(val.price_sale).format('0,00')}</td>
                                            <td className='text-center'>{val.order_qty + '.' + val.unite_name}</td>
                                            <td className={`text-end ${val.price_pattern > 0 ? 'text-green' : ''}`}>{val.price_pattern > 0 ? '+' : ''} {numeral(val.price_pattern * val.order_qty * val.qty_baht).format('0,00')}</td>
                                            <td className='text-end'>{numeral(val.qty_sale_add >0? val.price_grams*val.qty_gram_add: val.price_sale*val.order_qty).format('0,0')} </td>
                                            <td>{val.zone_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={8} className='text-end border-0'>ລວມຍອດທັງໝົດ</td>
                                        <td colSpan={2} className='text-end bg-dark-200 text-white'> {numeral(data.balance_total).format('0,00')} Kip</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8} className='text-end border-0'>ຮັບເງິນສົດ</td>
                                        <td colSpan={2} className='text-end bg-dark-200 text-white'> {numeral(data.balance_cash).format('0,00')} Kip</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8} className='text-end border-0'>ຮັບເງິນໂອນ</td>
                                        <td colSpan={2} className='text-end bg-dark-200 text-white'> {numeral(data.balance_transfer).format('0,00')} Kip</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8} className='text-end border-0'>ຮັບເງິນທອນ</td>
                                        <td colSpan={2} className='text-end bg-dark-200 text-white'> {numeral(data.balance_return).format('0,00')} Kip</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                    </div>
                    <div className="invoice-footer">
                        <p className="text-center mb-5px fw-bold">ຮ້ານຂາຍຄຳ ນາງວຽງຄຳ</p>
                        <p className="text-center">
                            <span className="me-10px">
                                <i className="fa fa-fw fa-lg fa-globe" /> {data.branch_name}
                            </span>
                            <span className="me-10px">
                                <i className="fa fa-fw fa-lg fa-phone-volume" /> Tel:{data.branch_tel}
                            </span>
                            <span className="me-10px">
                                <i className="fa fa-fw fa-lg fa-envelope" />{" "}
                                <a href="#"
                                    className="__cf_email__">
                                    {data.branch_email}
                                </a>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
