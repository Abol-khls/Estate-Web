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
    REQUEST_TYPES,
    CUSTOMER_STATUSES,
    CUSTOMER_ORDERING_OPTIONS,
    getRequestTypeLabel,
    getCustomerStatusLabel,
    getCustomerStatusColor,
} from "../../constants/customerOptions";

const GRID_COLUMNS = "200px 160px 130px 150px 1fr 150px";

export default function Customers() {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [requestType, setRequestType] = useState("all");
    const [status, setStatus] = useState("all");
    const [ordering, setOrdering] = useState("-created_at");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const pageSize = 20;

    const [loading, setLoading] = useState(true);
    const isFirstRun = useRef(true);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    async function loadCustomers(pageToLoad = page) {

        setLoading(true);

        try {

            const params = {
                page: pageToLoad,
                search,
                ordering,
            };

            if (requestType !== "all") {
                params.request_type = requestType;
            }

            if (status !== "all") {
                params.status = status;
            }

            const response = await api.get("customers/", { params });

            setCustomers(response.data.results ?? response.data);
            setCount(response.data.count ?? 0);

        }
        catch (error) {

            if (error.response?.status === 404 && pageToLoad !== 1) {
                setPage(1);
                return;
            }

            const message = getErrorMessage(
                error,
                "خطا در دریافت لیست مشتریان"
            );

            showSnackbar(message, "error");

            setCustomers([]);
            setCount(0);

        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            loadCustomers(1);
            return;
        }

        if (page !== 1) {
            setPage(1);
        } else {
            loadCustomers(1);
        }

      
    }, [search, requestType, status, ordering]);

    useEffect(() => {

        if (isFirstRun.current) return;

        loadCustomers(page);

    
    }, [page]);

    function handleDeleteClick(customer) {
        setSelectedCustomer(customer);
        setDeleteOpen(true);
    }

    async function handleDelete() {

        try {

            await api.delete(`customers/${selectedCustomer.id}/`);

            showSnackbar("مشتری با موفقیت حذف شد.", "success");

            setDeleteOpen(false);
            setSelectedCustomer(null);

            loadCustomers();

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "حذف مشتری انجام نشد."
            );

            showSnackbar(message, "error");

        }

    }

    return (

        <PageContainer>

            <PageHeader
                title="مشتریان"
                subtitle={`${count} مشتری ثبت‌شده`}
                action={
                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/clients/create")}
                    >
                        افزودن مشتری
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

                    <Grid size={{ xs: 12, md: 4 }}>
                        <AppTextField
                            placeholder="جستجو بر اساس نام یا شماره تماس..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startIcon={<SearchIcon fontSize="small" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <AppSelect
                            label="نوع درخواست"
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value)}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {REQUEST_TYPES.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <AppSelect
                            label="وضعیت"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {CUSTOMER_STATUSES.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <AppSelect
                            label="مرتب‌سازی"
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                        >
                            {CUSTOMER_ORDERING_OPTIONS.map((item) => (
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
                            نام مشتری
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            شماره تماس
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            نوع درخواست
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            بودجه
                        </Typography>

                        <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            یادداشت
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            عملیات
                        </Typography>

                    </Box>

                    {customers.length === 0 ? (

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
                                مشتری‌ای برای نمایش پیدا نشد.
                            </Typography>
                        </Box>

                    ) : (

                        customers.map((customer, index) => (

                            <Box
                                key={customer.id}
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

                                <Box sx={{ textAlign: "center" }}>

                                    <Typography fontWeight={700} noWrap>
                                        {customer.full_name}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        color={getCustomerStatusColor(customer.status)}
                                        label={getCustomerStatusLabel(customer.status)}
                                        sx={{ mt: 0.5 }}
                                    />

                                </Box>

                                <Box sx={{ textAlign: "center" }}>

                                    <Typography color="text.secondary">
                                        <bdi>{customer.phone}</bdi>
                                    </Typography>

                                    {customer.phone_2 && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            <bdi>{customer.phone_2}</bdi>
                                        </Typography>
                                    )}

                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Chip
                                        size="small"
                                        label={getRequestTypeLabel(customer.request_type)}
                                        sx={{ bgcolor: "rgba(31, 59, 87, 0.08)", fontWeight: 600 }}
                                    />
                                </Box>

                                <Typography align="center" fontWeight={600}>
                                    {customer.budget
                                        ? `${Number(customer.budget).toLocaleString("fa-IR")} تومان`
                                        : "—"}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        pr: 1,
                                    }}
                                >
                                    {customer.notes || "—"}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}>

                                    <Tooltip title="ویرایش">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/clients/${customer.id}/edit`)}
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
                                            onClick={() => handleDeleteClick(customer)}
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
                title="حذف مشتری"
                message={`آیا از حذف "${selectedCustomer?.full_name ?? ""}" مطمئن هستید؟`}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedCustomer(null);
                }}
                onConfirm={handleDelete}
            />

        </PageContainer>

    );

}