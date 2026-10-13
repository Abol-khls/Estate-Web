import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Button,
    Stack,
    useTheme,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import Building2 from "@mui/icons-material/ApartmentOutlined";
import Users from "@mui/icons-material/GroupsOutlined";
import Calendar from "@mui/icons-material/EventAvailableOutlined";
import FileText from "@mui/icons-material/DescriptionOutlined";
import ArrowLeft from "@mui/icons-material/ArrowBack";

import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import PageContainer from "../../components/common/PageContainer";
import DashboardSkeleton from "../../components/common/skeletons/DashboardSkeleton";
import TonePill from "../../components/common/TonePill";
import useCountUp from "../../hooks/useCountUp";
import { useSnackbar } from "../../context/useSnackbar";
import { getInitials, getToneByName } from "../../utils/initials";

import {
    getVisitStatusLabel,
    getVisitStatusColor,
} from "../../constants/visitOptions";

import {
    getActivityStatusLabel,
    getActivityStatusColor,
} from "../../constants/activityOptions";

const PILL_TONE_BY_COLOR = {
    primary: "emerald",
    success: "emerald",
    info: "indigo",
    secondary: "cyan",
    warning: "amber",
    error: "rose",
    default: "slate",
    neutral: "slate",
};

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

function StatCard({ title, value, icon, tone, footer, onClick, index }) {

    const Icon = icon;

    const animated = useCountUp(value);

    return (

        <Box
            onClick={onClick}
            sx={{
                p: { xs: 1.75, md: 2.5 },
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: (theme) => theme.custom.glassBorderSoft,
                boxShadow: (theme) => theme.custom.cardShadow,
                cursor: onClick ? "pointer" : "default",
                transition: "all .3s ease",
                animation: "cardIn .55s ease both",
                animationDelay: `${index * 80}ms`,
                "&:hover": onClick ? {
                    borderColor: (theme) => theme.custom.tones.emerald.border,
                    transform: "translateY(-2px)",
                    boxShadow: (theme) => theme.custom.hoverShadow,
                } : {},
                "&:hover .stat-icon": {
                    transform: "scale(1.08) rotate(-4deg)",
                },
            }}
        >

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>

                <Box sx={{ minWidth: 0 }}>

                    <Typography sx={{ fontSize: 12, fontWeight: 500 }} color="text.secondary" noWrap>
                        {title}
                    </Typography>

                    <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, mt: 0.5, lineHeight: 1.4 }}>
                        {animated.toLocaleString("en-US")}
                    </Typography>

                </Box>

                <Box
                    className="stat-icon"
                    sx={{
                        width: { xs: 40, md: 48 },
                        height: { xs: 40, md: 48 },
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "1px solid",
                        transition: "transform .3s ease",
                        bgcolor: (theme) => theme.custom.tones[tone].bg,
                        borderColor: (theme) => theme.custom.tones[tone].border,
                        color: (theme) => theme.custom.tones[tone].text,
                    }}
                >
                    <Icon />
                </Box>

            </Box>

            <Box
                sx={{
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 0.75,
                    mt: 2,
                    fontSize: 12,
                    fontWeight: 500,
                    color: (theme) => theme.custom.tones[tone].text,
                }}
            >

                <ArrowLeft sx={{ fontSize: 15 }} />

                <span>{footer}</span>

            </Box>

        </Box>

    );

}

function SectionCard({ title, subtitle, action, children, delay = 0 }) {

    return (

        <Box
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: (theme) => theme.custom.glassBorderSoft,
                boxShadow: (theme) => theme.custom.cardShadow,
                height: "100%",
                animation: "cardIn .6s ease both",
                animationDelay: `${delay}ms`,
            }}
        >

            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2.5,
                }}
            >

                <Box>

                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography sx={{ fontSize: 12, mt: 0.25 }} color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}

                </Box>

                {action}

            </Stack>

            {children}

        </Box>

    );

}

