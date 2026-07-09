import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function DeleteDialog({

    open,

    title = "حذف",

    message = "آیا از حذف این مورد مطمئن هستید؟",

    onClose,

    onConfirm

}) {

    return (

        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    p: 1,
                    minWidth: 340,
                },
            }}
        >

            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(214, 69, 69, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <WarningAmberRoundedIcon color="error" />
                </Box>

                {title}

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    {message}

                </DialogContentText>

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>

                <Button
                    onClick={onClose}
                    color="inherit"
                >

                    انصراف

                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                >

                    حذف

                </Button>

            </DialogActions>

        </Dialog>

    );

}