import { useRef } from "react";

import {
    Box,
    Stack,
    IconButton,
    Typography
} from "@mui/material";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ImageUploader({

    images,

    setImages

}) {

    const inputRef = useRef(null);

    function handleSelect(e) {

        const files = Array.from(e.target.files);

        const previews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isNew: true
        }));

        setImages(prev => [

            ...prev,

            ...previews

        ]);

    }

    function removeImage(index) {

        if (images[index].preview) {

            URL.revokeObjectURL(
                images[index].preview
            );

        }

        setImages(

            images.filter((_, i) => i !== index)

        );

    }

    return (

        <Box>

            <Typography
                variant="h6"
                mb={2}
            >

                تصاویر ملک

            </Typography>

            <input

                hidden

                multiple

                accept="image/*"

                ref={inputRef}

                type="file"

                onChange={handleSelect}

            />

            <Box

                sx={{

                    border: "2px dashed",

                    borderColor: "divider",

                    borderRadius: 2,

                    py: 4,

                    textAlign: "center",

                    cursor: "pointer",

                    mb: 3

                }}

                onClick={() =>

                    inputRef.current.click()

                }

            >

                <AddPhotoAlternateIcon

                    sx={{

                        fontSize: 50,

                        color: "primary.main"

                    }}

                />

                <Typography>

                    برای انتخاب تصویر کلیک کنید

                </Typography>

            </Box>

            <Stack

                direction="row"

                spacing={2}

                flexWrap="wrap"

            >

                {

                    images.map((image, index) => (

                        <Box

                            key={image.id ?? index}

                            sx={{

                                position: "relative"

                            }}

                        >

                            <img

                                src={image.preview || image.image}

                                width={140}

                                height={110}


                                style={{

                                    objectFit: "cover",

                                    borderRadius: 8

                                }}

                            />

                            <IconButton

                                color="error"

                                size="small"

                                sx={{

                                    position: "absolute",

                                    top: 5,

                                    right: 5,

                                    bgcolor: "white"

                                }}

                                onClick={() =>

                                    removeImage(index)

                                }

                            >

                                <DeleteIcon />

                            </IconButton>

                        </Box>

                    ))

                }

            </Stack>

        </Box>

    );

}