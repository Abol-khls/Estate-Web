import { Box, Typography, Chip } from "@mui/material";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import SquareFootIcon from "@mui/icons-material/SquareFootOutlined";

import { PROPERTY_TYPES, TRANSACTION_TYPES } from "../../constants/propertyOptions";

function getLabel(list, value) {
    return list.find(item => item.value === value)?.label ?? value;
}

export default function PublicPropertyCard({ property, onView }) {

    return (

        <Box
            onClick={() => onView(property)}
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
                overflow: "hidden",
                cursor: "pointer",
                transition: ".2s",
                "&:hover": {
                    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.12)",
                    transform: "translateY(-2px)",
                },
            }}
        >

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    bgcolor: "grey.100",
                }}
            >

                {property.cover_image ? (

                    <Box
                        component="img"
                        src={property.cover_image}
                        alt={property.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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

                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                        {Number(property.price).toLocaleString("fa-IR")} تومان
                    </Typography>

                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                        {getLabel(TRANSACTION_TYPES, property.transaction_type)}
                    </Typography>

                </Box>

            </Box>

            <Box sx={{ p: 2 }}>

                <Typography fontWeight={700} fontSize={16} noWrap>
                    {property.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: 0.5 }}>

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

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1.5 }}>

                    <Chip size="small" variant="outlined" label={getLabel(PROPERTY_TYPES, property.property_type)} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary" }}>
                        <SquareFootIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">
                            {Number(property.area).toLocaleString("fa-IR")} متر
                        </Typography>
                    </Box>

                </Box>

            </Box>

        </Box>

    );

}