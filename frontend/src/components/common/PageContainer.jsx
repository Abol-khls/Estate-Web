import { Box, Container } from "@mui/material";

export default function PageContainer({ children }) {

    return (

        <Box
            sx={{
                minHeight: "100%",
                py: { xs: 2, md: 3 },
            }}
        >

            <Container maxWidth={false} sx={{ maxWidth: 1600 }}>
                {children}
            </Container>

        </Box>

    );

}