import { Box, Typography, Chip, Button } from "@mui/material";

import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFootOutlined";
import BedIcon from "@mui/icons-material/KingBedOutlined";
import ApartmentIcon from "@mui/icons-material/ApartmentOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";

import SpecStrip from "../../components/common/SpecStrip";
import PriceTag from "../../components/common/PriceTag";

import {
    PROPERTY_TYPES,
    TRANSACTION_TYPES,
    getTransactionTypeColor,
    getTransactionTone,
} from "../../constants/propertyOptions";

function getLabel(list, value) {
    return list.find(item => item.value === value)?.label ?? value;
}

export default function PublicPropertyCard({ property, onView, index = 0 }) {

    const tone = getTransactionTone(property.transaction_type);

    const specItems = [
        { icon: SquareFootIcon, value: Number(property.area).toLocaleString("en-US"), label: "متر" },
        { icon: BedIcon, value: property.rooms ?? null, label: "خواب" },
        { icon: ApartmentIcon, value: property.floor ?? null, label: "طبقه" },
    ];

    return (

        <Box

            onClick={() => onView(property)}

            sx={{

                borderRadius: 4,

                border: "1px solid",

                borderColor: (theme) => theme.custom.glassBorderSoft,

                bgcolor: "background.paper",

                boxShadow: (theme) => theme.custom.cardShadow,

                overflow: "hidden",

                display: "flex",

                flexDirection: "column",

                cursor: "pointer",

                transition: "all .3s ease",

                animation: "cardIn .55s ease both",

                animationDelay: `${Math.min(index, 11) * 60}ms`,

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

                sx={{

                    position: "relative",

                    width: "100%",

                    height: 192,

                    overflow: "hidden",

                    bgcolor: (theme) => theme.custom.surfaceAlt,

                }}

            >

                {property.cover_image ? (

                    <Box
                        className="cover-img"
                        component="img"
                        src={property.cover_image}
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
                    color={getTransactionTypeColor(property.transaction_type)}
                    label={getLabel(TRANSACTION_TYPES, property.transaction_type)}
                    sx={{
                        position: "absolute",
                        top: 12,
                        insetInlineStart: 12,
                        fontWeight: 600,
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    }}
                />

                <PriceTag property={property} />

            </Box>

            <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>

                <Box>

                    <Typography fontWeight={700} fontSize={16} noWrap>
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

                    <Chip
                        size="small"
                        variant="outlined"
                        label={getLabel(PROPERTY_TYPES, property.property_type)}
                        sx={{ height: 20, fontSize: 11, fontWeight: 500 }}
                    />

                </Box>

                <SpecStrip inline items={specItems} sx={{ mt: "auto" }} />

                <Button
                    fullWidth
                    startIcon={<EventAvailableIcon sx={{ fontSize: 16 }} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(property);
                    }}
                    sx={{
                        py: 1,
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
                    مشاهده جزئیات و رزرو بازدید
                </Button>

            </Box>

        </Box>

    );

}