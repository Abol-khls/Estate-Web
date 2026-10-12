import { Box } from "@mui/material";

import { darkTokens } from "../../theme/tokens";
import { getPriceText } from "../../utils/formatPrice";
import { getTransactionTone } from "../../constants/propertyOptions";

export default function PriceTag({ property }) {

    const tone = getTransactionTone(property.transaction_type);

    return (

        <Box
            sx={{
                position: "absolute",
                bottom: 12,
                insetInlineEnd: 12,
                maxWidth: "calc(100% - 24px)",
                px: 1.5,
                py: 0.5,
                borderRadius: 3,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                bgcolor: "rgba(9, 13, 22, 0.82)",
                backdropFilter: "blur(8px)",
                color: darkTokens[tone].text,
            }}
        >
            {getPriceText(property)}
        </Box>

    );

}