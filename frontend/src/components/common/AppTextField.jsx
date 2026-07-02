import { TextField, InputAdornment } from "@mui/material";

export default function AppTextField({

    startIcon,

    endIcon,

    slotProps,

    ...props

}) {

    return (

        <TextField

            fullWidth

            size="small"

            slotProps={{

                input: {

                    startAdornment: startIcon ? (

                        <InputAdornment position="start">

                            {startIcon}

                        </InputAdornment>

                    ) : undefined,

                    endAdornment: endIcon ? (

                        <InputAdornment position="end">

                            {endIcon}

                        </InputAdornment>

                    ) : undefined,

                    ...(slotProps?.input ?? {})

                }

            }}

            {...props}

        />

    );

}