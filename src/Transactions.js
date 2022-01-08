import { TextsmsRounded } from '@material-ui/icons';
import React from 'react'
import { useState } from 'react';
import logo from './logo.svg';


const Transactions = (data, boolean) => {
    const { txn } = data;


    const [loading, setLoading] = useState(boolean.boolean);
    /*     const [currentLenght, setCurrentLenght] = useState(0)
        const previousLenght = usePrevious(currentLenght); */


    const getTime = (prop) => {
        const date = new Date(prop * 1000);
        return date.toLocaleString("es");
    };



    return (

        <>
            <p>A total of {txn.length ? txn.length : '0'} internal transactions found </p>
            {txn.length === 10000 ? <p>( This returns maximum of 10000 records only)</p> : null}



            <p className='subtitle items'> Last transactions  </p>

            {loading === true ? <div> <img src={logo} className="App-logo" alt="logo" />loading...     </div> :
                <table className="styled-table" >
                    <tbody>
                        <tr>

                            <th></th>
                            <th>Date</th>
                            <th></th>
                            <th> Value BNB </th>


                        </tr>


                        {

                            data.txn && data.txn.length === 1 ? data.txn.map((item, index) =>

                                <tr key={1 + index} className={index === 0 ? "first-row" : ""}>
                                    <td ></td>

                                    {index === 0 ? <td> <h4> {getTime(item.timeStamp)}</h4></td> : <td>{getTime(item.timeStamp)}</td>}
                                    <td></td>
                                    {index === 0 ? <td> <h4> {item.value} </h4></td> : <td>{item.value}  </td>}


                                </tr>


                            ) : null
                        }


                    </tbody>

                </table>
            }


        </>

    )
}

export default Transactions

