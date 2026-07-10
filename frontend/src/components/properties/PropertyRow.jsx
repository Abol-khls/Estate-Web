import {
    Box,
    Typography,
    IconButton,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import PropertyActions from "./PropertyActions";
import { BASE_URL } from "../../config";

export default function PropertyRow({

    property,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite,

    gridColumns = "130px 200px 140px 1fr 100px 170px",

    striped = false,

}) {

    const coverImage =
        property.images?.find(img => img.is_cover) ||
        property.images?.[0];

    return (

        <Box

            sx={{

                display: "grid",

                gridTemplateColumns: gridColumns,

                columnGap: 2,

                alignItems: "center",

                px: 3,

                py: 2.5,

                bgcolor: striped ? "rgba(31, 59, 87, 0.02)" : "transparent",

                borderBottom: "1px solid",

                borderColor: "divider",

                borderInlineStart: "3px solid transparent",

                transition: ".2s",

                "&:hover": {

                    bgcolor: "rgba(31, 59, 87, 0.05)",

                    borderInlineStartColor: "secondary.main",

                }

            }}

        >

            <Box
                sx={{ display: "flex", justifyContent: "center" }}
            >

                {

                    coverImage ?

                        (

                            <Box

                                component="img"

                                src={`${BASE_URL}${coverImage.image}`}

                                alt={property.title}

                                sx={{

                                    width: 110,

                                    height: 72,

                                    objectFit: "cover",

                                    borderRadius: 2,

                                    boxShadow: "0 1px 2px rgba(16,24,40,0.12)",

                                }}

                            />

                        )

                        :

                        (

                            <Box

                                sx={{

                                    width: 110,

                                    height: 72,

                                    bgcolor: "grey.100",

                                    borderRadius: 2,

                                    display: "flex",

                                    justifyContent: "center",

                                    alignItems: "center",

                                    color: "text.secondary",

                                    fontSize: 12,

                                }}

                            >

                                بدون تصویر

                            </Box>

                        )

                }

            </Box>

            <Box sx={{ textAlign: "center" }}>

                <Typography

                    fontWeight={700}

                    fontSize={16}

                    noWrap

                >

                    {property.title}

                </Typography>

                <Typography

                    variant="body2"

                    color="text.secondary"

                    sx={{ mt: 0.3 }}

                >

                    کد ملک: <bdi>{property.code}</bdi>

                </Typography>

            </Box>

            <Box
                sx={{ textAlign: "center" }}
            >

                <Box
                    sx={{
                        display: "inline-flex",
                        flexDirection: "column",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        bgcolor: "rgba(200, 155, 60, 0.12)",
                    }}
                >

                    <Typography
                        fontWeight={700}
                        fontSize={15}
                        sx={{ color: "#8A6A1F" }}
                    >

                        {Number(property.price).toLocaleString("fa-IR")}

                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{ color: "#8A6A1F", opacity: 0.8 }}
                    >

                        تومان

                    </Typography>

                </Box>

            </Box>

            <Typography
                color="text.primary"
                sx={{
                    whiteSpace: "normal",
                    lineHeight: 1.7,
                    pr: 1,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                }}
            >
                {property.address}
            </Typography>

            <Box
                sx={{ display: "flex", justifyContent: "center" }}
            >

                <IconButton

                    color="error"

                    onClick={() => onToggleFavorite(property)}

                >

                    {

                        property.is_favorite ?

                            <FavoriteIcon />

                            :

                            <FavoriteBorderIcon />

                    }

                </IconButton>

            </Box>

            <Box
                sx={{ display: "flex", justifyContent: "center" }}
            >

                <PropertyActions

                    property={property}

                    onView={onView}

                    onEdit={onEdit}

                    onDelete={onDelete}

                />

            </Box>

        </Box>

    );

}