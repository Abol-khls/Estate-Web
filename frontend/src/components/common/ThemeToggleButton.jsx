import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";

import { useThemeMode } from "../../context/ThemeModeContext";

export default function ThemeToggleButton({ sx }) {

    const { mode, toggleMode } = useThemeMode();

    return (

        <Tooltip title={mode === "dark" ? "حالت روشن" : "حالت تاریک"}>

            <IconButton onClick={toggleMode} sx={sx}>

                {mode === "dark" ? (
                    <LightModeIcon fontSize="small" />
                ) : (
                    <DarkModeIcon fontSize="small" />
                )}

            </IconButton>

        </Tooltip>

    );

}