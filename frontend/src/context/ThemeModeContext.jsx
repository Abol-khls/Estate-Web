import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import getTheme from "../theme/getTheme";

const STORAGE_KEY = "theme-mode";

const ThemeModeContext = createContext();

function getInitialMode() {

    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
        return stored;
    }

    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    return prefersDark ? "dark" : "light";

}

export function ThemeModeProvider({ children }) {

    const [mode, setMode] = useState(getInitialMode);

    useEffect(() => {

        localStorage.setItem(STORAGE_KEY, mode);

    }, [mode]);

    const toggleMode = () => {

        setMode((current) => (current === "dark" ? "light" : "dark"));

    };

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (

        <ThemeModeContext.Provider value={{ mode, toggleMode }}>

            <ThemeProvider theme={theme}>

                <CssBaseline />

                {children}

            </ThemeProvider>

        </ThemeModeContext.Provider>

    );

}

export function useThemeMode() {

    return useContext(ThemeModeContext);

}