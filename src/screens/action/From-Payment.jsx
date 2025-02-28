import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Invoice from '../../invoice/bill-invoice';
import numeral from 'numeral';
import { Urlimage } from '../../config/connect';
import axios from 'axios';
import { Config } from '../../config/connect';
import { Notification } from '../../utils/Notifig';
function FromPayment({ show, handleClosePay, staffId, datacart, fetchChart, balanceTotal, idInvoice,showInvoice }) {
    const api = Config.urlApi;
    const img = Urlimage.url;
    const userId = localStorage.getItem('user_uuid');
    const barnchId = localStorage.getItem('branch_Id');

    const [disabled, setDisabled] = useState(true);

    //==========================
    const [balanceSale, setBalanceSale] = useState(0)
    const [balanceCash, setBalanceCash] = useState('0');
    const [balanceTransfer, setBalanceTransfer] = useState('0');
    const [balanceReturn, setBalanceReturn] = useState('0');
    const [totalBalancePay, setTotalBalancePay] = useState(0)


    useEffect(() => {
        setTotalBalancePay(balanceTotal);
        setBalanceSale(balanceTotal);
    }, [staffId, balanceTotal])

    const [currentResult, setCurrentResult] = useState('1');
    const handleClick = (value) => {
        if (value === 'c') {
            setBalanceCash('0');
            setBalanceTransfer('0');
            setBalanceReturn('0')
        }
        else if (value === 'del') {
            if (currentResult === '1') {
                setBalanceCash(balanceCash.length > 1 ? balanceCash.slice(0, -1) : '0');
            } else {
                setBalanceTransfer(balanceTransfer.length > 1 ? balanceTransfer.slice(0, -1) : '0');
            }
        }
        else if (value === 'All') {
            if (currentResult === '1') {
                setBalanceCash(totalBalancePay);
            } else {
                setBalanceTransfer(totalBalancePay - balanceCash);
            }

            if (balanceCash >= totalBalancePay) {
                setBalanceTransfer(0);
            }
            setBalanceReturn(0)
        }
        else {
            if (currentResult === '1') {
                setBalanceCash(balanceCash === '0' ? value : balanceCash + value);
            } else {
                if (balanceCash >= totalBalancePay) {
                    setBalanceTransfer(0);
                } else if (value > totalBalancePay) {
                    setBalanceTransfer(totalBalancePay);
                } else {
                    setBalanceTransfer(balanceTransfer === '0' ? value : balanceTransfer + value);
                }
            }
        }

    };

    const [order, setOrder] = useState({
        user_id_fk: '',
        staff_id_fk: '',
        branch_id_fk: '',
        bill_shop: '',
        sale_remark: '',
        balance_total: '0',
        total_grams: '0',
        balance_cash: 0,
        balance_transfer: 0,
        balance_return: '0',
        currency_id_fk: 22001,
        rate_price: 1,
        balance_totalpay: 0,
        items: []
    });

  

    useEffect(() => {
        const items = datacart.map(item => ({
            cart_id: item.cart_id,
            product_id_fk: item.product_uuid,
            zone_id_fk: item.zone_id_fk,
            order_qty: item.order_qty,
            qty_grams: (item.qty_grams * item.order_qty),
            qty_add: item.qty_add,
            grams_add: item.grams_add,
            price_sale: item.price_sale,
            price_buy: item.price_buy,
            price_pattern: item.price_pattern,
            staff_id_fk: item.staff_id_fk,
            user_id_fk: item.user_id_fk
        }));
        const Toalgarms = datacart.reduce((acc, val) => acc + parseFloat(val.qty_grams * val.order_qty), 0)
        const balancePay = parseFloat(balanceCash) + parseFloat(balanceTransfer)
        setOrder({
            ...order,
            user_id_fk: userId,
            staff_id_fk: staffId,
            branch_id_fk: barnchId,
            total_grams: Toalgarms,
            balance_cash: balanceCash,
            balance_transfer: balanceTransfer,
            balance_return: balanceReturn,
            balance_total: balanceTotal,
            balance_totalpay: totalBalancePay,
            items: items
        })
        if (balancePay > totalBalancePay) {
            setBalanceReturn(balancePay - totalBalancePay);
        } else {
            setBalanceReturn(0);
        }

        if (balancePay >0 && balancePay >= totalBalancePay) {
            setDisabled(false);
        }else{
            setDisabled(true);
        }
    }, [balanceCash, balanceTransfer, balanceReturn])

    // const [showBill, setShowBill] = useState(false);
    // const [print, setPrint] = useState(false);
    // const [invoice, setInvoice] = useState('');

    // const handlePayment = () => {
    //     axios.post(api + 'payment/create', order).then(function (res) {
    //         if (res.status === 200) {
    //             fetchChart();
    //             setOrder({
    //                 bill_shop: '',
    //                 balance_total: '0',
    //                 total_grams: '0',
    //                 balance_cash: '0',
    //                 balance_transfer: '0',
    //                 balance_payment: '0',
    //                 balance_return: '0',
    //                 rate_price: 1,
    //                 balance_totalpay: 0,
    //                 currency_id_fk: 22001,
    //             })
    //             handleClose()
    //             setBalanceReturn(0);
    //             setBalanceCash(0);
    //             setBalanceTransfer(0);
    //             setBalanceSale(0);
    //             setTotalBalancePay(0);
    //             setInvoice(res.data.id);
    //             setPrint(true);
    //             setShowBill(true)
    //             Notification.success('ການດຳເນິນງານສຳເລັດ', 'ແຈ້ງເຕືອນ')
    //         } else {
    //             Notification.error('ການດຳເນິນງານບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ')
    //         }
    //     }).catch(function () {
    //         Notification.error('ການດຳເນິນງານບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ')
    //     });
    // }


    const handlePayment = async () => {
        try {
            const res = await axios.post(api + 'payment/create', order);
            if (res.status === 200) {
                idInvoice(res.data.id);  // Set invoice first
                showInvoice(true);
                fetchChart();
                setOrder({
                    bill_shop: '',
                    balance_total: '0',
                    total_grams: '0',
                    balance_cash: '0',
                    balance_transfer: '0',
                    balance_payment: '0',
                    balance_return: '0',
                    rate_price: 1,
                    balance_totalpay: 0,
                    currency_id_fk: 22001,
                });
                setBalanceReturn(0);
                setBalanceCash(0);
                setBalanceTransfer(0);
                setBalanceSale(0);
                setTotalBalancePay(0);
                handleClosePay();
                Notification.success('ການດຳເນິນງານສຳເລັດ', 'ແຈ້ງເຕືອນ');
            } else {
                Notification.error('ການດຳເນິນງານບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
            }
        } catch (error) {
            Notification.error('ການດຳເນິນງານບໍ່ສຳເລັດ', 'ແຈ້ງເຕືອນ');
        }
    };
    

    return (
        <>
            <Modal show={show} size='xl' backdrop="static" className='modal-pos' centered  >
                <Modal.Body className='p-0'>
                    {/* <a href="javascript:;" onClick={handleClose} className="btn-close position-absolute top-0 end-0 m-4" /> */}
                    <div className="modal-pos-product">
                        <div className="modal-pos-product-img p-3 border-end border-2">
                            <div className="option-list mb-2">
                                <div className="table-responsive w-100">
                                    <table className='table text-nowrap w-100'>
                                        <body>
                                            {datacart.map((val, index) =>
                                                <tr>
                                                    <td className='text-center' width={'2%'}>{index + 1} </td>
                                                    <td width={'3%'} className='with-img dt-type-numeric'>
                                                        <img src={val.file_image !== '' ? img + 'pos/' + val.file_image : 'assets/img/icon/picture.jpg'} className='rounded h-30px my-n1 mx-n1' alt="" />
                                                    </td>
                                                    <td>{val.tile_name + ' ' + val.qty_baht + '  ' + val.option_name} {val.qty_add > 0 ? (<span className='text-green'>+ {val.qty_add}</span>) : ('')}</td>
                                                    <td>{val.order_qty + ' / ' + val.unite_name}</td>
                                                    <td className='text-end'>{(val.qty_baht * val.qty_grams)} g</td>
                                                    <td className='text-end'>+ {numeral(val.price_pattern * val.order_qty * val.qty_baht).format('0,00')}</td>
                                                    <td className='text-end'> {numeral(
                                                        (val.price_sale * (val.qty_add > 0 ? val.grams_add : val.qty_grams) * val.order_qty) +
                                                        (val.price_pattern * val.order_qty * val.qty_baht)
                                                    ).format('0,00')}</td>
                                                </tr>
                                            )}
                                            <tr className='fs-16px'>
                                                <td colSpan={4} className='text-end border-0'>ລວມຍອດທັງໝົດ (LAK):</td>
                                                <td className='text-end text-danger border-0'>{datacart.reduce((acc, val) => acc + parseFloat((val.qty_add > 0 ? val.grams_add : val.qty_grams) * val.order_qty), 0)} g</td>
                                                <td colSpan={2} className='text-end text-gold border-0 bg-black'>{numeral(balanceSale).format('0,00')} ₭</td>
                                            </tr>
                                        </body>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-pos-product-info">
                            <div className="card p-1 mb-3 border-3 border-gold bg-dark rounded-pill text-white text-center fs-25px show-price">
                                {/* <div className='prices' data-heading={`${numeral(totalBalancePay).format('0,0')} ₭`} contenteditable>
                            {numeral(totalBalancePay).format('0,0')} ₭
                            </div> */}
                                <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                                            <stop stop-color="rgb(255, 213, 127)" offset="0" />
                                            <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                                            <stop stop-color="rgb(179, 149, 0)" offset="1" />
                                        </linearGradient>
                                    </defs>
                                    <text font-family="arial" font-size="40" id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                                        <tspan x="25%" y="37">{numeral(balanceSale).format('0,0.00')} ₭</tspan>
                                    </text>
                                </svg>
                            </div>
                            <div className="row fs-16px">
                                <div className="col-sm-6 col-6 mb-2">
                                    <label htmlFor="" className='form-label'>ຮັບເງິນສົດ</label>
                                    <div className={`card p-2 px-3 fs-25px border-3 border-gold  rounded-pill  ${currentResult === '1' ? 'text-white bg-dark' : 'text-dark'}`} onClick={() => setCurrentResult('1')} role='button'>{numeral(balanceCash).format('0,0')} ₭</div>
                                </div>
                                <div className="col-sm-6 col-6 mb-2">
                                    <label htmlFor="" className='form-label'>ຮັບເງິນໂອນ </label>
                                    <div className={`card p-2 fs-25px px-3 border-3 border-gold  rounded-pill ${currentResult === '2' ? 'text-white bg-dark' : 'text-dark'}`} role='button' onClick={() => setCurrentResult('2')}>{numeral(balanceTransfer).format('0,0')} ₭</div>
                                </div>
                                <div className="col-sm-12 col-12 mb-2">
                                    <label htmlFor="" className='form-label'>ເງິນທອນ</label>
                                    <div className='card p-1 fs-25px px-3 border-3 border-gold  rounded-pill text-white bg-dark'>{numeral(balanceReturn).format('0,0')} ₭</div>
                                </div>
                            </div>
                            <table id="calcu" className='w-100'>
                                <tbody>

                                    <tr>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('7')} >7</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('8')} >8</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('9')} >9</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter bg-orange' onClick={() => handleClick('del')} ><i class="fa-solid fa-delete-left" /></button></td>
                                    </tr>
                                    <tr>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('4')} >4</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('5')} >5</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('6')} >6</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter bg-red' onClick={() => handleClick('c')} >C</button></td>
                                    </tr>
                                    <tr>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('1')} >1</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('2')} >2</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('3')} >3</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter bg-green-300' onClick={() => handleClick('All')} >ພໍດີ</button></td>
                                    </tr>
                                    <tr>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('.')} >.</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('0')} >0</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('00')} >00</button></td>
                                        <td className='w-25'><button type="button" className='btnCenter' onClick={() => handleClick('000')} >000</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                            <div className="row gx-3">
                                <div className="col-4">
                                    <button type='button' onClick={handleClosePay} className="btn btn-danger w-100 fs-14px rounded-3 fw-bold mb-0 d-block py-3"  >
                                        <i className="fa-solid fa-rotate-left"></i> ຍົກເລິກ
                                    </button>
                                </div>
                                <div className="col-8">
                                    <button type='button' onClick={handlePayment} disabled={disabled} className="btn btn-green w-100 fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0">
                                     ບັນທຶກຂາຍ <i className="fa fa-check ms-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* {print && (
                <div id="printableArea">
                    <Invoice
                        show={showBill}
                        handleClose={() => setShowBill(false)}
                        invoice={invoice}
                        showStaff={() => showStaff(true)}
                        fetchChart={fetchChart()} />
                </div>
            )} */}
        </>
    )
}

export default FromPayment