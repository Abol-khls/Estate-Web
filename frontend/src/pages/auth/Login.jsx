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
import { Building as BuildingIcon } from "lucide-react";
import { ThemeProvider } from "@mui/material/styles";
import getTheme from "../../theme/getTheme";

const darkTheme = getTheme("dark");

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

        <ThemeProvider theme={darkTheme}>

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#090d16",
                p: 2,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.16), transparent 40%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.12), transparent 40%)",
                    animation: "floatGlow 10s ease-in-out infinite",
                },
            }}
        >

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: "relative",
                    width: 400,
                    maxWidth: "100%",
                    p: 4.5,
                    borderRadius: 6,
                    bgcolor: "rgba(15, 23, 42, 0.8)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
                    color: "#f1f5f9",
                    animation: "cardIn .7s ease both",
                    "& .MuiInputBase-input": { color: "#f1f5f9" },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                }}
            >

                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 4,
                        mx: "auto",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        background: (theme) => theme.custom.brandDiag,
                        boxShadow: (theme) => theme.custom.glow,
                    }}
                >
                    <BuildingIcon size={28} />
                </Box>

                <Typography
                    sx={{
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        mb: 0.5,
                        background: "linear-gradient(90deg, #34d399 0%, #22d3ee 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    {agency?.name || "Estate CRM"}
                </Typography>

                <Typography
                    sx={{ textAlign: "center", mb: 3, fontSize: 13, color: "#94a3b8" }}
                >
                    برای ورود به پنل مدیریت اطلاعات حساب خود را وارد کنید
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
                                        <PersonOutlineIcon fontSize="small" sx={{ color: "#64748b" }} />
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
                                        <LockOutlinedIcon fontSize="small" sx={{ color: "#64748b" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            edge="end"
                                            tabIndex={-1}
                                            sx={{ color: "#94a3b8" }}
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
                        {loading ? "در حال ورود..." : "ورود به پنل"}
                    </Button>

                    <Button
                        onClick={() => navigate("/")}
                        sx={{ color: "#94a3b8", fontWeight: 500, "&:hover": { color: "#34d399", bgcolor: "transparent" } }}
                    >
                        بازگشت به پورتال عمومی
                    </Button>

                </Stack>

            </Paper>

        </Box>

        </ThemeProvider>

    );

}