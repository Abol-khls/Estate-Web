import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

import api from "../../services/api";

export default function PublicLayout({ children }) {

    const navigate = useNavigate();

    const { data: agency } = useQuery({

        queryKey: ["public", "agency"],

        queryFn: async () => {

            const response = await api.get("public/agency/");

            return response.data;

        },

    });

    return (

        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F8FA" }}>

            <Box
                component="header"
                sx={{
                    bgcolor: "primary.dark",
                    color: "#fff",
                }}
            >

                <Container maxWidth="lg">

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 2,
                            flexWrap: "wrap",
                            gap: 1.5,
                        }}
                    >

                        <Box
                            onClick={() => navigate("/")}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                                cursor: "pointer",
                            }}
                        >

                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: "secondary.main",
                                }}
                            />

                            <Typography variant="h6" sx={{ color: "#fff" }}>
                                {agency?.name || "بنگاه املاک"}
                            </Typography>

                        </Box>

                        {agency?.phone && (

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                <PhoneIcon sx={{ fontSize: 18, color: "secondary.main" }} />

                                <Typography variant="body2">
                                    <bdi>{agency.phone}</bdi>
                                </Typography>

                            </Box>

                        )}

                    </Box>

                </Container>

            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    py: 3,
                    mt: 4,
                }}
            >

                <Container maxWidth="lg">

                    <Typography variant="body2" color="text.secondary" align="center">
                        {agency?.name || "بنگاه املاک"}
                        {agency?.address ? ` · ${agency.address}` : ""}
                    </Typography>

                </Container>

            </Box>

        </Box>

    );

}