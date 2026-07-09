import { useRef } from "react";

import {
    Box,
    Stack,
    Typography,
    IconButton
} from "@mui/material";

import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";

import { API_BASE_URL } from "../../config";

export default function VideoUploader({

    existingVideos,
    setExistingVideos,

    newVideos,
    setNewVideos,

    onRemove


}) {

    const inputRef = useRef(null);

    function handleSelect(e) {

        const files = Array.from(e.target.files);

        const previews = files.map(file => ({

            file,

            preview: URL.createObjectURL(file),

            isNew: true

        }));

        setNewVideos(prev => [

            ...prev,

            ...previews

        ]);
        e.target.value = "";

    }

    return (

        <Box sx={{ mt: 4 }}>

            <Typography
                variant="subtitle1"
                sx={{ mb: 1.5 }}
            >

                ویدیوهای ملک

            </Typography>

            <input

                hidden

                multiple

                accept="video/*"

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

                onClick={() =>

                    inputRef.current.click()

                }

            >

                <VideoLibraryIcon

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

                    برای انتخاب ویدیو کلیک کنید

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

                {

                    existingVideos.map((video, index) => (


                        <Box
                            key={video.id}
                            sx={{
                                position: "relative",
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: "0 1px 3px rgba(16,24,40,0.15)",
                            }}
                        >

                            <video
                                width={180}
                                controls
                                style={{ display: "block" }}
                            >
                                <source
                                    src={`${API_BASE_URL}${video.video}`}
                                    type="video/mp4"
                                />
                            </video>

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

                                onClick={() =>

                                    onRemove(video, index, false)

                                }

                            >

                                <DeleteIcon fontSize="small" />

                            </IconButton>

                        </Box>

                    ))

                }

                {

                    newVideos.map((video, index) => (

                        <Box
                            key={index}
                            sx={{
                                position: "relative",
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: "0 1px 3px rgba(16,24,40,0.15)",
                            }}
                        >

                            <video

                                src={video.preview}

                                width={180}

                                controls

                                style={{ display: "block" }}

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

                                onClick={() =>

                                    onRemove(video, index, true)

                                }

                            >

                                <DeleteIcon fontSize="small" />

                            </IconButton>

                        </Box>

                    ))

                }

            </Stack>

        </Box>

    );

}