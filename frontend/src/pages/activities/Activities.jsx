import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Pagination,
    Paper,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Grid,
    MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../../services/api";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";
import DeleteDialog from "../../components/common/DeleteDialog";
import Loading from "../../components/common/Loading";

import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";

import {
    ACTIVITY_STATUSES,
    ACTIVITY_ORDERING_OPTIONS,
    getActivityStatusLabel,
    getActivityStatusColor,
} from "../../constants/activityOptions";

const GRID_COLUMNS = "180px 200px 170px 140px 1fr 130px";

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

export default function Activities() {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [activities, setActivities] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [ordering, setOrdering] = useState("-follow_date");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const pageSize = 20;

    const [loading, setLoading] = useState(true);
    const isFirstRun = useRef(true);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    async function loadActivities(pageToLoad = page) {

        setLoading(true);

        try {

            const params = {
                page: pageToLoad,
                search,
                ordering,
            };

            if (status !== "all") {
                params.status = status;
            }

            const response = await api.get("activities/", { params });

            setActivities(response.data.results ?? response.data);
            setCount(response.data.count ?? 0);

        }
        catch (error) {

            if (error.response?.status === 404 && pageToLoad !== 1) {
                setPage(1);
                return;
            }

            const message = getErrorMessage(
                error,
                "خطا در دریافت لیست فعالیت‌ها"
            );

            showSnackbar(message, "error");

            setActivities([]);
            setCount(0);

        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            loadActivities(1);
            return;
        }

        if (page !== 1) {
            setPage(1);
        } else {
            loadActivities(1);
        }

    }, [search, status, ordering]);

    useEffect(() => {

        if (isFirstRun.current) return;

        loadActivities(page);

    }, [page]);

    function handleDeleteClick(activity) {
        setSelectedActivity(activity);
        setDeleteOpen(true);
    }

    async function handleDelete() {

        try {

            await api.delete(`activities/${selectedActivity.id}/`);

            showSnackbar("فعالیت با موفقیت حذف شد.", "success");

            setDeleteOpen(false);
            setSelectedActivity(null);

            loadActivities();

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "حذف فعالیت انجام نشد."
            );

            showSnackbar(message, "error");

        }

    }

    return (

        <PageContainer>

            <PageHeader
                title="فعالیت‌ها"
                subtitle={`${count} فعالیت ثبت‌شده`}
                action={
                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/activities/create")}
                    >
                        افزودن فعالیت
                    </AppButton>
                }
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

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <AppTextField
                            placeholder="جستجو بر اساس مشتری، عنوان یا توضیحات..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startIcon={<SearchIcon fontSize="small" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                        <AppSelect
                            label="وضعیت"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {ACTIVITY_STATUSES.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                        <AppSelect
                            label="مرتب‌سازی"
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                        >
                            {ACTIVITY_ORDERING_OPTIONS.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                </Grid>

            </Paper>

            {loading ? (

                <Loading />

            ) : (

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
                    }}
                >

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: GRID_COLUMNS,
                            columnGap: 2,
                            alignItems: "center",
                            px: 3,
                            py: 2,
                            bgcolor: "primary.main",
                        }}
                    >

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            مشتری
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            عنوان
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            تاریخ پیگیری
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            وضعیت
                        </Typography>

                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            توضیحات
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            عملیات
                        </Typography>

                    </Box>

                    {activities.length === 0 ? (

                        <Box
                            sx={{
                                py: 8,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 1.5,
                                color: "text.secondary",
                            }}
                        >
                            <InboxIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                            <Typography variant="body2">
                                فعالیتی برای نمایش پیدا نشد.
                            </Typography>
                        </Box>

                    ) : (

                        activities.map((activity, index) => (

                            <Box
                                key={activity.id}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: GRID_COLUMNS,
                                    columnGap: 2,
                                    alignItems: "center",
                                    px: 3,
                                    py: 2.5,
                                    bgcolor: index % 2 === 1 ? "rgba(31, 59, 87, 0.02)" : "transparent",
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    borderInlineStart: "3px solid transparent",
                                    transition: ".2s",
                                    "&:hover": {
                                        bgcolor: "rgba(31, 59, 87, 0.05)",
                                        borderInlineStartColor: "secondary.main",
                                    },
                                }}
                            >

                                <Typography align="center" fontWeight={700} noWrap>
                                    {activity.customer_name}
                                </Typography>

                                <Typography align="center" color="text.secondary" noWrap>
                                    {activity.title}
                                </Typography>

                                <Typography align="center" color="text.secondary">
                                    <bdi>{formatDateTime(activity.follow_date)}</bdi>
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Chip
                                        size="small"
                                        color={getActivityStatusColor(activity.status)}
                                        label={getActivityStatusLabel(activity.status)}
                                    />
                                </Box>

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        pr: 1,
                                    }}
                                >
                                    {activity.description || "—"}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}>

                                    <Tooltip title="ویرایش">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/activities/${activity.id}/edit`)}
                                            sx={{
                                                borderRadius: 2,
                                                border: "1px solid",
                                                borderColor: "primary.main",
                                                "&:hover": { bgcolor: "primary.main", color: "#fff" },
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="حذف">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(activity)}
                                            sx={{
                                                borderRadius: 2,
                                                border: "1px solid",
                                                borderColor: "error.main",
                                                "&:hover": { bgcolor: "error.main", color: "#fff" },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                </Box>

                            </Box>

                        ))

                    )}

                </Paper>

            )}

            {count > pageSize && (

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        page={page}
                        count={Math.ceil(count / pageSize)}
                        color="primary"
                        shape="rounded"
                        disabled={loading}
                        onChange={(event, value) => setPage(value)}
                    />
                </Box>

            )}

            <DeleteDialog
                open={deleteOpen}
                title="حذف فعالیت"
                message={`آیا از حذف "${selectedActivity?.title ?? ""}" مطمئن هستید؟`}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedActivity(null);
                }}
                onConfirm={handleDelete}
            />

        </PageContainer>

    );

}