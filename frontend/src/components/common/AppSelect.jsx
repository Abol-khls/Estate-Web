import {
    FormControl,
    InputLabel,
    Select
} from "@mui/material";

export default function AppSelect({

    label,

    children,

    fullWidth = true,

    size = "small",

    ...props

}) {

    return (

        <FormControl

            fullWidth={fullWidth}

            size={size}

        >

            <InputLabel>

                {label}

            </InputLabel>

            <Select

                label={label}

                {...props}

            >

                {children}

            </Select>

        </FormControl>

    );

}