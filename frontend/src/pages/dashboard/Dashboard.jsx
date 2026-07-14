import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Stack,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import Building2 from "@mui/icons-material/Apartment";
import Users from "@mui/icons-material/Groups";
import Calendar from "@mui/icons-material/Event";
import FileText from "@mui/icons-material/Description";
import ArrowLeft from "@mui/icons-material/ArrowBackIosNew";

import api from "../../services/api";
import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";

import {
    getVisitStatusLabel,
    getVisitStatusColor,
} from "../../constants/visitOptions";

import {
    getActivityStatusLabel,
    getActivityStatusColor,
} from "../../constants/activityOptions";

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

function StatCard({ title, value, icon: Icon, color, onClick }) {

    return (

        <Paper
            onClick={onClick}
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: onClick ? "pointer" : "default",
                transition: ".2s",
                "&:hover": onClick ? {
                    borderColor: color,
                    boxShadow: "0 4px 14px rgba(16, 24, 40, 0.08)",
                } : {},
            }}
        >

            <Box
                sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: `${color}1A`,
                    color: color,
                    flexShrink: 0,
                }}
            >
                <Icon />
            </Box>

            <Box sx={{ minWidth: 0 }}>

                <Typography variant="subtitle2" color="text.secondary" noWrap>
                    {title}
                </Typography>

                <Typography variant="h4" fontWeight={800}>
                    {value ?? 0}
                </Typography>

            </Box>

        </Paper>

    );

}

function SectionCard({ title, action, children }) {

    return (

        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
                overflow: "hidden",
                height: "100%",
            }}
        >

            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >

                <Typography variant="subtitle1" fontWeight={700}>
                    {title}
                </Typography>

                {action}

            </Stack>

            <Box sx={{ p: children ? 0 : 4 }}>
                {children}
            </Box>

        </Paper>

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

function MonthlyOverviewChart({ data }) {

    if (!data || data.length === 0) {

        return <EmptyRow text="داده‌ای برای نمایش نمودار وجود ندارد." />;

    }

    const maxValue = Math.max(
        1,
        ...data.map(item => Math.max(item.visits, item.contracts))
    );

    return (

        <Box sx={{ p: 3 }}>

            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />
                    <Typography variant="caption" color="text.secondary">بازدید</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "secondary.main" }} />
                    <Typography variant="caption" color="text.secondary">قرارداد</Typography>
                </Stack>

            </Stack>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: { xs: 1.5, sm: 3 },
                    height: 200,
                }}
            >

                {data.map((item) => (

                    <Box
                        key={item.month}
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >

                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 0.75,
                                width: "100%",
                                justifyContent: "center",
                            }}
                        >

                            <Box
                                title={`${item.visits} بازدید`}
                                sx={{
                                    width: { xs: 10, sm: 16 },
                                    height: `${(item.visits / maxValue) * 100}%`,
                                    minHeight: item.visits > 0 ? 4 : 0,
                                    borderRadius: "6px 6px 0 0",
                                    bgcolor: "primary.main",
                                    transition: ".3s",
                                }}
                            />

                            <Box
                                title={`${item.contracts} قرارداد`}
                                sx={{
                                    width: { xs: 10, sm: 16 },
                                    height: `${(item.contracts / maxValue) * 100}%`,
                                    minHeight: item.contracts > 0 ? 4 : 0,
                                    borderRadius: "6px 6px 0 0",
                                    bgcolor: "secondary.main",
                                    transition: ".3s",
                                }}
                            />

                        </Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, whiteSpace: "nowrap" }}
                        >
                            <bdi>{item.month}</bdi>
                        </Typography>

                    </Box>

                ))}

            </Box>

        </Box>

    );

}

