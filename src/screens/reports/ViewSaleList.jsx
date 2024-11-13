import React, { useEffect } from 'react';
import { Modal, Button } from 'rsuite';
import moment from 'moment';
import numeral from 'numeral';

function ViewSaleList({ open, handleModal, data }) {
    console.log(data);
    const formatCurrency = (value) => numeral(value).format('0,00');

    // Calculating totals
    const totalQtyCost = data?.dataList?.reduce((acc, item) => acc + parseFloat(item.order_qty * item.price_pattern * item.qty_baht), 0) || 0;
    const totalBalance = data?.dataList?.reduce((acc, item) => acc + parseFloat(item.total_balance), 0) || 0;

    return (
        <Modal size="lg" open={open} onClose={handleModal}>
            <Modal.Header>
                <Modal.Title className="py-2">ລາຍລະອຽດບິນ: {data?.sale_billNo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mb-3">
                    <div className="col-12 text-center">
                        <img src="./assets/img/logo/logo.png" className="w-10" alt="Logo" />
                    </div>
                    <div className="col-6">
                        <div>ຮ້ານຄຳ ນາງວຽງຄຳ </div>
                        <div>ເບີໂທລະສັບ: 02095555609</div>
                        <div>ເອມລ໌: example@example.com</div>
                        <div>ຕັ້ງຢູ່: ຕະຫລາດເຊົ້າມໍຊັ້ນ2</div>
                        <div>ບ້ານ ຫັດສະດີ, ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ</div>
                    </div>
                    <div className="col-6 text-end">
                        <div className="fs-18px">No: {data?.sale_billNo}</div>
                        <div className="fs-16px">Date: {moment(data?.sale_date).format('DD/MM/YYYY hh:mm')}</div>
                        <div>ຊື່ລູກຄ້າ: {data?.cus_fname} {data?.cus_lname}</div>
                        <div>ເບີໂທລະສັບ: {data?.cus_tel}</div>
                        <div>ທີ່ຢູ່: {data?.cus_address}</div>
                    </div>
                </div>

                <table className="table table-bordered align-middle w-100 text-nowrap">
                    <thead>
                        <tr>
                            <th className="text-center">ລ/ດ</th>
                            <th className="text-center">ລະຫັດ</th>
                            <th>ຊື່ສິນຄ້າ</th>
                            <th className="text-center">ນ້ຳໜັກ</th>
                            <th className="text-center">ກຣາມ</th>
                            <th className="text-center">ຊື້ເພີ່ມ</th>
                            <th className="text-center">ຈຳນວນ</th>
                            <th className="text-end">ຄ່າລາຍ</th>
                            <th className="text-end">ລວມເງິນ</th>
                            <th>ໂຊນຂາຍ</th>
                            <th>ພະນັກງານຂາຍ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.dataList?.map((item, index) => (
                            <tr key={item.code_id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{item.code_id}</td>
                                <td>{item.tile_name}</td>
                                <td className="text-center">{item.qty_baht} {item.option_name}</td>
                                <td className="text-center">{item.qty_grams} g</td>
                                <td className="text-center">{item.qty_sale_add > 0 ? `+ ${item.qty_sale_add}` : '-'}</td>
                                <td className="text-center">{item.order_qty} / {item.unite_name}</td>
                                <td className="text-end">{formatCurrency(item.order_qty * item.price_pattern)}</td>
                                <td className="text-end">{formatCurrency(item.total_balance)}</td>
                                <td>{item.zone_name}</td>
                                <td>{item.staff_name}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={7} className="text-end">ລວມຍອດທັງໝົດ</td>
                            <td className="text-end bg-black text-white">{formatCurrency(totalQtyCost)}</td>
                            <td className="text-end bg-black text-white">{formatCurrency(totalBalance)}</td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>

                <hr />

                <table className="table">
                    <tbody>
                        <tr>
                            <td width="30%" rowSpan={5} className="text-end border-0">ປະເພດຈ່າຍເງິນ: {data?.currency_name} ({data?.genus})</td>
                            <td className="text-end border-0">ລວມເປັນເງິນ:</td>
                            <td>{formatCurrency(data?.balance_totalpay)} {data?.genus}</td>
                        </tr>
                        <tr>
                            <td className="text-end border-0">ຈ່າຍເງິນສົດ:</td>
                            <td>{formatCurrency(data?.balance_cash)} {data?.genus}</td>
                        </tr>
                        <tr>
                            <td className="text-end border-0">ຈ່າຍເງິນໂອນ:</td>
                            <td>{formatCurrency(data?.balance_transfer)} {data?.genus}</td>
                        </tr>
                        <tr>
                            <td className="text-end border-0">ເງິນທອນ:</td>
                            <td>{formatCurrency(data?.balance_return)} ₭</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="text-left">ພະນັກງານຂາຍ: {data?.first_name} {data?.last_name}</td>
                        </tr>
                    </tfoot>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleModal} appearance="primary" color="red">ອອກ</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewSaleList;
