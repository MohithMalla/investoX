import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/allHoldings").then((res) => {
      // console.log(res.data);
      setAllHoldings(res.data);
    });
  }, []);

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // export const data = {
  //   labels,
  //   datasets: [
  // {
  //   label: 'Dataset 1',
  //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
  // },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };

const totalInvestment = holdings.reduce((sum, stock) => {
  return sum + stock.avg * stock.qty;
}, 0);

const currentValue = holdings.reduce((sum, stock) => {
  return sum + stock.price * stock.qty;
}, 0);

const profitLoss = currentValue - totalInvestment;
const profitLossPercent = (profitLoss / totalInvestment) * 100;


  return (
    <>
      <h3 className="title" style={{marginTop:"-40px",marginBottom:"10px"}}>Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
  <thead>
    <tr >
      <th>Instrument</th>
      <th>Qty.</th>
      <th>Avg. cost</th>
      <th>LTP</th>
      <th>Cur. val</th>
      <th>P&L</th>
      <th>Net chg.</th>
      <th>Day chg.</th>
    </tr>
  </thead>
  <tbody>
    {holdings.map((stock, index) => {
      const curValue = stock.price * stock.qty;
      const isProfit = curValue - stock.avg * stock.qty >= 0.0;
      const profClass = isProfit ? "profit" : "loss";
      const dayClass = stock.isLoss ? "loss" : "profit";



      return (
        <tr key={index} style={{width:"95%"}}>
          <td>{stock.name}</td>
          <td>{stock.qty}</td>
          <td>{stock.avg.toFixed(2)}</td>
          <td>{stock.price.toFixed(2)}</td>
          <td>{curValue.toFixed(2)}</td>
          <td className={profClass}>
            {(curValue - stock.avg * stock.qty).toFixed(2)}
          </td>
          <td className={profClass}>{stock.net}</td>
          <td className={dayClass}>{stock.day}</td>
        </tr>
      );
    })}
  </tbody>
</table>

      </div>

      <div className="row mt-4" >
        <div className="col text-center">
          <h5>
            {totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col text-center">
          <h5>
              {currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>

        </div>
        <div className="col text-center">
          <h5>
            {profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;