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
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
            }}
        >

            <Box>

                <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{ fontSize: 20, fontWeight: 700 }}
                >

                    {title}

                </Typography>

                {subtitle && (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.25, fontSize: 12 }}
                    >

                        {subtitle}

                    </Typography>

                )}

            </Box>

            {action}

        </Stack>

    );

}