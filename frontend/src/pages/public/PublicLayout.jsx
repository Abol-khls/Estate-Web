import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Popover } from "@mui/material";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import LoginIcon from "@mui/icons-material/Logout";
import { Building } from "lucide-react";

import api from "../../services/api";
import ThemeToggleButton from "../../components/common/ThemeToggleButton";

const headButtonSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    px: { xs: 1.1, sm: 1.75 },
    py: 0.75,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 3,
    cursor: "pointer",
    color: "#cbd5e1",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    bgcolor: "rgba(30, 41, 59, 0.5)",
    transition: "all .2s ease",
    "&:hover": {
        color: "#fff",
        borderColor: "rgba(16, 185, 129, 0.4)",
        bgcolor: "rgba(16, 185, 129, 0.08)",
    },
};

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

        <Box sx={{ minHeight: "100vh" }}>

            <Box
                component="header"
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                    bgcolor: (theme) => theme.custom.publicHeadBg,
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#f1f5f9",
                }}
            >

                <Container maxWidth="lg">

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 1.5,
                            gap: 1.5,
                        }}
                    >

                        <Box
                            onClick={() => navigate("/")}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                cursor: "pointer",
                            }}
                        >

                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    flexShrink: 0,
                                    background: (theme) => theme.custom.brandDiag,
                                    boxShadow: (theme) => theme.custom.glow,
                                    transition: "transform .3s ease",
                                    "&:hover": { transform: "rotate(-6deg) scale(1.05)" },
                                }}
                            >
                                <Building size={22} />
                            </Box>

                            <Box>

                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 16,
                                        lineHeight: 1.5,
                                        background: "linear-gradient(90deg, #34d399 0%, #22d3ee 100%)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent",
                                    }}
                                >
                                    {agency?.name || "بنگاه املاک"}
                                </Typography>

                                <Typography sx={{ fontSize: 11.5, color: "#94a3b8", display: { xs: "none", sm: "block" } }}>
                                    پورتال رسمی املاک و مستغلات
                                </Typography>

                            </Box>

                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                            <ThemeToggleButton
                                sx={{
                                    border: 0,
                                    bgcolor: "transparent",
                                    color: "#94a3b8",
                                    "&:hover": { color: "#fff", bgcolor: "rgba(255, 255, 255, 0.06)" },
                                }}
                            />

                            {(agency?.phone || agency?.address) && (

                                <>

                                    <Box
                                        component="button"
                                        type="button"
                                        onClick={(e) => setContactAnchor(e.currentTarget)}
                                        sx={{ ...headButtonSx, fontFamily: "inherit" }}
                                    >

                                        <PhoneIcon sx={{ fontSize: 16 }} />

                                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>راه‌های تماس</Box>

                                    </Box>

                                    <Popover
                                        open={Boolean(contactAnchor)}
                                        anchorEl={contactAnchor}
                                        onClose={() => setContactAnchor(null)}
                                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                                        slotProps={{
                                            paper: {
                                                sx: { p: 2, minWidth: 260, mt: 1 },
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
                                                    gap: 1.25,
                                                    color: "text.primary",
                                                    textDecoration: "none",
                                                    py: 0.8,
                                                    "&:hover": { color: (theme) => theme.custom.tones.emerald.text },
                                                }}
                                            >

                                                <PhoneIcon sx={{ fontSize: 18, color: (theme) => theme.custom.tones.emerald.text }} />

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
                                                    gap: 1.25,
                                                    py: 0.8,
                                                }}
                                            >

                                                <PlaceIcon sx={{ fontSize: 18, color: (theme) => theme.custom.tones.cyan.text, mt: 0.2 }} />

                                                <Typography variant="body2" color="text.secondary">
                                                    {agency.address}
                                                </Typography>

                                            </Box>

                                        )}

                                    </Popover>

                                </>

                            )}

                            <Box
                                component="button"
                                type="button"
                                onClick={() => navigate("/admin/login")}
                                sx={{ ...headButtonSx, fontFamily: "inherit" }}
                            >

                                <LoginIcon sx={{ fontSize: 16 }} />

                                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>ورود مدیران</Box>

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

                    <Typography sx={{ fontSize: 13.5 }} color="text.secondary" align="center">
                        {agency?.name || "بنگاه املاک"}
                        {agency?.address ? ` · ${agency.address}` : ""}
                    </Typography>

                </Container>

            </Box>

        </Box>

    );

}