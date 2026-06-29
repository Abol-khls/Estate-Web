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

        />

    );

}