import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Login(){


    const navigate = useNavigate();


    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);



    async function handleSubmit(e){

        e.preventDefault();

        setLoading(true);
        setError("");


        try {


            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                {
                    username,
                    password
                }
            );


            localStorage.setItem(
                "access",
                response.data.access
            );


            localStorage.setItem(
                "refresh",
                response.data.refresh
            );


            navigate("/dashboard");


        }
        catch(err){

            setError(
                "نام کاربری یا رمز عبور اشتباه است"
            );

        }


        setLoading(false);

    }



    return (

        <div className="login-page">


            <form
                className="login-box"
                onSubmit={handleSubmit}
            >


                <h1>
                    ورود به پنل
                </h1>



                {error && (

                    <p className="error">
                        {error}
                    </p>

                )}



                <input

                    placeholder="نام کاربری"

                    value={username}

                    onChange={
                        e=>setUsername(e.target.value)
                    }

                />



                <input

                    type="password"

                    placeholder="رمز عبور"

                    value={password}

                    onChange={
                        e=>setPassword(e.target.value)
                    }

                />



                <button>

                    {
                        loading
                        ? "در حال ورود..."
                        : "ورود"
                    }

                </button>



            </form>


        </div>

    );


}