import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    MenuItem,
    Typography,
    Box,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";
import AppButton from "../../components/common/AppButton";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";

const REQUEST_TYPES = [
    { value: "visit", label: "درخواست بازدید" },
    { value: "call", label: "درخواست تماس" },
    { value: "info", label: "درخواست اطلاعات بیشتر" },
];

export default function InquiryForm({ open, onClose, property }) {

    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        message: "",
        request_type: "visit",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    function validateForm() {

        const newErrors = {};

        if (!form.full_name.trim()) {
            newErrors.full_name = "نام و نام خانوادگی الزامی است";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "شماره تماس الزامی است";
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
                message: form.message,
                request_type: form.request_type,
            };

            if (property) {
                payload.property_id = property.id;
            }

            await api.post("public/inquiries/", payload);

            setSubmitted(true);

        }
        catch (error) {

            const fieldErrors = getFieldErrors(error);

            if (fieldErrors) {

                setErrors(fieldErrors);

                showSnackbar(
                    getFieldErrorSummary(fieldErrors, getNonFieldError(error)),
                    "error"
                );

            } else {

                const message = getErrorMessage(
                    error,
                    "ثبت درخواست با مشکل مواجه شد. لطفاً بعداً دوباره تلاش کنید."
                );

                showSnackbar(message, "error");

            }

        }
        finally {
            setSubmitting(false);
        }

    }

    function handleClose() {

        onClose();

        setTimeout(() => {

            setForm({ full_name: "", phone: "", message: "", request_type: "visit" });
            setErrors({});
            setSubmitted(false);

        }, 200);

    }

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 4 } }}
        >

            {submitted ? (

                <Box sx={{ p: 5, textAlign: "center" }}>

                    <Typography variant="h6" sx={{ mb: 1.5 }}>
                        درخواست شما ثبت شد
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        همکاران ما به‌زودی با شما تماس خواهند گرفت.
                    </Typography>

                    <AppButton onClick={handleClose}>
                        متوجه شدم
                    </AppButton>

                </Box>

            ) : (

                <form onSubmit={handleSubmit}>

                    <DialogTitle>
                        {property ? `درخواست درباره «${property.title}»` : "درخواست تماس"}
                    </DialogTitle>

                    <DialogContent>

                        <Grid container spacing={2} sx={{ mt: 0.5 }}>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <AppTextField
                                    label="نام و نام خانوادگی"
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
                                    sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <AppSelect
                                    label="نوع درخواست"
                                    name="request_type"
                                    value={form.request_type}
                                    onChange={handleChange}
                                >
                                    {REQUEST_TYPES.map(item => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </AppSelect>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <AppTextField
                                    label="توضیحات (اختیاری)"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                        </Grid>

                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2.5 }}>

                        <AppButton
                            variant="outlined"
                            color="inherit"
                            onClick={handleClose}
                            type="button"
                        >
                            انصراف
                        </AppButton>

                        <AppButton
                            type="submit"
                            startIcon={<SendIcon />}
                            disabled={submitting}
                        >
                            ارسال درخواست
                        </AppButton>

                    </DialogActions>

                </form>

            )}

        </Dialog>

    );

}