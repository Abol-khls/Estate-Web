import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, InputBase, MenuItem, Pagination, Select, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import PublicLayout from "./PublicLayout";
import PublicPropertyCard from "./PublicPropertyCard";
import InquiryForm from "./InquiryForm";

import AppSelect from "../../components/common/AppSelect";
import AppButton from "../../components/common/AppButton";
import PropertyGridSkeleton from "../../components/common/skeletons/PropertyGridSkeleton";

import api from "../../services/api";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useResourceList from "../../hooks/queries/useResourceList";
import { useSnackbar } from "../../context/useSnackbar";
import { getErrorMessage } from "../../utils/errorMessage";

import { PROPERTY_TYPES, TRANSACTION_TYPES, ORDERING_OPTIONS } from "../../constants/propertyOptions";

const PAGE_SIZE = 20;

function HeroField({ icon, wide, children }) {

    return (

        <Box
            sx={{
                flex: wide ? 1.4 : 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 3,
                minWidth: 0,
                bgcolor: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(51, 65, 85, 0.8)",
                transition: "border-color .2s ease",
                "&:focus-within": { borderColor: "#10b981" },
                "& .MuiSelect-icon": { color: "#64748b" },
            }}
        >

            {icon}

            {children}

        </Box>

    );

}

const heroInputSx = {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: "#e2e8f0",
    "& .MuiSelect-select": { py: 0.5, pr: 0 },
};


