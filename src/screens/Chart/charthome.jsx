// import { useState } from "react";
import BarChart from "./BarChart";
// import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { UserData,PriceData} from "./Data";
function MyChart() {
  const userChartData = {
    labels: UserData.map((data) => data.month),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: ["#2a71d0", "orange"],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const priceChartData = {
    labels: PriceData.map((data) => data.typeName),
    datasets: [
      {
        label: "ຍອດທັງໝົດ",
        data: PriceData.map((data) => data.userGain),
        backgroundColor: ["orange", "#2a71d0"],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  // IF YOU SEE THIS COMMENT: I HAVE GOOD EYESIGHT

  return (
   <>
   <div className="row">
    <div className="col-sm-8">
    <BarChart chartData={userChartData} />
    </div>
    <div className="col-sm-4">
    <PieChart chartData={priceChartData} />
    </div>
   </div>
   </>
  );
}

export default MyChart;
