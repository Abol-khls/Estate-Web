import { Box } from "@mui/material";

export default function TonePill({ tone, label, size = "small", sx }) {

    return (

        <Box
            component="span"
            sx={{
                display: "inline-flex",
                alignItems: "center",
                height: size === "small" ? 20 : 26,
                px: size === "small" ? 1 : 1.25,
                borderRadius: 999,
                fontSize: size === "small" ? 11 : 12,
                fontWeight: 500,
                whiteSpace: "nowrap",
                border: "1px solid",
                bgcolor: (theme) => theme.custom.tones[tone]?.bg,
                borderColor: (theme) => theme.custom.tones[tone]?.border,
                color: (theme) => theme.custom.tones[tone]?.text,
                ...sx,
            }}
        >
            {label}
        </Box>

    );

}