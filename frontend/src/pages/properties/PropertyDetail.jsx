import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import { BASE_URL } from "../../config";
import PropertyGallery from "../../components/properties/PropertyGallery";
import PageContainer from "../../components/common/PageContainer";
import Loading from "../../components/common/Loading";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";

import {
    Paper,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
    Box,
    Stack,
} from "@mui/material";


import {
    getPropertyTypeLabel,
    getTransactionTypeLabel
} from "../../constants/propertyHelpers";

import {
    getPropertyStatusLabel,
    getPropertyStatusColor
} from "../../constants/propertyOptions";


import IconButton from "@mui/material/IconButton";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ElevatorIcon from "@mui/icons-material/Elevator";
import InventoryIcon from "@mui/icons-material/Inventory2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function InfoItem({ label, value }) {

    return (

        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography fontWeight={600}>
                {value ?? "-"}
            </Typography>

        </Box>

    );

}

export default function PropertyDetail() {

    const { id } = useParams();

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

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

                const message = getErrorMessage(
                    error,
                    "خطا در دریافت اطلاعات ملک"
                );

                showSnackbar(message, "error");

            }

            finally {

                setLoading(false);

            }

        }

        loadProperty();

    }, [id]);



    if (loading) {

        return (

            <PageContainer>

                <Loading />

            </PageContainer>

        );

    }

    if (!property) {

        return (

            <PageContainer>

                <Typography color="text.secondary">
                    این ملک پیدا نشد.
                </Typography>

            </PageContainer>

        );

    }

    async function toggleFavorite() {

        try {

            const response = await api.post(

                `properties/${property.id}/toggle_favorite/`

            );

            setProperty(prev => ({
                ...prev,
                is_favorite: response.data.is_favorite
            }));

            showSnackbar(
                response.data.is_favorite
                    ? "به علاقه‌مندی‌ها اضافه شد."
                    : "از علاقه‌مندی‌ها حذف شد.",
                "success"
            );

        }

        catch (error) {

            const message = getErrorMessage(
                error,
                "خطا در افزودن به علاقه‌مندی‌ها"
            );

            showSnackbar(message, "error");

        }

    }

    async function handleDelete() {

        if (!window.confirm("از حذف این ملک مطمئن هستید؟"))
            return;

        try {

            await api.delete(
                `properties/${property.id}/`
            );

            showSnackbar(
                "ملک با موفقیت حذف شد.",
                "success"
            );

            navigate("/properties");

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "حذف ملک انجام نشد."
            );

            showSnackbar(message, "error");

        }

    }



    return (

        <PageContainer>

            <Button

                startIcon={<ArrowBackIcon />}

                onClick={() => navigate("/properties")}

                color="inherit"

                sx={{ mb: 2 }}

            >

                بازگشت به لیست املاک

            </Button>

            <Paper
                sx={{
                    p: { xs: 2.5, md: 4 },
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 1px 3px rgba(16,24,40,0.06)",
                }}
            >

                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3,
                    }}
                >

                    <Box>

                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>

                            <Typography variant="h4">
                                {property.title}
                            </Typography>

                            <Chip
                                color={getPropertyStatusColor(property.status)}
                                label={getPropertyStatusLabel(property.status)}
                            />

                        </Stack>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            کد ملک: <bdi>{property.code}</bdi>
                        </Typography>

                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                            alignItems: "center",
                        }}
                    >

                        <Box
                            sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                bgcolor: "rgba(200, 155, 60, 0.12)",
                                textAlign: "center",
                            }}
                        >

                            <Typography fontWeight={800} sx={{ color: "#8A6A1F" }}>
                                {Number(property.price).toLocaleString("fa-IR")}
                            </Typography>

                            <Typography variant="caption" sx={{ color: "#8A6A1F" }}>
                                تومان
                            </Typography>

                        </Box>

                        <IconButton
                            color="error"
                            onClick={toggleFavorite}
                            sx={{ border: "1px solid", borderColor: "error.main" }}
                        >

                            {

                                property.is_favorite

                                    ?

                                    <FavoriteIcon />

                                    :

                                    <FavoriteBorderIcon />

                            }

                        </IconButton>

                    </Box>

                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem
                            label="نوع ملک"
                            value={getPropertyTypeLabel(property.property_type)}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem
                            label="نوع معامله"
                            value={getTransactionTypeLabel(property.transaction_type)}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="متراژ" value={`${property.area} متر`} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="تعداد اتاق" value={property.rooms} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="طبقه" value={property.floor ?? "-"} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="تعداد طبقات" value={property.total_floors ?? "-"} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="سال ساخت" value={property.year_built ?? "-"} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Divider sx={{ my: 1 }} />

                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <InfoItem label="آدرس" value={property.address} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            توضیحات
                        </Typography>

                        <Typography sx={{ whiteSpace: "pre-line" }}>
                            {property.description || "-"}
                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >

                            <Chip
                                icon={<LocalParkingIcon />}
                                label="پارکینگ"
                                color={property.parking ? "success" : "default"}
                                variant={property.parking ? "filled" : "outlined"}
                            />

                            <Chip
                                icon={<ElevatorIcon />}
                                label="آسانسور"
                                color={property.elevator ? "success" : "default"}
                                variant={property.elevator ? "filled" : "outlined"}
                            />

                            <Chip
                                icon={<InventoryIcon />}
                                label="انباری"
                                color={property.storage ? "success" : "default"}
                                variant={property.storage ? "filled" : "outlined"}
                            />

                        </Box>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            تصاویر
                        </Typography>

                        <PropertyGallery
                            images={property.images}
                            title={property.title}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="h6"
                            sx={{ mb: 2 }}
                        >
                            ویدیوها
                        </Typography>

                        {(property?.videos ?? []).length > 0 ? (

                            <Grid container spacing={2}>

                                {property.videos.map(video => (

                                    <Grid
                                        size={{ xs: 12, md: 6 }}
                                        key={video.id}
                                    >

                                        <Box
                                            component="video"
                                            controls
                                            sx={{
                                                width: "100%",
                                                borderRadius: 2,
                                                display: "block",
                                            }}
                                        >

                                            <source
                                                src={`${BASE_URL}${video.video}`}
                                                type="video/mp4"
                                            />

                                            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.

                                        </Box>

                                    </Grid>

                                ))}

                            </Grid>

                        ) : (

                            <Typography color="text.secondary">
                                ویدیویی ثبت نشده است.
                            </Typography>

                        )}

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Divider sx={{ my: 3 }} />

                        <Stack direction="row" spacing={1.5}>

                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() =>
                                    navigate(`/properties/${property.id}/edit`)
                                }
                            >
                                ویرایش
                            </Button>

                            <Button
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                            >
                                حذف
                            </Button>

                        </Stack>

                    </Grid>

                </Grid>

            </Paper>

        </PageContainer>

    );

}