import React, { useState, useEffect } from 'react'
import { SelectPicker, Input, Button } from 'rsuite';
import { useNavigate, Link } from 'react-router-dom';
import { Config } from '../../config/connect';
import { useUnite, useTitle, useOption } from '../../utils/selectOption';
function FormPorduct() {
    const api = Config.urlApi;
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    // const itemUnite = useUnite();
    const itemTile = useTitle();
    const itemOption = useOption();


    const [inputs, setInputs] = useState([{
        quantity_all: '',
        option_id_fk: '',
        qty_baht:''
    }])
    const handleChange = (name, value) => {
        setInputs({
            ...inputs, [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs)
        // try {
        //     axios.post(api + 'tileps/create', inputs)
        //         .then(function (res) {
        //             if (res.status === 200) {
        //                 handleClose();
        //                 fetchTypePorduct();
        //                 Alert.successData(res.data.message)
        //             } else {
        //                 Alert.errorData(res.data.message)
        //             }
        //         });
        // } catch (error) {
        //     console.error('Error inserting data:', error);
        // }
    };




    const [rowse, setRowse] = useState([
        { id: 1, content: 'Row 1' },
    ]);
    const addRow = () => {
        const newRow = {
            id: rowse.length + 1,
            content: `Row ${rowse.length + 1}`,
        };
        setRowse([...rowse, newRow]);
    };
    const removeRow = (id) => {
        const updatedRows = rowse.filter((row) => row.id !== id);
        setRowse(updatedRows);
    };

    return (
        <>
            <div id="content" class="app-content">
                <ol class="breadcrumb float-xl-end">
                    <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                    <li class="breadcrumb-item "><Link to={'/product'}>ລາຍການສິນຄ້າ</Link></li>
                    <li class="breadcrumb-item active">ແບບຟອມບັນທຶກຂໍ້ມູນ</li>
                </ol>
                <h1 class="page-header mb-3"> <span className='me-3 text-danger' onClick={handleGoBack}><i class="fa-solid fa-circle-arrow-left"></i></span> ຟອມບັນທຶກສິນຄ້າ</h1>


                <div className="panel p-3">
                <form onSubmit={handleSubmit}>
                    <div className="row ">
                        <div className="form-group col-sm-6">
                            <label htmlFor="" className='form-label'>ເລືອກລາຍການສິນຄ້າ</label>
                            <SelectPicker name='tiles_id_fk' data={itemTile} block placeholder="ເລືອກສິນຄ້າ" required />
                        </div>
                        <div className="form-group col-sm-6">
                            <Button type='submit' appearance="primary" className='mt-4' block> ບັນທຶກ</Button>
                        </div>
                    </div>
                    <hr className='border-blue' />
                    {rowse.map((row, key) => (
                        <div className="row mb-2">
                            <div className="col-sm-3">
                                <label htmlFor="" className='form-label'>ນ້ຳໜັກ</label>
                                <Input type="number" name='qty_baht'  onChange={(e) => handleChange('qty_baht', e)} placeholder='ນ້ຳໜັກ' required />
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="" className='form-label'>ຂະໜາດ</label>
                                <SelectPicker name='option_id_fk'  onChange={(e) => handleChange('option_id_fk', e)} data={itemOption} block placeholder="ເລືອກ" />
                            </div>
                            <div className="col-sm-2 col-8">
                                <label htmlFor="" className='form-label'>ຈຳນວນ</label>
                                <Input type="number" name='quantity_all'  onChange={(e) => handleChange('quantity_all', e)} defaultValue={0} />
                            </div>
                            
                            <div className="col-sm-1 col-4">
                                {key + 1 > 1 ? (
                                    <button className='btn btn-danger mt-4' onClick={() => removeRow(row.id)}><i class="fa-solid fa-circle-minus"></i></button>
                                ) : (<button className='btn btn-primary mt-4' onClick={addRow}><i class="fa-solid fa-plus"></i></button>)}
                            </div>
                        </div>
                    ))}
                    </form>
                </div>
            </div>
        </>
    )
}

export default FormPorduct