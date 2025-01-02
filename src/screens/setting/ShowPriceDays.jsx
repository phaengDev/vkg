import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Config, Urlimage } from '../../config/connect';
import numeral from 'numeral';
function ShowPriceDays() {
    const api = Config.urlApi;
    const img = Urlimage.url;
    const [datasch, setDatasch] = useState({
        typeId: '',
    })

    const [itemData, setItemData] = useState([]);
    const fecthData = async () => {
        try {
            const response = await axios.post(api + 'price/', datasch);
            setItemData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const [itemoPtion, setItemoPtion] = useState([]);
  const fetchOption = async () => {
    try {
      const response = await fetch(api + 'type/option');
      const jsonData = await response.json();
      setItemoPtion(jsonData);
    } catch (error) {
      setItemoPtion([])
    }
  }

  const [chartData, setChartData] = useState({
    series: [{
        name: 'ລາຄາຂາຍ',
        type: 'column',
        data: [], // Data will be fetched dynamically
        color: '#EFBF04',
      }],
      options: {
        chart: {
          height: 450,
          type: 'line',
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: 'ລາຄາຂາຍທອງຄຳປະຈຳວັນ',
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: [], // Dates will be fetched dynamically
        yaxis: [{
          title: {
            text: 'ລາຄາຂາຍ',
          },
          labels: {
            formatter: (value) => numeral(value).format('0,0.00'), // Format Y-axis labels
          },
        }],
      }
  });






  const showPrice = async () => {
    try {
      const response = await fetch(`${api}home/price/1`);
      const jsonData = await response.json();
      const dates = jsonData.data.map(item => item.update_date);
      const prices = jsonData.data.map(item => item.price_sale_new * item.grams);

      setChartData(prevState => ({
        ...prevState,
        series: [{
          ...prevState.series[0],
          data: prices,
        }],
        options: {
          ...prevState.options,
          labels: dates,
        },
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    useEffect(() => {
        showPrice();
        fetchOption();
        fecthData();
    }, [])
    const texts = (text, size) => {
        return (
            <svg width='auto' height="55" xmlns="http://www.w3.org/2000/svg" >
                <defs>
                    <linearGradient id="grad2" y2="1" x2="1" x1="1" y1="0.1433">
                        <stop stop-color="rgb(255, 213, 127)" offset="0" />
                        <stop stop-color="rgb(179, 149, 0)" offset="0.4817" />
                        <stop stop-color="rgb(179, 149, 0)" offset="1" />
                    </linearGradient>
                </defs>
                <text font-family="arial" font-size={size} id="svg_1" y="45" x="288" fill="url(#grad2)" font-weight="bold">
                    <tspan x="10" y="45">{text}</tspan>
                </text>
            </svg>
        )
    }

    return (
        <div id="app" className="app p-0">
            <div className="login login-v1 ">
                <div className="login-container p-5">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card3">
                                <ReactApexChart  series={chartData.series}   options={chartData.options}
       type="line" height={450} />
                            </div>
                        </div>
                        <div className="col-sm-6 ">
                            <div className="card3">
                                <h3 className="text-center mb-1">
                                    
                                </h3>

                                {itemData.map((item, index) => (
                                    <table className="table text-nowrap fs-1">
                                        <thead>
                                            <tr>
                                                <th colSpan={2}> <center> {texts(`ລາຄາຂາຍ ${item.typeName} ວັນນີ້`, '40')} </center></th>
                                            </tr>
                                            </thead>
                                        <tbody>
                                            {(item.type_id_fk === 2 ? itemoPtion.slice(0, 1) :
                                                itemoPtion).map((val, key) =>
                                                    <tr key={key}>
                                                        <td className='border-0 w-30'>{texts(`ລາຄາ 1 ${val.option_name}:`,30)}</td>
                                                        <td className='border-0'>
                                                            {texts(`${numeral(item.price_sale * val.grams).format('0,00.00')} ₭`,35)}
                                                         </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowPriceDays