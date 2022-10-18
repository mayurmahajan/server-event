import React, { useState, useEffect } from "react";
import "./App.css";


const BaseURL = "http://localhost:8000";

function App() {
  const [status, setStatus] = useState("idle");
  const [stockPrices, setStockPrices] = useState([]);
  const formatPrice = (price) => {

    return new Intl.NumberFormat("us-EN", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
    }).format(price);
  };

  const fetchStockPrice = () => {
    console.log('here')
    setStatus("idle");
    fetch(`${BaseURL}/stocks`, { method: "GET" })
      .then((res) => (res.status === 200 ? res.json() : setStatus("rejected")))
      .then((result) => setStockPrices(result.data))
      .catch((err) => setStatus("rejected"));
  };

  const updateStockPrices = (data) => {
    console.log('datadata : ', data)

    const parsedData = JSON.parse(data);
    console.log('parsedData : ', parsedData)
    setStockPrices((stockPrices) =>
      [...stockPrices].map((stock) => {
        if (stock.id === parsedData.id) {
          return parsedData;
        }
        return stock;
      })
    );
  };

  const eventSource = new EventSource(`${BaseURL}/realtime-price`);

  useEffect(() => {
    console.log('yo')
    fetchStockPrice();

    eventSource.onerror = (e) => {
      console.log('error')
    }
    eventSource.onmessage = (e) => {
      console.log('e.data : ', e.data)
      updateStockPrices(e.data);
    }
  }, []);

  return (
    <div className="App">
      <table>
        <caption>Stock Prices</caption>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Ticker Symbol</th>
            <th>Time</th>
            <th>Real Time Price</th>
          </tr>
        </thead>
        <tbody>
          {stockPrices.map(({ id, ticker, price, timetime }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{ticker}</td>
              <td>{timetime}</td>
              <td>{formatPrice(price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App
