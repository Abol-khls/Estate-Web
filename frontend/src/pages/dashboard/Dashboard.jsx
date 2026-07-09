import { useEffect, useState } from "react";
import api from "../../services/api";
import { Box, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PageContainer from "../../components/common/PageContainer";
import Loading from "../../components/common/Loading";
import { useSnackbar } from "../../context/SnackbarContext";
import { getErrorMessage } from "../../utils/errorMessage";


export default function Dashboard() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    const { showSnackbar } = useSnackbar();

    async function load() {

        setLoading(true);
        setError(false);

        try {

            const res = await api.get("dashboard/");

            setData(res.data);

        }
        catch (err) {

            console.error(err);

            setError(true);

            const message = getErrorMessage(
                err,
                "خطا در دریافت اطلاعات داشبورد"
            );

            showSnackbar(message, "error");

        }
        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        load();

    }, []);

    if (loading) {

        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        );

    }

    if (error || !data) {

        return (
            <PageContainer>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        py: 8,
                    }}
                >
                    <Typography color="text.secondary">
                        دریافت اطلاعات داشبورد با مشکل مواجه شد.
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={load}
                    >
                        تلاش مجدد
                    </Button>
                </Box>
            </PageContainer>
        );

    }

    return (
        <PageContainer>
            <Typography variant="h4" sx={{ mb: 3 }}>
                داشبورد
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                }}
            >
                <Card title="املاک" value={data.properties} />
                <Card title="مشتریان" value={data.customers} />
                <Card title="بازدیدها" value={data.visits} />
                <Card title="قراردادها" value={data.contracts} />
            </Box>
        </PageContainer>
    );
}

function Card({ title, value }) {

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
                textAlign: "center",
            }}
        >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {title}
            </Typography>

            <Typography variant="h4" fontWeight={800}>
                {value ?? 0}
            </Typography>
        </Box>
    );
}