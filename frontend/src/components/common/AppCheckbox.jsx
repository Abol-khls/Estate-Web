import {

    Checkbox,

    FormControlLabel

} from "@mui/material";

export default function AppCheckbox({

    label,

    ...props

}) {

    return (

        <FormControlLabel

            control={<Checkbox {...props} />}

            label={label}

            sx={{

                "& .MuiFormControlLabel-label": {
                    fontSize: 14,
                    fontWeight: 500,
                    color: "text.primary",
                },

            }}

        />

    );

}