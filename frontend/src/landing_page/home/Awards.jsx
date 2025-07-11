import React from 'react';

function Awards() {
  return (
    <div className='container mt-5'>
      <div className="row">
        <div className="col-md-6 p-5 mt-4">
          <img src='/largestBroker.svg' alt='Largest Broker' className="img-fluid" />
        </div>
        <div className="col-md-6 p-5 mt-5">
          <h1>Largest stock broker in India</h1>
          <p className='mb-3'>
            2+ million InvestoX clients contribute to over 15% of all retail order volumes in India daily by trading and investing in:
          </p>
          <div className="row">
            <div className="col-6">
              <ul>
                <li><p>Futures and Options</p></li>
                <li><p>Commodity derivatives</p></li>
                <li><p>Currency derivatives</p></li>
              </ul>
            </div>
            <div className="col-6">
              <ul>
                <li><p>Stocks & IPOs</p></li>
                <li><p>Mutual funds</p></li>
                <li><p>Bonds & Govt. Securities</p></li>
              </ul>
            </div>
          </div>
          <img src='/pressLogos.png' alt='Press Logos' style={{ width: '80%' }} />
        </div>
      </div>
    </div>
  );
}

export default Awards;
