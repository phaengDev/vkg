import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
function FormSale() {
  const navigate = useNavigate();
  const [formfull, setFormfull] = useState(false);
  const headleBack = () => {
    navigate(`/home`);
  }
  const headleColes = () => {
    setFormfull(true)
  }
  // useEffect(() => {
  //   setFormfull(false)
  // }, [])
  return (
    <>
      <div id="content" className="app-content p-0">
        {formfull === true ?
          <div className='panel panel-expand'>
            <div class="panel-heading bg-white text-dark text-center ui-sortable-handle">
              <span className='float-end fs-16px' role='button' onClick={headleBack}><i class="fa-solid fa-circle-arrow-left fa-lg text-danger"></i> ຍ້ອນກັບ</span>
              <h4 class="panel-title fs-16px">ສະແກນລະຫັດພະນັກງານ</h4>
            </div>
            <div class="panel-body bg-default">
              <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4 ">
                  <div className="panel p-4 text-center rounded-4 border-top border-5 border-red">
                    <div class=" text-center mb-4">
                      <img src="/assets/img/user/user.png" alt="" class="mw-100 w-120px rounded-pill " />
                    </div>
                    <div className="from-group mb-4">
                      <label htmlFor="" className='form-label fs-16px'>ລະຫັດພະນັກງານ</label>
                      <input type="text" autoFocus className='form-control form-control-lg fs-18px border-blue text-center' placeholder='|||||||||||||||||||||||||||||||||' />
                    </div>
                  </div>
                </div>
                <div className="col-sm-4"></div>
              </div>
            </div>
          </div>
          :
          <div className="panel">
            <div className="panel-body p-0">
              <div className="profile">
                <div className="profile-header">
                  <div className="profile-header-cover" />
                  <div className="profile-header-content">
                    <div className="profile-header-img rounded-3 rounded-bottom-0">
                      <img src="assets/img/user/user-01.png" alt="" />
                    </div>
                    <div className="profile-header-info">
                      <h4 className="mt-0 mb-1">ຊື່ພ/ງ : ບຸນແພງ <div className='float-end top-0' onClick={headleColes} role='button' ><i class="fa-solid fa-power-off text-yellow fa-xl"></i></div></h4>
                      <p className="mb-2">ໂທລະສັບ: 0252160011</p>
                      <a href="#" className="btn btn-xs btn-yellow">
                        ໂຊນ: A
                      </a>

                    </div>
                  </div>
                  <div className="profile-header-tab " role="tablist">
                    <div className="row p-3">
                      <div className="col-sm-3">
                        <div className="form-group">
                          <input type="text" className='form-control' />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive ">
                      <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                        <thead className='thead-plc'>
                          <tr>
                            <th width="1%" className='text-center'>ລ/ດ</th>
                            <th className=''>ວັນທີ</th>
                            <th className=''>ບິນເລກທີ</th>
                            <th className=''>ຊື່ພະລິດຕະພັນ</th>
                            <th className=''>ນ້ຳໜັກ</th>
                            <th className=''>ຈຳນວນ</th>
                            <th className=''>ພະນັກງານຂາຍ</th>
                            <th className=''>ໝາຍເຫດ</th>
                          </tr>
                        </thead>
                        <tbody>

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        }
      </div>


    </>
  )
}

export default FormSale