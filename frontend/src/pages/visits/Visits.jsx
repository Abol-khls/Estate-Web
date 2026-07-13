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
    VISIT_STATUSES,
    VISIT_ORDERING_OPTIONS,
    getVisitStatusLabel,
    getVisitStatusColor,
} from "../../constants/visitOptions";

const GRID_COLUMNS = "200px 200px 170px 140px 1fr 130px";

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

export default function Visits() {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [visits, setVisits] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [ordering, setOrdering] = useState("-visit_date");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const pageSize = 20;

    const [loading, setLoading] = useState(true);
    const isFirstRun = useRef(true);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    async function loadVisits(pageToLoad = page) {

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

            const response = await api.get("visits/", { params });

            setVisits(response.data.results ?? response.data);
            setCount(response.data.count ?? 0);

        }
        catch (error) {

            if (error.response?.status === 404 && pageToLoad !== 1) {
                setPage(1);
                return;
            }

            const message = getErrorMessage(
                error,
                "خطا در دریافت لیست بازدیدها"
            );

            showSnackbar(message, "error");

            setVisits([]);
            setCount(0);

        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            loadVisits(1);
            return;
        }

        if (page !== 1) {
            setPage(1);
        } else {
            loadVisits(1);
        }

    }, [search, status, ordering]);

    useEffect(() => {

        if (isFirstRun.current) return;

        loadVisits(page);

    }, [page]);

    function handleDeleteClick(visit) {
        setSelectedVisit(visit);
        setDeleteOpen(true);
    }

    async function handleDelete() {

        try {

            await api.delete(`visits/${selectedVisit.id}/`);

            showSnackbar("بازدید با موفقیت حذف شد.", "success");

            setDeleteOpen(false);
            setSelectedVisit(null);

            loadVisits();

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "حذف بازدید انجام نشد."
            );

            showSnackbar(message, "error");

        }

    }

    return (

        <PageContainer>

            <PageHeader
                title="بازدیدها"
                subtitle={`${count} بازدید ثبت‌شده`}
                action={
                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/visits/create")}
                    >
                        افزودن بازدید
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
                            placeholder="جستجو بر اساس مشتری، ملک یا یادداشت..."
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
                            {VISIT_STATUSES.map((item) => (
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
                            {VISIT_ORDERING_OPTIONS.map((item) => (
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
                            ملک
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            تاریخ بازدید
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            وضعیت
                        </Typography>

                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            یادداشت
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            عملیات
                        </Typography>

                    </Box>

                    {visits.length === 0 ? (

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
                                بازدیدی برای نمایش پیدا نشد.
                            </Typography>
                        </Box>

                    ) : (

                        visits.map((visit, index) => (

                            <Box
                                key={visit.id}
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
                                    {visit.customer_name}
                                </Typography>

                                <Typography align="center" color="text.secondary" noWrap>
                                    {visit.property_title}
                                </Typography>

                                <Typography align="center" color="text.secondary">
                                    <bdi>{formatDateTime(visit.visit_date)}</bdi>
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Chip
                                        size="small"
                                        color={getVisitStatusColor(visit.status)}
                                        label={getVisitStatusLabel(visit.status)}
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
                                    {visit.notes || "—"}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}>

                                    <Tooltip title="ویرایش">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/visits/${visit.id}/edit`)}
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
                                            onClick={() => handleDeleteClick(visit)}
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
                title="حذف بازدید"
                message={`آیا از حذف بازدید "${selectedVisit?.customer_name ?? ""}" مطمئن هستید؟`}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedVisit(null);
                }}
                onConfirm={handleDelete}
            />

        </PageContainer>

    );

}