import { Box, Typography, Avatar, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Header() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const initial = user?.username?.charAt(0)?.toUpperCase() ?? "؟";

    return (

        <Box
            component="header"
            sx={{
                height: 72,
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                px: { xs: 2, md: 4 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >

            <Typography variant="h6" color="text.primary">
                داشبورد
            </Typography>

            <Box
                onClick={() => navigate("/settings")}
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


                <Typography variant="body2" color="text.secondary">
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

    );

}