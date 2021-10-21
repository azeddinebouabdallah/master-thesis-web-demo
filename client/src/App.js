import './App.css';
import money from "./images/money.png"
import chart from "./images/chart.png"
import bitcoin from './icons/logos_bitcoin.png'
import AddIcon from './icons/AddIcon'
import MoreIcon from './icons/MoreIcon'
import SubtractIcon from './icons/SubtractIcon'
import React, {useState} from "react"


function App() {

  const [priceInput, setPriceInput] = useState()

  let onPriceAddClicked = () => {
    if (priceInput){
      setPriceInput(parseInt(priceInput)+100)
    }else{
      setPriceInput(100)
    }
  }

  let onPriceSubClicked = () => {
    if (priceInput){
      setPriceInput(parseInt(priceInput)-100)
    }else{
      setPriceInput(0)
    }  }

  let priceInputChange = (e) => {
    setPriceInput(e.target.value)
  }

  let _onFocus = function (e) {
    e.currentTarget.type = "date";
  }
  let _onBlur = function (e) {
    e.currentTarget.type = "text";
    e.currentTarget.placeholder = "Date";
    e.currentTarget.min = "2020-01-01" 
    e.currentTarget.max="2020-03-01"
  }
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
            <img src={chart} alt='candlestick-chart'></img>
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
              <input type="text" onFocus={_onFocus} onBlur={_onBlur} placeholder="Date" max="2020-03-03" min="2020-01-01"/>
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
                <option value='lstm'>Only trading data</option>
              </select>
              <span><MoreIcon /></span>
            </div>
            <div className='submit-button'>
                <div className='submit'>
                  <p>Submit</p>
                </div>
            </div>
          </div>
        </div>
        <div className="prediction-output">
          <p><span>Date:</span> 01-01-2021</p>
          <div className="outputs">
            <div className="output-titles">
              <p><span>Predicted Price</span>(1 BTC):</p>
              <p><span>Predicted Trend</span>(1 BTC):</p>
              <p><span>Read Price</span>(1 BTC):</p>
              <p><span>Read Trend</span>(1 BTC):</p>
              <p><span>Predicted Benifits</span>:</p>
              <p><span>Real Benifits</span>:</p>
            </div>
            <div className="output-content">
              <p className="btc-price-up">12,301.21$</p>
              <p className="btc-trend-up">UP</p>
              <p className="btc-price-down">12,301.21$</p>
              <p className="btc-trend-down">DOWN</p>
              <p className="btc-benifits">301.21$</p>
              <p className="btc-benifits">301.21$</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
