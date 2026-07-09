import {
    Box,
    Tooltip,
    IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const actionButtonSx = {

    borderRadius: 2,

    border: "1px solid",

};

export default function PropertyActions({

    property,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}
        >

            <Tooltip title="مشاهده">

                <IconButton
                    size="small"
                    color="info"
                    onClick={() => onView(property)}
                    sx={{
                        ...actionButtonSx,
                        borderColor: "info.main",
                    }}
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>

            </Tooltip>

            <Tooltip title="ویرایش">

                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(property)}
                    sx={{
                        ...actionButtonSx,
                        borderColor: "primary.main",
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>

            </Tooltip>

            <Tooltip title="حذف">

                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(property)}
                    sx={{
                        ...actionButtonSx,
                        borderColor: "error.main",
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>

            </Tooltip>

        </Box>

    );

}