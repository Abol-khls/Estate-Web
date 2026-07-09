import { Box, Container } from "@mui/material";

export default function PageContainer({ children }) {

    return (

        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
                py: { xs: 3, md: 5 },
            }}
        >

            <Container maxWidth="xl">
                {children}
            </Container>

        </Box>

    );

}