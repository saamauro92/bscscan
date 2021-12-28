
import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Transactions from './Transactions';





function App() {
  const [getAddress, setGetAddres] = useState("");
  const [displayTransactions, setDisplayTransactions] = useState(false);
  const [value, setValue] = useState("");

  const [currentPrice, setCurrentPrice] = useState({})
  const [balanceToken, setBalanceToken] = useState({});

  const accountAddress = getAddress;
  const apiToken = process.env.REACT_APP_API_KEY;
  const endpointTokenBalance = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xf1018c71eebe32dd85012ad413bab6b940d0d51e&address=${accountAddress}&tag=latest&apikey=${apiToken}`
  const endpointTokenPrice = "https://api.coingecko.com/api/v3/coins/reward-hunters-token?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"



  const formatter = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumSignificantDigits: 8,


  });

  const currentPriceMath = (a, b) => {
    const result = a * b.slice(0, 15)

    const toReturn = formatter.format(result);

    return result;
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    setGetAddres(value);
    setDisplayTransactions(true);

  }

  useEffect(() => {

    const fetchTokenData = async () => {
      const tokenbalance = await axios.get(endpointTokenBalance)
      setBalanceToken(tokenbalance.data);

    }
    const fetchTokenPrice = async () => {
      const price = await axios.get(endpointTokenPrice);

      setCurrentPrice(price.data.market_data.current_price);
    }
    if (value.length > 20) {
      fetchTokenData();
    }

    fetchTokenPrice();
  }, [endpointTokenBalance])


  return (


    <div className="App">

      <form action="" onSubmit={handleSubmit}>

        <input type="text" name="" value={value} onChange={(e) => setValue(e.target.value)} className='search-bar' placeholder=' Introduce Address' />
        <input type="submit" value=">" className='button' />

      </form>


      <div className="summary-wrap">
        <div>
          <p> RHT</p>
          <p>  {currentPrice && formatter.format(currentPrice.usd)}</p>

        </div>
        <div>
          <p>BALANCE:</p>
          <p>  {balanceToken.result && balanceToken.result.slice(0, 9)}  </p>

        </div>

        <div>
          <p> TOTAL USD:</p>

          {balanceToken.result && <p>  $ {balanceToken.result && currentPriceMath(currentPrice.usd, balanceToken.result)}</p>}

        </div>

      </div>

      <Transactions address={getAddress} />


    </div>
  );
}

export default App;
