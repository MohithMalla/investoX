import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnoutChart"; // Your existing chart component

import {
  Tooltip,
  Grow,
} from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

const STOCK_SYMBOLS = [
  "INFY.NS",
  "TCS.NS",
  "WIPRO.NS",
  "RELIANCE.NS",
  "HINDUNILVR.NS",
  "ONGC.NS",
  "M&M.NS",
  "KPITTECH.NS",
  // "HDFC.NS",
  "ICICIBANK.NS",
  "SBIN.NS",
  "AXISBANK.NS",
  "BHARTIARTL.NS",
  "TATAMOTORS.NS",
  "LT.NS",
  "ULTRACEMCO.NS",
  "BAJFINANCE.NS",
  "ADANIGREEN.NS",
  "DRREDDY.NS",
  "MARUTI.NS",
];

const COLORS_BG = [
  "rgba(255, 99, 132, 0.5)",    // Red
  "rgba(54, 162, 235, 0.5)",    // Blue
  "rgba(255, 206, 86, 0.5)",    // Yellow
  "rgba(75, 192, 192, 0.5)",    // Teal
  "rgba(153, 102, 255, 0.5)",   // Purple
  "rgba(255, 159, 64, 0.5)",    // Orange
  "rgba(255, 99, 71, 0.5)",     // Tomato
  "rgba(60, 179, 113, 0.5)",    // Medium Sea Green
  "rgba(100, 149, 237, 0.5)",   // Cornflower Blue
  "rgba(238, 130, 238, 0.5)",   // Violet
  "rgba(255, 215, 0, 0.5)",     // Gold
  "rgba(0, 191, 255, 0.5)",     // Deep Sky Blue
  "rgba(199, 21, 133, 0.5)",    // Medium Violet Red
  "rgba(64, 224, 208, 0.5)",    // Turquoise
  "rgba(255, 140, 0, 0.5)",     // Dark Orange
  "rgba(123, 104, 238, 0.5)",   // Medium Slate Blue
  "rgba(0, 128, 128, 0.5)",     // Teal (darker)
  "rgba(255, 20, 147, 0.5)",    // Deep Pink
  "rgba(70, 130, 180, 0.5)",    // Steel Blue
  "rgba(176, 196, 222, 0.5)",   // Light Steel Blue
  "rgba(46, 139, 87, 0.5)",     // Sea Green
  "rgba(255, 99, 255, 0.5)",    // Pinkish Purple
  "rgba(255, 228, 181, 0.5)",   // Moccasin
  "rgba(210, 105, 30, 0.5)",    // Chocolate
  "rgba(105, 105, 105, 0.5)",   // Dim Gray
];

const COLORS_BORDER = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 99, 71, 1)",
  "rgba(60, 179, 113, 1)",
  "rgba(100, 149, 237, 1)",
  "rgba(238, 130, 238, 1)",
  "rgba(255, 215, 0, 1)",
  "rgba(0, 191, 255, 1)",
  "rgba(199, 21, 133, 1)",
  "rgba(64, 224, 208, 1)",
  "rgba(255, 140, 0, 1)",
  "rgba(123, 104, 238, 1)",
  "rgba(0, 128, 128, 1)",
  "rgba(255, 20, 147, 1)",
  "rgba(70, 130, 180, 1)",
  "rgba(176, 196, 222, 1)",
  "rgba(46, 139, 87, 1)",
  "rgba(255, 99, 255, 1)",
  "rgba(255, 228, 181, 1)",
  "rgba(210, 105, 30, 1)",
  "rgba(105, 105, 105, 1)",
];


const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Added search state

  const fetchStockData = async (symbol) => {
    try {
      const url = `https://investox-az5r.onrender.com/api/stock/${symbol}`;
      const res = await axios.get(url);

      const result = res.data.chart.result[0];
      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.chartPreviousClose;

      const percent = (((currentPrice - previousClose) / previousClose) * 100).toFixed(2);
      const isDown = percent < 0;

      return {
        name: symbol.replace(".NS", ""),
        price: currentPrice.toFixed(2),
        percent: `${percent}%`,
        isDown,
      };
    } catch (err) {
      console.error(`Failed to fetch ${symbol}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const all = await Promise.all(STOCK_SYMBOLS.map(fetchStockData));
      setWatchlist(all.filter(Boolean));
    };
    fetchAll();
  }, []);

  // Filter watchlist based on searchTerm (case insensitive)
  const filteredWatchlist = watchlist.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare data for the doughnut chart based on filtered list
  const chartData = {
    labels: filteredWatchlist.map((s) => s.name),
    datasets: [
      {
        label: "Price",
        data: filteredWatchlist.map((s) => s.price),
        backgroundColor: COLORS_BG,
        borderColor: COLORS_BORDER,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <i className="fas fa-search " style={{paddingRight:"-20px",marginLeft:"20px"}}></i>
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty fut weekly"
          className="search"
          value={searchTerm}                  
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <span className="counts"> {filteredWatchlist.length} / 50</span>
      </div>

      <ul className="list">
        {filteredWatchlist.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnutChart data={chartData} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);
  const generalContext = useContext(GeneralContext);

  const handleMouseEnter = () => setShowWatchlistActions(true);
  const handleMouseLeave = () => setShowWatchlistActions(false);
  const handleBuyClick = () => generalContext.openBuyWindow(stock.name);

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <span className="actions" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
  <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
    <button className="buy" onClick={handleBuyClick}>B</button>
  </Tooltip>
  <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
    <button className="sell">S</button>
  </Tooltip>
  <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
    <button className="icon">
      <BarChartOutlined fontSize="small" />
    </button>
  </Tooltip>
  <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
    <button className="icon">
      <MoreHoriz fontSize="small" />
    </button>
  </Tooltip>
</span>

      )}
    </li>
  );
};
