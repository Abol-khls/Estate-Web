import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Grid,
    Typography,
    Box,
    Paper,
    MenuItem,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";

import api from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";
import { REQUEST_TYPES, CUSTOMER_STATUSES } from "../../constants/customerOptions";

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

export default function CustomerForm() {

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        phone_2: "",
        request_type: "",
        status: "active",
        budget: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();

    const isEdit = Boolean(id);

    useEffect(() => {

        if (!isEdit) return;

        async function loadCustomer() {

            try {

                const response = await api.get(`customers/${id}/`);

                setForm({
                    full_name: response.data.full_name,
                    phone: response.data.phone,
                    phone_2: response.data.phone_2 ?? "",
                    request_type: response.data.request_type,
                    status: response.data.status,
                    budget: response.data.budget ?? "",
                    notes: response.data.notes ?? "",
                });

            }
            catch (error) {

                const message = getErrorMessage(
                    error,
                    "خطا در دریافت اطلاعات مشتری"
                );

                showSnackbar(message, "error");

            }

        }

        loadCustomer();

    }, [id]);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    function handleNumberChange(e) {

        const { name, value } = e.target;

        if (/^\d*$/.test(value)) {
            setForm(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

    }

    function validateForm() {

        const newErrors = {};

        if (!form.full_name.trim()) {
            newErrors.full_name = "نام مشتری الزامی است";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "شماره تماس الزامی است";
        }

        if (!form.request_type) {
            newErrors.request_type = "نوع درخواست را انتخاب کنید";
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
                full_name: form.full_name,
                phone: form.phone,
                phone_2: form.phone_2,
                request_type: form.request_type,
                status: form.status,
                budget: form.budget ? Number(form.budget) : null,
                notes: form.notes,
            };

            if (isEdit) {
                await api.patch(`customers/${id}/`, payload);
                showSnackbar("مشتری با موفقیت ویرایش شد.", "success");
            } else {
                await api.post("customers/", payload);
                showSnackbar("مشتری با موفقیت ثبت شد.", "success");
            }

            queryClient.invalidateQueries({ queryKey: ["customers", "list"] });

            navigate("/clients");

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
                    "ثبت اطلاعات مشتری با مشکل مواجه شد."
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
                title={isEdit ? "ویرایش مشتری" : "افزودن مشتری"}
            />

            <form onSubmit={handleSubmit}>

                <FormSection title="اطلاعات مشتری">

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="نام مشتری"
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            error={!!errors.full_name}
                            helperText={errors.full_name}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="شماره تماس"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="شماره تماس دوم (اختیاری)"
                            name="phone_2"
                            value={form.phone_2}
                            onChange={handleChange}
                            error={!!errors.phone_2}
                            helperText={errors.phone_2}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppSelect
                            label="نوع درخواست"
                            name="request_type"
                            value={form.request_type}
                            onChange={handleChange}
                            error={!!errors.request_type}
                            helperText={errors.request_type}
                        >
                            <MenuItem value="">انتخاب کنید</MenuItem>
                            {REQUEST_TYPES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppSelect
                            label="وضعیت مشتری"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            {CUSTOMER_STATUSES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="بودجه (تومان)"
                            name="budget"
                            value={form.budget}
                            onChange={handleNumberChange}
                            error={!!errors.budget}
                            helperText={errors.budget}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <AppTextField
                            label="یادداشت"
                            name="notes"
                            value={form.notes}
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
                        {isEdit ? "ذخیره تغییرات" : "ثبت مشتری"}
                    </AppButton>
                </Box>

            </form>

        </PageContainer>

    );

}