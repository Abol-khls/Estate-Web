import {
    Box,
    Typography,
    IconButton,
    Chip,
    Tooltip,
    Button,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFootOutlined";
import BedIcon from "@mui/icons-material/KingBedOutlined";
import ApartmentIcon from "@mui/icons-material/ApartmentOutlined";

import { BASE_URL } from "../../config";

import SpecStrip from "../common/SpecStrip";
import PriceTag from "../common/PriceTag";
import TonePill from "../common/TonePill";

import {
    getPropertyStatusLabel,
    getPropertyStatusColor,
    getTransactionTone,
    PROPERTY_TYPES,
    TRANSACTION_TYPES,
} from "../../constants/propertyOptions";

function getLabel(list, value) {
    return list.find(item => item.value === value)?.label ?? value;
}

export default function PropertyCard({

    property,

    index = 0,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite,

}) {

    const coverImage =
        property.images?.find(img => img.is_cover) ||
        property.images?.[0];

    const tone = getTransactionTone(property.transaction_type);

    const specItems = [
        { icon: SquareFootIcon, value: Number(property.area).toLocaleString("en-US"), label: "متر" },
        { icon: BedIcon, value: property.rooms ?? null, label: "خواب" },
        { icon: ApartmentIcon, value: property.floor ?? null, label: "طبقه" },
    ];

    return (

        <Box

            sx={{

                borderRadius: 4,

                border: "1px solid",

                borderColor: (theme) => theme.custom.glassBorderSoft,

                bgcolor: "background.paper",

                boxShadow: (theme) => theme.custom.cardShadow,

                overflow: "hidden",

                display: "flex",

                flexDirection: "column",

                transition: "all .3s ease",

                animation: "cardIn .5s ease both",

                animationDelay: `${Math.min(index, 11) * 50}ms`,

                "&:hover": {

                    borderColor: (theme) => theme.custom.tones.emerald.border,

                    boxShadow: (theme) => theme.custom.hoverShadow,

                    transform: "translateY(-2px)",

                },

                "&:hover .cover-img": {
                    transform: "scale(1.04)",
                },

            }}

        >

            <Box

                onClick={() => onView(property)}

                sx={{

                    position: "relative",

                    width: "100%",

                    height: 192,

                    overflow: "hidden",

                    bgcolor: (theme) => theme.custom.surfaceAlt,

                    cursor: "pointer",

                }}

            >

                {coverImage ? (

                    <Box
                        className="cover-img"
                        component="img"
                        src={`${BASE_URL}${coverImage.image}`}
                        alt={property.title}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            transition: "transform .5s ease",
                        }}
                    />

                ) : (

                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.secondary",
                            fontSize: 13,
                        }}
                    >
                        بدون تصویر
                    </Box>

                )}

                <Chip
                    size="small"
                    color={getPropertyStatusColor(property.status)}
                    label={getPropertyStatusLabel(property.status)}
                    sx={{
                        position: "absolute",
                        top: 12,
                        insetInlineStart: 12,
                        fontWeight: 600,
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    }}
                />

                <IconButton

                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property);
                    }}

                    aria-label="علاقه‌مندی"

                    sx={{

                        position: "absolute",

                        top: 10,

                        insetInlineEnd: 10,

                        bgcolor: "rgba(9, 13, 22, 0.6)",

                        backdropFilter: "blur(8px)",

                        width: 34,

                        height: 34,

                        "&:hover": { bgcolor: "rgba(9, 13, 22, 0.85)" },

                    }}

                >

                    {property.is_favorite ? (

                        <FavoriteIcon sx={{ fontSize: 19, color: "#f87171" }} />

                    ) : (

                        <FavoriteBorderIcon sx={{ fontSize: 19, color: "#e2e8f0" }} />

                    )}

                </IconButton>

                <PriceTag property={property} />

            </Box>

            <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>

                <Box>

                    <Typography
                        fontWeight={700}
                        fontSize={16}
                        noWrap
                        onClick={() => onView(property)}
                        sx={{ cursor: "pointer" }}
                    >
                        {property.title}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: 0.5 }}>

                        <PlaceIcon
                            sx={{
                                fontSize: 16,
                                mt: 0.2,
                                color: (theme) => theme.custom.tones[tone].text,
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "text.secondary",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {property.address}
                        </Typography>

                    </Box>

                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>

                    <TonePill
                        tone={tone}
                        label={getLabel(TRANSACTION_TYPES, property.transaction_type)}
                    />

                    <Chip
                        size="small"
                        variant="outlined"
                        label={getLabel(PROPERTY_TYPES, property.property_type)}
                        sx={{ height: 20, fontSize: 11, fontWeight: 500 }}
                    />

                </Box>

                <SpecStrip inline items={specItems} sx={{ mt: "auto" }} />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                    }}
                >

                    <Typography
                        sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}
                    >
                        کد ملک: <bdi>{property.code}</bdi>
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>

                        <Tooltip title="ویرایش">
                            <IconButton
                                size="small"
                                aria-label="ویرایش"
                                onClick={() => onEdit(property)}
                                sx={{
                                    color: (theme) => theme.custom.tones.emerald.text,
                                    "&:hover": {
                                        bgcolor: (theme) => theme.custom.tones.emerald.bg,
                                    },
                                }}
                            >
                                <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="حذف">
                            <IconButton
                                size="small"
                                aria-label="حذف"
                                onClick={() => onDelete(property)}
                                sx={{
                                    color: "text.secondary",
                                    "&:hover": {
                                        bgcolor: (theme) => theme.custom.tones.rose.bg,
                                        color: (theme) => theme.custom.tones.rose.text,
                                    },
                                }}
                            >
                                <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Button
                            size="small"
                            onClick={() => onView(property)}
                            sx={{
                                px: 1.75,
                                py: 0.5,
                                fontSize: 12,
                                border: "1px solid",
                                color: (theme) => theme.custom.tones[tone].text,
                                bgcolor: (theme) => theme.custom.tones[tone].bg,
                                borderColor: (theme) => theme.custom.tones[tone].border,
                                "&:hover": {
                                    bgcolor: (theme) => theme.custom.tones[tone].border,
                                },
                            }}
                        >
                            جزئیات کامل
                        </Button>

                    </Box>

                </Box>

            </Box>

        </Box>

    );

}