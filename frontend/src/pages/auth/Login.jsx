import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { saveAccessToken } from "../../services/tokenService";
import { useAuth } from "../../context/useAuth";
import { useSnackbar } from "../../context/useSnackbar";
import { API_BASE_URL } from "../../config";
import api from "../../services/api";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
    InputAdornment,
    IconButton,
    CircularProgress,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function getLoginErrorMessage(err) {

    if (!err.response) {
        return "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.";
    }

    if (err.response.status === 429) {
        return "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره امتحان کنید.";
    }

    if (err.response.status === 401) {
        return "نام کاربری یا رمز عبور اشتباه است.";
    }

    return "ورود انجام نشد. لطفاً دوباره تلاش کنید.";

}

export default function Login() {
    const { login } = useAuth();

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const { data: agency } = useQuery({

        queryKey: ["public", "agency"],

        queryFn: async () => {

            const response = await api.get("public/agency/");

            return response.data;

        },

    });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        if (!username.trim() || !password) {

            setError("نام کاربری و رمز عبور را وارد کنید.");

            return;

        }

        setLoading(true);
        setError("");

        try {

            const response = await axios.post(
                `${API_BASE_URL}/token/`,
                {
                    username: username.trim(),
                    password,
                },
                { withCredentials: true }
            );

            saveAccessToken(response.data.access);

            await login();

            showSnackbar(
                "با موفقیت وارد شدید",
                "success"
            );

            navigate("/admin/dashboard");

        }
        catch (err) {

            const message = getLoginErrorMessage(err);

            setError(message);

            showSnackbar(message, "error");

        }

        setLoading(false);

    }

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => theme.custom.darkAnchorBg,
                backgroundImage: (theme) =>
                    `radial-gradient(circle at 20% 20%, ${theme.custom.darkAnchorGlow}, transparent 40%),` +
                    "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06), transparent 40%)",
                p: 2,
            }}
        >

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: 380,
                    p: 4.5,
                    borderRadius: 4,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1.2,
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                    }}
                >

                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "secondary.main",
                        }}
                    />

                    <Typography
                        variant="h6"
                        color="primary.main"
                        fontWeight={700}
                    >
                        {agency?.name || "Estate CRM"}
                    </Typography>

                </Box>

                <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                        textAlign: "center",
                        mb: 0.5,
                    }}
                >
                    ورود به پنل مدیریت
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", mb: 3 }}
                >
                    برای دسترسی به داشبورد آژانس خود وارد شوید
                </Typography>

                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2, borderRadius: 2 }}
                    >
                        {error}
                    </Alert>

                )}

                <Stack spacing={2}>

                    <TextField
                        fullWidth
                        size="small"
                        label="نام کاربری"
                        value={username}
                        autoFocus
                        autoComplete="username"
                        disabled={loading}
                        onChange={e => setUsername(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        type={showPassword ? "text" : "password"}
                        label="رمز عبور"
                        value={password}
                        autoComplete="current-password"
                        disabled={loading}
                        onChange={e => setPassword(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            edge="end"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 1 }}
                        startIcon={
                            loading ? (
                                <CircularProgress size={18} sx={{ color: "primary.contrastText" }} />
                            ) : null
                        }
                    >
                        {loading ? "در حال ورود..." : "ورود"}
                    </Button>

                </Stack>

            </Paper>

        </Box>

    );

}