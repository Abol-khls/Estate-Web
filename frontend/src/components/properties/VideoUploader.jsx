import { useRef } from "react";

import {
    Box,
    Stack,
    Typography,
    IconButton
} from "@mui/material";

import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";

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

    }

    return (

        <Box mt={4}>

            <Typography
                variant="h6"
                mb={2}
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

                <VideoLibraryIcon

                    sx={{

                        fontSize: 50,

                        color: "primary.main"

                    }}

                />

                <Typography>

                    برای انتخاب ویدیو کلیک کنید

                </Typography>

            </Box>

            <Stack

                direction="row"

                spacing={2}

                sx={{

                    flexWrap: "wrap"

                }}

            >

                {

                    existingVideos.map((video, index) => (

                        <Box
                            key={video.id}
                            sx={{
                                position: "relative"
                            }}
                        >

                            <video

                                src={video.video}

                                width={180}

                                controls

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

                                    onRemove(video, index, false)

                                }

                            >

                                <DeleteIcon />

                            </IconButton>

                        </Box>

                    ))

                }

                {

                    newVideos.map((video, index) => (

                        <Box
                            key={index}
                            sx={{
                                position: "relative"
                            }}
                        >

                            <video

                                src={video.preview}

                                width={180}

                                controls

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

                                    onRemove(video, index, true)

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