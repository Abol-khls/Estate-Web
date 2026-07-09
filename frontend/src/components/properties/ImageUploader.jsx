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
    newImages = [],
    setNewImages
}) {

    const inputRef = useRef(null);

    function handleSelect(e) {

        const files = Array.from(e.target.files);

        const previews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isNew: true
        }));

        setNewImages(prev => [
            ...prev,
            ...previews
        ]);

        e.target.value = "";
    }

    function removeImage(index) {

        const image = newImages[index];

        if (image?.preview) {
            URL.revokeObjectURL(image.preview);
        }

        setNewImages(prev =>
            prev.filter((_, i) => i !== index)
        );
    }

    return (

        <Box>

            <Typography
                variant="subtitle1"
                sx={{ mb: 1.5 }}
            >
                تصاویر جدید
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
                    borderRadius: 3,
                    py: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    mb: 3,
                    bgcolor: "rgba(31, 59, 87, 0.02)",
                    transition: ".2s",
                    "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(31, 59, 87, 0.05)",
                    },
                }}
                onClick={() => inputRef.current.click()}
            >

                <AddPhotoAlternateIcon
                    sx={{
                        fontSize: 44,
                        color: "primary.main"
                    }}
                />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    برای انتخاب تصویر کلیک کنید
                </Typography>

            </Box>

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    flexWrap: "wrap",
                    rowGap: 2,
                }}
            >

                {newImages.map((image, index) => (

                    <Box
                        key={index}
                        sx={{
                            position: "relative"
                        }}
                    >

                        <Box
                            component="img"
                            src={image.preview}
                            sx={{
                                width: 140,
                                height: 110,
                                objectFit: "cover",
                                borderRadius: 2,
                                boxShadow: "0 1px 3px rgba(16,24,40,0.15)",
                            }}
                        />

                        <IconButton
                            color="error"
                            size="small"
                            sx={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                bgcolor: "white",
                                boxShadow: 1,
                                "&:hover": { bgcolor: "error.main", color: "#fff" },
                            }}
                            onClick={() => removeImage(index)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>

                    </Box>

                ))}

            </Stack>

        </Box>

    );

}