import { useState, useEffect } from "react";

import {
    Box,
    Grid,
    Card,
    CardMedia
} from "@mui/material";

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
        return null;
    }
    

    return (

        <Box>

            <Card
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    overflow: "hidden"
                }}
            >

                <CardMedia

                    component="img"

                    image={`${API_BASE_URL}${selectedImage.image}`}

                    alt={title}

                    sx={{
                        height: 520,
                        objectFit: "cover"
                    }}

                />

            </Card>

            <Grid container spacing={2}>

                {images.map(image => (

                    <Grid
                        size={{ xs: 4, md: 2 }}
                        key={image.id}
                    >

                        <Card

                            onClick={() =>
                                setSelectedImage(image)
                            }

                            sx={{

                                cursor: "pointer",

                                border:

                                    selectedImage?.id === image.id

                                        ? "3px solid #1976d2"

                                        : "2px solid transparent",

                                transition: ".2s"

                            }}

                        >

                            <CardMedia

                                component="img"

                                image={`${API_BASE_URL}${image.image}`}

                                sx={{
                                    height: 100,
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