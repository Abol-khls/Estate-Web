import {

    TableRow,
    TableCell,
    IconButton,
    Stack

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

    onToggleFavorite

}) {

    const coverImage =
        property.images?.find(img => img.is_cover) ||
        property.images?.[0];

    return (

        <TableRow
            hover
            sx={{
                transition: "all .2s",
                "&:hover": {
                    bgcolor: "action.hover",
                },
            }}
        >

            <TableCell
                sx={{
                    py: 2,
                    verticalAlign: "middle",
                }}
                width={140}>

                {

                    coverImage ? (

                        <img

                            src={`${API_BASE_URL}${coverImage.image}`}

                            alt={property.title}

                            style={{

                                width: 120,

                                height: 80,

                                objectFit: "cover",

                                borderRadius: 8

                            }}

                        />

                    ) : (

                        <div
                            style={{
                                width: 120,
                                height: 80,
                                borderRadius: 8,
                                background: "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: 12,
                                border: "1px solid #ddd"
                            }}
                        >
                            بدون تصویر
                        </div>

                    )

                }

            </TableCell>

            <TableCell
                sx={{
                    py: 2,
                    verticalAlign: "middle",
                }}
            >

                {property.title}

            </TableCell>

            <TableCell
                sx={{
                    py: 2,
                    verticalAlign: "middle",
                }}
            >

                {property.price}

            </TableCell>

            <TableCell
                sx={{
                    py: 2,
                    verticalAlign: "middle",
                }}
            >

                {property.address}

            </TableCell>

            <TableCell
                sx={{
                    py: 2,
                    verticalAlign: "middle",
                }}
            >

                <IconButton

                    color="error"

                    onClick={() => onToggleFavorite(property)}

                >

                    {

                        property.is_favorite

                            ?

                            <FavoriteIcon />

                            :

                            <FavoriteBorderIcon />

                    }

                </IconButton>

            </TableCell>
            <TableCell
                sx={{
                    py: 2,
                }}
            >

                <Stack direction="row" spacing={1}>

                    <PropertyActions

                        property={property}

                        onView={onView}

                        onEdit={onEdit}

                        onDelete={onDelete}

                    />

                </Stack>

            </TableCell>









        </TableRow>

    );

}