import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const mainRef = useRef(null);

    const location = useLocation();

    useEffect(() => {

        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }

    }, [location.pathname]);

    return (

        <Box
            sx={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                bgcolor: "background.default",
            }}
        >

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100vh",
                }}
            >

                <Header onMenuClick={() => setMobileOpen(true)} />

                <Box
                    component="main"
                    ref={mainRef}
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                    }}
                >
                    {children}
                </Box>

            </Box>

        </Box>

    );
}