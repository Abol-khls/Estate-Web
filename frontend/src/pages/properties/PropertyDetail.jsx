import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import { API_BASE_URL } from "../../config";

import {
    Container,
    Paper,
    Typography,
    CircularProgress,
    Grid,
    Divider,
    Chip,
    Button,
    Card,
    CardMedia,
} from "@mui/material";

import {
    getPropertyTypeLabel,
    getTransactionTypeLabel
} from "../../constants/propertyHelpers";


import IconButton from "@mui/material/IconButton";

import FavoriteIcon from "@mui/icons-material/Favorite";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function PropertyDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

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

    async function toggleFavorite() {

        try {

            const response = await api.patch(

                `properties/${property.id}/`,

                {

                    is_favorite: !property.is_favorite

                }

            );

            setProperty(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    async function handleDelete() {

        if (!window.confirm("از حذف این ملک مطمئن هستید؟"))
            return;

        await api.delete(
            `properties/${property.id}/`
        );

        navigate("/properties");

    }

    
    console.log(property.images);



    return (

        <Container
            maxWidth="lg"
            sx={{ mt: 4, mb: 4 }}
        >

            <Paper
                sx={{ p: 4 }}
            >

                <div

                    style={{

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        marginBottom: 24

                    }}

                >

                    <Typography

                        variant="h4"

                    >

                        {property.title}

                    </Typography>

                    <IconButton

                        color="error"

                        onClick={toggleFavorite}

                    >

                        {

                            property.is_favorite

                                ?

                                <FavoriteIcon />

                                :

                                <FavoriteBorderIcon />

                        }

                    </IconButton>

                </div>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            کد ملک:
                            <strong>
                                {" "}
                                {property.code}
                            </strong>

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            نوع ملک:
                            {" "}
                            {getPropertyTypeLabel(property.property_type)}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            نوع معامله:
                            {" "}
                            {getTransactionTypeLabel(property.transaction_type)}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            قیمت:
                            {" "}
                            {property.price}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            متراژ:
                            {" "}
                            {property.area}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            اتاق:
                            {" "}
                            {property.rooms}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            طبقه:
                            {" "}
                            {property.floor ?? "-"}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            تعداد طبقات:
                            {" "}
                            {property.total_floors ?? "-"}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>

                        <Typography>

                            سال ساخت:
                            {" "}
                            {property.year_built ?? "-"}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12 }}>

                        <Typography>

                            آدرس

                        </Typography>

                        <Typography>

                            {property.address}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12 }}>

                        <Typography>

                            توضیحات

                        </Typography>

                        <Typography>

                            {property.description || "-"}

                        </Typography>

                    </Grid>


                    <Grid size={{ xs: 12 }}>

                        <Chip

                            label="پارکینگ"

                            color={
                                property.parking
                                    ? "success"
                                    : "default"
                            }

                            sx={{ mr: 1 }}

                        />


                        <Chip

                            label="آسانسور"

                            color={
                                property.elevator
                                    ? "success"
                                    : "default"
                            }

                            sx={{ mr: 1 }}

                        />


                        <Chip

                            label="انباری"

                            color={
                                property.storage
                                    ? "success"
                                    : "default"
                            }

                        />

                    </Grid>


                    <Grid
                        size={{ xs: 12 }}
                        sx={{ mt: 3 }}
                    >
                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="h5"
                            sx={{ mb: 2 }}
                        >
                            تصاویر
                        </Typography>

                        <Grid container spacing={2}>

                            {
                                (property?.images ?? []).length > 0 ?

                                    (property?.images ?? []).map(image => (

                                        <Grid
                                            size={{ xs: 12, sm: 6, md: 4 }}
                                            key={image.id}
                                        >

                                            <Card>

                                                <CardMedia
                                                    component="img"
                                                    height="220"
                                                    image={`${API_BASE_URL}${image.image}`}
                                                    alt={property.title}
                                                />

                                            </Card>

                                        </Grid>

                                    ))

                                    :

                                    <Typography>

                                        تصویری ثبت نشده است.

                                    </Typography>

                            }

                        </Grid>


                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="h5"
                            sx={{ mb: 2 }}
                        >
                            ویدیوها
                        </Typography>


                        <Grid container spacing={2}>

                            {(property?.videos ?? []).length > 0 ? (

                                property.videos.map(video => (

                                    <Grid
                                        size={{ xs: 12, md: 6 }}
                                        key={video.id}
                                    >

                                        <video
                                            controls
                                            width="100%"
                                        >

                                            <source
                                                src={`${API_BASE_URL}${video.video}`}
                                                type="video/mp4"
                                            />

                                            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.

                                        </video>

                                    </Grid>

                                ))

                            ) : (

                                <Typography>
                                    ویدیویی ثبت نشده است.
                                </Typography>

                            )}

                        </Grid>



                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(`/properties/${property.id}/edit`)
                            }
                        >
                            ویرایش
                        </Button>


                        <Button
                            color="error"
                            sx={{ ml: 2 }}
                            onClick={handleDelete}
                        >
                            حذف
                        </Button>


                        <Button

                            sx={{ ml: 2 }}

                            onClick={() =>
                                navigate("/properties")
                            }

                        >

                            بازگشت

                        </Button>

                    </Grid>


                </Grid>

            </Paper>

        </Container>

    );

}