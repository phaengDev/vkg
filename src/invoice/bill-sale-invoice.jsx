
import React,{ useEffect, useState,useRef } from 'react';
import  '../invoice.css';
import { useLocation } from 'react-router-dom';
import { Config } from '../config/connect';
import moment from 'moment';
import numeral from 'numeral';
import { useReactToPrint } from 'react-to-print';
    const InvoiceSale=()=> {
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        const billId = searchParams.get('id');
const  api=Config.urlApi;
const [data, setData] = useState({ dataList: [] });
const fetchData = async () => {
    try {
      const response = await fetch(api + 'sale-r/reques/' + billId);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

const invoiceRef = useRef();
const printInvioce = useReactToPrint({
    content: () => invoiceRef.current,
  });
useEffect(() => {
    
    fetchData();
      printInvioce()
  }, [billId]);
  if (!billId) {
    return '';
  }
return (
  <>
  
  <div ref={invoiceRef}  class="receipt" >
        <header>
            <div id="logo" className="media w-50" data-src="6840541.png" src="6840541.png"> <img src="/assets/img/logo/logo.png" className='w-50' alt=""/></div>
        </header>
        <p class="tx-c fs-18px">{data.branch_name}</p>
        <table class="bill-details"  width="100%">
            <tbody>
                <tr>
                    <td colspan="2">ທີ່ຢູ່: <span>{data.village_name+', '+data.district_name+', '+data.province_name}</span></td>
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
              <td className="itemtext">{item.tile_name+' '+item.qty_baht+' '+item.option_name} {item.qty_sale_add  > 0?(<span className='text-green'>+ {item.qty_sale_add}</span>):''} </td>
              <td className="itemtext text-center">{item.order_qty+' '+item.unite_name}</td>
              <td className="itemtext text-end">{numeral(item.qty_sale_add >0? item.price_grams*item.qty_gram_add: item.price_sale*item.order_qty).format('0,0')}
              {item.price_pattern >0 ? (
                <>
                <br/>
               + {numeral(item.price_pattern*item.order_qty).format('0,00')}
               </>):('')}
              </td>
            </tr>
          ))}
            <tr>
                <td colspan="2" class="sum-up line tx-l">ລວມທັງໝົດ (Subtota) :</td>
                <td class="line price">{numeral(data.balance_total).format('0,00')}</td>
            </tr>
            <tr>
                <td colspan="2" class="sum-up tx-l">ອມພ : %</td>
                <td class="price">{numeral(data.balance_vat).format('0,00')}</td>
            </tr>
            <tr>
                <th colspan="2" class="sum-up bottom tx-l">ລວມເປັນເງິນ :</th>
                <th class="price tx-r bottom">{numeral(data.balance_total).format('0,00')}</th>
            </tr>
            <tr>
                <th colspan="2" class="sum-up  tx-l">ຮັບເງິນສົດ :</th>
                <th class="price tx-r ">{numeral(data.balance_cash).format('0,00')}</th>
            </tr>
            <tr>
                <th colspan="2" class="sum-up  tx-l">ຮັບເງິນໂອນ :</th>
                <th class="price tx-r ">{numeral(data.balance_transfer).format('0,00')}</th>
            </tr>
            {data.balance_return > 0? (
            <tr>
                <th colspan="2" class="sum-up bottom tx-l">ເງິນທອນ :</th>
                <th class="price tx-r bottom">{numeral(data.balance_return).format('0,00')}</th>
            </tr>
            ):''}
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
    </>
)
}
export default InvoiceSale;

