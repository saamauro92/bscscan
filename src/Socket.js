import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";



function Socket() {

    const [response, setResponse] = useState("");

    const [tokenData, setTokenData] = useState("");

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        /*         socket.on("FromAPI", data => {
                    setResponse(data);
        
                }); */
        socket.on("tokenBalance", data => {
            setTokenData(data);

            console.log(data)
        })



        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
    }, []);

    return (
        <div>

            <p>
                It's <time dateTime={response}>{response}</time>
            </p>




        </div>
    )
}

export default Socket
