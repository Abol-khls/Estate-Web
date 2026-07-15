import { Box, Skeleton } from "@mui/material";

export function PropertyCardSkeleton() {

    return (

        <Box
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
            }}
        >

            <Skeleton
                variant="rectangular"
                sx={{ width: "100%", aspectRatio: "16 / 10" }}
            />

            <Box sx={{ p: 2 }}>

                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="40%" />

                <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                    <Skeleton variant="rounded" width={70} height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2.5 }}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                </Box>

            </Box>

        </Box>

    );

}

export default function PropertyGridSkeleton({ count = 8 }) {

    return (

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                },
                gap: 2.5,
            }}
        >

            {Array.from({ length: count }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
            ))}

        </Box>

    );

}