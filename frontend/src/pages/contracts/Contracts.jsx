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
    CONTRACT_TYPES,
    CONTRACT_STATUSES,
    CONTRACT_ORDERING_OPTIONS,
    getContractTypeLabel,
    getContractStatusLabel,
    getContractStatusColor,
} from "../../constants/contractOptions";

const GRID_COLUMNS = "180px 180px 140px 150px 130px 120px 150px";

export default function Contracts() {

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [contracts, setContracts] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [contractType, setContractType] = useState("all");
    const [ordering, setOrdering] = useState("-created_at");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const pageSize = 10;

    const [loading, setLoading] = useState(true);
    const isFirstRun = useRef(true);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);

    async function loadContracts(pageToLoad = page) {

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

            if (contractType !== "all") {
                params.contract_type = contractType;
            }

            const response = await api.get("contracts/", { params });

            setContracts(response.data.results ?? response.data);
            setCount(response.data.count ?? 0);

        }
        catch (error) {

            if (error.response?.status === 404 && pageToLoad !== 1) {
                setPage(1);
                return;
            }

            const message = getErrorMessage(
                error,
                "خطا در دریافت لیست قراردادها"
            );

            showSnackbar(message, "error");

            setContracts([]);
            setCount(0);

        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            loadContracts(1);
            return;
        }

        if (page !== 1) {
            setPage(1);
        } else {
            loadContracts(1);
        }

       
    }, [search, status, contractType, ordering]);

    useEffect(() => {

        if (isFirstRun.current) return;

        loadContracts(page);

        
    }, [page]);

    function handleDeleteClick(contract) {
        setSelectedContract(contract);
        setDeleteOpen(true);
    }

    async function handleDelete() {

        try {

            await api.delete(`contracts/${selectedContract.id}/`);

            showSnackbar("قرارداد با موفقیت حذف شد.", "success");

            setDeleteOpen(false);
            setSelectedContract(null);

            loadContracts();

        }
        catch (error) {

            const message = getErrorMessage(
                error,
                "حذف قرارداد انجام نشد."
            );

            showSnackbar(message, "error");

        }

    }

    return (

        <PageContainer>

            <PageHeader
                title="قراردادها"
                subtitle={`${count} قرارداد ثبت‌شده`}
                action={
                    <AppButton
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/contracts/create")}
                    >
                        افزودن قرارداد
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
                            placeholder="جستجو بر اساس مشتری یا ملک..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startIcon={<SearchIcon fontSize="small" />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                        <AppSelect
                            label="نوع قرارداد"
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value)}
                        >
                            <MenuItem value="all">همه</MenuItem>
                            {CONTRACT_TYPES.map((item) => (
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
                            {CONTRACT_STATUSES.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <AppSelect
                            label="مرتب‌سازی"
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                        >
                            {CONTRACT_ORDERING_OPTIONS.map((item) => (
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
                            نوع
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            مبلغ
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            وضعیت
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            تاریخ امضا
                        </Typography>

                        <Typography align="center" variant="subtitle2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                            عملیات
                        </Typography>

                    </Box>

                    {contracts.length === 0 ? (

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
                                قراردادی برای نمایش پیدا نشد.
                            </Typography>
                        </Box>

                    ) : (

                        contracts.map((contract, index) => (

                            <Box
                                key={contract.id}
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
                                    {contract.customer_name ?? contract.customer}
                                </Typography>

                                <Typography align="center" color="text.secondary" noWrap>
                                    {contract.property_title ?? contract.property}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Chip
                                        size="small"
                                        label={getContractTypeLabel(contract.contract_type)}
                                        sx={{ bgcolor: "rgba(31, 59, 87, 0.08)", fontWeight: 600 }}
                                    />
                                </Box>

                                <Typography align="center" fontWeight={600}>
                                    {Number(contract.amount).toLocaleString("fa-IR")} تومان
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Chip
                                        size="small"
                                        color={getContractStatusColor(contract.status)}
                                        label={getContractStatusLabel(contract.status)}
                                    />
                                </Box>

                                <Typography align="center" color="text.secondary">
                                    {contract.signed_date
                                        ? new Date(contract.signed_date).toLocaleDateString("fa-IR")
                                        : "—"}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}>

                                    <Tooltip title="ویرایش">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/contracts/${contract.id}/edit`)}
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
                                            onClick={() => handleDeleteClick(contract)}
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
                title="حذف قرارداد"
                message="آیا از حذف این قرارداد مطمئن هستید؟"
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedContract(null);
                }}
                onConfirm={handleDelete}
            />

        </PageContainer>

    );

}