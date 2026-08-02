import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    Box,
    Typography,
    IconButton,
    Chip,
    Tooltip,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TodayIcon from "@mui/icons-material/Today";
import ViewListIcon from "@mui/icons-material/ViewList";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import Loading from "../../components/common/Loading";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getVisitStatusColor } from "../../constants/visitOptions";

const WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateKey(date) {
    return date.toISOString().slice(0, 10);
}

function buildMonthGrid(monthDate) {

    const firstOfMonth = startOfMonth(monthDate);

    const jsWeekday = firstOfMonth.getDay();

    const persianWeekdayIndex = (jsWeekday + 1) % 7;

    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - persianWeekdayIndex);

    const days = [];

    for (let i = 0; i < 42; i++) {

        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + i);

        days.push(day);

    }

    return days;

}

export default function VisitsCalendar() {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [monthDate, setMonthDate] = useState(startOfMonth(new Date()));

    const monthGrid = useMemo(() => buildMonthGrid(monthDate), [monthDate]);

    const rangeStart = toDateKey(monthGrid[0]);
    const rangeEnd = toDateKey(monthGrid[monthGrid.length - 1]);

    const { data, isLoading, isError } = useQuery({

        queryKey: ["visits", "calendar", rangeStart, rangeEnd],

        queryFn: async () => {

            const response = await api.get("visits/", {
                params: {
                    start_date: rangeStart,
                    end_date: rangeEnd,
                    page_size: 500,
                    ordering: "visit_date",
                },
            });

            return response.data;

        },

    });

    if (isError) {
        showSnackbar("خطا در دریافت اطلاعات تقویم بازدیدها", "error");
    }

    const visitsByDay = useMemo(() => {

        const map = {};

        for (const visit of data?.results ?? []) {

            const key = visit.visit_date?.slice(0, 10);

            if (!key) continue;

            if (!map[key]) map[key] = [];

            map[key].push(visit);

        }

        return map;

    }, [data]);

    const monthLabel = monthDate.toLocaleDateString("fa-IR", {
        month: "long",
        year: "numeric",
    });

    const todayKey = toDateKey(new Date());

    function goToPrevMonth() {
        setMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }

    function goToNextMonth() {
        setMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }

    function goToToday() {
        setMonthDate(startOfMonth(new Date()));
    }

    return (

        <PageContainer>

            <PageHeader
                title="تقویم بازدیدها"
                subtitle="نمای ماهانه‌ی بازدیدهای برنامه‌ریزی‌شده"
                action={
                    <AppButton
                        variant="outlined"
                        startIcon={<ViewListIcon />}
                        onClick={() => navigate("/admin/visits")}
                    >
                        نمای لیستی
                    </AppButton>
                }
            />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                    flexWrap: "wrap",
                    gap: 1.5,
                }}
            >

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                    <IconButton onClick={goToNextMonth}>
                        <ChevronRightIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ minWidth: 160, textAlign: "center" }}>
                        {monthLabel}
                    </Typography>

                    <IconButton onClick={goToPrevMonth}>
                        <ChevronLeftIcon />
                    </IconButton>

                </Box>

                <AppButton
                    variant="outlined"
                    startIcon={<TodayIcon />}
                    onClick={goToToday}
                >
                    امروز
                </AppButton>

            </Box>

            {isLoading ? (

                <Loading />

            ) : (

                <Box
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            bgcolor: (theme) => theme.custom.surfaceAlt,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    >

                        {WEEKDAYS.map(day => (

                            <Typography
                                key={day}
                                align="center"
                                variant="subtitle2"
                                color="text.secondary"
                                fontWeight={700}
                                sx={{ py: 1.2, fontSize: { xs: 11, sm: 14 } }}
                            >
                                {day}
                            </Typography>

                        ))}

                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                        }}
                    >

                        {monthGrid.map(day => {

                            const key = toDateKey(day);

                            const isCurrentMonth = day.getMonth() === monthDate.getMonth();

                            const dayVisits = visitsByDay[key] ?? [];

                            const isToday = key === todayKey;

                            return (

                                <Box
                                    key={key}
                                    sx={{
                                        minHeight: { xs: 74, sm: 110 },
                                        p: { xs: 0.5, sm: 1 },
                                        borderInlineEnd: "1px solid",
                                        borderTop: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: isCurrentMonth ? "background.paper" : (theme) => theme.custom.surfaceAlt,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: isToday ? 800 : 500,
                                                color: isToday
                                                    ? "secondary.dark"
                                                    : isCurrentMonth ? "text.primary" : "text.disabled",
                                                bgcolor: isToday ? (theme) => theme.custom.accentTint : "transparent",
                                                borderRadius: "50%",
                                                width: 22,
                                                height: 22,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {day.toLocaleDateString("fa-IR", { day: "numeric" })}
                                        </Typography>

                                    </Box>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>

                                        {dayVisits.slice(0, 3).map(visit => (

                                            <Tooltip
                                                key={visit.id}
                                                title={`${visit.customer_name} — ${visit.property_title}`}
                                            >

                                                <Chip
                                                    size="small"
                                                    label={visit.customer_name}
                                                    color={getVisitStatusColor(visit.status)}
                                                    onClick={() => navigate(`/admin/visits/${visit.id}`)}
                                                    sx={{
                                                        height: 20,
                                                        fontSize: 10,
                                                        justifyContent: "flex-start",
                                                        cursor: "pointer",
                                                        "& .MuiChip-label": {
                                                            px: 0.8,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        },
                                                    }}
                                                />

                                            </Tooltip>

                                        ))}

                                        {dayVisits.length > 3 && (

                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                                                +{dayVisits.length - 3} مورد دیگر
                                            </Typography>

                                        )}

                                    </Box>

                                </Box>

                            );

                        })}

                    </Box>

                </Box>

            )}

        </PageContainer>

    );

}