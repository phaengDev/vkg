import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Input, Message, useToaster, Badge, SelectPicker } from 'rsuite';
import Select from 'react-select'
import axios from 'axios';
import { Config,Urlimage } from '../../config/connect';
import { useOption, useType, useTitle } from '../../utils/selectOption';
import numeral from 'numeral';
import Swal from 'sweetalert2';
import Alert from '../../utils/config';
export default function PatternPage() {
    const api = Config.urlApi;
    const url = Urlimage.url;

    const itemType = useType();
    const itemTile = useTitle();
    const itemOption = useOption();

    const [colrow, setColrow] = useState(false);
    const headleAddNew = (index) => {
        setColrow(index)
    }

    const [inputs, setInputs] = useState({
        patternId: '',
        title_id_fk: '',
        pattern_name: '',
        pattern_pirce: '0',
        option_id_fk: '',
        pattern_img:null,
    })
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('patternId', inputs.patternId);
        formData.append('title_id_fk', inputs.title_id_fk);
        formData.append('pattern_name', inputs.pattern_name);
        formData.append('pattern_pirce', inputs.pattern_pirce);
        formData.append('option_id_fk', inputs.option_id_fk);
        formData.append('pattern_img', inputs.pattern_img);
        // return
        try {
            axios.post(api + 'pattern/create', formData)
                .then(function (res) {
                    if (res.status === 200) {
                        setColrow(false);
                        showMessage('ຢືນຢັນ', res.data.message, 'success');
                        setInputs({
                            patternId: '',
                            title_id_fk: '',
                            pattern_name: '',
                            pattern_pirce: '0',
                            option_id_fk: '',
                            pattern_img:null
                        });
                        fetchData();
                        setImageUrl('assets/img/icon/camera.png');
                    } else {
                        showMessage('ຂໍອະໄພ', res.data.message, 'error');
                    }
                }).catch(function (error) {
                    showMessage('ຂໍອະໄພ', 'ເກິນຂໍ້ຜິດພາດທາງລະບົບ', 'error');
                });
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }


    const heandleEdit = (item) => {
        setInputs({
            patternId: item.pattern_id,
            title_id_fk: item.title_id_fk,
            pattern_name: item.pattern_name,
            pattern_pirce: item.pattern_pirce,
            option_id_fk: item.option_id_fk,
        })
        if (item.pattern_img) {
            setImageUrl(url + 'pos/' + item.pattern_img);
        } else {
            setImageUrl('assets/img/icon/camera.png')
        }
        setColrow(true)
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
              axios.delete(api + `pattern/${id}`).then(function (response) {
                if (response.status === 200) {
                    fetchData();
                  Alert.successData(response.data.message)
                } else {
                  Alert.errorData(response.data.message)
                }
              }).catch((error) => {
                Alert.errorData('ການລົບຂໍ້ມູນບໍ່ສຳເລັດ ຂໍ້ມູນອາດມິການໃຊ້ງານຢູ່', error)
              });
            }
          });
    }
    // ========================
    const [values, setValues] = useState({
        type_id_fk: '',
        title_id_fk: '',
        option_id_fk: '',
    })
    const chechSearch = (name, value) => {
        setValues({
            ...values, [name]: value
        })
    }

    const handleSearch = () => {
        fetchData();
    }

    const [isLoading, setIsLoading] = useState(true);
    const [itemPattern, setItemPattern] = useState([])
    const fetchData = async () => {
        try {
            const response = await axios.post(api + 'pattern/', values);
            const jsonData = response.data;
            setItemPattern(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }


    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('assets/img/icon/camera.png');
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInputs({
            ...inputs,
            pattern_img: file
        });
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleClearImage = () => {
        setSelectedFile(null);
        setImageUrl('assets/img/icon/camera.png')
        document.getElementById('fileInput').value = '';
    };
    // ======================

    const toaster = useToaster();
    const [placement, setPlacement] = useState('topEnd');
    const showMessage = (titleName, messName, notifi) => {
        const message = (
            <Message showIcon type={notifi} closable>
                <strong>{titleName} </strong> {messName}
            </Message>
        );
        toaster.push(message, { placement });
    };
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            <div id="content" className="app-content bg-default px-3">
                <ol className="breadcrumb float-xl-end">
                    <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li className="breadcrumb-item active">ລາຍການລວດລາຍ</li>
                </ol>
                <h1 className="page-header mb-3">ລາຍການລວດລາຍທັງໝົດ</h1>

                <div className="row">
                    <div className={colrow === false ? 'col-sm-12' : 'col-sm-8'}>
                        <div className="palen">
                            <div className="panel panel-inverse pb-3">
                                <div className="panel-heading">
                                    <h4 className="panel-title fs-16px">ລາຍການສິນຄ້າ</h4>
                                    <div className="panel-heading-btn">
                                        {colrow === true ?
                                            <a href="javascript:;" className="btn btn-xs btn-icon btn-default" onClick={() => headleAddNew(false)}> <i className="fa fa-expand"></i></a>
                                            : ''
                                        }
                                    </div>
                                </div>
                                <div className="panel-body ">
                                    <div className="row mb-4">
                                        <div className="col-sm-3 form-group mb-2">
                                            <label htmlFor="" className='form-label'>ຮູບປະພັນ</label>
                                            <SelectPicker data={itemType} onChange={(e) => chechSearch('type_id_fk', e)} block placeholder="ເລືອກ" />
                                        </div>

                                        <div className="col-sm-3 form-group mb-2">
                                            <label htmlFor="" className='form-label'>ປະເພດ</label>
                                            <SelectPicker data={itemTile} onChange={(e) => chechSearch('title_id_fk', e)} block placeholder="ເລືອກ" />
                                        </div>
                                        <div className="col-sm-3 col-8 form-group mb-2">
                                            <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                            <SelectPicker data={itemOption} onChange={(e) => chechSearch('option_id_fk', e)} block placeholder="ເລືອກ" />
                                        </div>
                                        <div className="col-sm-3 col-4 mt-4">
                                            <button type="button" onClick={handleSearch} className="btn btn-danger px-3 "><i className="fas fa-search fs-16px"></i> </button>
                                            {colrow === false ?
                                                <button type="button" onClick={() => headleAddNew(true)} className="btn btn-black px-3 ms-2"><i className="fa-regular fa-plus fs-16px"></i> </button>
                                                : ''}
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered align-middle w-100 text-nowrap">
                                            <thead className='thead-plc'>
                                                <tr className=''>
                                                    <th width="1%" className='text-center'>ລ/ດ</th>
                                                    <th width="1%" className='text-center'>ຮູບ</th>
                                                    <th className=''>ປະເພດ</th>
                                                    <th className=''>ລາຍການ</th>
                                                    <th className='text-center'>ນ້ຳໜັກ</th>
                                                    <th className='text-end'>ລາຄາ</th>
                                                    <th width="5%" className='text-center'>ຕັ້ງຄ່າ</th>
                                                </tr>
                                            </thead>
                                            <tbody className=''>
                                                {
                                                    itemPattern.length > 0 ? (
                                                        itemPattern.map((item, key) => (
                                                            <tr key={key}>
                                                                <td className='text-center' width='5%'>{key + 1} </td>
                                                                <td className='text-center with-img dt-type-numeric' width='5%'>
                                                                <img src={item.pattern_img && item.pattern_img !== 'null' ? `${url}pattern/${item.pattern_img}`: './assets/img/icon/picture.jpg'} 
                                                                className='rounded h-30px my-n1 mx-n1' 
                                                                alt="" />
                                                                </td>
                                                                <td className=''> {item.tile_name} </td>
                                                                <td>{item.pattern_name}</td>
                                                                <td className='text-center'>{item.option_name}</td>
                                                                <td className='text-end'> {numeral(item.pattern_pirce).format('0,00')} </td>
                                                                <td className='text-center'>
                                                                    <button type='button' onClick={() => heandleEdit(item)} className="btn btn-green btn-xs me-1">
                                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                                    </button>
                                                                    <button type='button' onClick={() => headleDelete(item.pattern_id)} className="btn btn-red btn-xs">
                                                                        <i className="fa-solid fa-trash"></i>
                                                                    </button>
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
                    </div>


                    {/* ------------ form add data ------------------- */}

                    {colrow === true ? (
                        <div className="col-sm-4 ">
                            <div class="navbar navbar-sticky  d-xl-block my-n4 py-4 h-100 ">
                                <div className="panel border-4 border-bottom  rounded-4 border-green nav">
                                    <div className="panel-heading bg-green text-white">
                                        <h4 className="panel-title fs-16px">ຟອມເພີ່ມລວມລາຍ</h4>
                                        <div className="panel-heading-btn">
                                            {colrow === true ?
                                                <a href="javascript:;" className="btn btn-xs btn-icon btn-danger" onClick={() => headleAddNew(false)}> <i className="fa fa-times"></i></a>
                                                : ''
                                            }
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="panel-body row">
                                            <div className="form-group text-center mb-2">
                                                <center>
                                                    <div class="h-100px w-100px position-relative">
                                                        <label role='button'>
                                                        <input type="file" id="fileInput" name='pattern_img' onChange={handleFileChange} accept="image/*" className='hide' />
                                                            <img src={imageUrl} class="w-100px rounded-3" />
                                                        </label>
                                                        {selectedFile && (
                                                        <span role='button' onClick={handleClearImage} class="w-20px h-20px p-0 d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-0 top-0 rounded-pill mt-n2 me-n4">x</span>
                                                        )}
                                                        </div>
                                                </center>
                                            </div>
                                            <div className="form-group mb-2">
                                                <label htmlFor="" className='form-label'>ປະເພດ</label>
                                                <Select options={itemTile} value={itemTile.find(obj => obj.value === inputs.title_id_fk)} onChange={(e) => handleChange('title_id_fk', e.value)} required />
                                            </div>
                                            <div className="form-group mb-2">
                                                <label htmlFor="" className='form-label'>ຊື່ລວດລາຍ</label>
                                                <Input value={inputs.pattern_name} placeholder='ຊື່ລວດລາຍ' onChange={(e) => handleChange('pattern_name', e)} required />
                                            </div>
                                            <div className="col-sm-6 mb-2">
                                                <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                                <Select options={itemOption} defaultValue={itemOption.find(obj => obj.value === inputs.option_id_fk)} onChange={(e) => handleChange('option_id_fk', e.value)} required />
                                            </div>
                                            <div className="col-sm-6 mb-2">
                                                <label htmlFor="" className='form-label'>ລາຄາເລີມຕົ້ນ</label>
                                                <Input value={numeral(inputs.pattern_pirce).format('0,00')} onChange={(e) => handleChange('pattern_pirce', e)} placeholder='0.00' className='bg-lime-100' required />
                                            </div>
                                            <hr />
                                            <div className="col-6 mb-4">
                                                <button type='button' className='btn btn-danger w-100 fs-14px'>ເລີມໃໝ່</button>
                                            </div>
                                            <div className="col-6  mb-4">
                                                <button type='submit' className='btn btn-primary w-100 fs-14px'>ບັນທຶກ</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </div>
        </>
    )
}
