import { Box, Paper, Skeleton } from "@mui/material";

function StatCardSkeleton() {

    return (

        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: 3 }} />

            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="40%" height={32} />
            </Box>
        </Paper>

    );

}

function SectionSkeleton({ height = 260 }) {

    return (

        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }}
        >

            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Skeleton variant="text" width="30%" height={28} />
            </Box>

            <Box sx={{ p: 3 }}>
                <Skeleton variant="rounded" height={height} />
            </Box>

        </Paper>

    );

}

export default function DashboardSkeleton() {

    return (

        <Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    },
                    gap: 2.5,
                    mb: 3,
                }}
            >

                {Array.from({ length: 4 }).map((_, index) => (
                    <StatCardSkeleton key={index} />
                ))}

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" },
                    gap: 2.5,
                    mb: 2.5,
                }}
            >

                <SectionSkeleton height={200} />

                <SectionSkeleton height={220} />

            </Box>

            <SectionSkeleton height={180} />

        </Box>

    );

}