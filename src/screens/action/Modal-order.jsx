import React,{useState,useEffect} from 'react'
import Modal from 'react-bootstrap/Modal';
import { InputGroup,InputNumber,Message,useToaster } from 'rsuite';
import {Config, Urlimage } from '../../config/connect';
import numeral from 'numeral';
import axios from 'axios';
const ModalOrder=({dataps,itemPattern,showView,handleClose,fetchItemCart,staff})=> {
    const api=Config.urlApi;
    const img = Urlimage.url;
    const userId = localStorage.getItem('user_uuid')
    const barnchId = localStorage.getItem('branch_Id')

    const [images, setImages] = useState('/assets/img/icon/picture.jpg')
    const [pattern, setPattern] = useState(0);
    const [buyadd, setBuyadd] = useState(0)
  const [orderQty, setOrderQty] = useState('1');
  const confirmOrder = () => {
    const buyAddValue = buyadd > 0 ? (buyadd * dataps.kilogram) : 0;
    const dataOrder = {
      product_id_fk: dataps.product_uuid,
      zone_id_fk: dataps.zone_id_fk,
      price_buy: dataps.price_buy,
      price_sale: dataps.price_sale,
      qty_grams: dataps.grams,
      patternPrice: pattern,
      order_qty: orderQty,
      buy_add: buyAddValue,
      qty_add: buyadd,
      staff_id_fk: staff.staff_uuid,
      user_id_fk: userId
    };

    if (dataps.quantity <= 0) {
      return showMessage('ສິນຄ້າໝົດແລ້ວ ກະລຸນາເລືອກໂຊນອື່ນ', 'error');
    }
    if (staff.staff_uuid) {
      axios.post(api + 'order/create', dataOrder)
        .then(function (res) {
          if (res.status === 200) {
            showMessage(res.data.message, 'success');
            fetchItemCart();
            setPattern(0);
            setIsVisible(false);
            setOrderQty('1')
            handleClose();
          } else {
            showMessage(res.data.message, 'error');
          }
        }).catch(function () {
          showMessage('ການເພີມສິນຄ້າໄດ້ການຜິດພາດ ທາງລະບົບ', 'error');
        });
    } else {
    //   setShow(true);
    }
  }


  const [isVisible, setIsVisible] = useState(false);
  const handleToggle = () => {
    setIsVisible(!isVisible);
    setBuyadd(0)
  };
  


  // ===================== \\

  const toaster = useToaster();
  // const [placement, setPlacement] = useState('topEnd');
  const showMessage = (messName, notifi) => {
    const message = (
      <Message showIcon type={notifi} closable>
        <strong>ຢືນຢັນ! </strong> {messName}
      </Message>
    );
    toaster.push(message, { placement: 'topEnd' });
  };
  return (
    <>
     <Modal size='lg' show={showView} onHide={handleClose} animation={false} className=' modal-pos'>
        <Modal.Body className='p-0'>
          <span role='button' onClick={handleClose} class="btn-close position-absolute top-0 end-0 m-4"></span>
          <div class="modal-pos-product">
            <div class="modal-pos-product-img">
              <div
                className="img"
                style={{ backgroundImage: `url('${dataps.file_image !== '' ? img + 'pos/' + dataps.file_image : images}')` }}
              />
            </div>
            <div class="modal-pos-product-info">
              <div class="fs-4 fw-bold">{dataps.tile_name + ' ' + dataps.qty_baht + ' ' + dataps.option_name} ( {dataps.code_id} )</div>
              <div class="fs-6 text-body text-opacity-50 mb-2">
                {dataps.zone_name} / ນ້ຳໜັກ: {dataps.grams} ກຣາມ
              </div>
              <div class="fs-3 fw-bolder mb-3">{numeral(dataps.grams * dataps.price_sale).format('0,00')} ກີບ</div>
              <div class="option-row">
                <div class="d-flex mb-3">
                  <button type='button' onClick={() => setOrderQty(prevQty => Math.max(parseInt(prevQty) - 1, 1))} class="btn btn-danger btn-sm d-flex align-items-center"><i class="fa fa-minus"></i></button>
                  <input type="text" class="form-control w-40px fw-bold  px-0 mx-2 text-center border-0" name="qty" value={orderQty > 0 ? orderQty : '1'}
                    onChange={(e) => setOrderQty(Math.max(parseInt(e.target.value), 1))} />
                  <button type='button' onClick={() => setOrderQty(prevQty => parseInt(prevQty) + 1)} class="btn btn-green btn-sm d-flex align-items-center"><i class="fa fa-plus"></i></button>
                  <button type='button' onClick={handleToggle} class="btn btn-default btn-sm d-flex align-items-center ms-3 me-2"> {isVisible === true ? (<i class="fa-solid fa-minus text-red" />) : (<i class="fa-solid fa-ellipsis-vertical" />)} </button>
                  {isVisible && <InputGroup inside size="sm" style={{ width: '160px' }} >
                    <InputGroup.Addon>ຊື້ເພີ່ມ</InputGroup.Addon>
                    <InputNumber size="sm" onChange={(e) => setBuyadd(e)} defaultValue="0" />
                  </InputGroup>}
                </div>

              </div>
              <hr />
              <div class="mb-3">
                <div class="fw-bold fs-6">ລາຍ</div>
                <div class="option-list">
                  <div class="option " >
                    <input type="radio" id="size" name="size[]" onChange={() => setPattern('0')} class="option-input" />
                    <label class="option-label bg-black-100" for="size" role='button'>
                      <span class="option-text">ບໍ່ມີຄ່າລາຍ</span>
                      <span class="option-price">+0.00</span>
                    </label>
                  </div>
                  {itemPattern.map((item, key) => (
                    <div key={key} class="option" role='button'>
                      <input type="radio" id={`size${key + 1}`} name='size[]' onChange={() => setPattern(item.pattern_pirce)} class="option-input" />
                      <label class="option-label" for={`size${key + 1}`} role='button'>
                        <span class="option-text">{item.pattern_name}</span>
                        <span class="option-price">+{numeral(item.pattern_pirce).format('0,00')}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <hr />
              <div class="row gx-3">
                <div class="col-4">
                  <button type='button' class="btn btn-danger w-100 fs-14px rounded-3 fw-bold mb-0 d-block py-3" onClick={handleClose}>ຍົກເລີກ</button>
                </div>
                <div class="col-8">
                  <button type='button' onClick={confirmOrder} class="btn btn-blue w-100 fs-14px rounded-3 fw-bold d-flex justify-content-center align-items-center py-3 m-0">ເພີ່ມກະຕ່າ </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default ModalOrder