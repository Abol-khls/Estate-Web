import { Box, Paper, Typography, Button } from "@mui/material";

export default function ErrorState({

    icon: Icon,

    code,

    title,

    message,

    actionLabel,

    onAction,

}) {

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.dark",
                backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(200,155,60,0.15), transparent 40%)," +
                    "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06), transparent 40%)",
                p: 2,
            }}
        >

            <Paper
                sx={{
                    width: 400,
                    maxWidth: "100%",
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                    textAlign: "center",
                }}
            >

                <Box
                    sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        bgcolor: "rgba(200, 155, 60, 0.12)",
                        color: "secondary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2.5,
                    }}
                >
                    <Icon sx={{ fontSize: 34 }} />
                </Box>

                <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", letterSpacing: 2 }}
                >
                    خطای {code}
                </Typography>

                <Typography variant="h5" sx={{ mt: 0.5, mb: 1.5, fontWeight: 800 }}>
                    {title}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.9 }}>
                    {message}
                </Typography>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={onAction}
                    sx={{ borderRadius: 2.5, py: 1.2 }}
                >
                    {actionLabel}
                </Button>

            </Paper>

        </Box>

    );

}