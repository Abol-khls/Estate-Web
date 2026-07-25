import { Box, Drawer } from "@mui/material";

import SidebarContent from "./SidebarContent";

const DRAWER_WIDTH = 260;

export default function Sidebar({ mobileOpen, onClose }) {

    return (

        <>

            <Box
                component="aside"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    height: "100vh",
                    position: "sticky",
                    top: 0,
                }}
            >

                <SidebarContent />

            </Box>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: DRAWER_WIDTH,
                        boxSizing: "border-box",
                    },
                }}
            >

                <SidebarContent onNavigate={onClose} />

            </Drawer>

        </>

    );

}