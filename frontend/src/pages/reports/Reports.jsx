import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    Box,
    Grid,
    Paper,
    Typography,
    Chip,
} from "@mui/material";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";
import Loading from "../../components/common/Loading";

import api from "../../services/api";
import { useSnackbar } from "../../context/useSnackbar";
import { getErrorMessage } from "../../utils/errorMessage";

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
};

const CHART_COLORS = ["#A2712A", "#3E7C74", "#4A6FA5", "#B0563D", "#8A8477"];

const PIE_COLORS = CHART_COLORS;

function toDateInputValue(date) {
    return date.toISOString().slice(0, 10);
}

function defaultStartDate() {
    const d = new Date();
    d.setDate(d.getDate() - 180);
    return toDateInputValue(d);
}

function SectionPaper({ title, children }) {

    return (

        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
            }}
        >

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                {title}
            </Typography>

            {children}

        </Paper>

    );

}

export default function Reports() {

    const { showSnackbar } = useSnackbar();

    const [startDate, setStartDate] = useState(defaultStartDate());
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

    const salesChartData = data.sales.map(row => ({
        month: row.month,
        "مبلغ فروش": row.sale_amount,
        "مبلغ اجاره": row.rent_amount,
    }));

    const agentsChartData = data.agents.map(row => ({
        name: row.agent_name,
        بازدید: row.visits_count,
        قرارداد: row.contracts_count,
    }));

    const customerPieData = data.customers.by_request_type.map(row => ({
        name: REQUEST_TYPE_LABELS[row.request_type] ?? row.request_type,
        value: row.count,
    }));

    const priceChartData = data.property_prices.map(row => ({
        name: PROPERTY_TYPE_LABELS[row.property_type] ?? row.property_type,
        "میانگین قیمت": row.avg_price,
    }));

    return (

        <PageContainer>

            <PageHeader
                title="گزارش‌ها و آمار"
                subtitle="عملکرد آژانس در بازه‌ی زمانی انتخابی"
            />

            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >

                <Grid container spacing={2} sx={{ alignItems: "center" }}>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AppTextField
                            label="از تاریخ"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AppTextField
                            label="تا تاریخ"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box sx={{ display: "flex", gap: 1.5, justifyContent: { xs: "flex-start", md: "flex-end" } }}>

                            <AppButton
                                variant="outlined"
                                startIcon={<TableChartIcon />}
                                disabled={exporting}
                                onClick={() => handleExport("excel")}
                            >
                                دانلود Excel
                            </AppButton>

                            <AppButton
                                variant="outlined"
                                startIcon={<PictureAsPdfIcon />}
                                disabled={exporting}
                                onClick={() => handleExport("pdf")}
                            >
                                دانلود PDF
                            </AppButton>

                        </Box>

                    </Grid>

                </Grid>

            </Paper>

            <Grid container spacing={2.5}>

                <Grid size={{ xs: 12, lg: 7 }}>

                    <SectionPaper title="فروش و اجاره ماهانه">

                        {salesChartData.length === 0 ? (

                            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                                داده‌ای در این بازه ثبت نشده است.
                            </Typography>

                        ) : (

                            <Box sx={{ width: "100%", height: 280 }}>

                                <ResponsiveContainer>

                                    <BarChart data={salesChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <RechartsTooltip formatter={(value) => Number(value).toLocaleString("fa-IR")} />
                                        <Legend />
                                        <Bar dataKey="مبلغ فروش" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="مبلغ اجاره" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                                    </BarChart>

                                </ResponsiveContainer>

                            </Box>

                        )}

                    </SectionPaper>

                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>

                    <SectionPaper title="آمار مشتریان">

                        <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>

                            <Box>
                                <Typography variant="caption" color="text.secondary">تعداد کل</Typography>
                                <Typography variant="h5" fontWeight={800}>{data.customers.total}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">تبدیل‌شده</Typography>
                                <Typography variant="h5" fontWeight={800}>{data.customers.converted}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">نرخ تبدیل</Typography>
                                <Typography variant="h5" fontWeight={800}>
                                    <bdi>{data.customers.conversion_rate}٪</bdi>
                                </Typography>
                            </Box>

                        </Box>

                        {customerPieData.length === 0 ? (

                            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                                داده‌ای در این بازه ثبت نشده است.
                            </Typography>

                        ) : (

                            <Box sx={{ width: "100%", height: 220 }}>

                                <ResponsiveContainer>

                                    <PieChart>

                                        <Pie
                                            data={customerPieData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                        >

                                            {customerPieData.map((entry, index) => (
                                                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}

                                        </Pie>

                                        <RechartsTooltip />
                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </Box>

                        )}

                    </SectionPaper>

                </Grid>

                <Grid size={{ xs: 12, lg: 7 }}>

                    <SectionPaper title="عملکرد مشاوران">

                        {agentsChartData.length === 0 ? (

                            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                                مشاوری برای نمایش وجود ندارد.
                            </Typography>

                        ) : (

                            <Box sx={{ width: "100%", height: 280 }}>

                                <ResponsiveContainer>

                                    <BarChart data={agentsChartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={90} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="بازدید" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="قرارداد" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} />
                                    </BarChart>

                                </ResponsiveContainer>

                            </Box>

                        )}

                    </SectionPaper>

                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>

                    <SectionPaper title="میانگین قیمت ملک بر اساس نوع">

                        {priceChartData.length === 0 ? (

                            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                                ملکی برای نمایش وجود ندارد.
                            </Typography>

                        ) : (

                            <Box sx={{ width: "100%", height: 280 }}>

                                <ResponsiveContainer>

                                    <BarChart data={priceChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip formatter={(value) => Number(value).toLocaleString("fa-IR")} />
                                        <Bar dataKey="میانگین قیمت" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                                    </BarChart>

                                </ResponsiveContainer>

                            </Box>

                        )}

                    </SectionPaper>

                </Grid>

            </Grid>

        </PageContainer>

    );

}