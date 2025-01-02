import React, { useEffect, useState } from 'react'
import { Modal, Button, SelectPicker, } from 'rsuite';
import { useNavigate } from 'react-router-dom'
import {Config} from '../../config/connect';
import axios from 'axios';
import Swal from "sweetalert2";
import Alert from '../../utils/config';
import CheckRoundIcon from '@rsuite/icons/CheckRound';
function ZonePage() {
    const api = Config.urlApi;
    const navigate = useNavigate();
const  [titlename,setTilename]=useState(true)

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
        setInputs({
            zoneId:'',
            zoneName: '',
            bg_color:'',
            zone_status:'1'
        });
        setTilename(true)
    }
    const handleClose = () => setOpen(false);
    const [inputs, setInputs] = useState({
        zoneId:'',
        zoneName: '',
        bg_color:'',
        zone_status:'1'
    })

    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs)
        try {
            axios.post(api + 'zone/create', inputs)
                .then(function (res) {
                    if (res.status === 200) {
                        handleClose();
                        fetchZone();
                        Alert.successData(res.data.message)
                    } else {
                        Alert.errorData(res.data.message)
                    }
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    const headleEedit=(val)=>{
    setInputs({
        zoneId:val.zone_Id,
        zoneName: val.zone_name,
        bg_color: val.bg_color,
        zone_status:val.zone_status
    });
    setOpen(true);
    setTilename(false)
}


const headleDelete = (id) => {
    Swal.fire({
        title: "ຢືນຢັນ?",
        text: "ທ່ານຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່!",
        icon: "warning",
        width: 400,
        showDenyButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ຕົກລົງ",
        denyButtonText: `ຍົກເລີກ`
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(api + `zone/${id}`).then(function(resp) {
                if (resp.status === 200) {
                    fetchZone();
                    Alert.successData(resp.data.message);
                } else if (resp.status === 400) {
                    Alert.warningData(resp.data.message);
                } else {
                    Alert.errorData(resp.data.message);
                }
            })
            .catch((error) => {  // Fixed the syntax error here
                Alert.errorData('ບໍ່ສາມາດລົບຂໍ້ມູນນີ້ໄດ້', error);
            });
        }
    });
};


    const [filterName, setFilteName] = useState([])
    const [itemZone, setItemZone] = useState([]);
    const fetchZone = async () => {
        try {
            const response = await fetch(api + 'zone/');
            const jsonData = await response.json();
            setItemZone(jsonData);
            setFilteName(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
    }

    // const [filter, setFilter] = useState('');
    const Filter = (event) => {
        setItemZone(filterName.filter(n => n.zone_name.toLowerCase().includes(event)))
    }

    const viewData=(id)=>{
        navigate(`/view-z?id=${id}`);
    }

    const options = [
        { value: 'red', label: <><CheckRoundIcon color='red' /> ສິແດງ</> },
        { value: 'green', label: <><CheckRoundIcon color='green'  /> ສີຂຽວ</> },
        { value: 'orange', label: <><CheckRoundIcon color='orange'  /> ສິສົ້ມ</> },
        { value: 'blue', label: <><CheckRoundIcon color='blue'  /> ສີຟ້າ</> },
        { value: 'indigo', label: <><CheckRoundIcon color='indigo'  /> Indigo</> },
        { value: 'cyan', label: <><CheckRoundIcon color='cyan'  /> ສີຟ້າຂຽວ</> },
        { value: 'teal', label: <><CheckRoundIcon color='teal'  /> Teal</> },
        { value: 'yellow', label: <><CheckRoundIcon color='yellow'  /> Yellow</> },
        { value: 'lime', label: <><CheckRoundIcon color='lime'  /> Lime</> },
        { value: 'pink', label: <><CheckRoundIcon color='pink'  /> Pink</> },
        
      ];
    useEffect(() => {
        fetchZone();
    }, []);
    return (
        <>
            <div id="content" class="app-content">
                <ol class="breadcrumb float-end">
                    <li class="breadcrumb-item">
                        <button type="button" onClick={handleOpen} className="btn btn-sm btn-danger"><i class="fa-solid fa-plus"></i> ເພີ່ມໂຊນໃໝ່</button>
                    </li>
                </ol>
                <h1 class="page-header mb-3">ຂໍ້ມູນໂຊນຂາຍສິນຄ້າ</h1>
                <div className="panel pt-4 px-2">
                    <div className="table-responsive">
                        <div className="row mb-3">
                            <div className="col-sm-9 fs-20px"> </div>
                            <div className="col-sm-3">
                                <div className='input-group' >
                                    <input type='text' className='form-control' onChange={(event) => Filter(event.target.value)} placeholder="ຄົ້ນຫາ" />
                                </div>
                            </div>
                        </div>
                        <table id="data-table-default" className="table table-striped table-bordered align-middle w-100 text-nowrap">
                            <thead className='thead-plc'>
                                <tr>
                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                    <th width="10%" className='text-center'>ລະຫັດ</th>
                                    <th className='text-center'>ຊື່ໂຊນຂາຍ</th>
                                    <th className=''>ສີຂອງໂຊນ</th>
                                    <th width="10%"  className='text-center'>ລາຍການ</th>
                                    <th className='text-center'>ສະຖານະ</th>
                                    <th className='text-center' width='10%'>ການຕັ້ງຄ່າ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemZone.length > 0 ? (
                                    itemZone.map((item, key) => (
                                        <tr key={key}>
                                            <td className='text-center' >{key + 1}</td>
                                            <td className='text-center'>{item.zone_code}</td>
                                            <td>{item.zone_name}</td>
                                            <td className='text-center'><div className={`bg-${item.bg_color} w-30px h-15px rounded me-2`}></div> </td>
                                            <td className='text-center'><span role='button' onClick={()=>viewData(item.zone_Id)} className='badge bg-green  rounded-3'> {item.qty_stock} ລາຍການ</span></td>
                                            <td width='10%' className='text-center'>
                                                <span className={`badge ${item.zone_status === 1 ? 'bg-primary' : 'bg-danger'}`}>
                                                    {item.zone_status === 1 ? 'ເປິດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                                                </span>
                                            </td>
                                            <td className='text-center' width='10%'>
                                                <button type='button' onClick={()=>headleEedit(item)} className="btn btn-blue btn-xs me-2">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button type='button' onClick={() => headleDelete(item.zone_Id)} className="btn btn-red btn-xs">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-danger">ບໍ່ມີການບິນທຶກຂໍ້ມູນ</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title className='py-1'>{titlename===true?'ແບບຟອມພີ່ມໂຊນຂາຍ':'ແບບຟອມແກ້ໄຂໂຊນຂາຍ'} </Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="" className='form-label'>ຊື່ໂຊນຂາຍ</label>
                            <input type="text" name='zoneId' value={inputs.zoneId} className='hide' />
                            <input type='text' name='zoneName' value={inputs.zoneName} onChange={(e) => handleChange('zoneName', e.target.value)} className='form-control' placeholder='ຊື່ໂຊນ'  required />
                        </div>
                        <div className="form-group mt-2 row">
                            <div className="col-sm-6">
                            <label htmlFor="" className='form-label'>  ສະຖານະ </label>
                            <select name='zone_status' value={inputs.zone_status} onChange={(e) => handleChange('zone_status', e.target.value)} className='form-select' >
                                    <option value="1"><i class="fas fa-home"></i> ເປິດໃຊ້ງານ</option>
                                    <option value="2"> <i class="fas fa-home"></i> ປິດໃຊ້ງານ</option>
                            </select>
                            </div>
                            <div className="col-sm-6">
                            <label htmlFor="" className='form-label'>  ສີໂຊນ </label>
                            <SelectPicker data={options} defaultValue={inputs.bg_color} onChange={(e) => handleChange('bg_color', e)} block/>
                            </div>
                           
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary"> {titlename===true?'ບັນທຶກ':'ແກ້ໄຂ'}  </Button>
                        <Button onClick={handleClose} color='red' appearance="primary">
                            ຍົກເລີກ
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default ZonePage