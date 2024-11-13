import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import FormAddPolicy from './formAdd-policy';
import { Config } from '../config/connect';
function PolicyShop() {
    const api = Config.urlApi;
    const [show, setShow] = useState(false);
    const addItemPolicy = () => {
        setShow(true)
        setData('')
    }

    const [itemPolicy, setItemPolicy] = useState([]);
    const fetchPolicy = async () => {
        try {
            const response = await fetch(api + 'policy/');
            const jsonData = await response.json();
            setItemPolicy(jsonData);
            console.log(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const [data, setData] = useState('');
    const handleEdit = (data) => {
        setData(data);
        setShow(true)
    }


    const handleDelete = async (id) => {
        
    }


    useEffect(() => {
        fetchPolicy()
    }, [])
    return (
        <div id="content" className="app-content px-3">
            <ol className="breadcrumb float-end">
                <li className="breadcrumb-item"><Link to={'/home'}>ໜ້າຫຼັກ</Link></li>
                <li className="breadcrumb-item active">ຕັ້ງຄ່ານະໂຍບາຍ</li>
                <li className="breadcrumb-item text-green fs-16px" onClick={addItemPolicy} role='button'><i class="fa-solid fa-plus"></i> ເພີ່ມລາຍການໃໝ່</li>
            </ol>
            <h1 className="page-header  mb-3">ນະໂຍບາຍ ຂອງຮ້ານຄຳ ນາງວຽງຄຳ </h1>
            <div class="accordion" id="accordion">
                {itemPolicy.map((item, index) => (
                    <div class="accordion-item border-0">
                        <div class="accordion-header" id="headingOne">
                            <button class="accordion-button bg-vk text-white px-3 py-10px pointer-cursor fs-16px" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne-${item.policy_id}`}>
                                <div>  <i class="fa fa-circle fa-fw text-white me-2 fs-8px"></i> {index + 1}. {item.policy_name}</div>
                            </button>
                        </div>
                        <div id={`collapseOne-${item.policy_id}`} className={`accordion-collapse collapse ${index === 0 && 'show'}`} data-bs-parent={`#accordion-${item.policy_id}`}>
                            <div class="accordion-body">
                                <div dangerouslySetInnerHTML={{ __html: item.policy_detail }} />
                            </div>
                            <div className='float-end fs-16px p-3'>
                                <button type='button' className='btn btn-success btn-xs' role='button' onClick={() => handleEdit(item)}>edit</button>
                                <button type='button' className='btn btn-danger btn-xs ms-2' role='button' onClick={() => handleDelete(item.policy_id)}>delete</button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            <FormAddPolicy
                show={show}
                handleClose={() => setShow(false)}
                fetchPolicy={fetchPolicy}
                val={data}
            />

        </div>
    )
}

export default PolicyShop