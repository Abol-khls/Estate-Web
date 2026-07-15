import { Box, Paper, Skeleton } from "@mui/material";

export default function TableSkeleton({

    gridColumns,

    columnsCount,

    rows = 6,

}) {

    return (

        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
            }}
        >

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: gridColumns,
                    columnGap: 2,
                    alignItems: "center",
                    px: 3,
                    py: 2,
                    bgcolor: "primary.main",
                    opacity: 0.9,
                }}
            >

                {Array.from({ length: columnsCount }).map((_, index) => (

                    <Skeleton
                        key={index}
                        variant="text"
                        width="60%"
                        sx={{
                            mx: "auto",
                            bgcolor: "rgba(255,255,255,0.25)",
                        }}
                    />

                ))}

            </Box>

            {Array.from({ length: rows }).map((_, rowIndex) => (

                <Box
                    key={rowIndex}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        columnGap: 2,
                        alignItems: "center",
                        px: 3,
                        py: 2.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >

                    {Array.from({ length: columnsCount }).map((_, colIndex) => (

                        <Skeleton
                            key={colIndex}
                            variant="text"
                            width={colIndex === columnsCount - 1 ? "50%" : "75%"}
                            sx={{ mx: "auto", fontSize: "1rem" }}
                        />

                    ))}

                </Box>

            ))}

        </Paper>

    );

}