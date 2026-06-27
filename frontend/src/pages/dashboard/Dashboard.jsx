import { useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    console.log(user);

    useEffect(() => {

        async function loadData() {

            try {

                const response = await api.get(
                    "/dashboard/"
                );

                console.log(response.data);

            }

            catch (error) {

                console.log(error);

            }

        }

        loadData();

    }, []);

    return (

        <h1>

            Dashboard

        </h1>

    );

}