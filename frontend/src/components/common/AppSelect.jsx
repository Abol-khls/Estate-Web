import {
    FormControl,
    InputLabel,
    Select
} from "@mui/material";


export default function AppSelect({

    label,
    name,
    value,
    onChange,
    children

}) {

    return (

        <FormControl fullWidth>


            <InputLabel>
                {label}
            </InputLabel>


            <Select

                name={name}

                value={value}

                onChange={onChange}

                label={label}

            >

                {children}


            </Select>


        </FormControl>

    );

}