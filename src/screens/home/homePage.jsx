import React, { useEffect, useState, } from "react";
import { Config, Urlimage } from "../../config/connect";
import axios from "axios";
import numeral from 'numeral';
import { Placeholder, Loader, SelectPicker } from 'rsuite';
import { LineChart, LineChartBuy,PriceChartSale,PriceChartBuy } from "./chartHome";
function HomePage() {
  const api = Config.urlApi;
  const url = Urlimage.url;
  const [loadingpt, setLoadingpt] = useState(true);
  const [itemoPtion, setItemoPtion] = useState([]);
  const fetchOption = async () => {
    try {
      const response = await fetch(api + 'type/option');
      const jsonData = await response.json();
      setItemoPtion(jsonData);
    } catch (error) {
      setItemoPtion()
    }
    finally {
      setLoadingpt(false);
    }

  }
  const [datasch, setDatasch] = useState({
    typeId: '',
  })
  const [itemData, setItemData] = useState([]);
  const fecthData = async () => {
    try {
      const response = await axios.post(api + 'price/', datasch);
      setItemData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };//================

  const [sale, setSale] = useState([]);
  const [bsTotal, setBsTotal] = useState(0);
  const [loadsale, setLoadsale] = useState(true);
  const fetchSale = async () => {
    try {
      const response = await fetch(api + 'home/total');
      const jsonData = await response.json();
      setSale(jsonData);
      const balance = jsonData.reduce((acc, val) => acc + parseFloat(val.totalSale), 0);
      setBsTotal(balance);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setLoadsale(false);
    }
  }
 
  // ====================

  const [stock, setStock] = useState([]);
  const fetchStock = async () => {
    try {
      const response = await fetch(api + 'home/stock');
      const jsonData = await response.json();
      setStock(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchStock()
    fecthData();
    fetchOption();
    fetchSale();
  }, [bsTotal]);
  return (
    <div id="content" className="app-content">
      {loadingpt === true ? (
        <>
          <div className="row bg-white p-4 mb-4 ">
            <div className="col-sm-4 "> <Placeholder.Paragraph graph="image" active className="rounded-4 bg-white" /></div>
            <div className="col-sm-4"> <Placeholder.Paragraph graph="image" active className="rounded-4 bg-white" /></div>
            <div className="col-sm-4"> <Placeholder.Paragraph graph="image" active className="rounded-4 bg-white" /></div>
          </div>

        </>) : (
        <div className="row ">
          {itemData.map((item, key) =>
            <>
              {itemoPtion.map((val, key) =>
                <div className="col-xl-4 col-sm-6 col-md-6">
                  <div className="widget widget-stats bg-vk border-4 border-top border-gold rounded-4">
                    <div className="stats-icon"><img src={`./assets/img/icon/${item.type_Id === 1 ? 'gold-2.png' : 'gold.webp'}`} width={50} alt="" /></div>
                    <div className="stats-info">
                      <h4 className='fs-16px'>{item.typeName} <span className='text-gold'>ລາຄາຂາຍ</span> </h4>
                      <p>1 {val.option_name}: {numeral(item.price_sale * val.grams).format('0,00')} Kip</p>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
          <div className="col-sm-6">
            <div class="panel panel-inverse">
              <div class="panel-heading py-2">
                <div class="panel-title">
                  <ul class="nav nav-pills">
                    <li class="nav-item ">
                      <a href="#default-tab-1" data-bs-toggle="tab" class="nav-link  active me-3">ລາຄາຂາຍຄຳຮູບປະພັນປະຈຳວັນ</a>
                    </li>
                    <li class="nav-item">
                      <a href="#default-tab-2" data-bs-toggle="tab" class="nav-link ">ລາຄາຊື້ຄຳຮູບປະພັນປະຈຳວັນ</a>
                    </li>
                     </ul>
                </div>
                <div class="panel-heading-btn">
                  <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                  <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                </div>
              </div>
              <div class="panel-body tab-content">
              <div class="tab-pane fade active show" id="default-tab-1">
                <LineChart/>
                </div>
                <div class="tab-pane fade " id="default-tab-2">
                <LineChartBuy/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div class="panel panel-inverse">
              <div class="panel-heading py-2">
                <div class="panel-title">
                  <ul class="nav nav-pills">
                    <li class="nav-item ">
                      <a href="#gold-tab-1" data-bs-toggle="tab" class="nav-link  active me-3">ລາຄາຂາຍຄຳແທ່ງປະຈຳວັນ</a>
                    </li>
                    <li class="nav-item">
                      <a href="#gold-tab-2" data-bs-toggle="tab" class="nav-link ">ລາຄາຊື້ຄຳແທ່ງປະຈຳວັນ</a>
                    </li>
                  </ul>
                </div>
                <div class="panel-heading-btn">
                  <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                  <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                </div>
              </div>
              <div class="panel-body tab-content">
              <div class="tab-pane fade active show" id="gold-tab-1">
                <PriceChartSale/>
                </div>
                <div class="tab-pane fade " id="gold-tab-2">
                <PriceChartBuy/>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className={loadsale === true ? 'col-sm-12' : 'col-sm-6'}>
          <div className="card  rounded-3 mb-3 overflow-hidden bg-blue-800 text-white">
            <div className="card-body">

              <div className="row">
                <div className="col-xl-7 col-lg-8">
                  <div className="mb-3 text-gray-500">
                    <b>ລວມຍອດຂາຍ </b>
                  </div>
                  <div className="d-flex mb-1">
                    <h2 className="mb-0">₭ {loadsale === true ? (<Loader size="md" content="ກຳລັງໂຫຼດ...." />) : (numeral(bsTotal).format('0,00'))}</h2>
                  </div>
                  <hr className="bg-white bg-opacity-50" />
                  <div className="row text-truncate">
                    <>
                      {loadsale === true ? (<Placeholder.Paragraph graph="image" active />) : (sale.map((item, key) => {
                        const percentage = (item.totalSale / bsTotal) * 100;
                        const roundedPercentage = Math.round(percentage);
                        const Percentage = Number.isNaN(roundedPercentage) ? 0 : roundedPercentage;

                        return (
                          <div key={key} className="col-sm-6">
                            <div className=" text-gray-500">{item.typeName} {Percentage}</div>
                            <div className="fs-18px mb-5px fw-bold">{numeral(item.totalSale).format('0,00')}</div>

                            <div className="progress h-10px bg-gray-700 w-150px">
                              <div className="progress-bar progress-bar-striped bg-success progress-bar-animated fw-bold" style={{ width: `${percentage}%` }}>{Percentage}%</div>
                            </div>
                          </div>
                        )
                      })
                      )}
                    </>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                  <img src="./assets/img/svg/img-1.svg" height="150px" className="d-none d-lg-block" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="row">
            {sale.map((val, key) =>
              <div className="col-sm-6">
                <div className="card border-0 text-truncate mb-3 bg-blue-800 text-white">
                  <div className="card-body">
                    <div className="mb-3 text-gray-500">
                      <b className="mb-3">ຍອດຂາຍ {val.typeName} ວັນນີ້</b>
                    </div>
                    <div className="d-flex align-items-center mb-1">
                      <h3 className="text-white mb-0">
                        <span data-animation="number" data-value="2.19">
                          ₭ {numeral(val.totalSale).format('0,00')}
                        </span>
                      </h3>
                      <div className="ms-auto">
                        <div id="conversion-rate-sparkline" />
                      </div>
                    </div>
                    {val.bsOption.map((row, key) =>
                      <div className="d-flex mb-2">
                        <div className="d-flex align-items-center">
                          <i className="fa fa-circle text-red fs-8px me-2" />
                          {row.option_name}
                        </div>
                        <div className="d-flex align-items-center ms-auto">
                          <div className="text-end ps-2 fw-bold">
                            <span data-animation="number" data-value={val.totalSale * row.balance_pt / 100} className="me-1">
                              {numeral(row.balance_pt).format('0,00')}
                            </span>  ₭
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {stock.map((row, key) =>
        row.stock.length > 0 &&
          <div className="col-xl-4 col-lg-6">
            <div className="card border-0 mb-3 bg-blue-800 text-white border-4 border-top border-gold rounded-4 rounded-bottom-3">
              <div className="card-body">
                <div className="mb-3 text-gray-500">
                  <b>ສິນຄ້າໃກ້ໝົດ: {row.zone_name}</b>
                </div>
                {row.stock.map((val, index) =>
                  <div className="d-flex align-items-center mb-15px">
                    <div className="widget-img rounded-3  bg-white">
                      <div
                        className="h-100 w-100"
                        style={{
                          background: `url(${val.file_image !== '' ? url + 'pos/' + val.file_image : 'assets/img/icon/picture.jpg'}`,
                          backgroundSize: "auto 100%"
                        }}
                      />
                    </div>
                    <div className="text-truncate ms-2">
                      <div>{val.tile_name + ' (' + val.code_id + ')'} </div>
                      <div className="text-gray-500">{val.qty_baht + ' ' + val.option_name}</div>
                    </div>
                    <div className="ms-auto text-center">
                      <div className="fs-13px">
                        <span data-animation="number" data-value={val.quantity}>
                          {val.quantity}
                        </span>
                      </div>
                      <div className="text-gray-500 fs-10px">{val.unite_name}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default HomePage