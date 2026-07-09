import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
} from "@mui/material";

export default function Login() {


    const navigate = useNavigate();


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);



    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);
        setError("");


        try {


            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                {
                    username,
                    password
                }
            );


            localStorage.setItem(
                "access",
                response.data.access
            );


            localStorage.setItem(
                "refresh",
                response.data.refresh
            );


            navigate("/dashboard");


        }
        catch (err) {

            setError(
                "نام کاربری یا رمز عبور اشتباه است"
            );

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
                bgcolor: "primary.dark",
                backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(200,155,60,0.15), transparent 40%)," +
                    "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06), transparent 40%)",
                p: 2,
            }}
        >

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: 360,
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                }}
            >

                <Stack
                    direction="row"
                    spacing={1.2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mb: 3 }}
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
                    >
                        Estate CRM
                    </Typography>

                </Stack>

                <Typography
                    variant="h5"
                    textAlign="center"
                    sx={{ mb: 3 }}
                >
                    ورود به پنل
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

                        onChange={e => setUsername(e.target.value)}

                    />

                    <TextField

                        fullWidth

                        size="small"

                        type="password"

                        label="رمز عبور"

                        value={password}

                        onChange={e => setPassword(e.target.value)}

                    />

                    <Button

                        type="submit"

                        variant="contained"

                        size="large"

                        fullWidth

                        disabled={loading}

                    >

                        {
                            loading
                                ? "در حال ورود..."
                                : "ورود"
                        }

                    </Button>

                </Stack>

            </Paper>

        </Box>

    );


}