import { Box } from "@mui/material";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >

            <Sidebar />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                }}
            >

                <Header />

                <Box
                    component="main"
                    sx={{ flex: 1 }}
                >
                    {children}
                </Box>

            </Box>

        </Box>

    );
}