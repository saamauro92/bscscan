import React, { useState } from "react";
import Socket from './Socket'


function Home() {

    const [loadClient, setLoadClient] = useState(true);



    return (

        <div>

            <button onClick={() => setLoadClient(prevState => !prevState)}> STOP CLIENT</button>

            {loadClient ? <Socket /> : null}


        </div>
    )
}

export default Home
