import { Box } from "@mui/material";

export default function StatusPill({ status, label, sx }) {

    return (

        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: (theme) => theme.custom.fontMono,
                fontSize: 11,
                fontWeight: 600,
                px: 1.2,
                py: 0.4,
                borderRadius: 999,
                bgcolor: (theme) =>
                    theme.custom.status[status]?.bg ?? theme.custom.status.sold.bg,
                color: (theme) =>
                    theme.custom.status[status]?.text ?? theme.custom.status.sold.text,
                ...sx,
            }}
        >
            {label}
        </Box>

    );

}