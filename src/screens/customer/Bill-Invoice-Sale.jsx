import moment from 'moment';
import numeral from 'numeral';
import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { Config } from '../../config/connect';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
function BillInvoiceSale({ show, handleClose, data }) {
    const api = Config.urlApi
    const [item, setItem] = React.useState({
        branch_name: '',
        branch_tel: '',
        village_name: '',
        province_name: '',
        district_name: '',
    });
    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await fetch(api + 'system/' + data.branch_id_fk);
                const jsonData = await response.json();
                setItem({
                    branch_name: jsonData.branch_name,
                    branch_tel: jsonData.branch_tel,
                    village_name: jsonData.village_name,
                    district_name: jsonData.district_name,
                    province_name: jsonData.province_name,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchBranch();
    }, [data])
    const componentRef = useRef();
    const downloadImg = () => {
        toPng(componentRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = data.sale_billNo + '.jpg';
                link.click();
            })
            .catch((err) => {
                console.error('Failed to generate QR code image:', err);
            });
    };
    return (
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Body className='p-0'>
                <div className="container-file">
                    <div className="text-end px-3 mt-2 text-dark">
                        <button type='button' onClick={downloadImg} className='btn btn-xs btn-green me-2'><i class="fa-solid fa-download fs-5" /></button>
                        <button type='button' onClick={handleClose} className='btn btn-xs btn-danger'><i class="fa-solid fa-xmark fs-5" /></button>
                    </div>
                </div>
                <div ref={componentRef} className="bg-white">
                    <div
                        style={{
                            content: '""',
                            backgroundImage: 'url("./assets/img/logo/logo.png")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.05, // Set the desired opacity for the image
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 0,
                            pointerEvents: 'none' // Make the overlay non-interactive
                        }}
                    ></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="row">
                            <div className="col-12 text-center">
                                <div className="text-center">
                                    <img src="./assets/img/logo/logo.png" className="w-10" alt="Logo" />
                                </div>
                                <h4>{item.branch_name}</h4>
                            </div>
                            <div className="col-7 p-4">
                                <div className="row">
                                    <div className="col-sm-4 text-lg-end fs-bold">ເບີໂທລະສັບ:</div>
                                    <div className="col-sm-8 ">{item.branch_tel}</div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4 text-lg-end fs-bold">ທີ່ຢູ່ຮ້ານ:</div>
                                    <div className="col-sm-8 ">{item.village_name + ',' + item.district_name + ',' + item.province_name}</div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4 text-lg-end fs-bold">ພະນັກງານອອກບິນ:</div>
                                    <div className="col-sm-8 ">{data.userName}</div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="row">
                                    <div className="col-sm-4 text-lg-end fs-bold"><h4>BillNo :</h4></div>
                                    <div className="col-sm-8 ">
                                        <h4>{data.sale_billNo}</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4 text-lg-end fs-bold">ວັນທີອອກບິນ :</div>
                                    <div className="col-sm-8 ">{moment(data.sale_date).format('DD/MM/YYYY HH:mm')}</div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4 text-lg-end fs-bold">ພະນັກງານຂາຍ :</div>
                                    <div className="col-sm-8 ">{data.first_name + ' ' + data.last_name}</div>
                                </div>
                            </div>
                        </div>
                        <div className="table-resopnsive">
                            <table className='w-100 mb-3 text-nowrap'>
                                <tr>
                                    <td className='text-end' width={'10%'}>ຊື່ລູກຄ້າ :</td>
                                    <td className='border-bottom' width={'30%'}>{data.cus_fname + ' ' + data.cus_lname}</td>
                                    <td className='text-end' width={'10%'}>ເບີໂທລະສັບ : </td>
                                    <td className='border-bottom' width={'20%'}>{data.cus_tel}</td>
                                    <td className='text-end' width={'10%'}>ທີ່ຢູ່ : </td>
                                    <td className='border-bottom' width={'40%'}>{data.villageName}, {data.district_name}, {data.province_name}</td>
                                </tr>
                            </table>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center">ລ/ດ</th>
                                        <th className="text-center">ລະຫັດສິນຄ້າ</th>
                                        <th className="">ຊື່ສິນຄ້າ</th>
                                        <th className="text-center">ຈໍານວນ</th>
                                        <th className="text-end">ລາຄາສິນຄ້າ</th>
                                        <th className="text-end">ຄ່າລາຍ</th>
                                        <th className="text-end">ລາຄາຂາຍ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.dataList &&
                                        data.dataList.map((item, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{item.code_id}</td>
                                                <td className="">{item.tile_name} {item.qty_baht} {item.option_name}</td>
                                                <td className="text-center">{item.order_qty} {item.unite_name}</td>
                                                <td className="text-end">{numeral(item.price_sale).format('0,00.00')}</td>
                                                <td className="text-end">{numeral(item.price_pattern).format('0,00.00')}</td>
                                                <td className="text-end">{numeral(item.total_balance).format('0,00.00')}</td>
                                            </tr>
                                        ))}
                                    {
                                        data.dataList &&
                                        data.dataList.length < 5 &&
                                        Array.from({ length: 5 - data.dataList.length }).map((_, index) => (
                                            <tr key={`empty-${index}`}>
                                                <td className="text-center">{data.dataList.length + index + 1}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className='text-end'>-</td>
                                                <td className='text-end'>-</td>
                                                <td className='text-end'>-</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="row mb-5">
                                <div className="col-6 text-center">
                                    
                                        <center>  <QRCodeSVG
                                            value={data.sale_uuid}
                                            size={'250'}
                                            bgColor={"#ffffff"}
                                            level={"L"}
                                            includeMargin={false}
                                            style={{ height: "auto", maxWidth: "40%", width: "40%" }}
                                            imageSettings={{
                                                src: "assets/img/logo/logo.png",
                                                excavate: true,
                                            }}
                                        />
                                        </center>
                                    
                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <table className="table w-100 text-nowrap text-end">
                                        <tbody>
                                            <tr className="fw-bold ">
                                                <td className="text-end border-bottom-0">ລວມຍອດທັງໝົດ :</td>
                                                <td className="text-end">{numeral(data.balance_total).format('0,00.00')} {data.genus}</td>
                                            </tr>
                                            <tr className="fw-bold">
                                                <td className="text-end border-bottom-0">ຍອດຮັບເງິນສົດ :</td>
                                                <td className="text-end">{numeral(data.balance_cash).format('0,00.00')} {data.genus}</td>
                                            </tr>
                                            <tr className="fw-bold">
                                                <td className="text-end border-bottom-0">ຍອດຮັບເງິນໂອນ :</td>
                                                <td className="text-end">{numeral(data.balance_transfer).format('0,00.00')}  {data.genus}</td>
                                            </tr>
                                            <tr className="fw-bold">
                                                <td className="text-end border-bottom-0">ຍອດຮັບເງິນທອນ :</td>
                                                <td className="text-end">{numeral(data.balance_return).format('0,00.00')} ₭</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="row p-4 mb-5 mt-4">
                                <div className="col-6 text-center d-flex flex-column align-items-center">
                                    <h5>ລູກຄ້າ</h5>
                                    <p className='border-bottom w-50 border-dark' />
                                </div>
                                <div className="col-6 text-center d-flex flex-column align-items-center">
                                    <h5>ພະນັກງານ</h5>
                                    <p className='border-bottom w-50 border-dark' />
                                </div>
                            </div>
                            <div className="footer px-3">
                                <p className='fs-12px'>ຜູ້ບັນທຶກຂໍ້ມູນ : {data.userName} ||  ວັນທີ : {new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>

        </Modal>
    )
}

export default BillInvoiceSale