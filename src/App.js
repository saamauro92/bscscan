import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Transactions from './Transactions';





function App() {
  const [getAddress, setGetAddres] = useState("");

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  /* Token */
  const [currentPrice, setCurrentPrice] = useState({})
  const [balanceToken, setBalanceToken] = useState({});
  /* Bnb */
  const [bnbBalance, setBnbBalance] = useState("");
  const [bnbCurrentPrice, setBnbCurrentPrice] = useState("");

  const accountAddress = getAddress;
  const apiToken = process.env.REACT_APP_API_KEY;
  const endpointTokenBalance = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xf1018c71eebe32dd85012ad413bab6b940d0d51e&address=${accountAddress}&tag=latest&apikey=${apiToken}`
  const endpointTokenPrice = "https://api.coingecko.com/api/v3/coins/reward-hunters-token?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
  const endpointBnbBalance = `https://api.bscscan.com/api?module=account&action=balance&address=${accountAddress}&apikey=${apiToken}`
  const endpointBnbPrice = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${apiToken}`

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
  }

  useEffect(() => {


    const fetchTokenPrice = async () => {
      const price = await axios.get(endpointTokenPrice);

      setCurrentPrice(price.data.market_data.current_price);
    }
    fetchTokenPrice();

    const fetchBnbPrice = async () => {
      const bnbPrice = await axios.get(endpointBnbPrice);

      setBnbCurrentPrice(bnbPrice.data)

    }
    fetchBnbPrice();


    const fetchTokenData = async () => {
      try {
        const tokenbalance = await axios.get(endpointTokenBalance)

        setBalanceToken(tokenbalance.data);
      } catch (e) {
        setError("error: Invalid address", e)
      }

    }


    const fetchBnbAccountBalance = async () => {
      try {
        const bnbAccountBalance = await axios.get(endpointBnbBalance)
        setBnbBalance(bnbAccountBalance.data.result)
      } catch (e) {
        setError("error fetching bnb balance", e);
      }
    }
    fetchBnbAccountBalance();


    if (value.length > 20) {
      fetchTokenData();

    }

  }, [endpointTokenBalance])


  return (



    <div className="App">

      <form action="" onSubmit={handleSubmit}>

        <input type="text"
          name=""
          maxLength={42}
          minLength={6}
          pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|[a-zA-Z0-9\.]+"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='search-bar'
          placeholder=' Introduce Address' />
        <input type="submit" value="Go" className='button' />

      </form>

      {error && <p className='error-msg'>hola{error}</p>}
      <div className="summary-wrap">

        <div>
          <p className='items'>Account</p>
          <p>{getAddress && <>{getAddress.slice(0, 6) + "..." + getAddress.slice(getAddress.length - 8, getAddress.length)}</>}</p>
        </div>
        <div>
          <p className='items'> RHT Current Price</p>
          <p>  {currentPrice && formatter.format(currentPrice.usd)}</p>
          <p className='items'>RHT Balance:</p>
          <p>  {balanceToken.result && balanceToken.result.slice(0, 9)}  </p>

        </div>
        <div>
          <p className='items'> BNB Current Price</p>
          <p>  {bnbCurrentPrice && formatter.format(bnbCurrentPrice.result.ethusd)}</p>
          <p className='items'>BNB Balance:</p>
          <p>  {bnbBalance && bnbBalance}  ({bnbBalance && currentPriceMath(bnbCurrentPrice.result.ethusd, bnbBalance)})</p>

        </div>

        <div>
          <p className='items'> Total USD:</p>

          {balanceToken.result && <p>  $ {balanceToken.result && currentPriceMath(currentPrice.usd, balanceToken.result)}</p>}

        </div>

      </div>


      <Transactions address={getAddress} />



    </div >

  );
}

export default App;
