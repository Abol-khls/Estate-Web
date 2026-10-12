import { useState } from "react";
import { Box, Typography, IconButton, Button, InputBase } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useLocation, useNavigate } from "react-router-dom";

import ThemeToggleButton from "../common/ThemeToggleButton";

const PAGE_META = [
    { prefix: "/admin/dashboard", title: "داشبورد مدیریتی", subtitle: "گزارش لحظه‌ای عملکرد آژانس املاک" },
    { prefix: "/admin/properties", title: "مدیریت املاک و مستغلات", subtitle: "افزودن، ویرایش و نظارت بر وضعیت املاک آژانس" },
    { prefix: "/admin/clients", title: "مدیریت ارتباط با مشتریان (CRM)", subtitle: "پیگیری لیدها، وضعیت مذاکرات و پرونده‌های خرید و فروش" },
    { prefix: "/admin/contracts", title: "قراردادها و اسناد رسمی", subtitle: "ثبت مبایعه‌نامه‌ها، اجاره‌نامه‌ها و پیگیری وضعیت حقوقی" },
    { prefix: "/admin/visits", title: "مدیریت بازدیدها", subtitle: "برنامه‌ریزی و پیگیری بازدید مشتریان از املاک" },
    { prefix: "/admin/activities", title: "فعالیت‌ها و پیگیری‌ها", subtitle: "کارهای در جریان و یادآوری‌های تیم فروش" },
    { prefix: "/admin/reports", title: "گزارش‌ها", subtitle: "تحلیل عملکرد آژانس و خروجی‌های قابل دانلود" },
    { prefix: "/admin/settings", title: "تنظیمات", subtitle: "مدیریت پروفایل، امنیت و آژانس شما" },
];

export default function Header({ onMenuClick }) {

    const navigate = useNavigate();
    const location = useLocation();

    const [quickSearch, setQuickSearch] = useState("");

    const meta = PAGE_META.find((item) => location.pathname.startsWith(item.prefix)) ?? PAGE_META[0];

    function handleSearch(e) {

        e.preventDefault();

        const value = quickSearch.trim();

        navigate(
            value ? `/admin/properties?search=${encodeURIComponent(value)}` : "/admin/properties",
            { state: { quick: Date.now() } }
        );

        setQuickSearch("");

    }

    return (

        <Box
            component="header"
            sx={{
                height: 64,
                flexShrink: 0,
                bgcolor: (theme) => theme.custom.glassPanel,
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid",
                borderColor: "divider",
                px: { xs: 1.5, md: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                zIndex: 10,
            }}
        >

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>

                <IconButton
                    onClick={onMenuClick}
                    aria-label="منو"
                    sx={{
                        display: { xs: "inline-flex", md: "none" },
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ minWidth: 0 }}>

                    <Typography
                        noWrap
                        sx={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, color: "text.primary" }}
                    >
                        {meta.title}
                    </Typography>

                    <Typography
                        noWrap
                        sx={{
                            fontSize: 12,
                            color: "text.secondary",
                            display: { xs: "none", sm: "block" },
                        }}
                    >
                        {meta.subtitle}
                    </Typography>

                </Box>

            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        width: 288,
                        display: { xs: "none", lg: "flex" },
                        alignItems: "center",
                        gap: 1,
                        px: 1.75,
                        py: 0.5,
                        borderRadius: 3,
                        color: (theme) => theme.custom.textMuted,
                        bgcolor: (theme) => theme.custom.inputBg,
                        border: "1px solid",
                        borderColor: (theme) => theme.custom.borderStrong,
                        transition: "all .2s ease",
                        "&:focus-within": {
                            borderColor: "primary.main",
                            color: "primary.main",
                        },
                    }}
                >

                    <SearchIcon sx={{ fontSize: 18 }} />

                    <InputBase
                        value={quickSearch}
                        onChange={(e) => setQuickSearch(e.target.value)}
                        placeholder="جستجوی سریع ملک، کد یا آدرس..."
                        sx={{ flex: 1, fontSize: 13.5, color: "text.primary" }}
                    />

                </Box>

                <ThemeToggleButton />

                <Button
                    component="a"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                    مشاهده وب‌سایت عمومی
                </Button>

            </Box>

        </Box>

    );

}