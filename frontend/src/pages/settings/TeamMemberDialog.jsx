import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    MenuItem,
    FormControlLabel,
    Switch,
} from "@mui/material";

import AppTextField from "../../components/common/AppTextField";
import AppSelect from "../../components/common/AppSelect";
import AppButton from "../../components/common/AppButton";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";
import { USER_ROLES } from "../../constants/userOptions";

const EMPTY_FORM = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "agent",
    password: "",
    is_active: true,
};

export default function TeamMemberDialog({ open, onClose, member }) {

    const isEdit = Boolean(member);

    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        if (!open) return;

        if (member) {

            setForm({
                username: member.username ?? "",
                first_name: member.first_name ?? "",
                last_name: member.last_name ?? "",
                email: member.email ?? "",
                phone: member.phone ?? "",
                role: member.role ?? "agent",
                password: "",
                is_active: member.is_active,
            });

        } else {

            setForm(EMPTY_FORM);

        }

        setErrors({});

    }, [open, member]);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    function validateForm() {

        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = "نام کاربری الزامی است";
        }

        if (!isEdit && (!form.password || form.password.length < 8)) {
            newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
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
                username: form.username,
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                phone: form.phone,
                role: form.role,
                is_active: form.is_active,
            };

            if (form.password) {
                payload.password = form.password;
            }

            if (isEdit) {
                await api.patch(`team/${member.id}/`, payload);
                showSnackbar("عضو تیم با موفقیت ویرایش شد.", "success");
            } else {
                await api.post("team/", payload);
                showSnackbar("عضو جدید با موفقیت اضافه شد.", "success");
            }

            queryClient.invalidateQueries({ queryKey: ["team", "list"] });

            onClose();

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
                    "ثبت اطلاعات عضو تیم با مشکل مواجه شد."
                );

                showSnackbar(message, "error");

            }

        }
        finally {
            setSubmitting(false);
        }

    }

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: 4 } }}
        >

            <DialogTitle>
                {isEdit ? "ویرایش عضو تیم" : "افزودن عضو جدید"}
            </DialogTitle>

            <form onSubmit={handleSubmit}>

                <DialogContent>

                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <AppTextField
                                label="نام کاربری"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                                disabled={isEdit}
                                sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <AppSelect
                                label="نقش"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                {USER_ROLES.map(item => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </AppSelect>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <AppTextField
                                label="نام"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <AppTextField
                                label="نام خانوادگی"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
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
                                sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <AppTextField
                                label={isEdit ? "رمز عبور جدید (اختیاری)" : "رمز عبور"}
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Grid>

                        {isEdit && (

                            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.is_active}
                                            onChange={(e) =>
                                                setForm(prev => ({ ...prev, is_active: e.target.checked }))
                                            }
                                        />
                                    }
                                    label={form.is_active ? "فعال" : "غیرفعال"}
                                />
                            </Grid>

                        )}

                    </Grid>

                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5 }}>

                    <AppButton
                        variant="outlined"
                        color="inherit"
                        onClick={onClose}
                        type="button"
                    >
                        انصراف
                    </AppButton>

                    <AppButton type="submit" disabled={submitting}>
                        {isEdit ? "ذخیره تغییرات" : "افزودن"}
                    </AppButton>

                </DialogActions>

            </form>

        </Dialog>

    );

}