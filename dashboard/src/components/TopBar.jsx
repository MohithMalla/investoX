import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";

const TopBar = () => {
  const [nifty, setNifty] = useState(null);
  const [sensex, setSensex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const niftyRes = await axios.get("https://investox-az5r.onrender.com/api/stock/^NSEI");
        const sensexRes = await axios.get("https://investox-az5r.onrender.com/api/stock/^BSESN");

        const getLastPrice = (data) => data.chart.result[0].meta.regularMarketPrice;
        const niftyPrice = getLastPrice(niftyRes.data);
        const sensexPrice = getLastPrice(sensexRes.data);

        setNifty(niftyPrice.toFixed(2));
        setSensex(sensexPrice.toFixed(2));
      } catch (error) {
        console.error("Error fetching index data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <style>{`
        .topbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 1px;
          background-color: #fff;
          flex-wrap: wrap;
        }

        .indices-container {
          display: flex;
          gap: 50px;
          flex-wrap: wrap;
        }

        .index-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .index-name {
          font-weight: 500;
          font-size: 14px;
          color: #4a4a4a;
        }

        .index-price {
          font-size: 14px;
          color: #d32f2f;
        }

        @media (max-width: 600px) {
          .indices-container {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <div className="topbar-container">
        <div className="indices-container">
          <div className="index-box">
            <span className="index-name">NIFTY 50</span>
            <span className="index-price">{nifty || "--"}</span>
          </div>
          <div className="index-box">
            <span className="index-name">SENSEX</span>
            <span className="index-price">{sensex || "--"}</span>
          </div>
        </div>

        <Menu />
      </div>
    </>
  );
};

export default TopBar;
