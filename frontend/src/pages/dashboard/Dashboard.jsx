import { useEffect, useState } from "react";
import api from "../../services/api";


export default function Dashboard() {


    const [data, setData] = useState(null);



    useEffect(() => {


        async function load() {


            try {

                const res = await api.get(
                    "dashboard/"
                );


                setData(res.data);


            }

            catch (err) {

                console.log(err);

            }


        }


        load();


    }, []);



    if (!data) {

        return <div>Loading...</div>

    }



    return (

        <div>


            <h1>
                داشبورد
            </h1>



            <div className="cards">


                <Card
                    title="املاک"
                    value={data.properties}
                />


                <Card
                    title="مشتریان"
                    value={data.customers}
                />


                <Card
                    title="بازدیدها"
                    value={data.visits}
                />


                <Card
                    title="قراردادها"
                    value={data.contracts}
                />


            </div>



        </div>


    )

}



function Card({ title, value }) {


    return (

        <div className="card">


            <h3>
                {title}
            </h3>


            <h1>
                {value}
            </h1>


        </div>

    )


}