export default function Dashboard() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    async function load() {

        setLoading(true);
        setError(false);

        try {

            const res = await api.get("dashboard/");

            setData(res.data);

        }
        catch (err) {

            setError(true);

            const message = getErrorMessage(
                err,
                "خطا در دریافت اطلاعات داشبورد"
            );

            showSnackbar(message, "error");

        }
        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        load();

    }, []);

    if (loading) {

        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        );

    }

    if (error || !data) {

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
                        onClick={load}
                    >
                        تلاش مجدد
                    </Button>
                </Box>
            </PageContainer>
        );

    }

    return (

        <PageContainer>

            <PageHeader
                title="داشبورد"
                subtitle="نمای کلی از وضعیت آژانس شما"
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    },
                    gap: 2.5,
                    mb: 3,
                }}
            >

                <StatCard
                    title="تعداد املاک"
                    value={data.properties_count}
                    icon={Building2}
                    color="#1F3B57"
                    onClick={() => navigate("/properties")}
                />

                <StatCard
                    title="تعداد مشتری"
                    value={data.customers_count}
                    icon={Users}
                    color="#0E7C86"
                    onClick={() => navigate("/clients")}
                />

                <StatCard
                    title="بازدید امروز"
                    value={data.visits_today_count}
                    icon={Calendar}
                    color="#B8860B"
                    onClick={() => navigate("/visits")}
                />

                <StatCard
                    title="قراردادهای فعال"
                    value={data.active_contracts_count}
                    icon={FileText}
                    color="#8B3A3A"
                    onClick={() => navigate("/contracts")}
                />

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" },
                    gap: 2.5,
                    mb: 2.5,
                }}
            >

                <SectionCard title="روند شش ماه اخیر">
                    <MonthlyOverviewChart data={data.monthly_overview} />
                </SectionCard>

                <SectionCard
                    title="آخرین فعالیت‌ها"
                    action={
                        <Button
                            size="small"
                            endIcon={<ArrowLeft sx={{ fontSize: 14 }} />}
                            onClick={() => navigate("/activities")}
                        >
                            مشاهده همه
                        </Button>
                    }
                >

                    {data.recent_activities.length === 0 ? (

                        <EmptyRow text="فعالیتی ثبت نشده است." />

                    ) : (

                        data.recent_activities.map((activity, index) => (

                            <Box
                                key={activity.id}
                                sx={{
                                    px: 3,
                                    py: 1.75,
                                    borderBottom: index === data.recent_activities.length - 1
                                        ? "none"
                                        : "1px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1.5,
                                }}
                            >

                                <Box sx={{ minWidth: 0 }}>

                                    <Typography fontWeight={700} noWrap>
                                        {activity.title}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {activity.customer_name} · {formatDateTime(activity.follow_date)}
                                    </Typography>

                                </Box>

                                <Chip
                                    size="small"
                                    color={getActivityStatusColor(activity.status)}
                                    label={getActivityStatusLabel(activity.status)}
                                />

                            </Box>

                        ))

                    )}

                </SectionCard>

            </Box>

            <SectionCard
                title="آخرین بازدیدها"
                action={
                    <Button
                        size="small"
                        endIcon={<ArrowLeft sx={{ fontSize: 14 }} />}
                        onClick={() => navigate("/visits")}
                    >
                        مشاهده همه
                    </Button>
                }
            >

                {data.recent_visits.length === 0 ? (

                    <EmptyRow text="بازدیدی ثبت نشده است." />

                ) : (

                    data.recent_visits.map((visit, index) => (

                        <Box
                            key={visit.id}
                            sx={{
                                px: 3,
                                py: 1.75,
                                borderBottom: index === data.recent_visits.length - 1
                                    ? "none"
                                    : "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1.5,
                                flexWrap: "wrap",
                            }}
                        >

                            <Box sx={{ minWidth: 0 }}>

                                <Typography fontWeight={700} noWrap>
                                    {visit.customer_name}
                                </Typography>

                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {visit.property_title} · {formatDateTime(visit.visit_date)}
                                </Typography>

                            </Box>

                            <Chip
                                size="small"
                                color={getVisitStatusColor(visit.status)}
                                label={getVisitStatusLabel(visit.status)}
                            />

                        </Box>

                    ))

                )}

            </SectionCard>

        </PageContainer>

    );

}