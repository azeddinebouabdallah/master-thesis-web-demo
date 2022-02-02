import './App.css';
import money from "./images/money.png"
import chart from "./images/chart.png"
import bitcoin from './icons/logos_bitcoin.png'
import AddIcon from './icons/AddIcon'
import MoreIcon from './icons/MoreIcon'
import SubtractIcon from './icons/SubtractIcon'
import React, { useEffect, useState } from "react"
import { Chart as ChartJS, Tooltip, PointElement,CategoryScale, LinearScale, Title, LineElement, Legend, Filler } from 'chart.js';
import Chart from "react-google-charts";
import ApexCharts from 'apexcharts'

import { Line, Chart as ChartJSS } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, Tooltip, PointElement, LineElement, Title, Legend, Filler);
function App() {

  const [priceInput, setPriceInput] = useState()
  const [dateInput, setDateInput] = useState('2020-04-23')
  const [predictedPrice, setPredictedPrice] = useState('')
  const [yesterdayPrice, setYesterdayPrice] = useState('')
  const [realPrice, setRealPrice] = useState('')
  const [predictedTrend, setPredictedTrend] = useState('')
  const [realTrend, setRealTrend] = useState('')
  const [prediectedBenifit, setPredictedBenifit] = useState('')
  const [realBenifit, setRealBenifit] = useState('')

  const [mu, setMu] = useState(0)
  const [sigma, setSigma] = useState(0)
  const [x, setX] = useState(0)
  const [y , setY] = useState(0)



  const [chartData, setChartData] = useState()
  const [loadedChart, setLoadedChart] = useState(false)

  useEffect(() => {
    console.log()
    fetch(`http://127.0.0.1:5000/data/2020-04-23`)
      .then(res => res.json())
      .then(res => {
        setChartData(res.data)
        setLoadedChart(true)
        document.getElementById("mydatepicker").defaultValue = "2020-01-15";
      })
  }, [])

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
    fetch(`http://127.0.0.1:5000/prediction/${dateInput}/${priceInput}`, { mode: 'cors' })
      .then(res => res.json())
      .then(res => {
        setYesterdayPrice(res.yesterday_price)
        setPredictedPrice(res.predicted_price)
        setRealPrice(res.real_price)
        setRealTrend(res.real_trend)
        setPredictedTrend(res.predicted_trend)
        setPredictedBenifit(res.predicted_benifit)
        setRealBenifit(res.real_benifit)
        setX(res.x)
        setY(res.y)
      })

    fetch(`http://127.0.0.1:5000/data/${dateInput}`)
      .then(res => res.json())
      .then(res => {
        setChartData(res.data)
        setLoadedChart(true)
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
  }
  let _onBlur = function (e) {
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
          <h1 className='main-title'>Multimodal Approach <br />for Cryptocurrency Price <br /> Prediction. <span className='tag'>Master's thesis</span></h1>
          <div className='chart'>
            {loadedChart ?
              <Chart
                width={'90%'}
                height={350}
                chartType="CandlestickChart"
                loader={<div>Loading Chart</div>}
                data={chartData}
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
              /> : <p>Loading chart</p>
            }
          </div>
        </div>
        <div className="description">
          <h2 className='description-title'>
            Submitted by: Azeddine Bouabdallah <br /><br />
            First supervisor: Prof. Dr. Jan Jürjens <br /><br />
            Second supervisor: Dr. Zeyd Boukhers
          </h2>
        </div>
      </div>
      <div className='predictor-section'>
        <div className="prediction-form">
          <div className="prediction-form-header">
            <img src={bitcoin} alt='bitcoin icon'></img>

            <p>&nbsp; BTC/USD</p>
          </div>
          <div className='form-input'>
            <div className='form-input-container'>
              <div className='date'>
                <input type="date" onFocus={_onFocus} onBlur={_onBlur} placeholder="Date" onChange={dateInputChange} min="2016-10-21" max="2021-01-08" id="mydatepicker" />
                <span><MoreIcon /></span>
              </div>
              <div className="number">
                <span className="sub" onClick={onPriceSubClicked}><SubtractIcon /></span>
                <input type='number' className="price-input" placeholder="Invested price" value={priceInput} onChange={priceInputChange}></input>
                <span className="add" onClick={onPriceAddClicked}><AddIcon /></span>
              </div>
              <div className='submit-button'>
                <div className='submit' onClick={onPredictClick}>
                  <p>Predict</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="prediction-output">
          {/* My model's output*/}
          <div className="outputs">
            <div className="output-titles">
              <p><span>Model</span></p>
              <p><span>Previous date price</span></p>
              <p><span>Predicted price</span></p>
              <p><span>Predicted trend</span></p>
              <p><span>Real price</span></p>
              <p><span>Real trend</span></p>
              <p><span>Predicted difference</span></p>
              <p><span>Real difference</span></p>
            </div>
            <div className="output-content">
              <p>DMCrypt</p>
              <p className="btc-benifits">{yesterdayPrice}$</p>
              <p className={predictedTrend === "up" ? "btc-price-up" : "btc-price-down"}>{predictedPrice}$</p>
              <p className={predictedTrend === "up" ? "btc-trend-up" : "btc-trend-down"}>{predictedTrend}</p>
              <p className={realTrend === 'up' ? "btc-price-up" : "btc-price-down"}>{realPrice}$</p>
              <p className={realTrend === 'up' ? "btc-trend-up" : "btc-trend-down"}>{realTrend}</p>
              <p className="btc-benifits">{prediectedBenifit}$</p>
              <p className="btc-benifits">{realBenifit}$</p>
            </div>
          </div>
          <div>
            <ChartJSS
              type='line'
              data={
                {
                  labels: x,
                  datasets: [
                    {
                      label: "Price in USD",
                      data: y,
                      fill: true,
                      backgroundColor: "rgba(236, 240, 241,0.4)",
                    },
                  ],
                  backgroundColor: '#2980b9',
                  borderColor: '#2980b9',
                }
              }
              
              options={
                {
                  plugins: {
                    title: {
                      display: true,
                      text: "Cryptocurrency price prediction", 
                      color: 'white',
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                      color: 'white',
                   },
                  },
                  showLine: true,
                  fill: "#ecf0f1",
                  backgroundColor: "#ecf0f1",
                  borderColor: "#ecf0f1",
                 scales: {
                   y :{
                     ticks:{
                       color: "white"
                     }
                   },
                   x: {
                      ticks: {
                        color: "white"
                      }
                   }
                 }
                }
              }
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
