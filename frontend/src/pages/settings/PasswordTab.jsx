import { useState } from "react";
import { Grid, Box } from "@mui/material";

import LockResetIcon from "@mui/icons-material/LockReset";

import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";

export default function PasswordTab() {

    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    function validateForm() {

        const newErrors = {};

        if (!form.old_password) {
            newErrors.old_password = "رمز عبور فعلی را وارد کنید";
        }

        if (!form.new_password || form.new_password.length < 8) {
            newErrors.new_password = "رمز عبور جدید باید حداقل ۸ کاراکتر باشد";
        }

        if (form.new_password !== form.new_password_confirm) {
            newErrors.new_password_confirm = "تکرار رمز عبور مطابقت ندارد";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);

        try {

            await api.post("me/change-password/", {
                old_password: form.old_password,
                new_password: form.new_password,
            });

            showSnackbar("رمز عبور با موفقیت تغییر کرد.", "success");

            setForm({
                old_password: "",
                new_password: "",
                new_password_confirm: "",
            });

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
                    "تغییر رمز عبور با مشکل مواجه شد."
                );

                showSnackbar(message, "error");

            }

        }
        finally {
            setSubmitting(false);
        }

    }

    return (

        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 480 }}>

            <Grid container spacing={2}>

                <Grid size={{ xs: 12 }}>
                    <AppTextField
                        label="رمز عبور فعلی"
                        name="old_password"
                        type="password"
                        value={form.old_password}
                        onChange={handleChange}
                        error={!!errors.old_password}
                        helperText={errors.old_password}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AppTextField
                        label="رمز عبور جدید"
                        name="new_password"
                        type="password"
                        value={form.new_password}
                        onChange={handleChange}
                        error={!!errors.new_password}
                        helperText={errors.new_password}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AppTextField
                        label="تکرار رمز عبور جدید"
                        name="new_password_confirm"
                        type="password"
                        value={form.new_password_confirm}
                        onChange={handleChange}
                        error={!!errors.new_password_confirm}
                        helperText={errors.new_password_confirm}
                    />
                </Grid>

            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <AppButton type="submit" startIcon={<LockResetIcon />} disabled={submitting}>
                    تغییر رمز عبور
                </AppButton>
            </Box>

        </Box>

    );

}