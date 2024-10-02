import React, { useState, useEffect, useRef } from 'react'
import numeral from 'numeral';
import moment from 'moment';
const PrintBillTest = React.forwardRef(({ data, cartData }, ref) => {
    const username = localStorage.getItem('username')

    const [totalBalance, setTotalBalance] = useState(0);
    const [totalPattern, setTotalPattern] = useState(0);
    const [balanceTotal, setBalanceTotal] = useState(0)

    const [totalBalancePay, setTotalBalancePay] = useState(0)

    useEffect(() => {
        const balance = cartData.reduce((acc, val) => {
            const quantity = val.qty_add > 0 ? val.grams_add : val.qty_grams * val.order_qty;
            return acc + parseFloat(val.price_sale * quantity);
        }, 0);
        const bnPattern = cartData.reduce((acc, val) => acc + parseFloat(val.price_pattern * val.order_qty * val.qty_baht), 0);
        setTotalBalance(balance);
        setTotalPattern(bnPattern);

        setBalanceTotal(balance + bnPattern);
        setTotalBalancePay(balance + bnPattern);
    }, [cartData])
    return (
        <>
            <div ref={ref}>
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
                                <th rowSpan={2} width={'55%'}>ພ/ງຂາຍ : <span>{data.first_name + ' ' + data.last_name}</span></th>
                                <td className='text-end'>No: {data.id_code}</td>
                            </tr>
                            <tr>
                                <td className='text-end'>Date: {moment(new Date()).format('DD/MM/YYYY h:mm')}</td>
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
                            {cartData.map((item, key) => (
                                <tr className="service" key={key}>
                                    <td className="itemtext">{item.tile_name + ' ' + item.qty_baht + ' ' + item.option_name} {item.qty_sale_add > 0 ? (<span className='text-green'>+ {item.qty_sale_add}</span>) : ''} </td>
                                    <td className="itemtext text-center">{item.order_qty + ' ' + item.unite_name}</td>
                                    <td className="itemtext text-end">{item.grams_add > 1 ? (<s> {numeral(((item.price_sale * item.qty_grams) * item.order_qty+item.grams_add) + ((item.price_pattern * item.order_qty) * item.qty_baht)).format('0,00')}</s>)
                                        : (numeral(((item.price_sale * item.qty_grams) * item.order_qty) + ((item.price_pattern * item.order_qty) * item.qty_baht)).format('0,00')
                                        )}
                                        {item.price_pattern > 0 ? (
                                            <div className='desc text-green'>+{numeral((item.price_pattern * item.order_qty) * item.qty_baht).format('0,00')}</div>
                                        ) : ('')}
                                        <div> </div>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colspan="2" class="sum-up line tx-l">ລວມທັງໝົດ (Subtota) :</td>
                                <td class="line price">{numeral(totalBalance).format('0,00')} </td>
                            </tr>
                            <tr>
                                <td colspan="2" class="sum-up tx-l">ອມພ : %</td>
                                <td class="price">{numeral(0).format('0,00')}</td>
                            </tr>
                            <tr>
                                <th colspan="2" class="sum-up bottom tx-l">ລວມເປັນເງິນ :</th>
                                <th class="price tx-r bottom">{numeral(totalBalancePay).format('0,00')} ₭</th>
                            </tr>
                            <tr>
                                <td className="line bottom pt-2px" colspan="4"></td>
                            </tr>
                        </tbody>
                    </table>
                    <section>
                        <p className='fs-18px'>
                            ຜຸ້ບັນທຶກ : <span>{username}</span>
                        </p>
                        <h5 className='text-center'>ຂໍຂອບໃຈ</h5>
                    </section>
                </div>
            </div>
        </>
    );
});

export default PrintBillTest