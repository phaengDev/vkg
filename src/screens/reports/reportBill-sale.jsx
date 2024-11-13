import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { DatePicker, Input, SelectPicker, Placeholder, Pagination } from 'rsuite';
import { useStaff } from '../../utils/selectOption';
import { Config } from '../../config/connect';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import Invoice from '../../invoice/bill-invoice';
function ReportBillsale() {
    const itemStaff = useStaff();
    const api = Config.urlApi;
    const [dataSearch, setDataSearch] = useState({
        startDate: new Date(),
        endDate: new Date(),
        staffId: '',
        statusOff: '',
    });

    const handleChange = (name, value) => {
        setDataSearch({
            ...dataSearch, [name]: value
        });
    }

    const [isLoading, setIsLoading] = useState(true);
    const [filterName, setFilterName] = useState([])
    const [itemData, setItemData] = useState([]);

    const fetchDataReport = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(api + 'sale-r/report', dataSearch);
            const jsonData = response.data;
            console.log(jsonData)
            setItemData(jsonData);
            setFilterName(jsonData);
            setTotal(jsonData.length)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }




    const Filter = (event) => {
        setItemData(filterName.filter(n => n.sale_billNo.toLowerCase().includes(event)))
    }

    const [show, setShow] = useState(false);
    const [billId,setBillId]=useState('');
    const handlePrint=(id)=>{
      setBillId(id)
      setShow(true)
    }
    const [showStaff,setShowStaff]=useState(false)
