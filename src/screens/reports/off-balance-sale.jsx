import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Loader } from 'rsuite';
import axios from 'axios';
import { Config } from '../../config/connect';
import Alert from '../../utils/config';
export default function OffBalanceSale() {
    const api = Config.urlApi;
    const user_id=localStorage.getItem('user_uuid')
    const branch_id=localStorage.getItem('branch_Id')
    const [itemSale, setItemSale] = useState([]);
    // const [itemImport, setItemImport] = useState([]);
    const fetchDataReport = async () => {
        try {
            const response = await fetch(api + 'sale-r/saledays/'+branch_id);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setItemSale(jsonData);
            // setItemImport(jsonData.imports);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };

const [formData,setFormData]=useState({
    branchId:branch_id,
    userId:user_id,
});
const [IsLoading,setIsLoading]=useState(false)

const heandleOffBalance=()=>{
    setIsChecked(false)
    setIsLoading(true)
    axios.post(api + 'order/offBalance', formData)
      .then(function (res) {
        if(res.status===200){
            Alert.successData(res.data.message);
            setIsChecked(false)
            setIsLoading(false)
        }
      }).catch(function(error){
        Alert.errorData('ການປິດຍອດບໍ່ສຳເລັດ');
        setIsChecked(true)
        setIsLoading(false)
      })
}

    useEffect(() => {
        fetchDataReport();
    }, [user_id,branch_id]);
    return (
        <>
            <div id="content" className="app-content bg-default px-3">
                <ol className="breadcrumb float-end">
                    <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li className="breadcrumb-item active">ປິດຍອດຂາຍ</li>
                </ol>
                <h2 className="page-header mb-3">ປິດຍອດຂາຍ</h2>
                <div className="panel">
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-sm-4 mb-3 border-2 border-blue  border-end">
                               <div className="panel panel-body px-2 ">
                                <h4 className='text-center mt-4'>ປິດຍອດຂາຍປະຈຳວັນ</h4>
                            <hr />
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="checkbox1" onChange={handleCheckboxChange} />
                                    <label class="form-check-label" for="checkbox1">ເປິດເພື່ອທຳການສະແດງການປິດຍອດປະຈຳວັນ</label>
                                    <label class="form-check-label text-orange">! ທຸກໆວັນທ່ານຈະຕ້ອງມີການປິດຍອດຂາຍ</label>
                                </div>
                                <div className="text-center mt-4 mb-3 pb-5">
                                    <button type='button' onClick={heandleOffBalance} class={`btn btn-lg btn-primary ${isChecked===false ? ' disabled' : ''}`}>
                                        
                                        {IsLoading===false ? (
                                         <span class="d-flex align-items-center text-left">
                                        <i class="fa-solid fa-circle-check fa-3x me-3"></i>
                                            <span>
                                                <span class="d-block"><b>ຢືນຢັນການປິດຍອດ</b></span>
                                                <span class="d-block fs-12px opacity-7">ປິດຍອດປະຈຳວັນ</span>
                                            </span>
                                        </span> 
                                        ):(
                                         <Loader size="md" content="ກຳລັງດຳເນີນງານ...." />
                                        )
                                        }
                                    </button>
                                </div>
                            </div>
                            </div>
                            {/* <div className="col-sm-4 mb-3 border-2 border-orange border-end">
                              <div className="panel panel-body px-2 ">
                                <h4 className='text-center'>ລວມຍອດນຳເຂົ້າ</h4>
                                <hr className='border-blue m-3' />
                                {itemImport.length >0 ?(
                                    <>
                                <table className="table text-nowrap">
                                    <thead>
                                        <tr>
                                            <th className='text-center' width="1%" >ລ/ດ</th>
                                            <th>ລາຍການ</th>
                                            <th className='text-center'>ນ້ຳໜັກ</th>
                                            <th className='text-center'>ຈຳນວນ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemImport.map((item, key) =>
                                            <tr key={key}>
                                                <td className='text-center'>{key = 1}</td>
                                                <td>{item.tile_name}</td>
                                                <td className='text-center'>{item.qty_baht + ' ' + item.option_name}</td>
                                                <td className='text-center'>{item.qtyImport + ' ' + item.unite_name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                </> ):(<>
                                <img src="./assets/img/icon/file-not.png" alt="" />
                                </> )}
                            </div>
                            </div> */}
                            <div className="col-sm-8 ">
                             <div className="panel panel-body  px-2 ">
                                <h4 className='text-center'>ລວມຍອດຂາຍ</h4>
                                <hr className='border-blue m-3' />
                                {itemSale.length >0 ?(
                                    <>
                                <table className="table text-nowrap">
                                    <thead>
                                        <tr>
                                            <th className='text-center' width="1%" >ລ/ດ</th>
                                            <th className='text-center'>ລະຫັດ</th>
                                            <th>ລາຍການ</th>
                                            <th className='text-center'>ນ້ຳໜັກ</th>
                                            <th className='text-center'>ຈຳນວນຂາຍ</th>
                                            <th className='text-center'>ຈຳນວນຄົງເຫຼືອ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemSale.map((val, key) =>
                                            <tr key={key}>
                                                <td className='text-center'>{key = 1}</td>
                                                <td className='text-center'>{val.code_id}</td>
                                                <td>{val.tile_name}</td>
                                                <td className='text-center'>{val.qty_baht + ' ' + val.option_name}</td>
                                                <td className='text-center'>{val.qtySale + ' ' + val.unite_name}</td>
                                                <td className='text-center'>{val.quantity + ' ' + val.unite_name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                </> ):(<>
                                <div className='text-center'>
                                <img src="./assets/img/icon/file-not.png"  width={'50%'} alt="" />
                                </div>
                                
                                </> )}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
