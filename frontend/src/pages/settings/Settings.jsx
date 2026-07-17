import { useState } from "react";

import { Box, Tabs, Tab, Paper } from "@mui/material";

import PageContainer from "../../components/common/PageContainer";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";

import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";
import AgencyTab from "./AgencyTab";
import TeamTab from "./TeamTab";

export default function Settings() {

    const { user } = useAuth();

    const isManager = user?.role === "manager";

    const [tab, setTab] = useState("profile");

    return (

        <PageContainer>

            <PageHeader
                title="تنظیمات"
                subtitle="مدیریت پروفایل، امنیت و آژانس شما"
            />

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                }}
            >

                <Tabs
                    value={tab}
                    onChange={(event, value) => setTab(value)}
                    sx={{
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >

                    <Tab value="profile" label="پروفایل" />

                    <Tab value="password" label="رمز عبور" />

                    {isManager && <Tab value="agency" label="آژانس" />}

                    {isManager && <Tab value="team" label="اعضای تیم" />}

                </Tabs>

                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>

                    {tab === "profile" && <ProfileTab />}

                    {tab === "password" && <PasswordTab />}

                    {tab === "agency" && isManager && <AgencyTab />}

                    {tab === "team" && isManager && <TeamTab />}

                </Box>

            </Paper>

        </PageContainer>

    );

}