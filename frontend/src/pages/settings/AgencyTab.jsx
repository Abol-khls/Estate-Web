import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, Box } from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";
import Loading from "../../components/common/Loading";

import api from "../../services/api";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage, getFieldErrors, getNonFieldError, getFieldErrorSummary } from "../../utils/errorMessage";

export default function AgencyTab() {

    const { showSnackbar } = useSnackbar();

    const { data: agency, isLoading, isError } = useQuery({

        queryKey: ["agency"],

        queryFn: async () => {

            const response = await api.get("agency/me/");

            return response.data;

        },

    });

    const [form, setForm] = useState({ name: "", phone: "", address: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {

        if (!agency) return;

        setForm({
            name: agency.name ?? "",
            phone: agency.phone ?? "",
            address: agency.address ?? "",
        });

    }, [agency]);

    useEffect(() => {

        if (!isError) return;

        showSnackbar("خطا در دریافت اطلاعات آژانس", "error");

    }, [isError]);

    function handleChange(e) {

        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        setErrors(prev => ({ ...prev, [name]: "" }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setSubmitting(true);

        try {

            await api.patch("agency/me/", form);

            showSnackbar("اطلاعات آژانس با موفقیت ذخیره شد.", "success");

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
                    "ذخیره اطلاعات آژانس با مشکل مواجه شد."
                );

                showSnackbar(message, "error");

            }

        }
        finally {
            setSubmitting(false);
        }

    }

    if (isLoading) return <Loading />;

    return (

        <Box component="form" onSubmit={handleSubmit}>

            <Grid container spacing={2}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="نام آژانس"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <AppTextField
                        label="شماره تماس آژانس"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{ "& input": { direction: "ltr", textAlign: "right" } }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <AppTextField
                        label="آدرس"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        multiline
                        rows={3}
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