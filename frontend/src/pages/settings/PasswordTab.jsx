import { useState } from "react";
import { Grid, Box, InputAdornment, IconButton } from "@mui/material";

import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";

function VisibilityToggle({ visible, onToggle }) {

    return (

        <InputAdornment position="end">
            <IconButton size="small" onClick={onToggle} edge="end" tabIndex={-1}>
                {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
        </InputAdornment>

    );

}

export default function PasswordTab() {

    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
    });

    const [visibility, setVisibility] = useState({
        old_password: false,
        new_password: false,
        new_password_confirm: false,
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    function toggleVisibility(field) {

        setVisibility(prev => ({ ...prev, [field]: !prev[field] }));

    }

    function validateForm() {

        const newErrors = {};

        if (!form.old_password) {
            newErrors.old_password = "رمز عبور فعلی را وارد کنید";
        }

        if (!form.new_password) {
            newErrors.new_password = "رمز عبور جدید را وارد کنید";
        }
        else if (form.new_password.length < 10 || form.new_password.length > 64) {
            newErrors.new_password = "رمز عبور باید بین ۱۰ تا ۶۴ کاراکتر باشد";
        }
        else if (!/[A-Z]/.test(form.new_password)) {
            newErrors.new_password = "رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد";
        }
        else if (!/[a-z]/.test(form.new_password)) {
            newErrors.new_password = "رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد";
        }
        else if (!/[0-9]/.test(form.new_password)) {
            newErrors.new_password = "رمز عبور باید حداقل یک عدد داشته باشد";
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
                        type={visibility.old_password ? "text" : "password"}
                        autoComplete="current-password"
                        value={form.old_password}
                        onChange={handleChange}
                        error={!!errors.old_password}
                        helperText={errors.old_password}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <VisibilityToggle
                                        visible={visibility.old_password}
                                        onToggle={() => toggleVisibility("old_password")}
                                    />
                                ),
                            },
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AppTextField
                        label="رمز عبور جدید"
                        name="new_password"
                        type={visibility.new_password ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.new_password}
                        onChange={handleChange}
                        error={!!errors.new_password}
                        helperText={
                            errors.new_password ||
                            "حداقل ۱۰ کاراکتر، شامل حرف بزرگ، حرف کوچک و عدد انگلیسی"
                        }
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <VisibilityToggle
                                        visible={visibility.new_password}
                                        onToggle={() => toggleVisibility("new_password")}
                                    />
                                ),
                            },
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AppTextField
                        label="تکرار رمز عبور جدید"
                        name="new_password_confirm"
                        type={visibility.new_password_confirm ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.new_password_confirm}
                        onChange={handleChange}
                        error={!!errors.new_password_confirm}
                        helperText={errors.new_password_confirm}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <VisibilityToggle
                                        visible={visibility.new_password_confirm}
                                        onToggle={() => toggleVisibility("new_password_confirm")}
                                    />
                                ),
                            },
                        }}
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