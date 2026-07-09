import { useState, useEffect } from "react";

import {
    Box,
    Grid,
    Card,
    CardMedia,
    Typography
} from "@mui/material";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";

import { API_BASE_URL } from "../../config";

export default function PropertyGallery({ images, title }) {

    const cover =
        images?.find(img => img.is_cover) ?? images?.[0] ?? null;

    const [selectedImage, setSelectedImage] = useState(cover);

    useEffect(() => {

        setSelectedImage(
            images?.find(img => img.is_cover) ??
            images?.[0] ??
            null
        );

    }, [images]);

    if (!images?.length) {

        return (

            <Box
                sx={{
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    color: "text.secondary",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >

                <ImageNotSupportedOutlinedIcon
                    sx={{ fontSize: 36, opacity: 0.5 }}
                />

                <Typography variant="body2">
                    تصویری برای این ملک ثبت نشده است.
                </Typography>

            </Box>

        );

    }


    return (

        <Box>

            <Card
                elevation={0}
                sx={{
                    mb: 2,
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 4px 16px rgba(16,24,40,0.08)",
                }}
            >

                <CardMedia

                    component="img"

                    image={`${API_BASE_URL}${selectedImage.image}`}

                    alt={title}

                    sx={{
                        height: 480,
                        objectFit: "cover"
                    }}

                />

            </Card>

            <Grid container spacing={1.5}>

                {images.map(image => (

                    <Grid
                        size={{ xs: 4, md: 2 }}
                        key={image.id}
                    >

                        <Card

                            elevation={0}

                            onClick={() =>
                                setSelectedImage(image)
                            }

                            sx={{

                                cursor: "pointer",

                                borderRadius: 2,

                                border: "3px solid",

                                borderColor:

                                    selectedImage?.id === image.id

                                        ? "secondary.main"

                                        : "transparent",

                                opacity:
                                    selectedImage?.id === image.id
                                        ? 1
                                        : 0.75,

                                transition: ".2s",

                                "&:hover": { opacity: 1 },

                            }}

                        >

                            <CardMedia

                                component="img"

                                image={`${API_BASE_URL}${image.image}`}

                                sx={{
                                    height: 90,
                                    objectFit: "cover"
                                }}

                            />

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </Box>

    );

}