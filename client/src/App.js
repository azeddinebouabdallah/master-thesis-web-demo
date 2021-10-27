import './App.css';
import money from "./images/money.png"
import chart from "./images/chart.png"
import bitcoin from './icons/logos_bitcoin.png'
import AddIcon from './icons/AddIcon'
import MoreIcon from './icons/MoreIcon'
import SubtractIcon from './icons/SubtractIcon'
import React, { useState } from "react"

import Chart from "react-google-charts";
import ApexCharts from 'apexcharts'
function App() {

  const [priceInput, setPriceInput] = useState()
  const [dateInput, setDateInput] = useState()
  const [predictedPrice, setPredictedPrice] = useState('')
  const [yesterdayPrice, setYesterdayPrice] = useState('')
  const [realPrice, setRealPrice] = useState('')
  const [predictedTrend, setPredictedTrend] = useState('')
  const [realTrend, setRealTrend] = useState('')
  const [prediectedBenifit, setPredictedBenifit] = useState('')
  const [realBenifit, setRealBenifit] = useState('')
  

  let onPriceAddClicked = () => {
    if (priceInput) {
      setPriceInput(parseInt(priceInput) + 100)
    } else {
      setPriceInput(100)
    }
  }

  let onPriceSubClicked = () => {
    if (priceInput) {
      setPriceInput(parseInt(priceInput) - 100)
    } else {
      setPriceInput(0)
    }
  }

  let onPredictClick = (e) => {
    console.log(dateInput)
    console.log(priceInput)
    fetch(`http://127.0.0.1:5000/prediction/${dateInput}/${priceInput}`, {mode: 'cors'})
    .then(res => res.json())
    .then(res => {
      console.log(res)
      setYesterdayPrice(res.yesterday_price)
      setPredictedPrice(res.predicted_price)
      setRealPrice(res.real_price)
      setRealTrend(res.real_trend)
      setPredictedTrend(res.predicted_trend)
      setPredictedBenifit(res.predicted_benifit)
      setRealBenifit(res.real_benifit)
    })
  }

  let priceInputChange = (e) => {
    setPriceInput(e.target.value)
  }
  let dateInputChange = (e) => {
    console.log(dateInput)
    setDateInput(e.target.value)
    console.log(dateInput)
  }

  let _onFocus = function (e) {
    e.currentTarget.type = "date";
    e.currentTarget.value = "2020-04-23"
  }
  let _onBlur = function (e) {
    e.currentTarget.type = "text";
    e.currentTarget.placeholder = "Date";
    e.currentTarget.min = "2016-10-21"
    e.currentTarget.max = "2021-01-08"
  }

  let options = {
    title: 'title',
    width: 310,
    height: 260,
    backgroundColor: '#E4E4E4',
    is3D: true
};
  return (
    <div className="demo-app">
      <div className="header">
        <div className="filler"></div>
        <div className="header-image">
          <img src={money} alt="investing"></img>
        </div>
        <div className="title">
          <h1 className='main-title'>Multimodal Approach <br />for BTC Price <br /> Prediction. <span className='tag'>alpha</span></h1>
          <div className='chart'>
            <Chart
              width={'90%'}
              height={350}
              chartType="CandlestickChart"
              loader={<div>Loading Chart</div>}
              data={[
                ['day', 'a', 'b', 'c', 'd'],
                ['1', 20, 28, 38, 45],
                ['2', 31, 38, 55, 66],
                ['3', 50, 55, 77, 80],
                ['4', 77, 77, 66, 50],
                ['5', 68, 66, 22, 15],
                ['6', 20, 28, 38, 45],
                ['7', 31, 38, 55, 66],
                ['8', 50, 55, 77, 80],
                ['9', 77, 77, 66, 50],
                ['10', 68, 66, 22, 15],
                ['11', 50, 55, 77, 80],
                ['12', 77, 77, 66, 50],
                ['13', 68, 66, 22, 15],
                ['14', 20, 28, 38, 45],
                ['15', 50, 55, 77, 80],
                ['16', 77, 77, 66, 50],
                ['17', 68, 66, 22, 15],
                ['18', 50, 55, 77, 80],
                ['19', 31, 38, 55, 66],
                ['20', 50, 55, 77, 80],
                ['21', 77, 77, 66, 50],
                ['22', 68, 66, 22, 15],
                ['23', 20, 28, 38, 45],
              ]}
              options={{
                legend: 'none',
                bar: { groupWidth: '100%' }, // Remove space between bars.
                candlestick: {
                  fallingColor: { strokeWidth: 0, fill: '#e74c3c' }, // red
                  risingColor: { strokeWidth: 0, fill: '#2ecc71' }, // green
                  
                },
                backgroundColor: "#ecf0f1",
              }}
              rootProps={{ 'data-testid': '2' }}
            />
          </div>
        </div>
        <div className="description">
          <h2 className='description-title'>
            Robust and effective method for bitcoin price prediction using a novel mutlimodal  deep learning approach.
          </h2>
          <p className='description-content'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc volutpat in mauris id dictum eu ligula. Vestibulum risus aenean mollis sed fames ullamcorper cras pulvinar amet. Posuere vel dictum ante tincidunt. Quisque mattis facilisis dapibus sodales turpis tristique venenatis, aliquam ultrices.
          </p>
          <p className='description-content'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc volutpat in mauris id dictum eu ligula.
          </p>
        </div>
      </div>
      <div className='predictor-section'>
        <div className="prediction-form">
          <div className="prediction-form-header">
            <img src={bitcoin} alt='bitcoin icon'></img>

            <p>&nbsp; BTC/USDT</p>
          </div>
          <div className='form-input'>
            <div className='date'>
              <input type="text" onFocus={_onFocus} onBlur={_onBlur} placeholder="Date" onChange={dateInputChange} max="2020-03-03" min="2020-01-01" />
              <span><MoreIcon /></span>
            </div>
            <div className="number">
              <span className="sub" onClick={onPriceSubClicked}><SubtractIcon /></span>
              <input type='number' className="price-input" placeholder="Invested price" value={priceInput} onChange={priceInputChange}></input>
              <span className="add" onClick={onPriceAddClicked}><AddIcon /></span>
            </div>
            <div className="dropdown" placeholder="Model">
              <select>
                <option value='my-approach'>Full Model</option>
              </select>
              <span><MoreIcon /></span>
            </div>
            <div className='submit-button'>
              <div className='submit' onClick={onPredictClick}>
                <p>Predict</p>
              </div>
            </div>
          </div>
        </div>
        <div className="prediction-output">
          <p><span>Date:</span> 01-01-2021</p>
          <div className="outputs">
            <div className="output-titles">
              <p><span>Previous date price</span>(1 BTC):</p>
              <p><span>Predicted price</span>(1 BTC):</p>
              <p><span>Predicted trend</span>(1 BTC):</p>
              <p><span>Real price</span>(1 BTC):</p>
              <p><span>Real trend</span>(1 BTC):</p>
              <p><span>Predicted benifits</span>:</p>
              <p><span>Real benifits</span>:</p>
            </div>
            <div className="output-content">
              <p className="btc-benifits">{yesterdayPrice}$</p>
              <p className={predictedTrend === "up" ? "btc-price-up" : "btc-price-down"}>{predictedPrice}$</p>
              <p className={predictedTrend === "up" ? "btc-trend-up" : "btc-trend-down"}>{predictedTrend}</p>
              <p className={realTrend === 'up' ? "btc-price-up": "btc-price-down"}>{realPrice}</p>
              <p className={realTrend === 'up' ? "btc-trend-up": "btc-trend-down"}>{realTrend}</p>
              <p className="btc-benifits">{prediectedBenifit}$</p>
              <p className="btc-benifits">{realBenifit}$</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
