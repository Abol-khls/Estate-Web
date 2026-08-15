import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Popover } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import LoginIcon from "@mui/icons-material/Login";

import api from "../../services/api";
import ThemeToggleButton from "../../components/common/ThemeToggleButton";

export default function PublicLayout({ children }) {

    const navigate = useNavigate();

    const [contactAnchor, setContactAnchor] = useState(null);

    const { data: agency } = useQuery({

        queryKey: ["public", "agency"],

        queryFn: async () => {

            const response = await api.get("public/agency/");

            return response.data;

        },

    });

    return (

        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>

            <Box
                component="header"
                sx={{
                    bgcolor: (theme) => theme.custom.darkAnchorBg,
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

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>

                            <ThemeToggleButton sx={{ color: "inherit" }} />

                            {(agency?.phone || agency?.address) && (

                                <>

                                    <Box
                                        onClick={(e) => setContactAnchor(e.currentTarget)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.8,
                                            cursor: "pointer",
                                            color: "rgba(255,255,255,0.9)",
                                            fontSize: 13,
                                            px: 1.2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            border: "1px solid rgba(255,255,255,0.25)",
                                            transition: ".15s",
                                            "&:hover": {
                                                color: "#fff",
                                                borderColor: "rgba(255,255,255,0.5)",
                                            },
                                        }}
                                    >

                                        <PhoneIcon sx={{ fontSize: 16, color: "secondary.main" }} />

                                        <Typography variant="body2" sx={{ color: "inherit" }}>
                                            راه‌های تماس
                                        </Typography>

                                    </Box>

                                    <Popover
                                        open={Boolean(contactAnchor)}
                                        anchorEl={contactAnchor}
                                        onClose={() => setContactAnchor(null)}
                                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                                        slotProps={{
                                            paper: {
                                                sx: { borderRadius: 3, p: 2, minWidth: 240 },
                                            },
                                        }}
                                    >

                                        {agency?.phone && (

                                            <Box
                                                component="a"
                                                href={`tel:${agency.phone}`}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    color: "text.primary",
                                                    textDecoration: "none",
                                                    py: 0.8,
                                                    "&:hover": { color: "primary.main" },
                                                }}
                                            >

                                                <PhoneIcon sx={{ fontSize: 18, color: "primary.main" }} />

                                                <Typography variant="body2">
                                                    <bdi>{agency.phone}</bdi>
                                                </Typography>

                                            </Box>

                                        )}

                                        {agency?.address && (

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: 1,
                                                    py: 0.8,
                                                }}
                                            >

                                                <PlaceIcon sx={{ fontSize: 18, color: "primary.main", mt: 0.2 }} />

                                                <Typography variant="body2" color="text.secondary">
                                                    {agency.address}
                                                </Typography>

                                            </Box>

                                        )}

                                    </Popover>

                                </>

                            )}

                            <Box
                                onClick={() => navigate("/admin/login")}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.6,
                                    cursor: "pointer",
                                    color: "rgba(255,255,255,0.75)",
                                    fontSize: 13,
                                    px: 1.2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    transition: ".15s",
                                    "&:hover": {
                                        color: "#fff",
                                        borderColor: "rgba(255,255,255,0.5)",
                                    },
                                }}
                            >

                                <LoginIcon sx={{ fontSize: 16 }} />

                                <Typography variant="caption" sx={{ color: "inherit" }}>
                                    ورود مدیران
                                </Typography>

                            </Box>

                        </Box>

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