import React from "react";
import LineChart from "./LineChart";
function ChartPrice() {
    const UserData = [
        { id: 1, month: 'ເດືອນ 01', userGain: 80000, userLost: 823 },
        { id: 2, month: 'ເດືອນ 02', userGain: 45677, userLost: 345 },
        { id: 3, month: 'ເດືອນ 03', userGain: 78888, userLost: 555 },
        { id: 4, month: 'ເດືອນ 04', userGain: 90000, userLost: 4555 },
        { id: 5, month: 'ເດືອນ 05', userGain: 4300, userLost: 234 },
        { id: 6, month: 'ເດືອນ 06', userGain: 4300, userLost: 234 },
        { id: 7, month: 'ເດືອນ 07', userGain: 4304, userLost: 2004 },
        { id: 8, month: 'ເດືອນ 08', userGain: 4304, userLost: 2004 },
        { id: 9, month: 'ເດືອນ 09', userGain: 4304, userLost: 2004 },
        { id: 10, month: 'ເດືອນ 10', userGain: 4304, userLost: 2004 },
        { id: 11, month: 'ເດືອນ 11', userGain: 4304, userLost: 2004 },
        { id: 12, month: 'ເດືອນ 12', userGain: 4304, userLost: 2004 },
        { id: 1, month: 'ເດືອນ 01', userGain: 80000, userLost: 823 },
        { id: 2, month: 'ເດືອນ 02', userGain: 45677, userLost: 345 },
        { id: 3, month: 'ເດືອນ 03', userGain: 78888, userLost: 555 },
        { id: 4, month: 'ເດືອນ 04', userGain: 90000, userLost: 4555 },
        { id: 5, month: 'ເດືອນ 05', userGain: 4300, userLost: 234 },
        { id: 6, month: 'ເດືອນ 06', userGain: 4300, userLost: 234 },
        { id: 7, month: 'ເດືອນ 07', userGain: 4304, userLost: 2004 },
        { id: 8, month: 'ເດືອນ 08', userGain: 4304, userLost: 2004 },
        { id: 9, month: 'ເດືອນ 09', userGain: 4304, userLost: 2004 },
        { id: 10, month: 'ເດືອນ 10', userGain: 4304, userLost: 2004 },
        { id: 11, month: 'ເດືອນ 11', userGain: 4304, userLost: 2004 },
        { id: 12, month: 'ເດືອນ 12', userGain: 4304, userLost: 2004 },
      ];
      
      
      const userChartData = {
        labels: UserData.map((data) => data.month),
        datasets: [
          {
            label: 'ລາຄາຂາຍ',
            data: UserData.map((data) => data.userGain),
            backgroundColor: ['#2a71d0'],
            borderColor: 'black',
            borderWidth: 1,
            Highlight:50
          },
        ],
      };

  return (
  
    <LineChart chartData={userChartData}  />

)
}

export default ChartPrice;