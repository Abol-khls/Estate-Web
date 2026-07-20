import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
    Paper,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
    Box,
    Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import api from "../../services/api";
import PageContainer from "../../components/common/PageContainer";
import Loading from "../../components/common/Loading";
import InfoItem from "../../components/common/InfoItem";
import DeleteDialog from "../../components/common/DeleteDialog";

import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";
import useDeleteResource from "../../hooks/queries/useDeleteResource";

import {
    getCustomerStatusLabel,
    getCustomerStatusColor,
    getRequestTypeLabel,
} from "../../constants/customerOptions";

import { useState } from "react";

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

export default function CustomerDetail() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data: customer, isLoading, isError } = useQuery({

        queryKey: ["customers", "detail", id],

        queryFn: async () => {

            const response = await api.get(`customers/${id}/`);

            return response.data;

        },

    });

    const deleteMutation = useDeleteResource("customers");

    if (isLoading) {

        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        );

    }

    if (isError || !customer) {

        return (
            <PageContainer>
                <Typography color="text.secondary">
                    این مشتری پیدا نشد.
                </Typography>
            </PageContainer>
        );

    }

    function handleDelete() {

        deleteMutation.mutate(customer.id, {

            onSuccess: () => {

                showSnackbar("مشتری با موفقیت حذف شد.", "success");

                navigate("/admin/clients");

            },

            onError: (error) => {

                const message = getErrorMessage(error, "حذف مشتری انجام نشد.");

                showSnackbar(message, "error");

            },

        });

    }

    return (

        <PageContainer>

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin/clients")}
                sx={{ mb: 2 }}
            >
                بازگشت به لیست مشتریان
            </Button>

            <Paper
                sx={{
                    p: { xs: 2.5, md: 4 },
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 2 }}
                >

                    <Box>

                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>

                            <Typography variant="h5" fontWeight={800}>
                                {customer.full_name}
                            </Typography>

                            <Chip
                                color={getCustomerStatusColor(customer.status)}
                                label={getCustomerStatusLabel(customer.status)}
                            />

                        </Stack>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            <bdi>{customer.phone}</bdi>
                        </Typography>

                    </Box>

                    <Stack direction="row" spacing={1.5}>

                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/admin/clients/${customer.id}/edit`)}
                        >
                            ویرایش
                        </Button>

                        <Button
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteOpen(true)}
                        >
                            حذف
                        </Button>

                    </Stack>

                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="شماره تماس" value={customer.phone} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="شماره تماس دوم" value={customer.phone_2 || "—"} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="نوع درخواست" value={getRequestTypeLabel(customer.request_type)} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem
                            label="بودجه"
                            value={customer.budget ? `${Number(customer.budget).toLocaleString("fa-IR")} تومان` : "—"}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="تاریخ ثبت" value={formatDateTime(customer.created_at)} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                        <InfoItem label="آخرین به‌روزرسانی" value={formatDateTime(customer.updated_at)} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Divider sx={{ my: 1 }} />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Typography variant="caption" color="text.secondary">
                            یادداشت
                        </Typography>

                        <Typography sx={{ whiteSpace: "pre-line" }}>
                            {customer.notes || "—"}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

            <DeleteDialog
                open={deleteOpen}
                title="حذف مشتری"
                message={`آیا از حذف "${customer.full_name}" مطمئن هستید؟`}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />

        </PageContainer>

    );

}