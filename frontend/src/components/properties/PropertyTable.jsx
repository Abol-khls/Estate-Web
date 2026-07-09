import { Paper, Box, Typography } from "@mui/material";
import PropertyRow from "./PropertyRow";
import InboxIcon from "@mui/icons-material/Inbox";

const GRID_COLUMNS = "130px 200px 140px 1fr 100px 170px";

export default function PropertyTable({

    properties,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite

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

                    gridTemplateColumns: GRID_COLUMNS,

                    columnGap: 2,

                    alignItems: "center",

                    px: 3,

                    py: 2,

                    bgcolor: "primary.main",

                }}

            >

                <Typography
                    align="center"
                    variant="subtitle2"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                    تصویر
                </Typography>

                <Typography
                    align="center"
                    variant="subtitle2"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                    عنوان
                </Typography>

                <Typography
                    align="center"
                    variant="subtitle2"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                    قیمت
                </Typography>

                <Typography
                    variant="subtitle2"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                    آدرس
                </Typography>

                <Typography
                    align="center"
                    variant="subtitle2"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                    علاقه‌مندی
                </Typography>

                <Typography
                    align="center"
                    variant="subtitle2"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                    عملیات
                </Typography>

            </Box>

            {properties.length === 0 ? (

                <Box
                    sx={{
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                        color: "text.secondary",
                    }}
                >

                    <InboxIcon sx={{ fontSize: 40, opacity: 0.5 }} />

                    <Typography variant="body2">
                        ملکی برای نمایش پیدا نشد.
                    </Typography>

                </Box>

            ) : (

                properties.map((property, index) => (

                    <PropertyRow

                        key={property.id}

                        property={property}

                        onView={onView}

                        onEdit={onEdit}

                        onDelete={onDelete}

                        onToggleFavorite={onToggleFavorite}

                        gridColumns={GRID_COLUMNS}

                        striped={index % 2 === 1}

                    />

                ))

            )}

        </Paper>

    );

}