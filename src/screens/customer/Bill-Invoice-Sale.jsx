import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import '../../assets/main-style.css';
function BillInvoiceSale({ show, handleClose }) {
    return (
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Body className='p-0 '>
                <div className="section-bg-one ">
                    <main class="main-wrapper position-relative">
                        <div class="modern-invoice3" id="download-section">
                            <div class="invoice-top">
                                <div class="row align-items-center">
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 text-center text-sm-start mb-3 mb-sm-1">
                                        <img src="/assets/img/logo/logo.png" class="img-fluid w-25" title="invoice" alt="invoice" />
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 text-center text-sm-end mb-3 mb-sm-1">
                                        <h4 class="text-35 text-uppercase mb-0 mt-0">Invoice</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="invoice-details pt-20">
                                <div class="row">
                                    <div class="col-sm-6 text-sm-end order-sm-1">
                                        <strong class="text-18 mb-3 d-inline-block">Pay To:</strong>
                                        <address class="mb-4">
                                            initTheme<br />
                                            1216 R. Dhaka, Bangladesh<br />
                                            Bonani, OX Bokki<br />
                                            contact@inittheme.com
                                        </address>
                                    </div>
                                    <div class="col-sm-6 order-sm-0">
                                        <strong class="text-18 mb-3 d-inline-block">Invoiced To:</strong>
                                        <address class="mb-4">
                                            Rafsan Jani<br />
                                            16/10 A Banasree<br />
                                            1508C uttor AN<br />
                                            kolkata , india
                                        </address>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive invoice-table mb-4">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item</th>
                                            <th>Description</th>
                                            <th class="black-bg">Unit Cost</th>
                                            <th class="black-bg">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Origin License</td>
                                            <td>Extended License</td>
                                            <td>$999,00</td>
                                            <td>$999,00</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Custom Services</td>
                                            <td>Instalation </td>
                                            <td>$150,00</td>
                                            <td>$3.000,00</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Hosting</td>
                                            <td>1 year subcription</td>
                                            <td>$499,00</td>
                                            <td>$499,00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="row">
                                <div class="col-lg-8 col-md-8 col-sm-6"></div>
                                <div class="col-lg-4 col-md-4 col-sm-6 ms-auto">
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong class="status">Subtotal</strong>
                                                </td>
                                                <td>$8.497,00</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong class="status">Discount (20%)</strong>
                                                </td>
                                                <td>$1,699,40</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong class="status">VAT (10%)</strong>
                                                </td>
                                                <td>$679,76</td>
                                            </tr>
                                            <tr class="total-pay">
                                                <td class="border-bottom-0">
                                                    <strong>Total</strong>
                                                </td>
                                                <td class="border-bottom-0">
                                                    <strong>$7.477,36</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12 mb-20">
                                    <span class="status d-block mb-20"> <strong>Date :</strong> 01-12-2023</span>
                                    <h5 class="mb-2 text-title font-700"> Important: </h5>
                                    <p>This is an electronic generated invoice so doesn't require any signature. </p>
                                    <p>Please read all terms and polices on www.yourdomaon.com for returns, replacement and other issues.</p>
                                </div>
                            </div>
                            <div class="signature text-right">
                                <img src="assets/images/sign.svg" alt="img" />
                                <p>SAIFUL ISLAM</p>
                                <h5 class="text-title font-500 text-18"> Product Manager </h5>
                            </div>
                        </div>
                    </main>
                </div>
            </Modal.Body>

        </Modal>
    )
}

export default BillInvoiceSale