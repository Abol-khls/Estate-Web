import { useEffect, useState } from "react";
import { Grid, Box, Chip, Typography } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";
import { getRoleLabel, getRoleColor } from "../../constants/userOptions";

export default function ProfileTab() {

    const { user, fetchUser } = useAuth();
    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        if (!user) return;

        setForm({
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
        });

    }, [user]);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setSubmitting(true);

        try {

            await api.patch("me/", form);

            await fetchUser();

            showSnackbar("پروفایل با موفقیت به‌روزرسانی شد.", "success");

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
                    "به‌روزرسانی پروفایل با مشکل مواجه شد."
                );

                showSnackbar(message, "error");

            }

        }
        finally {
            setSubmitting(false);
        }

    }

    if (!user) return null;

    return (

        <Box component="form" onSubmit={handleSubmit}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>

                <Typography color="text.secondary">
                    نام کاربری: <bdi>{user.username}</bdi>
                </Typography>

                <Chip
                    size="small"
                    color={getRoleColor(user.role)}
                    label={getRoleLabel(user.role)}
                />

            </Box>

            <Grid container spacing={2}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="نام"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="نام خانوادگی"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="ایمیل"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
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

            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <AppButton type="submit" startIcon={<SaveIcon />} disabled={submitting}>
                    ذخیره تغییرات
                </AppButton>
            </Box>

        </Box>

    );

}