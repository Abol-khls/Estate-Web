import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    Box,
    Typography,
    Chip,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    LabelList,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableChartIcon from "@mui/icons-material/TableChartOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";
import Loading from "../../components/common/Loading";
import ChartTooltip from "../../components/common/ChartTooltip";

import useCountUp from "../../hooks/useCountUp";
import api from "../../services/api";
import { useSnackbar } from "../../context/useSnackbar";
import { getErrorMessage } from "../../utils/errorMessage";
import { formatToman } from "../../utils/formatPrice";

const REQUEST_TYPE_LABELS = {
    buy: "خرید",
    rent: "اجاره",
    sell: "فروش",
    mortgage: "رهن",
};

const PROPERTY_TYPE_LABELS = {
    apartment: "آپارتمان",
    villa: "ویلا",
    land: "زمین",
    office: "اداری",
    shop: "مغازه",
    suite: "سوئیت",
};

const EMERALD = "#10b981";
const CYAN = "#06b6d4";
const INDIGO = "#6366f1";
const AMBER = "#f59e0b";

const DONUT_COLORS = [EMERALD, CYAN, INDIGO, AMBER, "#64748b"];

const PRESETS = [
    { key: "30", label: "۳۰ روز اخیر", days: 30 },
    { key: "90", label: "۳ ماه اخیر", days: 90 },
    { key: "180", label: "۶ ماه اخیر", days: 180 },
    { key: "365", label: "۱ سال اخیر", days: 365 },
];

function toDateInputValue(date) {
    return date.toISOString().slice(0, 10);
}

function dateDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return toDateInputValue(d);
}

function compact(value) {
    return formatToman(value, false);
}

function Panel({ title, subtitle, action, children, delay = 0 }) {

    return (

        <Box
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                height: "100%",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: (theme) => theme.custom.glassBorderSoft,
                boxShadow: (theme) => theme.custom.cardShadow,
                animation: "cardIn .6s ease both",
                animationDelay: `${delay}ms`,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
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

            </Box>

            {children}

        </Box>

    );

}

function EmptyState({ text }) {

    return (

        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center", fontSize: 14 }}>
            {text}
        </Typography>

    );

}

function LegendDot({ color, label }) {

    return (

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 12, color: "text.secondary" }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
            {label}
        </Box>

    );

}

function KpiCard({ title, value, suffix, text, icon, tone, index }) {

    const Icon = icon;

    const animated = useCountUp(value);

    return (

        <Box
            sx={{
                p: { xs: 1.75, md: 2.5 },
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: (theme) => theme.custom.glassBorderSoft,
                boxShadow: (theme) => theme.custom.cardShadow,
                animation: "cardIn .55s ease both",
                animationDelay: `${index * 80}ms`,
                overflow: "hidden",
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    insetInlineEnd: -30,
                    top: -30,
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: (theme) => theme.custom.tones[tone].bg,
                    filter: "blur(2px)",
                },
            }}
        >

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>

                <Box sx={{ minWidth: 0 }}>

                    <Typography sx={{ fontSize: 12, fontWeight: 500 }} color="text.secondary" noWrap>
                        {title}
                    </Typography>

                    <Typography sx={{ fontSize: { xs: 17, md: 24 }, fontWeight: 700, mt: 0.5, lineHeight: 1.4 }}>
                        {text ?? compact(animated)}
                        {suffix && (
                            <Box component="span" sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary", marginInlineStart: 0.5 }}>
                                {suffix}
                            </Box>
                        )}
                    </Typography>

                </Box>

                <Box
                    sx={{
                        width: { xs: 38, md: 46 },
                        height: { xs: 38, md: 46 },
                        borderRadius: 3,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid",
                        bgcolor: (theme) => theme.custom.tones[tone].bg,
                        borderColor: (theme) => theme.custom.tones[tone].border,
                        color: (theme) => theme.custom.tones[tone].text,
                    }}
                >
                    <Icon />
                </Box>

            </Box>

        </Box>

    );

}

