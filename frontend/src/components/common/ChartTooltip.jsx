import { Box } from "@mui/material";

export default function ChartTooltip({ active, payload, label, formatter }) {

    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (

        <Box
            sx={{
                px: 1.75,
                py: 1.25,
                minWidth: 140,
                borderRadius: 3,
                fontSize: 12,
                direction: "rtl",
                bgcolor: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid #334155",
                color: "#f1f5f9",
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.5)",
            }}
        >

            {label !== undefined && label !== "" && (
                <Box sx={{ fontWeight: 700, mb: 0.75 }}>{label}</Box>
            )}

            {payload.map((item) => (

                <Box
                    key={item.dataKey}
                    sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.25 }}
                >

                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: item.color || item.payload?.fill,
                            flexShrink: 0,
                        }}
                    />

                    <span>{item.name}:</span>

                    <Box component="span" sx={{ fontWeight: 700, marginInlineStart: "auto" }}>
                        {formatter ? formatter(item.value, item.dataKey) : Number(item.value).toLocaleString("en-US")}
                    </Box>

                </Box>

            ))}

        </Box>

    );

}