import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import theme from "./Theme.js";
import rtlCache from "./rtlCache.js";
import { SnackbarProvider } from "./context/SnackbarContext";

createRoot(
    document.getElementById("root")

)
    .render(

        <StrictMode>

            <CacheProvider value={rtlCache}>

                <ThemeProvider theme={theme}>
                    <CssBaseline />

                    <SnackbarProvider>

                        <AuthProvider>

                            <App />

                        </AuthProvider>

                    </SnackbarProvider>

                </ThemeProvider>

            </CacheProvider>

        </StrictMode>

    );