export default function Reports() {

    const { showSnackbar } = useSnackbar();

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [preset, setPreset] = useState("180");

    const [startDate, setStartDate] = useState(dateDaysAgo(180));
    const [endDate, setEndDate] = useState(toDateInputValue(new Date()));

    const [exporting, setExporting] = useState(false);

    const { data, isLoading, isError } = useQuery({

        queryKey: ["reports", "summary", startDate, endDate],

        queryFn: async () => {

            const response = await api.get("reports/summary/", {
                params: { start_date: startDate, end_date: endDate },
            });

            return response.data;

        },

    });

    async function handleExport(exportFormat) {

        setExporting(true);

        try {

            const response = await api.get("reports/export/", {
                params: {
                    export_format: exportFormat,
                    start_date: startDate,
                    end_date: endDate,
                },
                responseType: "blob",
            });

            const extension = exportFormat === "pdf" ? "pdf" : "xlsx";

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `report-${startDate}-to-${endDate}.${extension}`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "دریافت فایل گزارش با مشکل مواجه شد."
            );

            showSnackbar(message, "error");

        }
        finally {
            setExporting(false);
        }

    }

    if (isLoading) {

        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        );

    }

    if (isError || !data) {

        return (
            <PageContainer>
                <Typography color="text.secondary">
                    دریافت اطلاعات گزارش با مشکل مواجه شد.
                </Typography>
            </PageContainer>
        );

    }

    const totalSale = data.sales.reduce((sum, row) => sum + Number(row.sale_amount || 0), 0);
    const totalRent = data.sales.reduce((sum, row) => sum + Number(row.rent_amount || 0), 0);

    const salesChartData = data.sales.map(row => ({
        month: row.month,
        sale: Number(row.sale_amount || 0),
        rent: Number(row.rent_amount || 0),
    }));

    const agentsChartData = data.agents.map(row => ({
        name: row.agent_name,
        visits: row.visits_count,
        contracts: row.contracts_count,
    }));

    const customerPieData = data.customers.by_request_type.map(row => ({
        name: REQUEST_TYPE_LABELS[row.request_type] ?? row.request_type,
        value: row.count,
    }));

    const pieTotal = customerPieData.reduce((sum, row) => sum + row.value, 0);

    const priceChartData = data.property_prices.map(row => ({
        name: PROPERTY_TYPE_LABELS[row.property_type] ?? row.property_type,
        price: Number(row.avg_price || 0),
    }));

    const axisTick = { fontSize: 11, fill: theme.palette.text.secondary };

    const gridStroke = theme.palette.divider;

    function applyPreset(item) {
        setPreset(item.key);
        setStartDate(dateDaysAgo(item.days));
        setEndDate(toDateInputValue(new Date()));
    }

    return (

        <PageContainer>

            <PageHeader
                title="گزارش‌ها و آمار"
                subtitle="عملکرد آژانس در بازه‌ی زمانی انتخابی"
            />

            <Box
                sx={{
                    p: { xs: 2, md: 2.5 },
                    mb: 3,
                    borderRadius: 4,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: (theme) => theme.custom.glassBorderSoft,
                    boxShadow: (theme) => theme.custom.cardShadow,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>

                    {PRESETS.map(item => (

                        <Chip
                            key={item.key}
                            label={item.label}
                            onClick={() => applyPreset(item)}
                            color={preset === item.key ? "primary" : "default"}
                            variant={preset === item.key ? "filled" : "outlined"}
                            sx={{ fontWeight: 600 }}
                        />

                    ))}

                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr 1fr", md: "220px 220px 1fr" },
                        gap: 2,
                        alignItems: "center",
                    }}
                >

                    <AppTextField
                        label="از تاریخ"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setPreset("");
                            setStartDate(e.target.value);
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                    />

                    <AppTextField
                        label="تا تاریخ"
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setPreset("");
                            setEndDate(e.target.value);
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                    />

                    <Box
                        sx={{
                            gridColumn: { xs: "1 / -1", md: "auto" },
                            display: "flex",
                            gap: 1.5,
                            justifyContent: { xs: "stretch", md: "flex-end" },
                            "& > *": { flex: { xs: 1, md: "none" } },
                        }}
                    >

                        <AppButton
                            variant="outlined"
                            startIcon={<TableChartIcon />}
                            disabled={exporting}
                            onClick={() => handleExport("excel")}
                        >
                            Excel
                        </AppButton>

                        <AppButton
                            variant="outlined"
                            startIcon={<PictureAsPdfIcon />}
                            disabled={exporting}
                            onClick={() => handleExport("pdf")}
                        >
                            PDF
                        </AppButton>

                    </Box>

                </Box>

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
                    gap: { xs: 1.5, md: 2.5 },
                    mb: 3,
                }}
            >

                <KpiCard index={0} tone="emerald" icon={PaidOutlinedIcon} title="مجموع فروش" value={totalSale} suffix="تومان" />

                <KpiCard index={1} tone="indigo" icon={KeyOutlinedIcon} title="مجموع اجاره" value={totalRent} suffix="تومان" />

                <KpiCard index={2} tone="cyan" icon={GroupsOutlinedIcon} title="مشتریان" value={data.customers.total} text={Number(data.customers.total).toLocaleString("en-US")} />

                <KpiCard index={3} tone="amber" icon={TrendingUpIcon} title="نرخ تبدیل" value={0} text={`${data.customers.conversion_rate}٪`} />

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 7fr) minmax(0, 5fr)" },
                    gap: 3,
                }}
            >

                <Panel
                    delay={150}
                    title="فروش و اجاره ماهانه"
                    subtitle="ستون‌ها فروش (محور راست) و خط اجاره (محور چپ)"
                    action={
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <LegendDot color={EMERALD} label="فروش" />
                            <LegendDot color={INDIGO} label="اجاره" />
                        </Box>
                    }
                >

                    {salesChartData.length === 0 ? (

                        <EmptyState text="داده‌ای در این بازه ثبت نشده است." />

                    ) : (

                        <Box sx={{ width: "100%", height: { xs: 260, md: 320 }, direction: "ltr" }}>

                            <ResponsiveContainer>

                                <ComposedChart data={salesChartData} margin={{ top: 8, right: isMobile ? 0 : 8, left: isMobile ? 0 : 8, bottom: 0 }}>

                                    <defs>
                                        <linearGradient id="barSale" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0" stopColor={EMERALD} stopOpacity={1} />
                                            <stop offset="1" stopColor={CYAN} stopOpacity={0.55} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="4 4" />

                                    <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />

                                    <YAxis yAxisId="sale" orientation="left" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={compact} width={isMobile ? 38 : 54} hide={isMobile} />

                                    <YAxis yAxisId="rent" orientation="right" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={compact} width={isMobile ? 38 : 54} hide={isMobile} />

                                    <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />

                                    <Bar yAxisId="sale" dataKey="sale" name="فروش" fill="url(#barSale)" radius={[8, 8, 0, 0]} maxBarSize={44} animationDuration={1000} />

                                    <Line yAxisId="rent" dataKey="rent" name="اجاره" type="monotone" stroke={INDIGO} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: theme.palette.background.paper, fill: INDIGO }} activeDot={{ r: 6 }} animationDuration={1200} />

                                </ComposedChart>

                            </ResponsiveContainer>

                        </Box>

                    )}

                </Panel>

                <Panel
                    delay={230}
                    title="آمار مشتریان"
                    subtitle={`${Number(data.customers.converted).toLocaleString("en-US")} مشتری تبدیل‌شده از ${Number(data.customers.total).toLocaleString("en-US")}`}
                >

                    {customerPieData.length === 0 ? (

                        <EmptyState text="داده‌ای در این بازه ثبت نشده است." />

                    ) : (

                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row", lg: "column", xl: "row" }, alignItems: "center", gap: 2 }}>

                            <Box sx={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>

                                <ResponsiveContainer>

                                    <PieChart>

                                        <Pie
                                            data={customerPieData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={66}
                                            outerRadius={92}
                                            paddingAngle={3}
                                            cornerRadius={8}
                                            stroke="none"
                                            animationDuration={1000}
                                        >

                                            {customerPieData.map((entry, index) => (
                                                <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                            ))}

                                        </Pie>

                                    </PieChart>

                                </ResponsiveContainer>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        pointerEvents: "none",
                                    }}
                                >

                                    <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
                                        {Number(pieTotal).toLocaleString("en-US")}
                                    </Typography>

                                    <Typography sx={{ fontSize: 11 }} color="text.secondary">
                                        درخواست
                                    </Typography>

                                </Box>

                            </Box>

                            <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 1.75 }}>

                                {customerPieData.map((row, index) => {

                                    const percent = pieTotal ? Math.round((row.value / pieTotal) * 100) : 0;

                                    return (

                                        <Box key={row.name}>

                                            <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, mb: 0.5 }}>

                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                                                    {row.name}
                                                </Box>

                                                <Box sx={{ fontWeight: 700 }}>
                                                    {row.value.toLocaleString("en-US")}
                                                    <Box component="span" sx={{ color: "text.secondary", fontWeight: 500, marginInlineStart: 0.75 }}>
                                                        {percent}٪
                                                    </Box>
                                                </Box>

                                            </Box>

                                            <Box sx={{ height: 6, borderRadius: 999, bgcolor: (t) => t.custom.surfaceAlt, overflow: "hidden" }}>
                                                <Box
                                                    sx={{
                                                        height: "100%",
                                                        width: `${percent}%`,
                                                        borderRadius: 999,
                                                        bgcolor: DONUT_COLORS[index % DONUT_COLORS.length],
                                                        transition: "width 1s ease",
                                                    }}
                                                />
                                            </Box>

                                        </Box>

                                    );

                                })}

                            </Box>

                        </Box>

                    )}

                </Panel>

                <Panel
                    delay={310}
                    title="عملکرد مشاوران"
                    subtitle="تعداد بازدید و قرارداد هر مشاور"
                    action={
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <LegendDot color={CYAN} label="بازدید" />
                            <LegendDot color={AMBER} label="قرارداد" />
                        </Box>
                    }
                >

                    {agentsChartData.length === 0 ? (

                        <EmptyState text="مشاوری برای نمایش وجود ندارد." />

                    ) : (

                        <Box sx={{ width: "100%", height: Math.max(220, agentsChartData.length * 62 + 40), direction: "ltr" }}>

                            <ResponsiveContainer>

                                <BarChart data={agentsChartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barCategoryGap="28%">

                                    <defs>
                                        <linearGradient id="barVisits" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0" stopColor={CYAN} stopOpacity={0.45} />
                                            <stop offset="1" stopColor={CYAN} stopOpacity={1} />
                                        </linearGradient>
                                        <linearGradient id="barContracts" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0" stopColor={AMBER} stopOpacity={0.45} />
                                            <stop offset="1" stopColor={AMBER} stopOpacity={1} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid horizontal={false} stroke={gridStroke} strokeDasharray="4 4" />

                                    <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />

                                    <YAxis dataKey="name" type="category" tick={axisTick} tickLine={false} axisLine={false} width={isMobile ? 70 : 100} orientation="right" />

                                    <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />

                                    <Bar dataKey="visits" name="بازدید" fill="url(#barVisits)" radius={[0, 8, 8, 0]} animationDuration={1000}>
                                        <LabelList dataKey="visits" position="right" style={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                                    </Bar>

                                    <Bar dataKey="contracts" name="قرارداد" fill="url(#barContracts)" radius={[0, 8, 8, 0]} animationDuration={1000}>
                                        <LabelList dataKey="contracts" position="right" style={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                                    </Bar>

                                </BarChart>

                            </ResponsiveContainer>

                        </Box>

                    )}

                </Panel>

                <Panel
                    delay={390}
                    title="میانگین قیمت ملک بر اساس نوع"
                    subtitle="به تومان"
                >

                    {priceChartData.length === 0 ? (

                        <EmptyState text="ملکی برای نمایش وجود ندارد." />

                    ) : (

                        <Box sx={{ width: "100%", height: { xs: 260, md: 300 }, direction: "ltr" }}>

                            <ResponsiveContainer>

                                <BarChart data={priceChartData} margin={{ top: 22, right: 8, left: 8, bottom: 0 }}>

                                    <defs>
                                        <linearGradient id="barPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0" stopColor={INDIGO} stopOpacity={1} />
                                            <stop offset="1" stopColor={EMERALD} stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="4 4" />

                                    <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />

                                    <YAxis hide />

                                    <RechartsTooltip content={<ChartTooltip formatter={(value) => `${compact(value)} تومان`} />} cursor={{ fill: "rgba(16,185,129,0.06)" }} />

                                    <Bar dataKey="price" name="میانگین قیمت" fill="url(#barPrice)" radius={[8, 8, 0, 0]} maxBarSize={52} animationDuration={1000}>
                                        <LabelList dataKey="price" position="top" formatter={compact} style={{ fontSize: 11, fontWeight: 600, fill: theme.palette.text.primary }} />
                                    </Bar>

                                </BarChart>

                            </ResponsiveContainer>

                        </Box>

                    )}

                </Panel>

            </Box>

        </PageContainer>

    );

}