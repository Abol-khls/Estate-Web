import { Box, Typography } from "@mui/material";

export default function InfoItem({ label, value }) {

    return (

        <Box>

            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>

            <Typography fontWeight={600}>
                {value ?? "—"}
            </Typography>

        </Box>

    );

}