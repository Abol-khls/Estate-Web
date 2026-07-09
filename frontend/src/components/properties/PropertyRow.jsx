import {
    Box,
    Typography,
    IconButton,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import PropertyActions from "./PropertyActions";
import { API_BASE_URL } from "../../config";

export default function PropertyRow({

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

                display: "grid",

                gridTemplateColumns: "130px 200px 140px 1fr 100px 170px",

                columnGap: 2,

                alignItems: "center",

                px: 3,

                py: 2.5,

                borderBottom: "1px solid",

                borderColor: "divider",

                transition: ".2s",

                "&:hover": {

                    bgcolor: "action.hover",

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

                                src={`${API_BASE_URL}${coverImage.image}`}

                                alt={property.title}

                                sx={{

                                    width: 110,

                                    height: 72,

                                    objectFit: "cover",

                                    borderRadius: 2,

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

                <Typography
                    fontWeight={700}
                    fontSize={16}
                >

                    {Number(property.price).toLocaleString("fa-IR")}

                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                >

                    تومان

                </Typography>

            </Box>

            <Typography

                color="text.primary"

                sx={{

                    whiteSpace: "normal",

                    lineHeight: 1.7,

                    pr: 1,

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