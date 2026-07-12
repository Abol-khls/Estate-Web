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
import { CONTRACT_TYPES, CONTRACT_STATUSES } from "../../constants/contractOptions";
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

export default function ContractForm() {

    const [form, setForm] = useState({
        customer: null,
        property: null,
        contract_type: "",
        amount: "",
        status: "draft",
        signed_date: "",
        description: "",
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

        async function loadContract() {

            try {

                const response = await api.get(`contracts/${id}/`);

                setForm({
                    customer: {
                        id: response.data.customer,
                        full_name: response.data.customer_name,
                    },
                    property: {
                        id: response.data.property,
                        title: response.data.property_title,
                    },
                    contract_type: response.data.contract_type,
                    amount: response.data.amount,
                    status: response.data.status,
                    signed_date: response.data.signed_date ?? "",
                    description: response.data.description ?? "",
                });

            }
            catch (error) {

                const message = getErrorMessage(
                    error,
                    "خطا در دریافت اطلاعات قرارداد"
                );

                showSnackbar(message, "error");

            }

        }

        loadContract();

   
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

        if (!form.customer) {
            newErrors.customer = "انتخاب مشتری الزامی است";
        }

        if (!form.property) {
            newErrors.property = "انتخاب ملک الزامی است";
        }

        if (!form.contract_type) {
            newErrors.contract_type = "نوع قرارداد را انتخاب کنید";
        }

        if (!form.amount) {
            newErrors.amount = "مبلغ قرارداد الزامی است";
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
                contract_type: form.contract_type,
                amount: Number(form.amount),
                status: form.status,
                signed_date: form.signed_date || null,
                description: form.description,
            };

            if (isEdit) {
                await api.patch(`contracts/${id}/`, payload);
                showSnackbar("قرارداد با موفقیت ویرایش شد.", "success");
            } else {
                await api.post("contracts/", payload);
                showSnackbar("قرارداد با موفقیت ثبت شد.", "success");
            }

            navigate("/contracts");

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
                    "ثبت اطلاعات قرارداد با مشکل مواجه شد."
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
                title={isEdit ? "ویرایش قرارداد" : "افزودن قرارداد"}
            />

            <form onSubmit={handleSubmit}>

                <FormSection title="طرفین قرارداد">

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

                <FormSection title="جزئیات قرارداد">

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppSelect
                            label="نوع قرارداد"
                            name="contract_type"
                            value={form.contract_type}
                            onChange={handleChange}
                            error={!!errors.contract_type}
                            helperText={errors.contract_type}
                        >
                            <MenuItem value="">انتخاب کنید</MenuItem>
                            {CONTRACT_TYPES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppSelect
                            label="وضعیت"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            error={!!errors.status}
                            helperText={errors.status}
                        >
                            {CONTRACT_STATUSES.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="مبلغ قرارداد (تومان)"
                            name="amount"
                            value={form.amount}
                            onChange={handleNumberChange}
                            error={!!errors.amount}
                            helperText={errors.amount}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <AppTextField
                            label="تاریخ امضا"
                            name="signed_date"
                            type="date"
                            value={form.signed_date}
                            onChange={handleChange}
                            error={!!errors.signed_date}
                            helperText={errors.signed_date}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{
                                "& input[type='date']": {
                                    direction: "ltr",
                                    textAlign: "right",
                                },
                                "& input[type='date']::-webkit-calendar-picker-indicator": {
                                    marginInlineStart: 1,
                                },
                            }}
                        />
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
                        {isEdit ? "ذخیره تغییرات" : "ثبت قرارداد"}
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