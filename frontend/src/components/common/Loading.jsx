import {

    Box,

    CircularProgress,

    Typography

} from "@mui/material";

export default function Loading() {

    return (

        <Box

            sx={{

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent: "center",

                gap: 1.5,

                py: 8,

            }}

        >

            <CircularProgress
                size={36}
                thickness={4}
                color="primary"
            />

            <Typography
                variant="body2"
                color="text.secondary"
            >
                در حال بارگذاری...
            </Typography>

        </Box>

    );

}