import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";

import { useThemeMode } from "../../context/useThemeMode";

export default function ThemeToggleButton({ sx }) {

    const { mode, toggleMode } = useThemeMode();

    return (

        <Tooltip title={mode === "dark" ? "حالت روشن" : "حالت تاریک"}>

            <IconButton
                onClick={toggleMode}
                aria-label="تغییر تم"
                sx={{
                    width: 40,
                    height: 40,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: (theme) => theme.custom.surfaceAlt,
                    color: "text.secondary",
                    "&:hover": {
                        color: "text.primary",
                        bgcolor: (theme) => theme.custom.surfaceAlt,
                    },
                    ...sx,
                }}
            >

                {mode === "dark" ? (
                    <LightModeIcon fontSize="small" />
                ) : (
                    <DarkModeIcon fontSize="small" />
                )}

            </IconButton>

        </Tooltip>

    );

}