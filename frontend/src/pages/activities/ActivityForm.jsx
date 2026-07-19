import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Grid,
    Typography,
    Box,
    Paper,
    MenuItem,
    Chip,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";
import EntityPickerDialog from "../../components/common/EntityPickerDialog";

import api from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";
import { ACTIVITY_STATUSES } from "../../constants/activityOptions";
import { getCustomerStatusLabel, getCustomerStatusColor } from "../../constants/customerOptions";

function FormSection({ title, children }) {

    return (

        <Paper
            sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 1px 3px rgba(16,24,40,0.06)",
                mb: 3,
            }}
        >

            <Typography variant="subtitle1" sx={{ mb: 2, color: "primary.main" }}>
                {title}
            </Typography>

            <Grid container spacing={2}>
                {children}
            </Grid>

        </Paper>

    );

}

function PickerField({ label, placeholder, displayValue, error, helperText, onClick }) {

    return (

        <Box>

            <Typography
                variant="caption"
                sx={{
                    display: "block",
                    mb: 0.6,
                    ml: 0.5,
                    color: error ? "error.main" : "text.secondary",
                }}
            >
                {label}
            </Typography>

            <Box
                onClick={onClick}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: error ? "error.main" : "divider",
                    bgcolor: "background.paper",
                    cursor: "pointer",
                    transition: ".15s",
                    "&:hover": {
                        borderColor: error ? "error.main" : "primary.main",
                    },
                }}
            >

                <Typography
                    color={displayValue ? "text.primary" : "text.secondary"}
                    noWrap
                    sx={{ fontWeight: displayValue ? 600 : 400 }}
                >
                    {displayValue ?? placeholder}
                </Typography>

                <SearchIcon fontSize="small" color="action" />

            </Box>

            {helperText && (

                <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 0.6, mx: 1.5 }}
                >
                    {helperText}
                </Typography>

            )}

        </Box>

    );

}

export default function ActivityForm() {

    const [form, setForm] = useState({
        customer: null,
        title: "",
        description: "",
        follow_date: "",
        status: "pending",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();

    const isEdit = Boolean(id);

    useEffect(() => {

        if (!isEdit) return;

        async function loadActivity() {

            try {

                const response = await api.get(`activities/${id}/`);

                setForm({
                    customer: {
                        id: response.data.customer,
                        full_name: response.data.customer_name,
                    },
                    title: response.data.title,
                    description: response.data.description ?? "",
                    follow_date: response.data.follow_date
                        ? response.data.follow_date.slice(0, 16)
                        : "",
                    status: response.data.status,
                });

            }
            catch (error) {

                const message = getErrorMessage(
                    error,
                    "خطا در دریافت اطلاعات فعالیت"
                );

                showSnackbar(message, "error");

            }

        }

        loadActivity();

    }, [id]);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    function validateForm() {

        const newErrors = {};

        if (!form.customer) {
            newErrors.customer = "انتخاب مشتری الزامی است";
        }

        if (!form.title.trim()) {
            newErrors.title = "عنوان فعالیت الزامی است";
        }

        if (!form.follow_date) {
            newErrors.follow_date = "تاریخ پیگیری الزامی است";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {

            const payload = {
                customer: form.customer.id,
                title: form.title,
                description: form.description,
                follow_date: form.follow_date,
                status: form.status,
            };

            if (isEdit) {
                await api.patch(`activities/${id}/`, payload);
                showSnackbar("فعالیت با موفقیت ویرایش شد.", "success");
            } else {
                await api.post("activities/", payload);
                showSnackbar("فعالیت با موفقیت ثبت شد.", "success");
            }

            queryClient.invalidateQueries({ queryKey: ["activities", "list"] });

            navigate("/admin/activities");

        }
        catch (error) {

            const fieldErrors = getFieldErrors(error);

            if (fieldErrors) {

                setErrors(prev => ({ ...prev, ...fieldErrors }));

                showSnackbar(
                    getFieldErrorSummary(fieldErrors, getNonFieldError(error)),
                    "error"
                );

            } else {

                const message = getErrorMessage(
                    error,
                    "ثبت اطلاعات فعالیت با مشکل مواجه شد."
                );

                showSnackbar(message, "error");

            }

        }
        finally {
            setSubmitting(false);
        }

    }

    return (

        <PageContainer>

            <PageHeader
                title={isEdit ? "ویرایش فعالیت" : "افزودن فعالیت"}
            />

            <form onSubmit={handleSubmit}>

                <FormSection title="مشتری مرتبط">

                    <Grid size={{ xs: 12 }}>
                        <PickerField
                            label="مشتری"
                            placeholder="برای انتخاب مشتری کلیک کنید"
                            displayValue={form.customer?.full_name}
                            error={!!errors.customer}
                            helperText={errors.customer}
                            onClick={() => setCustomerDialogOpen(true)}
                        />
                    </Grid>

                </FormSection>

                <FormSection title="جزئیات فعالیت">

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="عنوان"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            error={!!errors.title}
                            helperText={errors.title}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="تاریخ و ساعت پیگیری"
                            name="follow_date"
                            type="datetime-local"
                            value={form.follow_date}
                            onChange={handleChange}
                            error={!!errors.follow_date}
                            helperText={errors.follow_date}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{
                                "& input": {
                                    direction: "ltr",
                                    textAlign: "right",
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppSelect
                            label="وضعیت"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            {ACTIVITY_STATUSES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <AppTextField
                            label="توضیحات"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                        />
                    </Grid>

                </FormSection>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <AppButton
                        type="submit"
                        startIcon={<SaveIcon />}
                        disabled={submitting}
                    >
                        {isEdit ? "ذخیره تغییرات" : "ثبت فعالیت"}
                    </AppButton>
                </Box>

            </form>

            <EntityPickerDialog
                open={customerDialogOpen}
                onClose={() => setCustomerDialogOpen(false)}
                title="انتخاب مشتری"
                endpoint="customers/"
                pageSize={20}
                searchPlaceholder="جستجو بر اساس نام یا شماره تماس..."
                onSelect={(customer) => {
                    setForm(prev => ({ ...prev, customer }));
                    setErrors(prev => ({ ...prev, customer: "" }));
                }}
                renderItem={(customer) => (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>

                        <Box>
                            <Typography fontWeight={700}>
                                {customer.full_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <bdi>{customer.phone}</bdi>
                            </Typography>
                        </Box>

                        <Chip
                            size="small"
                            color={getCustomerStatusColor(customer.status)}
                            label={getCustomerStatusLabel(customer.status)}
                        />

                    </Box>
                )}
            />

        </PageContainer>

    );

}