
import React,{useEffect,useState} from 'react';
import { Line } from 'react-chartjs-2';
import { Config } from '../../config/connect';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const api =Config.urlApi;
const LineChart = () => {
  const [price, setPrice] = useState({ dateList: [], price_sale: [] });
  const showPrice = async () => {
    try {
      const response = await fetch(`${api}home/price/1`);
      const jsonData = await response.json();
      setPrice({
        dateList: jsonData.data.map(item => item.update_date),
        price_sale: jsonData.data.map(item => (item.price_sale_new*item.grams)),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(()=>{
    showPrice()
  },[])


  const data = {
    labels: price.dateList,
    datasets: [
      {
        label: 'ລາຄາຂາຍ',
        data: price.price_sale,
        fill: false,
        borderColor: 'rgb(255,140,0)',
        tension: 0.1,
      },
    ],
  }

  // Define options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return <Line data={data} options={options}  />;
};


const LineChartBuy = () => {
  const [price, setPrice] = useState({ dateList: [], price_buy: [] });
  const showPriceBuy = async () => {
    try {
      const response = await fetch(`${api}home/price/1`);
      const jsonData = await response.json();
      setPrice({
        dateList: jsonData.data.map(item => item.update_date),
        price_buy: jsonData.data.map(item => (item.price_buy_new*item.grams)),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(()=>{
    showPriceBuy()
  },[]) 
  
    const data = {
      labels: price.dateList,
      datasets: [
        {
          label: 'ລາຄາຊື້',
          data: price.price_buy,
          fill: false,
          borderColor: 'green',
          tension: 0.1,
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
       
      },
    };
    return (
          <Line data={data} options={options} />
      );
  
  };

  //==================


  const PriceChartSale = () => {
    const [price, setPrice] = useState({ dateList: [], price_sale: [] });
    const showPriceBuy = async () => {
      try {
        const response = await fetch(`${api}home/price/2`);
        const jsonData = await response.json();
        setPrice({
          dateList: jsonData.data.map(item => item.update_date),
          price_sale: jsonData.data.map(item => (item.price_sale_new*item.grams)),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    useEffect(()=>{
      showPriceBuy()
    },[]) 
    
  
  
      const data = {
        labels: price.dateList,
        datasets: [
          {
            label: 'ລາຄາຊື້',
            data: price.price_sale,
            fill: false,
            borderColor: 'rgb(255,140,0)',
            tension: 0.1,
          },
        ],
      };
    
      // Define options for the chart
      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
         
        },
      };
      return (
            <Line data={data} options={options} />
        );
    
    };

    const PriceChartBuy = () => {
      const [price, setPrice] = useState({ dateList: [], price_buy: [] });
      const showPriceBuy = async () => {
        try {
          const response = await fetch(`${api}home/price/2`);
          const jsonData = await response.json();
          setPrice({
            dateList: jsonData.data.map(item => item.update_date),
            price_buy: jsonData.data.map(item => (item.price_buy_new*item.grams)),
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      useEffect(()=>{
        showPriceBuy()
      },[]) 
      
    
    
        const data = {
          labels: price.dateList,
          datasets: [
            {
              label: 'ລາຄາຊື້',
              data: price.price_buy,
              fill: false,
              borderColor: 'green',
              tension: 0.1,
            },
          ],
        };
      
        // Define options for the chart
        const options = {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
           
          },
        };
        return (
              <Line data={data} options={options} />
          );
      
      };
  


  export { LineChart, LineChartBuy,PriceChartSale,PriceChartBuy };
