import { Box, Typography } from "@mui/material";

export default function SpecStrip({ items, sx }) {

    const visible = items.filter((item) => item.value !== null && item.value !== undefined);

    if (visible.length === 0) {
        return null;
    }

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "stretch",
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 1,
                ...sx,
            }}
        >

            {visible.map((item, index) => (

                <Box
                    key={item.label}
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.3,
                        position: "relative",
                        ...(index !== 0 && {
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                insetInlineStart: 0,
                                top: 2,
                                bottom: 2,
                                width: "1px",
                                bgcolor: "divider",
                            },
                        }),
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                            fontFamily: (theme) => theme.custom.fontMono,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "text.primary",
                        }}
                    >

                        <item.icon sx={{ fontSize: 15, color: "primary.main" }} />

                        {item.value}

                    </Box>

                    <Typography
                        sx={{ fontSize: 11, color: (theme) => theme.custom.textMuted }}
                    >
                        {item.label}
                    </Typography>

                </Box>

            ))}

        </Box>

    );

}