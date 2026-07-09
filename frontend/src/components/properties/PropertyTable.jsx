import { Paper, Box, Typography } from "@mui/material";
import PropertyRow from "./PropertyRow";

export default function PropertyTable({

    properties,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite

}) {

    return (

        <Paper
            elevation={2}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
            }}
        >

            <Box

                sx={{

                    display: "grid",

                    gridTemplateColumns: "130px 200px 140px 1fr 100px 170px",

                    columnGap: 2,

                    alignItems: "center",

                    px: 3,

                    py: 2.5,

                    bgcolor: "grey.100",

                    borderBottom: "1px solid",

                    borderColor: "divider",

                }}

            >

                <Typography
                    align="center"
                    fontWeight={700}
                >
                    تصویر
                </Typography>

                <Typography
                    align="center"
                    fontWeight={700}
                >
                    عنوان
                </Typography>

                <Typography
                    align="center"
                    fontWeight={700}
                >
                    قیمت
                </Typography>

                <Typography fontWeight={700}>
                    آدرس
                </Typography>

                <Typography
                    align="center"
                    fontWeight={700}
                >
                    علاقه‌مندی
                </Typography>

                <Typography
                    align="center"
                    fontWeight={700}
                >
                    عملیات
                </Typography>

            </Box>

            {properties.map(property => (

                <PropertyRow

                    key={property.id}

                    property={property}

                    onView={onView}

                    onEdit={onEdit}

                    onDelete={onDelete}

                    onToggleFavorite={onToggleFavorite}

                />

            ))}

        </Paper>

    );

}