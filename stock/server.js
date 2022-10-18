const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 8000;
const stocks = [
  { id: 1, ticker: "AAPL", price: 490.48 },
  { id: 2, ticker: "MSFT", price: 213.02 },
  { id: 3, ticker: "AMZN", price: 3284.72 },
];
function getRandomStock() {
  return Math.round(Math.random() * (2 - 0) + 0);
}
function getRandomPrice() {
  return Math.random() * (5000 - 20) + 20;
}
app.get("/stocks", function (req, res) {
  res.status(200).json({ success: true, data: stocks });
});


app.get("/realtime-price", function (req, res) {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  setInterval(() => {
    const timetime = Date.now() ;
    console.log('timetime1: ', timetime)
    res.write(
      "data:" +
        JSON.stringify({ ...stocks[getRandomStock()], price: timetime, timetime: timetime})
    );
    res.write("\\n\\n");
  }, 1000);
});


app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
});