import { useState } from "react";
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
    getVisitStatusLabel,
    getVisitStatusColor,
} from "../../constants/visitOptions";

function formatDateTime(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

}

export default function VisitDetail() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data: visit, isLoading, isError } = useQuery({

        queryKey: ["visits", "detail", id],

        queryFn: async () => {

            const response = await api.get(`visits/${id}/`);

            return response.data;

        },

    });

    const deleteMutation = useDeleteResource("visits");

    if (isLoading) {

        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        );

    }

    if (isError || !visit) {

        return (
            <PageContainer>
                <Typography color="text.secondary">
                    این بازدید پیدا نشد.
                </Typography>
            </PageContainer>
        );

    }

    function handleDelete() {

        deleteMutation.mutate(visit.id, {

            onSuccess: () => {

                showSnackbar("بازدید با موفقیت حذف شد.", "success");

                navigate("/admin/visits");

            },

            onError: (error) => {

                const message = getErrorMessage(error, "حذف بازدید انجام نشد.");

                showSnackbar(message, "error");

            },

        });

    }

    return (

        <PageContainer>

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin/visits")}
                sx={{ mb: 2 }}
            >
                بازگشت به لیست بازدیدها
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
                                {visit.customer_name}
                            </Typography>

                            <Chip
                                color={getVisitStatusColor(visit.status)}
                                label={getVisitStatusLabel(visit.status)}
                            />

                        </Stack>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {visit.property_title}
                        </Typography>

                    </Box>

                    <Stack direction="row" spacing={1.5}>

                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/admin/visits/${visit.id}/edit`)}
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

                    <Grid size={{ xs: 6, md: 4 }}>
                        <InfoItem label="تاریخ بازدید" value={formatDateTime(visit.visit_date)} />
                    </Grid>

                    <Grid size={{ xs: 6, md: 4 }}>
                        <InfoItem label="تاریخ ثبت" value={formatDateTime(visit.created_at)} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Divider sx={{ my: 1 }} />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Typography variant="caption" color="text.secondary">
                            یادداشت
                        </Typography>

                        <Typography sx={{ whiteSpace: "pre-line" }}>
                            {visit.notes || "—"}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

            <DeleteDialog
                open={deleteOpen}
                title="حذف بازدید"
                message={`آیا از حذف بازدید "${visit.customer_name}" مطمئن هستید؟`}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />

        </PageContainer>

    );

}