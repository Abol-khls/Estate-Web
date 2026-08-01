import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    Box,
    Grid,
    Typography,
    Chip,
    Paper,
    Divider,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import SquareFootIcon from "@mui/icons-material/SquareFootOutlined";
import BedIcon from "@mui/icons-material/KingBedOutlined";
import ApartmentIcon from "@mui/icons-material/ApartmentOutlined";

import api from "../../services/api";
import PublicLayout from "./PublicLayout";
import InquiryForm from "./InquiryForm";
import Loading from "../../components/common/Loading";
import AppButton from "../../components/common/AppButton";
import SpecStrip from "../../components/common/SpecStrip";

import {
    PROPERTY_TYPES,
    TRANSACTION_TYPES,
} from "../../constants/propertyOptions";

function getLabel(list, value) {
    return list.find(item => item.value === value)?.label ?? value;
}

function PublicGallery({ images, title }) {

    const [selected, setSelected] = useState(
        images?.find(img => img.is_cover) ?? images?.[0] ?? null
    );

    if (!images?.length) {

        return (

            <Box
                sx={{
                    aspectRatio: "16 / 9",
                    borderRadius: 4,
                    bgcolor: (theme) => theme.custom.surfaceAlt,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                }}
            >
                تصویری برای این ملک ثبت نشده است.
            </Box>

        );

    }

    return (

        <Box>

            <Box
                component="img"
                src={selected?.image}
                alt={title}
                sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    borderRadius: 4,
                    display: "block",
                }}
            />

            {images.length > 1 && (

                <Box sx={{ display: "flex", gap: 1, mt: 1.5, overflowX: "auto" }}>

                    {images.map(image => (

                        <Box
                            key={image.id}
                            component="img"
                            src={image.image}
                            onClick={() => setSelected(image)}
                            sx={{
                                width: 84,
                                height: 64,
                                objectFit: "cover",
                                borderRadius: 2,
                                cursor: "pointer",
                                flexShrink: 0,
                                border: "2px solid",
                                borderColor: selected?.id === image.id ? "primary.main" : "transparent",
                            }}
                        />

                    ))}

                </Box>

            )}

        </Box>

    );

}

export default function PublicPropertyDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [inquiryOpen, setInquiryOpen] = useState(false);

    const { data: property, isLoading, isError } = useQuery({

        queryKey: ["public", "properties", "detail", id],

        queryFn: async () => {

            const response = await api.get(`public/properties/${id}/`);

            return response.data;

        },

        enabled: Boolean(id),

    });

    const { data: agency } = useQuery({

        queryKey: ["public", "agency"],

        queryFn: async () => {

            const response = await api.get("public/agency/");

            return response.data;

        },

    });

    if (isLoading) {

        return (
            <PublicLayout>
                <Loading />
            </PublicLayout>
        );

    }

    if (isError || !property) {

        return (

            <PublicLayout>

                <Box sx={{ textAlign: "center", py: 8 }}>

                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        این ملک پیدا نشد یا دیگر موجود نیست.
                    </Typography>

                    <AppButton onClick={() => navigate("/")}>
                        بازگشت به لیست ملک‌ها
                    </AppButton>

                </Box>

            </PublicLayout>

        );

    }

    const specItems = [
        { icon: SquareFootIcon, value: Number(property.area).toLocaleString("en-US"), label: "متراژ" },
        { icon: BedIcon, value: property.rooms ?? "—", label: "خواب" },
        { icon: ApartmentIcon, value: property.floor ?? "—", label: "طبقه" },
    ];

    const secondarySpecs = [
        { label: "تعداد کل طبقات", value: property.total_floors ?? "—" },
        { label: "سال ساخت", value: property.year_built ?? "—" },
    ];

    const amenities = [
        { label: "پارکینگ", value: property.parking },
        { label: "آسانسور", value: property.elevator },
        { label: "انباری", value: property.storage },
    ].filter(item => item.value);

    return (

        <PublicLayout>

            <AppButton
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/")}
                sx={{ mb: 2 }}
            >
                بازگشت به لیست ملک‌ها
            </AppButton>

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 7 }}>

                    <PublicGallery images={property.images} title={property.title} />

                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >

                        <Typography variant="h5" fontWeight={800}>
                            {property.title}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mt: 1, color: "text.secondary" }}>
                            <PlaceIcon sx={{ fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    minWidth: 0,
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {property.address}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                            <Chip
                                label={getLabel(PROPERTY_TYPES, property.property_type)}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={getLabel(TRANSACTION_TYPES, property.transaction_type)}
                                size="small"
                                color="primary"
                            />
                        </Box>

                        <Box
                            sx={{
                                mt: 2.5,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: (theme) => theme.custom.accentTint,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: (theme) => theme.custom.fontMono,
                                    fontWeight: 800,
                                    fontSize: 28,
                                    color: "primary.main",
                                    lineHeight: 1.3,
                                }}
                            >
                                {Number(property.price).toLocaleString("en-US")}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "primary.main" }}>
                                تومان
                            </Typography>
                        </Box>

                        <SpecStrip items={specItems} sx={{ mt: 2.5 }} />

                        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>

                            {secondarySpecs.map(spec => (

                                <Grid size={{ xs: 6 }} key={spec.label}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {spec.label}
                                    </Typography>
                                    <Typography fontWeight={700} sx={{ fontFamily: (theme) => theme.custom.fontMono }}>
                                        {spec.value}
                                    </Typography>
                                </Grid>

                            ))}

                        </Grid>

                        {amenities.length > 0 && (

                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2.5 }}>

                                {amenities.map(item => (

                                    <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                                        <Typography variant="body2">{item.label}</Typography>
                                    </Box>

                                ))}

                            </Box>

                        )}

                        <Divider sx={{ my: 2.5 }} />

                        <AppButton
                            fullWidth
                            onClick={() => setInquiryOpen(true)}
                        >
                            درخواست بازدید از این ملک
                        </AppButton>

                        {agency?.phone && (

                            <AppButton
                                fullWidth
                                variant="outlined"
                                startIcon={<PhoneIcon />}
                                component="a"
                                href={`tel:${agency.phone}`}
                                sx={{ mt: 1.5 }}
                            >
                                تماس مستقیم با آژانس
                            </AppButton>

                        )}

                    </Paper>

                </Grid>

                {property.description && (

                    <Grid size={{ xs: 12 }}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >

                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                                توضیحات
                            </Typography>

                            <Typography color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 2 }}>
                                {property.description}
                            </Typography>

                        </Paper>

                    </Grid>

                )}

                {property.videos?.length > 0 && (

                    <Grid size={{ xs: 12 }}>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >

                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                                ویدیوها
                            </Typography>

                            <Grid container spacing={2}>

                                {property.videos.map(video => (

                                    <Grid size={{ xs: 12, md: 6 }} key={video.id}>

                                        <Box
                                            component="video"
                                            controls
                                            sx={{
                                                width: "100%",
                                                borderRadius: 2,
                                                display: "block",
                                            }}
                                        >

                                            <source src={video.video} type="video/mp4" />

                                            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.

                                        </Box>

                                    </Grid>

                                ))}

                            </Grid>

                        </Paper>

                    </Grid>

                )}

            </Grid>

            <InquiryForm
                open={inquiryOpen}
                onClose={() => setInquiryOpen(false)}
                property={property}
            />

        </PublicLayout>

    );

}