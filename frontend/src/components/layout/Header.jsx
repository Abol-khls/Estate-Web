import { Box, Typography, Avatar, Stack } from "@mui/material";

import { useAuth } from "../../context/AuthContext";

export default function Header() {

    const { user } = useAuth();

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
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
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