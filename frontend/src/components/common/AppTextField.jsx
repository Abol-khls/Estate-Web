import { TextField, InputAdornment } from "@mui/material";

export default function AppTextField({

    startIcon,

    endIcon,

    slotProps,

    InputProps,

    ...props

}) {

    return (

        <TextField

            fullWidth

            size="small"

            InputProps={{

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

                ...InputProps

            }}

            slotProps={slotProps}

            {...props}

        />

    );

}