import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import { Input, Message, useToaster, InputGroup, InputPicker, SelectPicker } from 'rsuite';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connect';
import Alert from '../../utils/config';
import numeral from 'numeral';
import Invoice from '../../invoice/bill-invoice';
// import Swal from 'sweetalert2';
import { useStaff, useOption,useProvince,useDistrict } from '../../utils/selectOption';

import ReactToPrint from 'react-to-print';
import Select from 'react-select'
import { RadioTile, RadioTileGroup, useMediaQuery } from 'rsuite';
import { useRate } from '../../utils/selectOption';
import ModalOrder from './Modal-order';
import PrintBillTest from './print-billTest';

function FormSale() {
  const api = Config.urlApi;
  const img = Urlimage.url;
  const itemOption = useOption();
  const itemPv = useProvince();


const [idpv,setIdpv]=useState(null);
const handleProvice=(value)=>{
  setOrder({
    ...order,district_id_fk:null
  })
  setIdpv(value)
}
  const itemDistrict=useDistrict(idpv)

  const { dataList } = useRate()
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(`/home`);
  }


  const [showBill, setShowBill] = useState(false);
  const itemStaff = useStaff();
  const userId = localStorage.getItem('user_uuid')
  const barnchId = localStorage.getItem('branch_Id')
  const inputRef = useRef(null);
  const [itemZone, setItemZone] = useState([]);
  const fetchZone = async () => {
    try {
      const response = await fetch(api + 'zone/');
      const jsonData = await response.json();
      setItemZone(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const [showpay, setShowPay] = useState(false);
  const [showStaff, setShowStaff] = useState(true);
  const handleClose = () => {
    setCheckUser(1)
    // setShow(false);
  }

  const handleModal = (index) => {
    setShowStaff(index);
  }
  const [datasaerch, setDatasearch] = useState({
    userSale_id: ''
  })
  const headleCheng = (name, value) => {
    setDatasearch({
      ...datasaerch, [name]: value
    })
  }

  const [staffId, setStaffId] = useState('')
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    staff_uuid: '',
    id_code: '',
    village_name: '',
    district_name: '',
    province_name: '',
    branch_name: '',
    branch_tel: '',
    branch_logo: 'assets/img/logo/logo.png',
  })

  const handleChangeStaff = async (value) => {
    try {
      const response = await fetch(api + 'staff/search/' + value);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      if (res) {
        setShowStaff(false);
        setData({
          first_name: res.first_name || '',
          last_name: res.last_name || '',
          staff_uuid: res.staff_uuid || '',
          id_code: res.id_code || '',
          village_name: res.village_name,
          district_name: res.district_name,
          province_name: res.province_name,
          branch_name: res.branch_name,
          branch_tel: res.branch_tel,
          branch_logo: res.branch_logo,
        });
        setStaffId(res.staff_uuid || '');
      } else {
        console.error('No data found in response:', res);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [error, setError] = useState(false);
  const heandleSearch = (e) => {
    e.preventDefault();
    axios.post(api + 'staff/search', datasaerch)
      .then(function (res) {
        if (res.status === 200) {
          setShowStaff(false);
          setError(false)
          setData({
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            staff_uuid: res.data.staff_uuid,
            id_code: res.data.id_code
          })
          setStaffId(res.data.staff_uuid)
        } else {
          alert(res.data.message || 'An error occurred');
        }
      })
      .catch(function (error) {
        setError(true)
      });
  }

  // const [check, setCheck] = useState(false);
  // const openSearch = (index) => {
  //   setCheck(index);
  // }
  const [active, setActive] = useState('')
  const [datasearch, setDataSearch] = useState({
    zoneId: '',
    posductName: ''
  })
  const handleCheck = (name, value) => {
    setDataSearch({
      ...datasearch, [name]: value// Reset posductName
    });
    setActive(value);
    fetchStockPorduct();
  };

  const handleCheckAll = () => {
    setDataSearch({
      zoneId: '',
      posductName: ''
    });
    setActive('')
  }

  const [filterName, setFilterName] = useState([])
  const [itempos, setItemProduct] = useState([]);
  const fetchStockPorduct = async () => {
    try {
      const response = await axios.post(api + 'posd/itemsale', datasearch);
      const jsonData = response.data;
      setItemProduct(jsonData);
      setFilterName(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  }
  const Filter = (event) => {
    setItemProduct(filterName.filter(n =>
      n.tile_name.toLowerCase().includes(event.toLowerCase()) || // Filter by tile_name
      n.code_id.toLowerCase().includes(event.toLowerCase()) // Filter by code_id
    ));
  }


  const hanchBranch = (event) => {
    if (event === '' || event === null) {
      setItemProduct(filterName);
    } else {
      setItemProduct(filterName.filter(n =>
        n.option_id_fk.toLowerCase().includes(event.toLowerCase())
      ));
    }
  }


  const [images, setImages] = useState('/assets/img/icon/picture.jpg')
  const heandlePlus = (id) => {
    axios.get(api + `order/pluscart/${id}`).then(function (resp) {
      if (resp.status === 200) {
        fetchItemCart();
        showMessage(resp.data.message, 'success');
      } else {
        showMessage(resp.data.message, 'error');
      }
    }).catch(function () {
      showMessage('ການດຳເນີນງານລົມເຫລວ', 'error')
    });
  }

  const heandleMinus = (id) => {
    axios.get(api + `order/minuscart/${id}`)
      .then(function (resp) {
        if (resp.status === 200) {
          fetchItemCart();
          showMessage(resp.data.message, 'success');
        } else {
          showMessage(resp.data.message, 'error');
        }
      }).catch(function () {
        showMessage('ການດຳເນີນງານລົມເຫລວ', 'error')
      });
  }

  const heandleDel = (id) => {
    axios.get(api + `order/delcart/${id}`)
      .then(function (resp) {
        if (resp.status === 200) {
          fetchItemCart();
          showMessage(resp.data.message, 'success');
        } else {
          showMessage(resp.data.message, 'error');
        }
      }).catch(function () {
        showMessage('ການດຳເນີນງານລົມເຫລວ', 'error')
      });
  }

  const [dataps, setDataps] = useState({})
  const [patternList, setPatternList] = useState([]);
  const addOrderCart = (item) => {
    modalView(true)
    setDataps(item);
    if (item.patternList) {
      setPatternList(item.patternList);
    }

  }

  //========= off add order ============ \\
  const [itemcart, setItemCart] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalPattern, setTotalPattern] = useState(0);
  const [balanceTotal, setBalanceTotal] = useState(0)

  const [totalBalancePay, setTotalBalancePay] = useState(0)

  const fetchItemCart = async () => {
    try {
      const response = await axios.get(api + 'order/itemcart/' + staffId);
      const jsonData = response.data;
      setItemCart(jsonData);
      const items = jsonData.map(item => ({
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
      // const balance = jsonData.reduce((acc, val) => acc + parseFloat(val.price_sale * (val.qty_add > 0 ? val.qty_grams: val.qty_grams * val.order_qty)), 0);
      const balance = jsonData.reduce((acc, val) => {
        const quantity = val.qty_add > 0 ? val.grams_add : val.qty_grams * val.order_qty;
        return acc + parseFloat(val.price_sale * quantity);
      }, 0);
      const bnPattern = jsonData.reduce((acc, val) => acc + parseFloat(val.price_pattern * val.order_qty * val.qty_baht), 0);
      setTotalBalance(balance);
      setTotalPattern(bnPattern);
      setBalanceTotal(balance + bnPattern);
      setTotalBalancePay(balance + bnPattern);

      setOrder(prevOrder => ({
        ...prevOrder,
        staff_id_fk: staffId,
        items: items,
        balance_total: balance + bnPattern,
        balance_totalpay: balance + bnPattern
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGetSale = (index) => {
    setShowPay(index);
  };

  //=============================

  const [order, setOrder] = useState({
    user_id_fk: userId,
    staff_id_fk: staffId,
    branch_id_fk: barnchId,
    customId: '',
    bill_shop: '',
    cus_fname: '',
    cus_lname: '',
    cus_tel: '',
    district_id_fk:'',
    villageName: '',
    cus_remark: '',
    sale_remark: '',
    balance_total: '0',
    total_grams: '0',
    balance_cash: '0',
    balance_transfer: '0',
    balance_payment: '0',
    balance_return: '0',
    currency_id_fk: 22001,
    rate_price: 1,
    balance_totalpay: 0,
    items: []
  });
  const [search, setSearch] = useState(false)

  const handleChange = (name, value) => {
    setOrder({
      ...order, [name]: value
    })

    if (name === 'cus_tel' && value) {
      setSearch(true);
      setItemCust([])
    } else {
      setSearch(false);
    }
    setDatacust({
      cusTel: value
    });
  }


  //==================== ບັນທຶກການຈ່າຍ
  const [print, setPrint] = useState(false);
  const [invoice, setInvoice] = useState('');

  const handlePayment = () => {
    axios.post(api + 'order/payment', order).then(function (res) {
      if (res.status === 200) {
        setStaffId('');
        setInvoice(res.data.id);
        setData({
          first_name: '',
          last_name: '',
          staff_uuid: '',
          id_code: '',
        })
        setItemCart([])
        setShowPay(false);
        setOrder({
          bill_shop: '',
          alance_total: '0',
          total_grams: '0',
          balance_cash: '0',
          balance_transfer: '0',
          balance_payment: '0',
          balance_return: '0',
          rate_price: 1,
          balance_totalpay: 0,
          currency_id_fk: 22001,
        })
        setBalanceReturn(0);
        setPrint(true);
        setShowBill(true)
      } else {
        showMessage(res.data.message, 'error');
      }
    }).catch(function () {
      Alert.errorData('ການດຳເນິນງານບໍ່ສຳເລັດ')
    });
  }

  //==========================
  const [balanceCash, setBalanceCash] = useState(0);
  const [balanceTransfer, setBalanceTransfer] = useState(0);
  const [balanceReturn, setBalanceReturn] = useState(0);
  const [ratePrice, setRatePrice] = useState(1)
  // const balancePayment = balanceCash + balanceTransfer;
  // const [balancePayment, setBalancePayment] = useState(0); // Assuming this is set elsewhere in your code


  const handleCashChange = (name, value) => {
    const newAmount = parseFloat(value.replace(/,/g, ''));
    setBalanceCash(isNaN(newAmount) ? 0 : newAmount);

    // setBalancePayment(newAmount + parseFloat(balanceTransfer));

    if ((newAmount + balanceTransfer) > totalBalancePay) {
      setBalanceReturn((newAmount + balanceTransfer) - totalBalancePay);
    } else {
      setBalanceReturn(0);
    }

    if (newAmount >= totalBalancePay) {
      setBalanceTransfer(0);
      setCheckOnly('readOnly');
      setOrder(prevOrder => ({
        ...prevOrder, balance_transfer: 0,
      }));
    } else {
      setCheckOnly('');
    }

    setOrder(prevOrder => ({
      ...prevOrder, [name]: value,
    }));
  };


  //================
  const handleTransferChange = (name, value) => {
    const newTransfer = parseFloat(value.replace(/,/g, ''));
    setBalanceTransfer(isNaN(newTransfer) ? 0 : parseInt(newTransfer));
    // setBalancePayment(newTransfer + parseFloat(balanceCash));
    if (newTransfer + parseFloat(balanceCash) > totalBalancePay) {
      setBalanceReturn(newTransfer + parseFloat(balanceCash) - totalBalancePay);
    } else {
      setBalanceReturn(0);
    }

    setOrder({
      ...order, [name]: value
    });
  };
  //============= search customer 
  const [datacust, setDatacust] = useState({
    cusTel: ''
  })

  const [activeShow, setActiveShow] = useState('');
  const [itemCust, setItemCust] = useState([]);
  const handleSearchCust = async () => {
    try {
      const response = await axios.post(api + 'customer/search/', datacust);
      const jsonData = response.data;
      setItemCust(jsonData);
      if (jsonData.length > 0) {
        setActiveShow('show')
      } else {
        setActiveShow('');
        setOrder({
          ...order,
          customId: '',
          cus_fname: '',
          cus_lname: '',
          cus_tel: '',
          villageName: '',
        });
      }
    } catch (error) {
      setOrder({
        ...order,
        customId: '',
        cus_fname: '',
        cus_lname: '',
        cus_tel: '',
        villageName: '',
      });
      console.error('Error fetching data:', error);
    }
  };


  const handleUsecust = (item) => {
    setOrder({
      ...order,
      customId: item.cus_uuid,
      cus_fname: item.cus_fname,
      cus_lname: item.cus_lname,
      cus_tel: item.cus_tel,
      villageName: item.villageName,
      district_id_fk:item.district_id_fk
    });
    setIdpv(item.province_id_fk)
    setActiveShow('')
  }

  // ===================== \\

  const toaster = useToaster();
  const showMessage = (messName, notifi) => {
    const message = (
      <Message showIcon type={notifi} closable>
        <strong>ຢືນຢັນ! </strong> {messName}
      </Message>
    );
    toaster.push(message, { placement: 'topEnd' });
  };

  const [checkOnly, setCheckOnly] = useState('');
  //====================
  const [showView, setShowView] = useState(false);
  const modalView = (index) => {
    setShowView(index)
  }


  //======================
  useEffect(() => {
    fetchStockPorduct();
    fetchZone();
    fetchItemCart();
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
  }, [datasearch, userId, barnchId, data, staffId])

  const [checkUser, setCheckUser] = useState(1)

  const checkUseFrom = (index) => {
    setCheckUser(index)
  }


  //=============== ນຳໃຊ້ເລດເງິນ 
  const [isInline] = useMediaQuery('xl');
  const [activeRate, setActiveRate] = useState(22001);
  const [currencyName, setCurrencyName] = useState('LA');
  const [genus, setGenus] = useState('₭');
  const handleRateChange = (newValue) => {
    setActiveRate(newValue);
    const useRate = dataList.find(item => item.currency_id === newValue);
    if (useRate) {
      const updatedTotalBalancePay = balanceTotal / useRate.reate_price;
      setTotalBalancePay(updatedTotalBalancePay);
      setGenus(useRate.genus);
      setCurrencyName(useRate.currency_name);
      setRatePrice(useRate.reate_price)
      setOrder({
        ...order, currency_id_fk: newValue,
        rate_price: useRate.reate_price,
        balance_totalpay: updatedTotalBalancePay,
        balance_cash: 0,
        balance_transfer: 0,
        balance_return: 0
      });

      setBalanceReturn(0)
      setBalanceTransfer(0)
      setBalanceCash(0)
    }

  };
  const itemcartOrder = useRef();
  const [isPrintVisible, setPrintVisible] = useState(false);

  return (
    <>
      <div id="app" className="app app-content-full-height app-without-sidebar app-without-header">
        <div id="content" className="app-content p-0">
          <div className="pos pos-with-menu pos-with-sidebar" id="pos">
            <div className="pos-menu">
              <div className="logo text-center">
                <a href='home' >
                  <div className="logo-img ">
                    <img src="/assets/img/logo/logo.png" className="w-60" alt="" />
                  </div>
                  <div className="logo-text">ຮ້ານຄຳ ວຽງຄຳ</div>
                </a>
              </div>
              <div className="nav-container">
                <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <span role='button' onClick={() => handleCheckAll()} className={`nav-link  ${active === '' ? 'active' : ''}`} >
                        <div className="nav-icon">
                          <i className="fa-solid fa-fw fa-dumpster" />
                        </div>
                        <div className="nav-text">ລວມທັງໝົດ</div>
                      </span>
                    </li>
                    {itemZone.map((val, key) =>
                      <li className="nav-item ">
                        <span role='button' onClick={() => handleCheck('zoneId', val.zone_Id)} className={`nav-link text-${val.bg_color} ${active === val.zone_Id ? 'active' : ''}`} >
                          <div className="nav-icon ">
                            <img src="/assets/img/icon/109970.png" width={50} alt="" />
                          </div>
                          <div className={`nav-text fs-14px text-${val.bg_color}`}>{val.zone_name} </div>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pos-content">
              <div className='sticky-top bg-vk px-2 p-1 mt-1 rounded-3 me-2 ms-2 nav-container' >
                <div className="row ">
                  <div className="col-5 col-sm-3">
                    <InputGroup className='border-0'>
                      <InputGroup.Button onClick={handleBack} color="blue" appearance="primary" className='me-2 rounded'>
                        <i class="fa-solid fa-circle-arrow-left fs-4"></i>
                      </InputGroup.Button>
                      <InputPicker data={itemOption} onChange={(e) => hanchBranch(e)} placeholder='ປະເພດນ້ຳໜັກ' />
                    </InputGroup>
                  </div>
                  <div className="col-7 col-sm-9">
                    <InputGroup inside>
                      <InputGroup.Addon>
                        <i className='fas fa-search' />
                      </InputGroup.Addon>
                      <Input ref={inputRef} onChange={(e) => Filter(e)} placeholder='ຄົ້ນຫາ ຊື່ສິນຄ້າ/ ລະຫັດສິນຄ້າ' />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div className="pos-content-container h-100">
                <div className="product-row">
                  {itempos.map((item, index) =>
                    <div className="product-container" >
                      <a href="javascript:;" onClick={() => addOrderCart(item)}
                        className={`product ${item.quantity <= 0 ? 'not-available ' : ''}`} >
                        <div className="img"
                          style={{
                            backgroundImage: `url('${item.file_image !== '' ? img + 'pos/' + item.file_image : images}')`
                          }} >
                          <span className={`badge bg-${item.bg_color}  rounded-bottom-0 rounded-end-b`}>{item.zone_name}</span>
                        </div>
                        <div className="text">
                          <div className="title">{item.tile_name} ( {item.code_id}  )</div>
                          <div className="price text-danger">{item.qty_baht}/{item.option_name}</div>
                          {item.quantity <= 0 && (
                            <div className="not-available-text">
                              <div>ສິນຄ້າໝົດ</div>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pos-sidebar">
              <div className="h-100 d-flex flex-column p-0">
                <div className="pos-sidebar-header ">
                  <div className="back-btn">
                    <button type="button"
                      data-dismiss-class="pos-sidebar-mobile-toggled" data-target="#pos"
                      className="btn border-0" >
                      <i className="fa fa-chevron-left" />
                    </button>
                  </div>
                  <div className="icon ">
                    <i className="fa-solid fa-user-tie text-white"></i>
                  </div>
                  <div className="title">{data.first_name + ' ' + data.last_name}</div>
                  <div className="order bg-orange">
                    ID: <b>{data.id_code} </b>
                  </div>
                </div>
                <div className="pos-sidebar-nav"> </div>
                <div className="pos-sidebar-body "
                  data-scrollbar="true"
                  data-height="100%" >
                  <div className="pos-table">
                    {
                      itemcart.length > 0 ? (
                        itemcart.map((val, index) =>
                          <div key={index} className="row pos-table-row py-2">
                            <div className="col-9">
                              <div className="pos-product-thumb">
                                <div className="img"
                                  style={{ backgroundImage: `url('${val.file_image !== '' ? img + 'pos/' + val.file_image : images}')` }} />
                                <div className="info">
                                  <div className="title">{val.tile_name} ( {val.qty_baht} {val.option_name}) {val.qty_sale_add > 0 ? (<span className='text-green'>+ {val.qty_sale_add} </span>) : ''}</div>
                                  {val.price_pattern > 0 ? (
                                    <div className='desc text-green'>+{numeral((val.price_pattern * val.order_qty) * val.qty_baht).format('0,00')}</div>
                                  ) : ('')}

                                  <div className="single-price">ໂຊນ: <span className=' text-primary'> {val.zone_name}</span></div>
                                  <div className="input-group qty">
                                    <div className="input-group-append">
                                      <span role='button' onClick={() => heandleMinus(val.cart_id)} className={`btn btn-danger ${val.qty_add > 0 ? 'disabled' : ''}`}>
                                        <i className="fa fa-minus" />
                                      </span>
                                    </div>
                                    <input type="text" className="form-control" value={val.order_qty} />
                                    <div className="input-group-prepend">
                                      <span role='button' onClick={() => heandlePlus(val.cart_id)} className={`btn btn-success ${val.qty_add > 0 ? 'disabled' : ''}`}>
                                        <i className="fa fa-plus" />
                                      </span>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-3 total-price">
                              <div>
                                <span role='button' onClick={() => heandleDel(val.cart_id)} className="btn btn-xs btn-danger">
                                  <i className="fa-solid fa-trash"></i>
                                </span>
                              </div>
                              <div>
                                {val.grams_add > 1 ? (<s> {numeral(((val.price_sale * val.qty_grams) * val.order_qty) + ((val.price_pattern * val.order_qty) * val.qty_baht)).format('0,00')}</s>) : (
                                  numeral(((val.price_sale * val.qty_grams) * val.order_qty) + ((val.price_pattern * val.order_qty) * val.qty_baht)).format('0,00')
                                )}
                                <div> {val.grams_add > 0 ? (
                                  numeral(((val.price_sale * val.grams_add) * val.order_qty) + ((val.price_pattern * val.order_qty) * val.qty_baht)).format('0,00')
                                ) : ''}</div>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        <>
                          <div className='text-center mt-5'>
                            <img src="assets/img/icon/emptyCart.png" className='mt-3 w-70' alt="" />
                          </div>
                        </>
                      )
                    }
                  </div>
                  {/* </div> */}

                </div>
                <div className="pos-sidebar-footer">
                  <div className="d-flex align-items-center mb-2">
                    <div> ທັງໝົດ</div>
                    <div className="flex-1 text-end h6 mb-0">{numeral(totalBalance).format('0,00')}</div>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div> ລວມຄ່າລາຍ</div>
                    <div className="flex-1 text-end h6 mb-0">{numeral(totalPattern).format('0,00')}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div>ອາກອນ (0%)</div>
                    <div className="flex-1 text-end h6 mb-0">0.00</div>
                  </div>
                  <hr className="opacity-1 my-10px" />
                  <div className="d-flex align-items-center mb-2">
                    <div>ລວມທັງໝົດ</div>
                    <div className="flex-1 text-end h4 mb-0 text-gold fw-bold">{numeral(totalBalance + totalPattern).format('0,00')}</div>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <button type='button' onClick={() => handleModal(true)} className="btn btn-danger rounded-3 text-center me-10px w-70px"  >
                      <i className="fa-solid fa-user-tie d-block fs-18px my-1"></i> ພະນັກງານ
                    </button>
                    <ReactToPrint
                      trigger={() =>
                        <button type='button' disabled={itemcart.length > 0 ? false : true} className="btn btn-green rounded-3 text-center me-10px w-70px" >
                          <i className="fa fa-receipt d-block fs-18px my-1" /> ພີມບິນ
                        </button>
                      }
                      content={() => itemcartOrder.current}
                      onBeforeGetContent={() => {
                        setPrintVisible(true);
                        return new Promise((resolve) => {
                          setTimeout(resolve, 300);
                        });
                      }}
                      onAfterPrint={() => {
                        setPrintVisible(false);
                      }}
                    />
                    <button type='button' onClick={() => handleGetSale(true)} className={`btn btn-blue rounded-3 text-center flex-1 ${itemcart.length > 0 ? '' : 'disabled'}`}  >
                      <i className="fa-solid fa-hand-holding-dollar d-block fs-18px my-1"></i>
                      ຮັບເງິນ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a href='#'
            class="pos-mobile-sidebar-toggler" data-toggle-class="pos-sidebar-mobile-toggled" data-target="#pos" >
            <i className="fa-solid fa-cart-plus fs-25px iconify display-6" ></i>
            <span className="badge">{itemcart.length}</span>
          </a>
        </div>
      </div>


      {print && (
        <div id="printableArea">
          <Invoice
            show={showBill}
            handleClose={() => setShowBill(false)}
            invoice={invoice}
            showStaff={() => setShowStaff(true)}
            fetchChart={fetchItemCart} />
        </div>
      )}
      {isPrintVisible === true && (
        <PrintBillTest
          ref={itemcartOrder}
          cartData={itemcart}
          data={data}
        />

      )}
      <Modal show={showStaff} backdrop="static" centered onHide={handleClose}>
        <Modal.Body className='p-3'>
          <div className="row pt-3">
            <div className="col-sm-12 ">
              <form onSubmit={heandleSearch}>
                <div className=" text-center mb-4">
                  <img src="/assets/img/user/user.png" alt="" className="mw-100 w-120px rounded-pill " />
                </div>
                <div className="from-group text-center mb-4">
                  <label htmlFor="" className='form-label fs-16px'>ລະຫັດພະນັກງານ</label>
                  {checkUser === 1 ? (
                    <InputGroup inside size='lg'>
                      <InputGroup.Button onClick={() => checkUseFrom(2)}>
                        <i className='fas fa-user text-red' />
                      </InputGroup.Button>
                      <Input size='lg'  ref={inputRef} autoFocus onChange={(e) => headleCheng('userSale_id', e)} className='text-center' placeholder='||||||||||||||||||||||||||||' autoComplete="off" required />
                    </InputGroup>
                  ) : checkUser === 2 && (
                    <div className='row' >
                      <Select size='lg' ref={inputRef} options={itemStaff} onChange={(e) => handleChangeStaff(e.value)} className='text-start col-11' placeholder='ເລອກພະນັກງານ' required />
                      <button type='button' onClick={() => checkUseFrom(1)} class="btn btn-red col-1" ><i class="fa-solid fa-xmark mt-1 fs-5" /></button>
                    </div>
                  )}

                </div>

              </form>
              <p className='text-center mb-2'><a href='home' className='text-h-red'><i className="fa-solid fa-hand-point-left"></i>  ຍ້ອນກັບ</a></p>
              {error === true && (
                <div className="alert alert-warning alert-dismissible fade show mb-0">
                  <i className="fa-solid fa-circle-exclamation fa-xl"></i> ລະຫັດພະນັກງານບໍ່ຖຶກຕ້ອງ
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        {/* )} */}
      </Modal>


      <Modal show={showpay} size='xl' backdrop="static" className='modal-pos' centered  >
        <Modal.Body className='p-0'>
          <>
            <a href="javascript:;" onClick={() => handleGetSale(false)} className="btn-close position-absolute top-0 end-0 m-4" />
            <div className="modal-pos-product">
              <div className="modal-pos-product-img p-3 border-end border-2">
                <div className="fs-4 fw-bold"><i className="fa-solid fa-users me-2 text-danger"></i> ຂໍ້ມູນລູກຄ້າ</div>
                <hr className='mt-2' />
                <div className="row">
                  <div className="col-sm-12 mb-2">
                    <div className="from-groupmb-4" >
                      <label htmlFor="" className='form-label fs-14px'>ເບີໂທລະສັບ</label>
                      <InputGroup>
                        <Input type="tel" className='' value={order.cus_tel} onChange={(e) => handleChange('cus_tel', e)} placeholder='ເບໂທລະສັບ' />
                        {search && (
                          <InputGroup.Button onClick={handleSearchCust}>
                            <i className="fas fa-search"></i>
                          </InputGroup.Button>
                        )}
                      </InputGroup>
                      <ul className={`dropdown-menu dropdown-menu-end ${activeShow}`}>
                        {
                          itemCust.length > 0 ? (
                            itemCust.map((role, key) => (
                              <li role='button' key={key} onClick={() => handleUsecust(role)} className='dropdown-item text-h-red'><i className="fa-solid fa-phone"></i> : {role.cus_tel} / {role.cus_fname + ' ' + role.cus_lname}</li>
                            ))
                          ) : ('')}
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-6 col-6 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ຊື່ລູກຄ້າ</label>
                      <Input type="text" className='' value={order.cus_fname} onChange={(e) => handleChange('cus_fname', e)}  placeholder='ຊື່ລູກຄ້າ' />
                    </div>
                  </div>
                  <div className="col-sm-6 col-6 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ນາມສະກຸນ</label>
                      <Input type="text" value={order.cus_lname} onChange={(e) => handleChange('cus_lname', e)} placeholder='ນາມສະກຸນ' />
                    </div>
                  </div>
                  <div className="col-sm-6 col-6 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ແຂວງ</label>
                      <Select options={itemPv} value={itemPv.find(obj => obj.value === idpv)} onChange={(e) => handleProvice(e.value)} block placeholder="ເລືອກແຂວງ"  />
                    </div>
                  </div>
                  <div className="col-sm-6 col-6 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ເມືອງ</label>
                      <Select options={itemDistrict}  value={itemDistrict.find(obj => obj.value === order.district_id_fk)} onChange={(e) => handleChange('district_id_fk', e.value)} block placeholder="ເລືອກເມືອງ"  />
                    </div>
                  </div>

                

                  <div className="col-sm-12 mb-2">
                    <div className="from-groupmb-4">
                      <label htmlFor="" className='form-label fs-14px'>ບ້ານ</label>
                      <Input className='py-3  fs-14px' value={order.villageName} onChange={(e) => handleChange('villageName', e)}  placeholder='ບ້ານ' />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-pos-product-info">
                <RadioTileGroup defaultValue={activeRate} inline={isInline} onChange={handleRateChange} aria-label="1" className='py-1 my-1'>
                  {dataList.map((rete, key) =>
                    <RadioTile icon={<img src={`./assets/img/flag/${rete.currency_icon}`} className='w-30px' />} label={rete.currency_name + ' (' + rete.genus + ')'} value={rete.currency_id} className='py-1 '>
                      {numeral(rete.reate_price).format('0,00')}
                    </RadioTile>
                  )}
                </RadioTileGroup>
                <hr className='mt-1' />
                <div className="option-list mb-2">
                  <div className="table-responsive w-100">
                    <table className='table text-nowrap w-100'>
                      <body>
                        {itemcart.map((val, index) =>
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
                          <td colSpan={4} className='text-end'>ລວມຍອດທັງໝົດ :</td>
                          <td className='text-end text-danger'>{itemcart.reduce((acc, val) => acc + parseFloat((val.qty_add > 0 ? val.grams_add : val.qty_grams) * val.order_qty), 0)} g</td>
                          <td colSpan={2} className='text-end text-gold bg-black'>{numeral(totalBalance + totalPattern).format('0,00')} ₭</td>
                        </tr>
                        {activeRate !== 22001 && (
                          <tr>
                            <td colSpan={4} className='text-end fs-16px'>ຍອດເງິນທີ່ຕ້ອງຈ່າຍ ({currencyName}):</td>
                            <td></td>
                            <td colSpan={2} className='text-end text-gold bg-vk fs-18px'>{numeral(totalBalancePay).format('0,00.00')} {genus}</td>
                          </tr>
                        )}
                      </body>
                    </table>
                  </div>
                </div>
                <div className="row fs-16px">
                  <div className="col-sm-6 col-6 mb-2">
                    <label htmlFor="" className='form-label'>ຮັບເງິນສົດ </label>
                    <InputGroup inside className='bg-lime-100'>
                      <Input type='tel' size='lg' value={numeral(order.balance_cash).format('0,00')} onChange={(e) => handleCashChange('balance_cash', e)} className='bg-lime-100' placeholder='0.00' />
                      <InputGroup.Addon> {genus}</InputGroup.Addon>
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 col-6 mb-2">
                    <label htmlFor="" className='form-label'>ຮັບເງິນໂອນ</label>
                    <InputGroup inside className='bg-lime-100'>
                      <Input type='tel' size='lg' value={numeral(order.balance_transfer).format('0,00')} onChange={(e) => handleTransferChange('balance_transfer', e)} className='bg-lime-100' readOnly={checkOnly} placeholder='0.00' />
                      <InputGroup.Addon> {genus}</InputGroup.Addon>
                    </InputGroup>
                  </div>
                  <div className="col-sm-8 col-6 mb-2">
                    <label htmlFor="" className='form-label'>ເງິນທອນ</label>
                    <InputGroup inside className='bg-orange-100'>
                      <Input size='lg' value={numeral(order.balance_return = (balanceReturn * ratePrice)).format('0,00')} placeholder='0.00' className='bg-orange-100' readOnly />
                      <InputGroup.Addon> ₭</InputGroup.Addon>
                    </InputGroup>
                  </div>
                  <div className="col-sm-4 col-6 mb-2 text-center">
                    <label htmlFor="" className='form-label'>ບິນຮ້ານ</label>
                    <Input size='lg' onChange={(e) => handleChange('bill_shop', e)} placeholder='0x-xxxx' className='bg-dark text-center text-white' />
                  </div>
                  <div className="col-sm-12">
                    <label htmlFor="" className='form-label'>ໝາຍເຫດ</label>
                    <input type="text" value={order.total_grams = itemcart.reduce((acc, val) => acc + parseFloat(val.qty_grams * val.order_qty), 0)} className='hide' />
                    <Input name="sale_remark" onChange={(e) => handleChange('sale_remark', e)} id="" className='fs-14px py-3' placeholder='ໝາຍເຫດ' />
                  </div>
                </div>
                <hr />
                <div className="row gx-3">
                  <div className="col-4">
                    <button type='button' onClick={() => handleGetSale(false)} className="btn btn-danger w-100 fs-14px rounded-3 fw-bold mb-0 d-block py-3"  >
                      <i className="fa-solid fa-rotate-left"></i> ຍົກເລິກ
                    </button>
                  </div>
                  <div className="col-8">
                    <button type='submit' onClick={handlePayment} className="btn btn-green w-100 fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0">
                      ບັນທຶກຂາຍ <i className="fa fa-check ms-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Modal.Body>
      </Modal>

      <ModalOrder
        dataps={dataps}
        itemPattern={patternList}
        showView={showView}
        handleClose={() => setShowView(false)}
        staff={data}
        fetchItemCart={fetchItemCart} />
    </>
  )
}

export default FormSale.bind({})