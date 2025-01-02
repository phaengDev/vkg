import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { SelectPicker, Input, DatePicker, Message, useToaster, Whisper, Tooltip } from 'rsuite';
import { useOption, useUnite, useTitle, useZone } from '../../utils/selectOption';
import Select from 'react-select'
import axios from 'axios';
import moment from 'moment';
import { Config } from '../../config/connect';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FormReceivedMt from './Form-received-mt';
function RormReceived() {
    const api = Config.urlApi;
    const itemTile = useTitle();
    const itemOption = useOption();
    const itemZone = useZone();

    const currentDate = new Date();
    const [search, setSearch] = useState({
        option_id_fk: '',
        tiles_id_fk: ''
    });
    const userId = localStorage.getItem('user_uuid')
    const branchId = localStorage.getItem('branch_Id')
    const changeSeaerch = (name, value) => {
        setSearch({
            ...search, [name]: value
        });
    }
    const [itemPorduct, setItemProduct] = useState([]);
    const fetchPorduct = async () => {
        try {
            const response = await axios.post(api + 'posd/option', search);
            const jsonData = response.data;
            setItemProduct(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const data = itemPorduct.map(item => ({ label: item.qty_baht + '/' + item.option_name, value: item.product_uuid }));

    const [datasearch, setDatasearch] = useState({
        startDate: new Date(),
        endDate: new Date(),
        title_id_fk: '',
        zone_id_fk: '',
        option_id_fk: ''
    });
    const changeReport = (name, value) => {
        setDatasearch({
            ...datasearch, [name]: value
        })
    }
    const [isLoading, setIsLoading] = useState(true);
    const [itemreceived, setItemreceived] = useState([]);
    const fetchReceived = async () => {
        try {
            const response = await axios.post(api + 'received/', datasearch);
            const jsonData = response.data;
            setItemreceived(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }
    const heandleSearch = () => {
        fetchReceived();
    }


    const [inputs, setInputs] = useState([{
        receivedId: '',
        branch_id_fk: branchId,
        tiles_id_fk: '',
        product_id_fk: '',
        quantity: '',
        quantityEd: '',
        zone_id_fk: '',
        received_date: '',
        received_byid: userId
    }])

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(api + 'received/create', inputs)
            .then(function (res) {
                if (res.status === 200) {
                    showMessage(res.data.message, 'success')
                    fetchReceived();
                    setInputs({
                        receivedId: '',
                        tiles_id_fk: '',
                        product_id_fk: '',
                        quantity: '',
                        quantityEd: '',
                        zone_id_fk: ''
                    });
                    setNewform(false)
                } else {
                    showMessage(res.data.message, 'error')
                }
            }).catch(function () {
                showMessage('ເກີດຂໍ້ຜິດພາດບໍ່ສາມາດບັນທຶກໄດ້', 'error')
            });
    }
    const headleDelete = () => {

    }

    const heandleEdit = (val) => {
        setInputs({
            receivedId: val.received_id,
            tiles_id_fk: val.tiles_id_fk,
            product_id_fk: val.product_id_fk,
            quantity: val.received_qty,
            quantityEd: val.received_qty,
            zone_id_fk: val.zone_id_fk,
            received_date: val.received_date,

        });
        setSearch({
            option_id_fk: '',
            tiles_id_fk: val.tiles_id_fk
        })
        setNewform(true);
        setFormup(true);
    }

    const [formup, setFormup] = useState(false);
    const [newform, setNewform] = useState(false);
    const headleNewform = (index) => {
        setNewform(index);
        if (index === true) {
            setInputs({
                receivedId: '',
                tiles_id_fk: '',
                product_id_fk: '',
                quantity: '',
                zone_id_fk: '',
                quantityEd: '',
                branch_id_fk: branchId,
                received_byid: userId,
            });
            setFormup(false)
        }
    }

    //=================== uploadFile==========
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

   
    const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleCloseFile = () => {
    setFile(null); // Clear the selected file
};

// const handleUpload = () => {
//     const formData = new FormData();
//     formData.append('file', file);
//     axios.post(api + 'received/upload', formData)
//       .then(response => {
//         if(response.status===200){
//             alert(response.data.message)
//         }else{
//             alert(response.data.message)
//         }
//         console.log(response.data);
//       })
//       .catch(error => {
//         alert('Error uploading file:', error);
//       });
//   };

    //=====================
    const toaster = useToaster();
    const [placement, setPlacement] = useState('topEnd');
    const showMessage = (messName, notifi) => {
        const message = (
            <Message showIcon type={notifi} closable>
                <strong>ຢືນຢັນ! </strong> {messName}
            </Message>
        );
        toaster.push(message, { placement });
    };

    // =================//=============
    const exportToExcel = () => {
        const table = document.getElementById('table-to-xls');
        const worksheet = XLSX.utils.table_to_sheet(table);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ລາຍການນຳເຂົ້າ");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "ລາຍງານການນຳເຂົ້າ.xlsx");
      };
      

    useEffect(() => {
        fetchReceived()
        fetchPorduct();
    }, [search])

 
const tooltip = (
  <Tooltip>
   ນຳເຂົ້າແບບຈຳນວນຫຼາຍ ລາຍການ
  </Tooltip>
);
    return (
        <>
            <div id="content" className="app-content px-3">
                <ol className="breadcrumb float-xl-end">
                    <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li className="breadcrumb-item "><Link to={'/stock'}>ລາຍການສິນຄ້າ</Link></li>
                    <li className="breadcrumb-item text-green" onClick={exportToExcel}  role='button'><i class="fa-solid fa-cloud-arrow-up"></i> Ecport Excel</li>
                </ol>
                <h1 className="page-header mb-3">ຟອມນຳສິນຄ້າເຂົ້າສາງ</h1>
                <div className="row">
                    <div className={newform === false ? 'col-sm-12' : 'col-sm-8'}>
                        <div className="panel border  border-t-4 mb-4">
                            <div className="panel-body">
                                <div className="row mb-2">
                                    <div className="col-sm-4 col-lg-2 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ວັນທິ </label>
                                        <DatePicker oneTap format="dd/MM/yyyy" defaultValue={datasearch.startDate} onChange={(e) => changeReport('startDate', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-4 col-lg-2 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ຫາວັນທິ</label>
                                        <DatePicker oneTap format="dd/MM/yyyy" defaultValue={datasearch.endDate} onChange={(e) => changeReport('endDate', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-4 col-lg-3 col-8 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ລາຍການສິນຄ້າ</label>
                                        <SelectPicker data={itemTile} onChange={(e) => changeReport('title_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-3 col-8 form-group mb-2">
                                        <label htmlFor="" className='form-label'>ໂຊນຂາຍ</label>
                                        <SelectPicker data={itemZone} onChange={(e) => changeReport('zone_id_fk', e)} block placeholder="ເລືອກ" />
                                    </div>
                                    <div className="col-sm-6 col-lg-2 col-4 mt-4">
                                        <button type="button" onClick={heandleSearch} className="btn btn-danger fs-14px px-3 "><i className="fas fa-search fs-16px"></i> </button>
                                        {newform === false && (
                                            <button type="button" onClick={() => headleNewform(true)} className="btn btn-black fs-14px px-3 ms-2"><i className="fas fa-plus fs-16px"></i> </button>
                                        )}
                                        <Whisper placement="top" controlId="control-id-hover" trigger="hover" speaker={tooltip}>
                                        <button type="button" onClick={handleOpen} className="btn btn-green fs-14px ms-2 px-2 "><i className="fa-solid fa-file-circle-plus fs-4"/></button>
                                        </Whisper>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table id='table-to-xls' className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                        <thead className='thead-plc'>
                                            <tr className=''>
                                                <th width="1%" className='text-center'>ລ/ດ</th>
                                                <th width="10%" className='text-center'>ວັນທິນຳເຂົ້າ</th>
                                                <th className='text-center'>ລະຫັດ</th>
                                                <th className=''>ຊື່ສິນຄ້າ</th>
                                                <th className=''>ນ້ຳໜັກ</th>
                                                <th className='text-center' width="15%">ຈຳນວນໃໝ່</th>
                                                <th className='text-center' width="15%">ຍົກຍອດ</th>
                                                <th className='text-center' width="15%">ຈຳນວນໃນສາງ</th>
                                                <th>ຫົວໜ່ວຍ</th>
                                                <th>ໂຊນຂາຍ</th>
                                                <th width="5%" className='text-center'>ຕັ້ງຄ່າ</th>
                                            </tr>
                                        </thead>
                                        <tbody className=''>
                                            {
                                                itemreceived.length > 0 ? (
                                                    itemreceived.map((item, key) => (
                                                        <tr key={key}>
                                                            <td className='text-center' width='5%'>{key + 1} </td>
                                                            <td className='text-center'>{moment(item.received_date).format('DD/MM/YYYY HH:mm')}</td>
                                                            <td className='text-center'>{item.code_id}</td>
                                                            <td>{item.tile_name}</td>
                                                            <td>{item.qty_baht} {item.option_name}</td>
                                                            <td className='text-center'> {item.received_qty} </td>
                                                            <td className='text-center'> {item.old_quantity} </td>
                                                            <td className='text-center'> {item.received_qty + item.old_quantity} </td>
                                                            <td>{item.unite_name}</td>
                                                            <td>{item.zone_name}</td>
                                                            <td className='text-center'>
                                                                {item.status_use===1?(
                                                                    <>
                                                                <button type='button' onClick={() => heandleEdit(item)} className="btn btn-green btn-xs me-1">
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                </button>
                                                                <button type='button' onClick={() => headleDelete(item.cart_id)} className="btn btn-red btn-xs">
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                                </>
                                                                ):(<i className="fa-solid fa-circle-check fs-20px text-green"></i>)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={12} className='text-center text-danger'> ບໍ່ມີລາຍການນຳເຂົ້າສິນຄ້າ</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {newform === true && (
                        <div className="col-sm-4">
                             <div class="navbar navbar-sticky  d-xl-block my-n4 py-4 h-100 ">
                            <form onSubmit={handleSubmit} className='nav'>
                                <div className="panel panel-inverse border-4 border-bottom rounded-4 border-red ">
                                    <div className="panel-heading bg-vk">
                                        <h4 className="panel-title fs-14px">{formup === true ? 'ຟອມແກ້ໄຂສິນຄ້ານຳເຂົ້າ' : 'ຟອມສິນຄ້ານຳເຂົ້າ'}</h4>
                                        <div className="panel-heading-btn ">
                                            <a href="javascript:;" onClick={() => headleNewform(false)} className="btn btn-sm btn-icon btn-warning" ><i className="fa fa-times fs-4"></i></a>
                                        </div>
                                    </div>
                                    <div className="panel-body ">
                                        <div className=" form-group mb-2">
                                            <label htmlFor="" className='form-label'>ເລືອກສິນຄ້າ</label>
                                            <Select onChange={(e) => changeSeaerch('tiles_id_fk', e.value)} value={itemTile.find(obj => obj.value === inputs.tiles_id_fk)} options={itemTile} required />
                                        </div>
                                        <div className=" form-group mb-2">
                                            <label htmlFor="" className='form-label'>ນ້ຳໜັກ </label>
                                            <Select options={data} onChange={(e) => handleChange('product_id_fk', e.value)} value={data.find(obj => obj.value === inputs.product_id_fk)} block placeholder="ເລືອກ" required />
                                        </div>
                                        <div className=" form-group mb-2">
                                            <label htmlFor="" className='form-label'>ເລືອກໂຊນຂາຍ</label>
                                            <Select options={itemZone} onChange={(e) => handleChange('zone_id_fk', e.value)} value={itemZone.find(obj => obj.value === inputs.zone_id_fk)} block placeholder="ເລືອກ" required />
                                        </div>
                                        <div className=" form-group mb-2">
                                            <label htmlFor="" className='form-label'>ຈຳນວນ</label>
                                            <input type="text" value={inputs.quantityEd = inputs.quantityEd} className='hide' />
                                            <Input type='number' value={inputs.quantity} onChange={(e) => handleChange('quantity', e)} block placeholder="ເລືອກ" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className='form-label'>ວັນທິນຳເຂົ້າ </label>
                                            {formup === false ? (
                                                <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('received_date', e)} value={inputs.received_date = new Date()} block placeholder="ເລືອກ" />
                                            ) : (
                                                <DatePicker oneTap format="dd/MM/yyyy" onChange={(e) => handleChange('received_date', e)} value={new Date(inputs.received_date)} block placeholder="ເລືອກ" />
                                            )}

                                        </div>
                                        <hr className='border-blue' />
                                        <div className="form-group row mt-3 mb-4">
                                            <div className="col-6"> <button type='reset' onClick={setInputs} className='btn btn-danger w-100 fs-14px'><i className="fa-solid fa-rotate fs-lg"></i> ເລີມໃໝ່</button></div>
                                            <div className="col-6">  <button type='submit' className='btn btn-primary  w-100 fs-14px'>{formup === true ? (<>
                                                <i className="fa-solid fa-pen-to-square"></i> ແກ້ໄຂ້</>) : (<><i className="fa-solid fa-download fs-lg"></i> ບັນທຶກ</>)}</button></div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* <Modal open={open} onClose={handleClose}>
                    <Modal.Header>
                        <Modal.Title>ອັບໂຫຼດນຳເຂົ້າສິນຄ້າ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <label className='btn btn-default fs-16px'>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xlsx,.xls" className='hide'
                                />
                                <i class="fa-solid fa-file-excel me-3"></i>
                                ເລື່ອໄຟລ໌ Excel..xlsx,.xls ..
                            </label>
                            {file && (
                                <>
                                    <div class="alert alert-success alert-dismissible fade show mt-3">
                                        <strong>ໄຟລ໌:</strong>
                                        {file.name}
                                        <button type="button" onClick={handleCloseFile} class="btn-close" data-bs-dismiss="alert" />
                                    </div>
                                </>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleUpload} disabled={file ? '':'disabled'} appearance="primary">
                            <i class="fa-solid fa-check fa-lg me-2"></i> ອັບໂຫຼດ
                        </Button>
                        <Button onClick={handleClose} color='red' appearance="primary">
                            ຍົກເລີກ
                        </Button>
                    </Modal.Footer>
                </Modal> */}
                <FormReceivedMt open={open} hadleClose={handleClose} fetchData={fetchReceived} />
            </div>

        </>
    )
}

export default RormReceived