function EmptyRow({ text }) {

    return (

        <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
                {text}
            </Typography>
        </Box>

    );

}

function RecentItem({ name, title, caption, statusLabel, statusColor, onClick }) {

    const tone = getToneByName(name);

    return (

        <Box
            onClick={onClick}
            sx={{
                p: 1.5,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                cursor: "pointer",
                bgcolor: (theme) => theme.custom.surfaceAlt,
                border: "1px solid",
                borderColor: "divider",
                transition: "all .2s ease",
                "&:hover": {
                    borderColor: (theme) => theme.custom.tones.emerald.border,
                    transform: "translateX(-2px)",
                },
            }}
        >

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>

                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: (theme) => theme.custom.tones[tone].bg,
                        color: (theme) => theme.custom.tones[tone].text,
                    }}
                >
                    {getInitials(name)}
                </Box>

                <Box sx={{ minWidth: 0 }}>

                    <Typography sx={{ fontSize: 14, fontWeight: 600 }} noWrap>
                        {title}
                    </Typography>

                    <Typography sx={{ fontSize: 12 }} color="text.secondary" noWrap>
                        {caption}
                    </Typography>

                </Box>

            </Box>

            <TonePill
                tone={PILL_TONE_BY_COLOR[statusColor] ?? "slate"}
                label={statusLabel}
            />

        </Box>

    );

}

function smoothPath(points) {

    if (points.length < 2) return "";

    let d = `M${points[0][0]},${points[0][1]}`;

    for (let i = 0; i < points.length - 1; i++) {

        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const t = 0.18;

        d += ` C${p1[0] + (p2[0] - p0[0]) * t},${p1[1] + (p2[1] - p0[1]) * t} ${p2[0] - (p3[0] - p1[0]) * t},${p2[1] - (p3[1] - p1[1]) * t} ${p2[0]},${p2[1]}`;

    }

    return d;

}

