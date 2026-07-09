import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
    const [state, setState] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = (message, severity = "info") => {
        setState({
            open: true,
            message,
            severity,
        });
    };

    const closeSnackbar = () => {
        setState((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <Snackbar
                open={state.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity={state.severity}
                    onClose={closeSnackbar}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {state.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    return useContext(SnackbarContext);
}