import { Box, Stack, Typography } from "@mui/material";

export default function PageHeader({

    title,

    subtitle,

    action

}) {

    return (

        <Stack
            direction="row"
            sx={{
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 2,
                mb: 4,
            }}
        >

            <Box>

                <Box
                    sx={{
                        width: 36,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "secondary.main",
                        mb: 1.5,
                    }}
                />

                <Typography
                    variant="h4"
                    color="text.primary"
                >

                    {title}

                </Typography>

                {subtitle && (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >

                        {subtitle}

                    </Typography>

                )}

            </Box>

            {action}

        </Stack>

    );

}