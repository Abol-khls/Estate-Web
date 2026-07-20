import { NavLink, useNavigate } from "react-router-dom";

import {
    Home,
    Building2,
    Users,
    FileText,
    Calendar,
    ListChecks,
    Settings,
    LogOut
} from "lucide-react";

import { Box, Stack, Typography, Button } from "@mui/material";

import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
    { label: "داشبورد", icon: Home, to: "/admin/dashboard" },
    { label: "املاک", icon: Building2, to: "/admin/properties" },
    { label: "مشتریان", icon: Users, to: "/admin/clients" },
    { label: "قراردادها", icon: FileText, to: "/admin/contracts" },
    { label: "بازدیدها", icon: Calendar, to: "/admin/visits" },
    { label: "فعالیت‌ها", icon: ListChecks, to: "/admin/activities" },
    { label: "تنظیمات", icon: Settings, to: "/admin/settings" },
];

export default function Sidebar() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (

        <Box
            component="aside"
            sx={{
                width: 260,
                flexShrink: 0,
                minHeight: "100vh",
                bgcolor: "primary.dark",
                color: "#fff",
                px: 2.5,
                py: 3.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
            }}
        >

            <Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1.2,
                        mb: 5,
                        px: 0.5,
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
                        Estate CRM
                    </Typography>

                </Box>

                <Stack spacing={0.5}>

                    {NAV_ITEMS.map(({ label, icon: Icon, to }) => (

                        <NavLink
                            key={to}
                            to={to}
                            style={{ textDecoration: "none" }}
                        >

                            {({ isActive }) => (

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        px: 2,
                                        py: 1.3,
                                        borderRadius: 2,
                                        fontSize: 14,
                                        transition: ".15s",
                                        color: isActive
                                            ? "#1A2233"
                                            : "rgba(255,255,255,0.75)",
                                        bgcolor: isActive
                                            ? "secondary.main"
                                            : "transparent",
                                        fontWeight: isActive ? 700 : 500,
                                        "&:hover": {
                                            bgcolor: isActive
                                                ? "secondary.main"
                                                : "rgba(255,255,255,0.08)",
                                            color: isActive ? "#1A2233" : "#fff",
                                        },
                                    }}
                                >

                                    <Icon size={18} />

                                    {label}

                                </Box>

                            )}

                        </NavLink>

                    ))}

                </Stack>

            </Box>

            <Button
                onClick={handleLogout}
                startIcon={<LogOut size={18} />}
                sx={{
                    color: "#fff",
                    bgcolor: "error.main",
                    justifyContent: "flex-start",
                    "&:hover": { bgcolor: "#B93838" },
                }}
            >
                خروج
            </Button>

        </Box>

    );

}