export default function PublicProperties() {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [searchParams, setSearchParams] = useSearchParams();

    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
    const search = useDebouncedValue(searchInput, 400);

    const [propertyType, setPropertyType] = useState(searchParams.get("property_type") ?? "all");
    const [transactionType, setTransactionType] = useState(searchParams.get("transaction_type") ?? "all");
    const [ordering, setOrdering] = useState(searchParams.get("ordering") ?? "-created_at");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

    const [inquiryOpen, setInquiryOpen] = useState(false);

    const isFirstRun = useRef(true);

    const listRef = useRef(null);

    const { data: agency } = useQuery({

        queryKey: ["public", "agency"],

        queryFn: async () => {

            const response = await api.get("public/agency/");

            return response.data;

        },

    });

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        setPage(1);

    }, [search, propertyType, transactionType, ordering]);

    useEffect(() => {

        const next = {};

        if (search) next.search = search;
        if (propertyType !== "all") next.property_type = propertyType;
        if (transactionType !== "all") next.transaction_type = transactionType;
        if (ordering !== "-created_at") next.ordering = ordering;
        if (page !== 1) next.page = String(page);

        setSearchParams(next, { replace: true });

    }, [search, propertyType, transactionType, ordering, page]);

    const params = useMemo(() => {

        const value = { page, search, ordering };

        if (propertyType !== "all") {
            value.property_type = propertyType;
        }

        if (transactionType !== "all") {
            value.transaction_type = transactionType;
        }

        return value;

    }, [page, search, propertyType, transactionType, ordering]);

    const { data, isLoading, isError, error } = useResourceList("public/properties", params);

    const properties = Array.isArray(data) ? data : (data?.results ?? []);
    const count = Array.isArray(data) ? data.length : (data?.count ?? 0);

    useEffect(() => {

        if (!isError) return;

        const message = getErrorMessage(
            error,
            "دریافت لیست ملک‌ها با مشکل مواجه شد. لطفاً بعداً دوباره تلاش کنید."
        );

        showSnackbar(message, "error");

    }, [isError, error]);

    return (

        <PublicLayout>

            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 7,
                    px: { xs: 2.25, md: 3.5 },
                    py: { xs: 4.5, md: 7 },
                    textAlign: "center",
                    color: (theme) => theme.custom.hero.text,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    border: "1px solid",
                    borderColor: (theme) => theme.custom.hero.border,
                    background: (theme) => theme.custom.hero.bg,
                    isolation: "isolate",
                    animation: "pageFade .6s ease both",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at 15% 20%, rgba(16, 185, 129, 0.16), transparent 45%), radial-gradient(circle at 85% 85%, rgba(6, 182, 212, 0.14), transparent 45%)",
                        zIndex: -1,
                        pointerEvents: "none",
                        animation: "floatGlow 9s ease-in-out infinite",
                    },
                }}
            >

                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#34d399",
                        bgcolor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                >

                    <StarBorderIcon sx={{ fontSize: 15 }} />

                    پورتال رسمی املاک {agency?.name ?? ""}

                </Box>

                <Typography
                    component="h1"
                    sx={{
                        m: 0,
                        fontWeight: 800,
                        lineHeight: 1.5,
                        maxWidth: 820,
                        fontSize: { xs: 28, md: 44 },
                    }}
                >
                    خانه رویایی خود را در بهترین نقطه شهر پیدا کنید
                </Typography>

                <Typography
                    sx={{
                        maxWidth: 640,
                        fontSize: { xs: 14, md: 16 },
                        color: (theme) => theme.custom.hero.sub,
                    }}
                >
                    بانک اطلاعاتی املاک مسکونی، تجاری و ویلایی با مشاوره تخصصی و پیگیری حرفه‌ای قراردادها.
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 840,
                        p: 1.5,
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "stretch",
                        gap: 1.5,
                        textAlign: "start",
                        bgcolor: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                >

                    <HeroField wide icon={<SearchIcon sx={{ fontSize: 18, color: "#34d399" }} />}>
                        <InputBase
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="عنوان، منطقه یا آدرس..."
                            className="hero-search-input"
                            sx={heroInputSx}
                        />
                    </HeroField>

                    <HeroField icon={<ApartmentOutlinedIcon sx={{ fontSize: 18, color: "#22d3ee" }} />}>
                        <Select
                            variant="standard"
                            disableUnderline
                            displayEmpty
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            renderValue={(value) =>
                                `نوع ملک: ${value === "all" ? "همه" : PROPERTY_TYPES.find(item => item.value === value)?.label ?? value}`
                            }
                            sx={heroInputSx}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {PROPERTY_TYPES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </HeroField>

                    <HeroField icon={<HandshakeOutlinedIcon sx={{ fontSize: 18, color: "#34d399" }} />}>
                        <Select
                            variant="standard"
                            disableUnderline
                            displayEmpty
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                            renderValue={(value) =>
                                `نوع معامله: ${value === "all" ? "همه" : TRANSACTION_TYPES.find(item => item.value === value)?.label ?? value}`
                            }
                            sx={heroInputSx}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {TRANSACTION_TYPES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </HeroField>

                    <AppButton
                        onClick={() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                        sx={{ px: 3 }}
                    >
                        جستجوی ملک
                    </AppButton>

                </Box>

            </Box>

            <Box
                ref={listRef}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 5,
                    mb: 3,
                    scrollMarginTop: "90px",
                }}
            >

                <Box>

                    <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
                        املاک ویژه و پیشنهادی برای شما
                    </Typography>

                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                        {count} ملک برای بازدید
                    </Typography>

                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>

                    <Box sx={{ width: 180 }}>
                        <AppSelect
                            label="مرتب‌سازی"
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                        >
                            {ORDERING_OPTIONS.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Box>

                    <AppButton variant="outlined" onClick={() => setInquiryOpen(true)} sx={{ py: 0.9 }}>
                        درخواست تماس با ما
                    </AppButton>

                </Box>

            </Box>

            {isLoading ? (

                <PropertyGridSkeleton />

            ) : properties.length === 0 ? (

                <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
                    ملکی مطابق جستجوی شما پیدا نشد.
                </Box>

            ) : (

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                    }}
                >

                    {properties.map((property, index) => (

                        <PublicPropertyCard
                            key={property.id}
                            index={index}
                            property={property}
                            onView={(p) => navigate(`/property/${p.id}`)}
                        />

                    ))}

                </Box>

            )}

            {count > PAGE_SIZE && (

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        page={page}
                        count={Math.ceil(count / PAGE_SIZE)}
                        color="primary"
                        shape="rounded"
                        onChange={(event, value) => setPage(value)}
                    />
                </Box>

            )}

            <InquiryForm
                open={inquiryOpen}
                onClose={() => setInquiryOpen(false)}
                property={null}
            />

        </PublicLayout>

    );

}