function MonthlyOverviewChart({ data }) {

    const theme = useTheme();

    const [active, setActive] = useState(null);

    if (!data || data.length === 0) {

        return <EmptyRow text="داده‌ای برای نمایش نمودار وجود ندارد." />;

    }

    const emerald = "#10b981";
    const cyan = "#06b6d4";

    const W = 700, H = 280, L = 12, R = 44, T = 14, B = 34;
    const iw = W - L - R;
    const ih = H - T - B;

    const rawMax = Math.max(1, ...data.map((item) => Math.max(item.visits, item.contracts)));
    const max = Math.ceil(rawMax / 4) * 4;

    const steps = Math.max(data.length - 1, 1);

    const x = (i) => data.length === 1 ? L + iw / 2 : L + iw - (i * iw) / steps;
    const y = (v) => T + ih - (v / max) * ih;

    const visitPoints = data.map((item, i) => [x(i), y(item.visits)]);
    const contractPoints = data.map((item, i) => [x(i), y(item.contracts)]);

    const baseline = (points) =>
        `L${points[points.length - 1][0]},${T + ih} L${points[0][0]},${T + ih}Z`;

    const grid = [];

    for (let g = 0; g <= 4; g++) {

        const gy = T + (ih / 4) * g;

        grid.push(
            <g key={g}>
                <line x1={L} x2={W - R + 8} y1={gy} y2={gy} stroke={theme.palette.text.primary} strokeOpacity=".07" />
                <text x={W - R + 16} y={gy + 4} textAnchor="start" fill={theme.palette.text.secondary} fontSize="12" fontFamily={theme.typography.fontFamily}>
                    {Math.round(max - (max / 4) * g).toLocaleString("en-US")}
                </text>
            </g>
        );

    }

    const activeItem = active === null ? null : data[active];

    return (

        <Box sx={{ position: "relative", direction: "ltr", width: "100%" }}>

            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="نمودار بازدیدها و قراردادها" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }} onMouseLeave={() => setActive(null)}>

                <defs>
                    <linearGradient id="areaVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={emerald} stopOpacity=".28" />
                        <stop offset="1" stopColor={emerald} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="areaContracts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={cyan} stopOpacity=".18" />
                        <stop offset="1" stopColor={cyan} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {grid}

                {data.length > 1 && (
                    <>
                        <path d={`${smoothPath(contractPoints)} ${baseline(contractPoints)}`} fill="url(#areaContracts)" style={{ animation: "areaIn 1s ease .5s both" }} />
                        <path d={smoothPath(contractPoints)} fill="none" stroke={cyan} strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ animation: "drawLine 1.3s ease .1s both" }} />
                        <path d={`${smoothPath(visitPoints)} ${baseline(visitPoints)}`} fill="url(#areaVisits)" style={{ animation: "areaIn 1s ease .4s both" }} />
                        <path d={smoothPath(visitPoints)} fill="none" stroke={emerald} strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ animation: "drawLine 1.3s ease both" }} />
                    </>
                )}

                {contractPoints.map((point, i) => (
                    <circle key={`c${i}`} cx={point[0]} cy={point[1]} r="4" fill={cyan} stroke={theme.palette.background.paper} strokeWidth="2" style={{ cursor: "pointer", animation: "areaIn .6s ease 1s both" }} onMouseEnter={() => setActive(i)} />
                ))}

                {visitPoints.map((point, i) => (
                    <circle key={`v${i}`} cx={point[0]} cy={point[1]} r="5" fill={emerald} stroke={theme.palette.background.paper} strokeWidth="2" style={{ cursor: "pointer", animation: "areaIn .6s ease 1s both" }} onMouseEnter={() => setActive(i)} />
                ))}

                {data.map((item, i) => (
                    <text key={item.month} x={x(i)} y={H - 8} textAnchor="middle" fill={theme.palette.text.secondary} fontSize="12" fontFamily={theme.typography.fontFamily}>
                        {item.month}
                    </text>
                ))}

            </svg>

            {activeItem && (

                <Box
                    sx={{
                        position: "absolute",
                        left: `${(x(active) / W) * 100}%`,
                        top: `${(y(Math.max(activeItem.visits, activeItem.contracts)) / H) * 100}%`,
                        transform: "translate(-50%, -125%)",
                        direction: "rtl",
                        pointerEvents: "none",
                        px: 1.75,
                        py: 1.25,
                        minWidth: 130,
                        borderRadius: 3,
                        fontSize: 12,
                        bgcolor: "#0f172a",
                        border: "1px solid #334155",
                        color: "#f1f5f9",
                        boxShadow: (t) => t.custom.popShadow,
                    }}
                >

                    <Box sx={{ fontWeight: 700, mb: 0.75 }}>{activeItem.month}</Box>

                    <Box sx={{ color: "#34d399" }}>بازدید: {activeItem.visits.toLocaleString("en-US")}</Box>

                    <Box sx={{ color: "#22d3ee" }}>قرارداد: {activeItem.contracts.toLocaleString("en-US")}</Box>

                </Box>

            )}

        </Box>

    );

}

