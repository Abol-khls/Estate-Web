import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

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
        >

            <DialogTitle>

                {title}

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    {message}

                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
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