import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Grid,
    Typography,
    Box,
    Paper,
    MenuItem,
    Autocomplete,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";
import { CONTRACT_TYPES, CONTRACT_STATUSES } from "../../constants/contractOptions";

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

function EntityAutocomplete({ label, endpoint, getOptionLabel, value, onChange, error, helperText }) {

    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (value && !inputValue) {
            setInputValue(getOptionLabel(value) ?? "");
        }

       
    }, [value]);

    useEffect(() => {

        let active = true;

        const timeout = setTimeout(async () => {

            setLoading(true);

            try {

                const response = await api.get(endpoint, {
                    params: { search: inputValue },
                });

                if (active) {
                    setOptions(response.data.results ?? response.data);
                }

            }
            catch {

                if (active) {
                    setOptions([]);
                }

            }
            finally {

                if (active) {
                    setLoading(false);
                }

            }

        }, 300);

        return () => {
            active = false;
            clearTimeout(timeout);
        };

    }, [inputValue, endpoint]);

    return (

        <Autocomplete
            options={options}
            loading={loading}
            value={value}
            inputValue={inputValue}
            filterOptions={(opts) => opts}
            noOptionsText="موردی یافت نشد"
            loadingText="در حال جستجو..."
            isOptionEqualToValue={(option, val) => option.id === val?.id}
            getOptionLabel={(option) => getOptionLabel(option) ?? ""}
            onChange={(event, newValue) => onChange(newValue)}
            onInputChange={(event, newInputValue, reason) => {
                if (reason === "reset" && !newInputValue) return;
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <AppTextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText}
                />
            )}
        />

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
                        <EntityAutocomplete
                            label="مشتری"
                            endpoint="customers/"
                            getOptionLabel={(option) => option.full_name}
                            value={form.customer}
                            onChange={(newValue) => {
                                setForm(prev => ({ ...prev, customer: newValue }));
                                setErrors(prev => ({ ...prev, customer: "" }));
                            }}
                            error={!!errors.customer}
                            helperText={errors.customer}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <EntityAutocomplete
                            label="ملک"
                            endpoint="properties/"
                            getOptionLabel={(option) => option.title}
                            value={form.property}
                            onChange={(newValue) => {
                                setForm(prev => ({ ...prev, property: newValue }));
                                setErrors(prev => ({ ...prev, property: "" }));
                            }}
                            error={!!errors.property}
                            helperText={errors.property}
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

        </PageContainer>

    );

}