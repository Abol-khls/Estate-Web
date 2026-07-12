import { TextField, InputAdornment } from "@mui/material";

export default function AppTextField({

    startIcon,

    endIcon,

    slotProps,

    InputProps,

    inputProps,

    InputLabelProps,

    ...props

}) {

    return (

        <TextField

            fullWidth

            size="small"

            {...props}

            slotProps={{

                ...slotProps,

                input: {
                    startAdornment: startIcon ? (
                        <InputAdornment position="start">
                            {startIcon}
                        </InputAdornment>
                    ) : InputProps?.startAdornment,
                    endAdornment: endIcon ? (
                        <InputAdornment position="end">
                            {endIcon}
                        </InputAdornment>
                    ) : InputProps?.endAdornment,
                    ...InputProps,
                    ...slotProps?.input,
                },

                htmlInput: {
                    ...inputProps,
                    ...slotProps?.htmlInput,
                },

                inputLabel: {
                    ...InputLabelProps,
                    ...slotProps?.inputLabel,
                },

            }}

        />

    );

}