const fetchChart=()=>{
  
}

    const [activePage, setActivePage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(12);
    useEffect(() => {
        fetchDataReport();
    }, [dataSearch,])
    const currentItems = itemData.slice((activePage - 1) * limit, activePage * limit);

    return (
        <div id="content" className="app-content  p-0 ">
            <div class="app-content-padding bg-component">
                <div class="d-lg-flex mb-lg-3 mb-2">
                    <h1 class="page-header mb-0 flex-1"> <Link to={'/r-sale'} ><i class="fa-solid fa-circle-arrow-left fs-2 text-red"/></Link> ລາຍການບິນຂາຍປະຈຳວັນ</h1>
                </div>
                <div className="row ">
                    <div className='col-sm-3 col-6  col-lg-3'>
                        <label htmlFor="" className='form-label'>ວັນທີ</label>
                        <DatePicker oneTap color="red" format="dd/MM/yyyy" onChange={(e) => handleChange('startDate', e)} defaultValue={dataSearch.startDate} placeholder='ວັນທີ' block />
                    </div>
                    <div className='col-sm-3 col-6  col-lg-3'>
                        <label htmlFor="" className='form-label'>ວັນທີ</label>
                        <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('endDate', e)} defaultValue={dataSearch.endDate} placeholder='ວັນທີ' block />
                    </div>
                    <div className='col-sm-4 col-lg-3'>
                        <label htmlFor="" className='form-label'>ພະນັກງານຂາຍ</label>
                        <SelectPicker data={itemStaff} onChange={(e) => handleChange('staffId', e)} block placeholder="ເລືອກ" />
                    </div>
                    <div className='col-sm-4 col-lg-3'>
                        <label htmlFor="" className='form-label'>ເລກທີບິນ</label>
                        <Input onChange={(e) => Filter(e)} block placeholder="ເລກທີບິນ" />
                    </div>
                </div>

            </div>

            {isLoading ? (
                <div className='row mt-5 p-3'>
                    <div className="col-sm-3">
                        <Placeholder.Paragraph graph="image" className='card p-3' active />
                    </div>
                    <div className="col-sm-3">
                        <Placeholder.Paragraph graph="image" className='card p-3' active />
                    </div>
                    <div className="col-sm-3">
                        <Placeholder.Paragraph graph="image" className='card p-3' active />
                    </div>
                    <div className="col-sm-3">
                        <Placeholder.Paragraph graph="image" className='card p-3' active />
                    </div>
                </div>
            ) : (
                currentItems.length > 0 ? (
                    <>
                        <div className="row p-4 ">
                            {currentItems.map((item, index) => (
                                <div className="col-sm-6 col-md-4 col-xl-3  mb-3">
                                    <div className="card rounded-bottom-0 rounded-top-3 hover-zoom border-0 bg-white"  onClick={()=>handlePrint(item.sale_uuid)}>
                                        <div className="card-background" />
                                        <div className="card-body p-0 mb-3" >
                                            <div className='p-2'>
                                                <table width={'100%'} className='text-nowrap'>
                                                    <tr>
                                                        <td width={'60%'} className='text-yellow-600'>No:{item.sale_billNo}</td>
                                                        <td rowSpan={3} className='text-end' width={'40%'}><img src="assets/img/icon/succes.png" width={'50%'} className='float-end tp-0' alt="" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='text-red'>Date:{moment(item.sale_date).format('DD/MM/YYYY hh:mm')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>ພະນັກງານ:{item.first_name + ' ' + item.last_name}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <hr className='mt-1 mb-1 border-red border-dotted ' />
                                            <div className='text-center fs-18px p-1'>ບິນເງິນສົດ</div>
                                            <div className="px-2">
                                                <table class="items text-nowrap">
                                                    <thead>
                                                        <tr>
                                                            <th class="heading name">ລາຍການ</th>
                                                            <th class="heading qty">ຈຳນວນ</th>
                                                            <th class="heading amount text-end">ລວມເງິນ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.dataList.map((val, key) => (
                                                            <tr className="service" key={key}>
                                                                <td className="itemtext">{val.tile_name + ' ' + val.qty_baht + ' ' + val.option_name} {val.qty_sale_add > 0 ? (<span className='text-green'>+ {val.qty_sale_add}</span>) : ''} </td>
                                                                <td className="valtext text-center">{val.order_qty + ' ' + val.unite_name}</td>
                                                                <td className="valtext text-end">{numeral(val.qty_sale_add > 0 ? val.price_grams * val.qty_gram_add : val.price_sale * val.order_qty).format('0,0')}
                                                                    {val.price_pattern > 0 ? (
                                                                        <>
                                                                            <br />
                                                                            + {numeral(val.price_pattern * val.order_qty).format('0,00')}
                                                                        </>) : ('')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td colspan="2" class="sum-up line tx-l">ລວມທັງໝົດ (Subtota) :</td>
                                                            <td class="line price">{numeral(item.balance_total).format('0,00')} </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" class="sum-up tx-l">ອມພ : %</td>
                                                            <td class="price">{numeral(item.balance_vat).format('0,00')}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colspan="2" class="sum-up bottom tx-l">ລວມເປັນເງິນ :</th>
                                                            <th class="price tx-r bottom">{numeral(item.balance_total).format('0,00')} ₭</th>
                                                        </tr>
                                                        <tr>
                                                            <th colspan="2" class="sum-up  tx-l">ຮັບເງິນສົດ :</th>
                                                            <th class="price tx-r ">{numeral(item.balance_cash).format('0,00')} {item.genus}</th>
                                                        </tr>
                                                        <tr>
                                                            <th colspan="2" class="sum-up  tx-l">ຮັບເງິນໂອນ :</th>
                                                            <th class="price tx-r ">{numeral(item.balance_transfer).format('0,00')} {item.genus}</th>
                                                        </tr>
                                                        {item.balance_return > 0 ? (
                                                            <tr>
                                                                <th colspan="2" class="sum-up bottom tx-l">ເງິນທອນ :</th>
                                                                <th class="price tx-r bottom">{numeral(item.balance_return).format('0,00')} ₭</th>
                                                            </tr>
                                                        ) : ''}
                                                        <tr>
                                                            <td className="line bottom pt-2px" colspan="4"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="zigzag-bottom"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Invoice
                            invoice={billId}
                            show={show}
                            handleClose={() => setShow(false)}
                            showStaff={() => setShowStaff(true)}
                            fetchChart={fetchChart}
                        />
                        <div className='text-center mb-3'>
                            <Pagination
                                prev
                                last
                                next
                                first
                                size="md"
                                total={total}
                                limit={limit}
                                activePage={activePage}
                                onChangePage={setActivePage}
                                onChangeLimit={(newLimit) => {
                                    setLimit(newLimit);
                                    setActivePage(1);
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center bg-white">
                        <img src="./assets/img/icon/file-not.png" className='w-40' alt="" />
                    </div>
                )
            )}
        </div>
    )
}

export default ReportBillsale