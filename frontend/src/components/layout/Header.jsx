import { Box, Typography, Avatar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ThemeToggleButton from "../common/ThemeToggleButton";

export default function Header({ onMenuClick }) {

    const { user } = useAuth();
    const navigate = useNavigate();

    const initial = user?.username?.charAt(0)?.toUpperCase() ?? "؟";

    return (

        <Box
            component="header"
            sx={{
                height: 72,
                flexShrink: 0,
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                px: { xs: 1.5, md: 4 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
            }}
        >

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                <IconButton
                    onClick={onMenuClick}
                    sx={{ display: { xs: "inline-flex", md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" color="text.primary" noWrap>
                    داشبورد
                </Typography>

            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                <ThemeToggleButton />

                <Box
                onClick={() => navigate("/admin/settings")}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    borderRadius: 3,
                    px: 1.2,
                    py: 0.6,
                    transition: ".15s",
                    "&:hover": {
                        bgcolor: "rgba(31, 59, 87, 0.06)",
                    },
                }}
            >


                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                    {user?.username}
                </Typography>

                <Avatar
                    sx={{
                        bgcolor: "primary.main",
                        width: 36,
                        height: 36,
                        fontSize: 14,
                    }}
                >
                    {initial}
                </Avatar>

            </Box>

            </Box>

        </Box>

    );

}