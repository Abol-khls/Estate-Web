import { Container } from "@mui/material";

export default function PageContainer({ children }) {

    return (

        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                mb: 4,
            }}
        >
            {children}
        </Container>

    );

}