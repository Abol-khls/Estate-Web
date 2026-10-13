import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Building2,
    Building,
    Users,
    FileText,
    CalendarCheck,
    ListChecks,
    BarChart3,
    Settings,
    Globe,
    LogOut
} from "lucide-react";

import { Box, Typography, IconButton, Tooltip } from "@mui/material";

import { useAuth } from "../../context/useAuth";
import { getInitials, getDisplayName, getRoleLabel } from "../../utils/initials";

const NAV_ITEMS = [
    { label: "داشبورد", icon: LayoutDashboard, to: "/admin/dashboard" },
    { label: "املاک", icon: Building2, to: "/admin/properties" },
    { label: "مشتریان", icon: Users, to: "/admin/clients" },
    { label: "قراردادها", icon: FileText, to: "/admin/contracts" },
    { label: "بازدیدها", icon: CalendarCheck, to: "/admin/visits" },
    { label: "فعالیت‌ها", icon: ListChecks, to: "/admin/activities" },
    { label: "گزارش‌ها", icon: BarChart3, to: "/admin/reports" },
    { label: "تنظیمات", icon: Settings, to: "/admin/settings" },
];

export default function SidebarContent({ onNavigate }) {

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    const displayName = getDisplayName(user);

    return (

        <Box
            sx={{
                height: "100%",
                bgcolor: (theme) => theme.custom.sidebar.bg,
                backdropFilter: "blur(16px)",
                borderInlineEnd: "1px solid rgba(255, 255, 255, 0.08)",
                color: (theme) => theme.custom.sidebar.text,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >

            <Box
                sx={{
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderBottom: (theme) => `1px solid ${theme.custom.sidebar.border}`,
                    flexShrink: 0,
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
                    }}
                >
                    <Building size={22} />
                </Box>

                <Box sx={{ minWidth: 0 }}>

                    <Typography
                        noWrap
                        sx={{
                            fontWeight: 700,
                            fontSize: 16,
                            lineHeight: 1.5,
                            background: (theme) => theme.custom.brandText,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        {user?.agency?.name || "Estate CRM"}
                    </Typography>

                    <Typography sx={{ fontSize: 12, color: "#94a3b8" }} noWrap>
                        سامانه جامع املاک
                    </Typography>

                </Box>

            </Box>

            <Box
                component="nav"
                sx={{
                    flex: 1,
                    px: 2,
                    py: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    overflowY: "auto",
                }}
            >

                {NAV_ITEMS.map((item, index) => (

                    <NavLink
                        key={item.to}
                        to={item.to}
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
                                    py: 1.4,
                                    borderRadius: 3,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    border: "1px solid",
                                    transition: "all .2s ease",
                                    animation: `cardIn .45s ease both`,
                                    animationDelay: `${index * 40}ms`,
                                    color: (theme) =>
                                        isActive
                                            ? theme.custom.sidebar.textActive
                                            : theme.custom.sidebar.text,
                                    bgcolor: (theme) =>
                                        isActive
                                            ? theme.custom.sidebar.activeBg
                                            : "transparent",
                                    borderColor: (theme) =>
                                        isActive
                                            ? theme.custom.sidebar.activeBorder
                                            : "transparent",
                                    "& svg": {
                                        transition: "transform .2s ease",
                                    },
                                    "&:hover": {
                                        bgcolor: (theme) =>
                                            isActive
                                                ? theme.custom.sidebar.activeBg
                                                : theme.custom.sidebar.hoverBg,
                                        color: (theme) =>
                                            isActive
                                                ? theme.custom.sidebar.textActive
                                                : "#f1f5f9",
                                        "& svg": {
                                            transform: "scale(1.1)",
                                        },
                                    },
                                }}
                            >

                                <item.icon size={18} />

                                {item.label}

                            </Box>

                        )}

                    </NavLink>

                ))}

                <Box
                    component="a"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: 1.4,
                        borderRadius: 3,
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                        color: "#67e8f9",
                        border: "1px solid rgba(6, 182, 212, 0.2)",
                        bgcolor: "rgba(6, 182, 212, 0.05)",
                        transition: "all .2s ease",
                        "& svg": { color: "#22d3ee" },
                        "&:hover": {
                            bgcolor: "rgba(6, 182, 212, 0.1)",
                        },
                    }}
                >

                    <Globe size={18} />

                    پورتال عمومی مشتریان

                </Box>

            </Box>

            <Box
                sx={{
                    p: 2,
                    flexShrink: 0,
                    borderTop: (theme) => `1px solid ${theme.custom.sidebar.border}`,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid #1e293b",
                    }}
                >

                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "#fff",
                            background: (theme) => theme.custom.brand,
                            userSelect: "none",
                        }}
                    >
                        {getInitials(displayName)}
                    </Box>

                    <Box
                        onClick={() => {
                            navigate("/admin/settings");
                            if (onNavigate) onNavigate();
                        }}
                        sx={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                    >

                        <Typography noWrap sx={{ fontSize: 14, fontWeight: 500, color: "#f1f5f9" }}>
                            {displayName}
                        </Typography>

                        <Typography noWrap sx={{ fontSize: 12, color: "#34d399" }}>
                            {getRoleLabel(user?.role)}
                        </Typography>

                    </Box>

                    <Tooltip title="خروج از حساب">

                        <IconButton
                            onClick={handleLogout}
                            aria-label="خروج از حساب"
                            size="small"
                            sx={{
                                color: "#94a3b8",
                                "&:hover": {
                                    color: "#f87171",
                                    bgcolor: "rgba(239, 68, 68, 0.1)",
                                },
                            }}
                        >
                            <LogOut size={18} />
                        </IconButton>

                    </Tooltip>

                </Box>

            </Box>

        </Box>

    );

}