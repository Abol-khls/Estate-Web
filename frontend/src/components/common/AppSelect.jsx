import {
    FormControl,
    InputLabel,
    Select,
    FormHelperText
} from "@mui/material";

export default function AppSelect({

    label,

    children,

    fullWidth = true,

    size = "small",

    helperText,

    error,

    ...props

}) {

    return (

        <FormControl
            fullWidth={fullWidth}
            size={size}
            error={error}
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
            <FormHelperText>

                {helperText}

            </FormHelperText>

        </FormControl>

    );

}