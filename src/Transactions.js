import React from 'react'
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import ring from "./assets/ring.wav"
import logo from './logo.svg';


const Transactions = (address) => {

    const [data, setData] = useState([{}])
    const [error, setError] = useState("");
    const apiToken = process.env.REACT_APP_API_KEY;
    const endpointTransactions = `https://api.bscscan.com/api?module=account&action=txlistinternal&address=${address.address}&startblock=0&endblock=99999999&page=1&offset=25&sort=desc&apikey=${apiToken}`
    const [loading, setLoading] = useState(false);
    const [currentLenght, setCurrentLenght] = useState(0)
    const previousLenght = usePrevious(currentLenght);

    /* audio */
    /* hook to get old value  */
    function usePrevious(value) {
        const ref = useRef();

        useEffect(() => {
            ref.current = value;

        }, [value])

        return ref.current;
    }



    useEffect(() => {

        const fetchTransactions = async () => {
            if (address.address.length > 1) {

                try {
                    setLoading(true);
                    const transactions = await axios.get(endpointTransactions)
                    setData(transactions.data.result);

                    setLoading(false);
                    setCurrentLenght(transactions.data.result.length);


                } catch (e) {
                    setError("Error: Error in address, please try again or refresh page", e)
                    setLoading(true)
                }
            }
        }


        fetchTransactions();

        setInterval(() => {
            fetchTransactions();
            alertOnUpdate();


        }, 10 * 60 * 1000);

    }, [address])



    function alertOnUpdate() {

        if (currentLenght > previousLenght) {

            const ringNotification = new Audio(ring);
            ringNotification.play();
        } else return null;


    }



    const getTime = (prop) => {
        const date = new Date(prop * 1000);
        return date.toLocaleString("es");
    }

    return (
        <div >

            <p className='subtitle'> Last transactions </p>
            {loading == true ? <div> <img src={logo} className="App-logo" alt="logo" />loading...     </div> :
                <table className="styled-table" >
                    <tbody>
                        <tr>

                            <th></th>
                            <th>time</th>
                            <th></th>
                            <th> value BNB </th>
                            <th></th>
                            <th>block</th>

                        </tr>


                        {data && data.length > 1 ? data.map((item, index) =>

                            <tr key={1 + index} className={index === 0 ? "first-row" : ""}>
                                <td ></td>

                                {index === 0 ? <td> <h4> {getTime(item.timeStamp)}</h4></td> : <td>{getTime(item.timeStamp)}</td>}
                                <td></td>
                                {index === 0 ? <td> <h4> {item.value} </h4></td> : <td>0.{item.value}  </td>}
                                <td></td>
                                {index === 0 ? <td> <h4> {item.blockNumber}</h4></td> : <td>{item.blockNumber}</td>}

                            </tr>


                        ) : null
                        }


                    </tbody>

                </table>
            }

            {error && <div className='error-msg'> {error} </div>}
        </div >
    )
}

export default Transactions
