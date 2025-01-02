import React, { useState, useEffect } from 'react'
import { Modal, Button, Grid, Row, Col, SelectPicker, Placeholder,Loader, Input } from 'rsuite';
import { Config } from '../../config/connect';
import { useTitle, useOption, useZone } from '../../utils/selectOption';
import axios from 'axios';
import { Notification } from '../../utils/Notifig';
export default function FormReceivedMt({ open, hadleClose, fetchData }) {

    const api = Config.urlApi;
    const branch_id_fk = localStorage.getItem('branch_id_fk');
    const received_byid = localStorage.getItem('user_uuid');

    const type = useTitle();
    const option = useOption();
    const zone = useZone();

    const [search, setSearch] = useState({
        tiles_id_fk:'',
        option_id_fk:''
    });
    const [itemPorduct, setItemPorduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const showPorduct = async () => {
        try {
            const response = await axios.post(api + 'posd/pdAll',search);
            const jsonData = response.data;
          
            setItemPorduct(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const hanleFilter = (name,event) => {
        setSearch({
            ...search,
            [name]:event
        });
    }
    
// =======================

    const [selectedItems, setSelectedItems] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false); // State for "Check All" checkbox
    // Toggle "Check All"
    const handleCheckAll = () => {
        if (isAllChecked) {
            setSelectedItems([]); // Uncheck all
        } else {
            const allSelected = itemPorduct.map((item) => ({
                product_uuid: item.product_uuid,
                received_qty: '',
            }));
            setSelectedItems(allSelected); // Check all
        }
        setIsAllChecked((prev) => !prev);
    };

    const handleCheckboxChange = (product_uuid) => {
        setSelectedItems((prevState) => {
            const isSelected = prevState.find((item) => item.product_uuid === product_uuid);
            if (isSelected) {
                return prevState.filter((item) => item.product_uuid !== product_uuid);
            } else {
                return [...prevState, { product_uuid, received_qty: '' }];
            }
        });
    };

    const handleQtyChange = (product_uuid, received_qty) => {
        setSelectedItems((prevState) =>
            prevState.map((item) =>
                item.product_uuid === product_uuid ? { ...item, received_qty } : item
            )
        );
    };


const [zone_id_fk, setZone_id_fk] = useState(null);
const [saveLoad,setSaveLoad] = useState(false);
    const handleSave = async () => {
       if(zone_id_fk !== null || zone_id_fk !== ''){
        setSaveLoad(true)
        const values={
            zone_id_fk: zone_id_fk,
            branch_id_fk: branch_id_fk,
            received_byid: received_byid,
            dataList: selectedItems,
        }
        try {
            axios.post(api + 'received/createMt', values)
                .then(function (res) {
                    console.log(res.data);
                    if (res.status === 200) {
                        fetchData();
                        hadleClose();
                        Notification.success(res.data.message,'ແຈ້ງເຕືອນ');
                    }else {
                        Notification.error(res.data.message,'ແຈ້ງເຕືອນ')
                    }
                })
        } catch (error) {
            Notification.error('ການເພີ່ມຂໍ້ມູນບໍ່ສາມາດບັນທຶກໄດ້', 'ແຈ້ງເຕືອນ')
        }
        finally {
            setSaveLoad(false);
        }
    }
    }

    useEffect(() => {
        if(open){
        showPorduct();
        }
        if (selectedItems.length === itemPorduct.length) {
            setIsAllChecked(true);
        } else {
            setIsAllChecked(false);
        }
    }, [selectedItems,search,branch_id_fk,open]);

    return (
        <>
            <Modal size={"lg"} open={open} onClose={hadleClose}>
                <Modal.Header>
                    <Modal.Title className='my-1'>ຟອມນຳເຂົ້າສິນຄ້າ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col xs={24} sm={8} md={8}>
                                <label className='form-label'>ຊື່ສິນຄ້າ</label>
                                <SelectPicker data={type} onChange={(value) => hanleFilter('tiles_id_fk',value)} block />
                            </Col>
                            <Col xs={24} sm={6} md={6}>
                                <label className='form-label'>ຫົວໜ່ວຍ</label>
                                <SelectPicker data={option} onChange={(value) => hanleFilter('option_id_fk',value)} block placeholder='ຫົວໜ່ວຍ' />
                            </Col>
                            {selectedItems.length > 0 && (
                                <>
                                    <Col xs={20} sm={6} md={6} >
                                        <label className='form-label'>ໂຊນຂາຍ ຫຼ ຕູ້ຂາຍ</label>
                                        <SelectPicker data={zone} onChange={(value) => setZone_id_fk(value)} block placeholder="ໂຊນຂາຍ ຫຼ ຕູ້ຂາຍ" />
                                           {zone_id_fk ===null && <label className='text-red'>ກະລຸນາເລືອກໂຊນຂາຍ ຫຼ ຕູ້ຂາຍ</label>}
                                    </Col>
                                    <Col xs={4} sm={4} md={4}>
                                        <Button color='blue' onClick={handleSave} block appearance='primary' className='mt-4' disabled={zone_id_fk === null?true:false}> {saveLoad ? <Loader content="ກຳລັງບັນທຶກ..." />:(<> <i className="fas fa-check me-2" />  ຢືນຢັນນຳເຂົ້າ </>)} </Button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </Grid>

                    <div className="table-responsive mt-1">
                        <table className="table table-hover table-bordered">
                            <thead className='thead-plc'>
                                <tr className='text-center'>
                                    <th className='text-center w-1' >
                                        <input class="form-check-input" type="checkbox" checked={isAllChecked}  onChange={handleCheckAll} />
                                    </th>
                                    <th>ລະຫັດສິນຄ້າ</th>
                                    <th>ຊື່ສິນຄ້າ</th>
                                    <th>ນ້ຳໜັກ</th>
                                    <th width="20%" >ຈໍານວນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? <>
                                    <Placeholder.Grid rows={5} columns={6} active />
                                    <Loader size={"lg"} backdrop content="ກຳລັງໂຫລດຂໍ້ມູນ..." vertical />
                                </> : (
                                    <>
                                        {itemPorduct.map((item) => {
                                            const selectedItem = selectedItems.find(
                                                (selected) => selected.product_uuid === item.product_uuid
                                            );
                                            return (
                                                <tr className='text-center' key={item.product_uuid}>
                                                    <td>
                                                        <input class="form-check-input is-invalid" type="checkbox"
                                                            checked={!!selectedItem}
                                                            onChange={() => handleCheckboxChange(item.product_uuid)} />
                                                    </td>
                                                    <td>{item.code_id}</td>
                                                    <td>{item.tile_name}</td>
                                                    <td>{item.qty_baht} {item.option_name}</td>
                                                    <td className='py-1'>
                                                        <Input type='number' size='sm' placeholder='ຈໍານວນ'
                                                            disabled={!selectedItem}
                                                            value={selectedItem?.received_qty || ''}
                                                            onChange={(value) =>
                                                                handleQtyChange(item.product_uuid, value)
                                                            }
                                                            required={!selectedItem} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hadleClose} appearance='primary' color='red'>ປິດ</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
