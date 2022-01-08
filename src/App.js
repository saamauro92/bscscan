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
  /* Internal Transactions */
  const [txn, setTxn] = useState([]);

  const [boolean, setBoolean] = useState(false);


  const apiToken = process.env.REACT_APP_API_KEY;
  const endpointTokenPrice = "https://api.coingecko.com/api/v3/coins/reward-hunters-token?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
  const endpointBnbPrice = `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${apiToken}`

  const formatter = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumSignificantDigits: 8,


  });

  const currentPriceMath = (a, b) => {
    const result = a * b.slice(0, 15)
    return result;
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetAddres(value);

    fetchBnbAccountBalance(value);
    fetchTokenData(value);
    fetchTransactions(value);


  }


  const fetchTokenData = async (id) => {
    try {
      const tokenbalance = await axios.get(`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xf1018c71eebe32dd85012ad413bab6b940d0d51e&address=${id}&tag=latest&apikey=${apiToken}`)

      return setBalanceToken(tokenbalance.data)

    } catch (e) {
      setError(e)
    }

  }

  const fetchBnbAccountBalance = async (id) => {
    try {
      const bnbAccountBalance = await axios.get(`https://api.bscscan.com/api?module=account&action=balance&address=${id}&apikey=${apiToken}`)

      return setBnbBalance(bnbAccountBalance.data.result)

    } catch (e) {
      setError(e);
    }
  }



  const fetchTransactions = async (id) => {
    if (id.length > 1) {

      try {
        setBoolean(true);
        const transactions = await axios.get(`https://api.bscscan.com/api?module=account&action=txlistinternal&address=${id}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${apiToken}`)
        setTxn(transactions.data.result);
        setBoolean(false);

        /*       setLoading(false); */
        /*           setCurrentLenght(transactions.data.result.length); */
        /*            setArray(transactions.data.result.length) */


      } catch (e) {
        setError(e);
      }
    }
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

  }, [])


  return (



    <div className="App">
      <h3>Check your Balance {"&"} Last Rewards!</h3>

      <form action="" onSubmit={handleSubmit}>

        <input type="text"
          name=""
          maxLength={42}
          minLength={6}
          pattern="^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$|[a-zA-Z0-9\.]+"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='search-bar'
          placeholder=' Address' />
        <input type="submit" value="Go" className='button' />

      </form>

      {error && <p className='error-msg'>{error}</p>}

      <div className="summary-wrap">


        <div className='wrapper'>
          <p className='items'> RHT Price</p>
          <p>  {currentPrice && formatter.format(currentPrice.usd)}</p>
          <p className='items'> BNB Price</p>
          <p>  {bnbCurrentPrice && formatter.format(bnbCurrentPrice.result.ethusd)}</p>

        </div>

        <div>
          <p className='items'>Account</p>
          <p>{getAddress && <>{getAddress.slice(0, 6) + "..." + getAddress.slice(getAddress.length - 8, getAddress.length)}</>}</p>
        </div>
        <div>
          <div className='wrapper'>

            <p className='items'>RHT Balance:</p>
            <p>  {balanceToken.result && balanceToken.result.slice(0, 9)}  </p>


            <p className='items'>BNB Balance:</p>
            <p>  {bnbBalance && bnbBalance}  ({bnbBalance && currentPriceMath(bnbCurrentPrice.result.ethusd, bnbBalance)})</p>
          </div>
        </div>

        <div>
          <p className='items'> Total USD:</p>

          {balanceToken.result && <p>  $ {balanceToken.result && currentPriceMath(currentPrice.usd, balanceToken.result)}</p>}

        </div>

      </div>

      <Transactions txn={txn} boolean={boolean} />



    </div >

  );
}

export default App;