export default function Dashboard() {

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({

        queryKey: ["dashboard"],

        queryFn: async () => {

            const response = await api.get("dashboard/");

            return response.data;

        },

    });

    useEffect(() => {

        if (!isError) return;

        showSnackbar("خطا در دریافت اطلاعات داشبورد", "error");

    }, [isError]);

    if (isLoading) {

        return (
            <PageContainer>
                <DashboardSkeleton />
            </PageContainer>
        );

    }

    if (isError || !data) {

        return (
            <PageContainer>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        py: 8,
                    }}
                >
                    <Typography color="text.secondary">
                        دریافت اطلاعات داشبورد با مشکل مواجه شد.
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => refetch()}
                    >
                        تلاش مجدد
                    </Button>
                </Box>
            </PageContainer>
        );

    }

    const goAction = (label, path) => (
        <Button
            size="small"
            endIcon={<ArrowLeft sx={{ fontSize: 14 }} />}
            onClick={() => navigate(path)}
        >
            {label}
        </Button>
    );

    return (

        <PageContainer>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                    },
                    gap: { xs: 1.5, md: 2.5 },
                    mb: 3,
                }}
            >

                <StatCard
                    index={0}
                    title="کل املاک ثبت‌شده"
                    value={data.properties_count}
                    icon={Building2}
                    tone="emerald"
                    footer="مشاهده فهرست املاک"
                    onClick={() => navigate("/admin/properties")}
                />

                <StatCard
                    index={1}
                    title="قراردادهای فعال"
                    value={data.active_contracts_count}
                    icon={FileText}
                    tone="cyan"
                    footer="مشاهده قراردادها"
                    onClick={() => navigate("/admin/contracts")}
                />

                <StatCard
                    index={2}
                    title="مشتریان و لیدها"
                    value={data.customers_count}
                    icon={Users}
                    tone="indigo"
                    footer="مشاهده فهرست مشتریان"
                    onClick={() => navigate("/admin/clients")}
                />

                <StatCard
                    index={3}
                    title="بازدیدهای امروز"
                    value={data.visits_today_count}
                    icon={Calendar}
                    tone="amber"
                    footer="مشاهده برنامه بازدیدها"
                    onClick={() => navigate("/admin/visits")}
                />

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", xl: "2fr 1fr" },
                    gap: 3,
                    mb: 3,
                }}
            >

                <SectionCard
                    delay={200}
                    title="روند بازدیدها و قراردادها"
                    subtitle="نمودار فعالیت‌های ثبت‌شده در ۶ ماه اخیر"
                    action={
                        <Stack direction="row" spacing={2.5} sx={{ fontSize: 12, color: "text.secondary" }}>
                            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                                <span>بازدید</span>
                            </Stack>
                            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#06b6d4" }} />
                                <span>قرارداد</span>
                            </Stack>
                        </Stack>
                    }
                >
                    <MonthlyOverviewChart data={data.monthly_overview} />
                </SectionCard>

                <SectionCard
                    delay={280}
                    title="آخرین فعالیت‌ها"
                    action={goAction("مشاهده همه", "/admin/activities")}
                >

                    {data.recent_activities.length === 0 ? (

                        <EmptyRow text="فعالیتی ثبت نشده است." />

                    ) : (

                        <Stack spacing={1.5}>

                            {data.recent_activities.map((activity) => (

                                <RecentItem
                                    key={activity.id}
                                    name={activity.customer_name}
                                    title={activity.title}
                                    caption={`${activity.customer_name} · ${formatDateTime(activity.follow_date)}`}
                                    statusLabel={getActivityStatusLabel(activity.status)}
                                    statusColor={getActivityStatusColor(activity.status)}
                                    onClick={() => navigate("/admin/activities")}
                                />

                            ))}

                        </Stack>

                    )}

                </SectionCard>

            </Box>

            <SectionCard
                delay={360}
                title="آخرین بازدیدها"
                action={goAction("مشاهده همه", "/admin/visits")}
            >

                {data.recent_visits.length === 0 ? (

                    <EmptyRow text="بازدیدی ثبت نشده است." />

                ) : (

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                            gap: 1.5,
                        }}
                    >

                        {data.recent_visits.map((visit) => (

                            <RecentItem
                                key={visit.id}
                                name={visit.customer_name}
                                title={visit.customer_name}
                                caption={`${visit.property_title} · ${formatDateTime(visit.visit_date)}`}
                                statusLabel={getVisitStatusLabel(visit.status)}
                                statusColor={getVisitStatusColor(visit.status)}
                                onClick={() => navigate("/admin/visits")}
                            />

                        ))}

                    </Box>

                )}

            </SectionCard>

        </PageContainer>

    );

}