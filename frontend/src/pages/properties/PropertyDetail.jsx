import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

import {
    Container,
    Paper,
    Typography,
    CircularProgress
} from "@mui/material";

export default function PropertyDetail() {

    const { id } = useParams();

    const [property, setProperty] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadProperty() {

            try {

                const response = await api.get(
                    `properties/${id}/`
                );

                setProperty(response.data);

            }

            catch (error) {

                console.log(error);

            }

            finally {

                setLoading(false);

            }

        }

        loadProperty();

    }, [id]);



    if (loading) {

        return (

            <Container sx={{ mt: 4 }}>

                <CircularProgress />

            </Container>

        );

    }



    return (

        <Container sx={{ mt: 4 }}>

            <Paper sx={{ p: 3 }}>

                <Typography variant="h4">

                    {property.title}

                </Typography>

                <Typography>
                    کد: {property.code}
                </Typography>

                <Typography>
                    قیمت: {property.price}
                </Typography>

                <Typography>
                    متراژ: {property.area}
                </Typography>

                <Typography>
                    آدرس: {property.address}
                </Typography>

                <Typography>
                    توضیحات: {property.description}
                </Typography>

            </Paper>

        </Container>

    );

}