import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

import PropertyCard from "./PropertyCard";

export default function PropertyGrid({

    properties,

    onView,

    onEdit,

    onDelete,

    onToggleFavorite,

}) {

    if (properties.length === 0) {

        return (

            <Box
                sx={{
                    py: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    color: "text.secondary",
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >

                <InboxIcon sx={{ fontSize: 40, opacity: 0.5 }} />

                <Typography variant="body2">
                    ملکی برای نمایش پیدا نشد.
                </Typography>

            </Box>

        );

    }

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

            {properties.map((property) => (

                <PropertyCard
                    key={property.id}
                    property={property}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleFavorite={onToggleFavorite}
                />

            ))}

        </Box>

    );

}