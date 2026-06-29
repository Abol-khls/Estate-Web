import { TextField } from "@mui/material";

export default function AppSelect({

    children,

    ...props

}) {

    return (

        <TextField

            select

            fullWidth

            size="small"

            {...props}

        >

            {children}

        </TextField>

    );

}