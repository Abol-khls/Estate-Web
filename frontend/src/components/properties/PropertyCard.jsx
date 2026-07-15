import {
    Box,
    Typography,
    IconButton,
    Chip,
    Tooltip,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFootOutlined";

import { BASE_URL } from "../../config";

import {
    getPropertyStatusLabel,
    getPropertyStatusColor,
    PROPERTY_TYPES,
    TRANSACTION_TYPES,
} from "../../constants/propertyOptions";

function getLabel(list, value) {
    return list.find(item => item.value === value)?.label ?? value;
}

export default function PropertyCard({

    property,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite,

}) {

    const coverImage =
        property.images?.find(img => img.is_cover) ||
        property.images?.[0];

    return (

        <Box

            sx={{

                borderRadius: 4,

                border: "1px solid",

                borderColor: "divider",

                bgcolor: "background.paper",

                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",

                overflow: "hidden",

                display: "flex",

                flexDirection: "column",

                transition: ".2s",

                "&:hover": {

                    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.12)",

                    transform: "translateY(-2px)",

                },

            }}

        >

            <Box

                onClick={() => onView(property)}

                sx={{

                    position: "relative",

                    width: "100%",

                    aspectRatio: "16 / 10",

                    bgcolor: "grey.100",

                    cursor: "pointer",

                }}

            >

                {coverImage ? (

                    <Box
                        component="img"
                        src={`${BASE_URL}${coverImage.image}`}
                        alt={property.title}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
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
                        top: 10,
                        insetInlineStart: 10,
                        fontWeight: 700,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                    }}
                />

                <IconButton

                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property);
                    }}

                    sx={{

                        position: "absolute",

                        top: 8,

                        insetInlineEnd: 8,

                        bgcolor: "rgba(255,255,255,0.9)",

                        width: 34,

                        height: 34,

                        "&:hover": { bgcolor: "#fff" },

                    }}

                >

                    {property.is_favorite ? (

                        <FavoriteIcon sx={{ fontSize: 19, color: "error.main" }} />

                    ) : (

                        <FavoriteBorderIcon sx={{ fontSize: 19, color: "text.secondary" }} />

                    )}

                </IconButton>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        insetInlineStart: 0,
                        insetInlineEnd: 0,
                        px: 1.5,
                        py: 1,
                        background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >

                    <Typography
                        sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}
                    >
                        {Number(property.price).toLocaleString("fa-IR")} تومان
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.85)" }}
                    >
                        {getLabel(TRANSACTION_TYPES, property.transaction_type)}
                    </Typography>

                </Box>

            </Box>

            <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>

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

                    <Typography variant="caption" color="text.secondary">
                        کد ملک: <bdi>{property.code}</bdi>
                    </Typography>

                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>

                    <PlaceIcon sx={{ fontSize: 16, color: "text.secondary", mt: 0.3 }} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {property.address}
                    </Typography>

                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>

                    <Chip
                        size="small"
                        variant="outlined"
                        label={getLabel(PROPERTY_TYPES, property.property_type)}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary" }}>
                        <SquareFootIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">
                            {Number(property.area).toLocaleString("fa-IR")} متر
                        </Typography>
                    </Box>

                </Box>

                <Box
                    sx={{
                        mt: "auto",
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                    }}
                >

                    <Tooltip title="مشاهده">
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => onView(property)}
                            sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "info.main",
                                "&:hover": { bgcolor: "info.main", color: "#fff" },
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="ویرایش">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(property)}
                            sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "primary.main",
                                "&:hover": { bgcolor: "primary.main", color: "#fff" },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="حذف">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(property)}
                            sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "error.main",
                                "&:hover": { bgcolor: "error.main", color: "#fff" },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                </Box>

            </Box>

        </Box>

    );

}