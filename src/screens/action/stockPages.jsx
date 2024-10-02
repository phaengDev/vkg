import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { Config } from '../../config/connect'
import { Pagination } from 'rsuite';
export default function StockPages() {
    const api=Config.urlApi;
    const [groupedProducts, setGroupedProducts] = useState({});
    const [activePage, setActivePage] = useState({});
    const limit = 5; // Number of items per page

    const showProduct = async () => {
        try {
            const response = await fetch(`${api}posd/st-group`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const items = await response.json();
            const groupedData = groupBy(items, 'option_name');
            setGroupedProducts(groupedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };

    useEffect(() => {
        showProduct();
    }, []);

    const handlePageChange = (page, group) => {
        setActivePage(prev => ({ ...prev, [group]: page }));
    };

    const limitOptions = [5, 10, 50,100];
    return (
        <div id="content" class="app-content px-3">
            <ol class="breadcrumb float-xl-end">
                <li class="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                <li class="breadcrumb-item"><Link to={'/stock'}>ລາຍການ</Link></li>
                <li class="breadcrumb-item active">ສະຕ໋ອກລວມ</li>
            </ol>
            <h1 class="page-header mb-3"><Link to={'/stock'}  ><i class="fa-solid fa-circle-arrow-left text-red" /></Link> ສາງສິນຄ້າລວມ</h1>
            <div className="row">
            {Object.entries(groupedProducts).map(([optionName, products]) => {
                const currentPage = activePage[optionName] || 1;
                const totalPages = Math.ceil(products.length / limit);
                const paginatedProducts = products.slice((currentPage - 1) * limit, currentPage * limit);

                return (
                    <div className="col-sm-4" key={optionName}>
                        <div className="panel panel-inverse">
                            <div className="panel-heading bg-vk">
                                ຫົວໜ່ວຍ {optionName}
                            </div>
                            <div className="panel-body p-0 pb-0">
                                <table className="table text-nowrap fs-13px">
                                    <thead>
                                        <tr className=''>
                                            <td className='text-blue'>ປະເພດ</td>
                                            <td width={'20%'} className='text-center text-blue'>ນ້ຳໜັກ</td>
                                            <td width={'10%'} className='text-center text-blue'>ຈຳນວນ</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedProducts.map(product => (
                                            <tr key={product.product_uuid}>
                                                <td><i class="fa-solid fa-angle-right" /> {product.tile_name}</td>
                                                <td className='text-center'>{product.qty_baht} ({optionName})</td>
                                                <td className='text-center'>{product.quantity} {product.unite_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* {totalPages > 1 && ( */}
                                <div  className='p-3 text-center'>
                                    <Pagination
                                        prev
                                        last
                                        next
                                        first
                                        size="xs"
                                        total={products.length}
                                        limit={limit}
                                        activePage={currentPage}
                                        onChangePage={page => handlePageChange(page, optionName)}
                                    />
                                    </div>
                                {/* )} */}
                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
        </div>
    )
}
