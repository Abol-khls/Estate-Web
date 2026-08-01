import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CacheProvider } from "@emotion/react";
import { ThemeModeProvider } from "./context/ThemeModeContext.jsx";
import rtlCache from "./rtlCache.js";
import { SnackbarProvider } from "./context/SnackbarContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";

createRoot(
    document.getElementById("root")

)
    .render(

        <StrictMode>

            <QueryClientProvider client={queryClient}>

            <CacheProvider value={rtlCache}>

                <ThemeModeProvider>

                    <SnackbarProvider>

                        <AuthProvider>

                            <ErrorBoundary>
                                <App />
                            </ErrorBoundary>

                        </AuthProvider>

                    </SnackbarProvider>

                </ThemeModeProvider>

            </CacheProvider>

            </QueryClientProvider>

        </StrictMode>

    );