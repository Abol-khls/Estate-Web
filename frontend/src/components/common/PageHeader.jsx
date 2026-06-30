import { Stack, Typography } from "@mui/material";

export default function PageHeader({

    title,

    action

}) {

    return (

        <Stack

            direction="row"

            

            justifyContent="space-between"

            alignItems="center"

            mb={3}

        >

            <Typography

                variant="h4"

                fontWeight={700}

            >

                {title}

            </Typography>

            {action}

        </Stack>

    );

}