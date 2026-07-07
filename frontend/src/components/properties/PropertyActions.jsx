import Button from "@mui/material/Button";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PropertyActions({

    property,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <>

            <Button

                startIcon={<VisibilityIcon />}

                onClick={() => onView(property)}

            >

                مشاهده

            </Button>

            <Button

                startIcon={<EditIcon />}

                onClick={() => onEdit(property)}

            >

                ویرایش

            </Button>

            <Button

                color="error"

                startIcon={<DeleteIcon />}

                onClick={() => onDelete(property)}

            >

                حذف

            </Button>

        </>

    );

}