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
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";
import { VISIT_STATUSES } from "../../constants/visitOptions";
import { getCustomerStatusLabel, getCustomerStatusColor } from "../../constants/customerOptions";
import { getPropertyStatusLabel, getPropertyStatusColor } from "../../constants/propertyOptions";

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

export default function VisitForm() {

    const [form, setForm] = useState({
        customer: null,
        property: null,
        visit_date: "",
        status: "scheduled",
        notes: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
    const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    useEffect(() => {

        if (!isEdit) return;

        async function loadVisit() {

            try {

                const response = await api.get(`visits/${id}/`);

                setForm({
                    customer: {
                        id: response.data.customer,
                        full_name: response.data.customer_name,
                    },
                    property: {
                        id: response.data.property,
                        title: response.data.property_title,
                    },
                    visit_date: response.data.visit_date
                        ? response.data.visit_date.slice(0, 16)
                        : "",
                    status: response.data.status,
                    notes: response.data.notes ?? "",
                });

            }
            catch (error) {

                const message = getErrorMessage(
                    error,
                    "خطا در دریافت اطلاعات بازدید"
                );

                showSnackbar(message, "error");

            }

        }

        loadVisit();

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

        if (!form.property) {
            newErrors.property = "انتخاب ملک الزامی است";
        }

        if (!form.visit_date) {
            newErrors.visit_date = "تاریخ بازدید الزامی است";
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
                property: form.property.id,
                visit_date: form.visit_date,
                status: form.status,
                notes: form.notes,
            };

            if (isEdit) {
                await api.patch(`visits/${id}/`, payload);
                showSnackbar("بازدید با موفقیت ویرایش شد.", "success");
            } else {
                await api.post("visits/", payload);
                showSnackbar("بازدید با موفقیت ثبت شد.", "success");
            }

            navigate("/visits");

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
                    "ثبت اطلاعات بازدید با مشکل مواجه شد."
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
                title={isEdit ? "ویرایش بازدید" : "افزودن بازدید"}
            />

            <form onSubmit={handleSubmit}>

                <FormSection title="طرفین بازدید">

                    <Grid size={{ xs: 12, md: 6 }}>
                        <PickerField
                            label="مشتری"
                            placeholder="برای انتخاب مشتری کلیک کنید"
                            displayValue={form.customer?.full_name}
                            error={!!errors.customer}
                            helperText={errors.customer}
                            onClick={() => setCustomerDialogOpen(true)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <PickerField
                            label="ملک"
                            placeholder="برای انتخاب ملک کلیک کنید"
                            displayValue={form.property?.title}
                            error={!!errors.property}
                            helperText={errors.property}
                            onClick={() => setPropertyDialogOpen(true)}
                        />
                    </Grid>

                </FormSection>

                <FormSection title="جزئیات بازدید">

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="تاریخ و ساعت بازدید"
                            name="visit_date"
                            type="datetime-local"
                            value={form.visit_date}
                            onChange={handleChange}
                            error={!!errors.visit_date}
                            helperText={errors.visit_date}
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
                            {VISIT_STATUSES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
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
                        {isEdit ? "ذخیره تغییرات" : "ثبت بازدید"}
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

            <EntityPickerDialog
                open={propertyDialogOpen}
                onClose={() => setPropertyDialogOpen(false)}
                title="انتخاب ملک"
                endpoint="properties/"
                searchPlaceholder="جستجو بر اساس عنوان یا کد ملک..."
                onSelect={(property) => {
                    setForm(prev => ({ ...prev, property }));
                    setErrors(prev => ({ ...prev, property: "" }));
                }}
                renderItem={(property) => (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700} noWrap>
                                {property.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                کد: <bdi>{property.code}</bdi>
                            </Typography>
                        </Box>

                        <Chip
                            size="small"
                            color={getPropertyStatusColor(property.status)}
                            label={getPropertyStatusLabel(property.status)}
                        />

                    </Box>
                )}
            />

        </PageContainer>

    );

}