import { NavLink, useNavigate } from "react-router-dom";

import {
    Home,
    Building2,
    Users,
    FileText,
    Calendar,
    ListChecks,
    BarChart3,
    Settings,
    ExternalLink,
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
    { label: "گزارش‌ها", icon: BarChart3, to: "/admin/reports" },
    { label: "تنظیمات", icon: Settings, to: "/admin/settings" },
];

export default function SidebarContent({ onNavigate }) {

    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (

        <Box
            sx={{
                height: "100%",
                bgcolor: (theme) => theme.custom.sidebar.bg,
                color: (theme) => theme.custom.sidebar.text,
                px: 2.5,
                py: 3.5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: (theme) => `${theme.custom.sidebar.border} transparent`,
                "&::-webkit-scrollbar": { width: 10 },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: (theme) => theme.custom.sidebar.border,
                    borderRadius: 10,
                    border: (theme) => `2px solid ${theme.custom.sidebar.bg}`,
                    backgroundClip: "padding-box",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: (theme) => theme.custom.sidebar.activeBg,
                },
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
                            bgcolor: (theme) => theme.custom.sidebar.logoDot,
                        }}
                    />

                    <Typography variant="h6" sx={{ color: "#F3F1EA" }}>
                        Estate CRM
                    </Typography>

                </Box>

                <Stack spacing={0.5}>

                    {NAV_ITEMS.map(({ label, icon: Icon, to }) => (

                        <NavLink
                            key={to}
                            to={to}
                            onClick={onNavigate}
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
                                        color: (theme) =>
                                            isActive
                                                ? theme.custom.sidebar.textActive
                                                : theme.custom.sidebar.text,
                                        bgcolor: (theme) =>
                                            isActive
                                                ? theme.custom.sidebar.activeBg
                                                : "transparent",
                                        fontWeight: isActive ? 700 : 500,
                                        "&:hover": {
                                            bgcolor: (theme) =>
                                                isActive
                                                    ? theme.custom.sidebar.activeBg
                                                    : theme.custom.sidebar.hoverBg,
                                            color: (theme) =>
                                                isActive
                                                    ? theme.custom.sidebar.textActive
                                                    : "#fff",
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

            <Box sx={{ flexShrink: 0 }}>

                <Button
                    component="a"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<ExternalLink size={18} />}
                    fullWidth
                    sx={{
                        color: "inherit",
                        border: "1px solid rgba(255,255,255,0.2)",
                        justifyContent: "flex-start",
                        mb: 1.2,
                        "&:hover": {
                            bgcolor: (theme) => theme.custom.sidebar.hoverBg,
                            borderColor: "rgba(255,255,255,0.35)",
                        },
                    }}
                >
                    مشاهده پنل عمومی
                </Button>

                <Button
                    onClick={handleLogout}
                    startIcon={<LogOut size={18} />}
                    fullWidth
                    sx={{
                        color: "#fff",
                        bgcolor: "error.main",
                        justifyContent: "flex-start",
                        "&:hover": { bgcolor: "error.dark" },
                    }}
                >
                    خروج
                </Button>

            </Box>

        </Box>

    );

}